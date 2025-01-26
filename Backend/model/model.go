package model

import (
	"context"
	"errors"
	"fmt"
	"math"
	"os"
	"runtime"
	"strconv"
	"strings"
	"sync"

	utils "github.com/Sayan-995/automate/utils"
	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"github.com/philippgille/chromem-go"
	"github.com/tmc/langchaingo/textsplitter"
	"google.golang.org/api/option"
)
func init(){
	godotenv.Load()
}
const END = "END"
const isNormalizedPrecisionTolerance = 1e-6
var (
	ErrEntryPointNotSet = errors.New("entry point not set")
	ErrNodeNotFound = errors.New("node not found")
	ErrNoOutgoingEdge = errors.New("no outgoing edge found for node")
)

type GraphState struct{
	Text string
	Question string
	GeneratedAnswer string
	Document string
	Model  *genai.GenerativeModel
	Context context.Context
	Collection *chromem.Collection
}
func (g *GraphState)ValidateAnswer(question ,context,answer string)(bool,error){
	client,err:=genai.NewClient(g.Context,option.WithAPIKey(os.Getenv("GEMINI_API_KEY")))
	if(err!=nil){
		return false,err;
	}
	defer client.Close()
	fmt.Println(context);
	fmt.Println("Answer");
	fmt.Println(answer)
	model := client.GenerativeModel("gemini-1.5-flash")
	res,err:=model.GenerateContent(g.Context,genai.Text(fmt.Sprintf(utils.ValidationPromptTemplate,context,question,answer)))
	if err!= nil {
		return false,err;
	}
	for _,cand:=range(res.Candidates){
		if(cand.Content!=nil){
			for _,part:=range(cand.Content.Parts){
				ans:=fmt.Sprintf("%s",part)
				if(strings.Contains(strings.ToLower(ans),"yes")){
					return true,nil
				}else if(strings.Contains(strings.ToLower(ans),"no")){
					return false,nil
				}
			}
		}
	}
	return false,fmt.Errorf("error while validating")
}
func (g *GraphState)GenerateAnswer()error{
	res,err:=g.Model.GenerateContent(g.Context,genai.Text(fmt.Sprintf(utils.QuestionAnsweringPromptTemplate,g.Document,g.Question)))
	if(err!=nil){
		return err
	}
	var ans string
	var GenAns string;
	for _,cand:=range(res.Candidates){
		if(cand.Content!=nil){
			for _,part:=range(cand.Content.Parts){
				tans:=fmt.Sprintf("%s",part)
				GenAns+=tans
			}
		}
	}
	Ok,err:=g.ValidateAnswer(g.Question,g.Document,GenAns);
	if err!=nil{
		return err
	}
	if(Ok){
		ans=GenAns
	}else{
		ans="The question is irrelevent to the document"
	}
	g.GeneratedAnswer=ans
	return nil
}
func (g *GraphState)CreateModel()error{
	client,err:=genai.NewClient(g.Context,option.WithAPIKey(os.Getenv("GEMINI_API_KEY")))
	if(err!=nil){
		return err
	}
	model:=client.GenerativeModel("gemini-1.5-flash")
	g.Model=model
	return nil
}
func (g *GraphState)RetriveDocs()error{
	res,err:=g.Collection.Query(g.Context,g.Question,3,nil,nil)
	text:=res[0].Content+"\n"+res[1].Content+"\n"+res[2].Content;
	if err!=nil{
		return err
	}
	g.Document=text
	return nil
}
func isNormalized(v []float32) bool {
	var sqSum float64
	for _, val := range v {
		sqSum += float64(val) * float64(val)
	}
	magnitude := math.Sqrt(sqSum)
	return math.Abs(magnitude-1) < isNormalizedPrecisionTolerance
}
func normalizeVector(v []float32) []float32 {
	var norm float32
	for _, val := range v {
		norm += val * val
	}
	norm = float32(math.Sqrt(float64(norm)))

	res := make([]float32, len(v))
	for i, val := range v {
		res[i] = val / norm
	}

	return res
}
type ollamaResponse struct {
	Embedding []float32 `json:"embedding"`
}

func NewEmbeddingFuncGemini() chromem.EmbeddingFunc {
	var checkedNormalized bool
	checkNormalized := sync.Once{}
	// client,err:=genai.NewClient(context.Background(),option.WithAPIKey(os.Getenv("GEMINI_API_KEY")));
	return func(ctx context.Context, text string) ([]float32, error) {
		client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("GEMINI_API_KEY")))
		if err != nil {
			fmt.Println(err)
		}
		defer client.Close()

		em := client.EmbeddingModel("text-embedding-004")
		res, err := em.EmbedContent(ctx, genai.Text(text))
		if err!=nil{
			fmt.Println(err)
		}
		// fmt.Println(res.Embedding.Values)
		embeddingResponse:= ollamaResponse{
			Embedding: res.Embedding.Values,
		}
		// Check if the response contains embeddings.
		if len(embeddingResponse.Embedding) == 0 {
			return nil, errors.New("no embeddings found in the response")
		}

		v := embeddingResponse.Embedding
		checkNormalized.Do(func() {
			if isNormalized(v) {
				checkedNormalized = true
			} else {
				checkedNormalized = false
			}
		})
		if !checkedNormalized {
			v = normalizeVector(v)
		}

		return v, nil
	}
}
func (g *GraphState) BuildVectorStore(Text string)(*chromem.Collection,error){
	ctx:=g.Context
	splitter:=textsplitter.NewMarkdownTextSplitter(
		textsplitter.WithChunkSize(200),
		textsplitter.WithChunkOverlap(40),
		textsplitter.WithCodeBlocks(true),
		textsplitter.WithHeadingHierarchy(true),
	)
	splittedText,err:=splitter.SplitText(Text)
	if(err!=nil){
		return nil,err
	}
	fmt.Println(len(splittedText))
	db:=chromem.NewDB()
	var doc []chromem.Document
	for i:=0;i<len(splittedText);i++{
		doc = append(doc, chromem.Document{
			ID: strconv.Itoa(i+1),
			Content: splittedText[i],
		})
	}
	//ikkxUZHDi7KGLJD1Oakt1zVsHCwK1rls
	//emb_36abc431baf8bc70098f3bb9a8733e6ccb83e3c11971cfc6
	// chromem.NewEmbeddingFuncMixedbread("emb_989891ce41f83258ffec8d617c325b08e4300cca5b4df0a1","mixedbread-ai/mxbai-embed-large-v1")
	// c, err := db.CreateCollection("knowledge-base", nil,
	// chromem.NewEmbeddingFuncMixedbread("emb_989891ce41f83258ffec8d617c325b08e4300cca5b4df0a1","mixedbread-ai/mxbai-embed-large-v1") )
	c, err := db.CreateCollection("knowledge-base", nil,NewEmbeddingFuncGemini())
	if err != nil {
		panic(err)
	}
	err=c.AddDocuments(ctx,doc,runtime.NumCPU())
	fmt.Println(err)
	if err!=nil{
		return nil,err
	}
	return c,nil
}
type Node struct{
	Name string
	Function func()error
}
type Edge struct{
	From string
	To string
}
type MessageGraph struct{
	Nodes map[string]Node
	Edges map[string][]string
	EntryPoint string
}
func NewMessageGraph()*MessageGraph{
	return &MessageGraph{
		Nodes: make(map[string]Node),
		Edges: make(map[string][]string),
	}
}
func (g *MessageGraph)AddNode(Name string,Fn func()error){
	g.Nodes[Name]=Node{
		Name: Name,
		Function: Fn,
	}
}
func (g *MessageGraph)AddEdge(To ,From string){
	g.Edges[To] = append(g.Edges[To], From)
}
func (g *MessageGraph) SetEntryPoint(name string) {
	g.EntryPoint = name
}
type Runnable struct {
	graph *MessageGraph
}
func (g *MessageGraph) Compile() (*Runnable, error) {
	if g.EntryPoint == "" {
		return nil, ErrEntryPointNotSet
	}
	fmt.Println(g)
	return &Runnable{
		graph: g,
	}, nil
}
func (r *Runnable)Invoke(g *GraphState)(string,error){
	var st []string 
	st=append(st,r.graph.EntryPoint)
	for(len(st)>0){
		CurrentNode:=st[len(st)-1]
		st=st[:len(st)-1] 
		if CurrentNode==END{
			continue
		}
		node,ok:=r.graph.Nodes[CurrentNode]
		if !ok{
			return "",fmt.Errorf("error while traversing graph")
		}
		err:=node.Function()
		if err!=nil{
			return "",err
		}
		found:=false
		for _,Children:=range(r.graph.Edges[CurrentNode]){
			st=append(st, Children)
			found=true
		}
		if !found{
			return "",fmt.Errorf("%s %s",ErrNoOutgoingEdge,CurrentNode)
		}
	}
	fmt.Println(g.GeneratedAnswer)
	return g.GeneratedAnswer,nil
}

func CreateRunable(g *GraphState)(*Runnable,error){
	graph:=NewMessageGraph()
	graph.AddNode("retrive_docs",g.RetriveDocs)
	graph.AddNode("create_model",g.CreateModel)
	graph.AddNode("generate_answer",g.GenerateAnswer)
	graph.SetEntryPoint("retrive_docs")
	graph.AddEdge("retrive_docs","create_model")
	graph.AddEdge("create_model","generate_answer")
	graph.AddEdge("generate_answer",END)
	r,err:=graph.Compile()
	if(err!=nil){
		return nil,err
	}
	return r,nil
}