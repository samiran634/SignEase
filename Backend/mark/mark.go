package mark

import (
	"fmt"

	"github.com/DavidBelicza/TextRank/v2"
	"github.com/DavidBelicza/TextRank/v2/convert"
	"github.com/DavidBelicza/TextRank/v2/parse"
)
var (
	SentenceCount=0
)
func Populate(textRank *textrank.TextRank,
	text string,
	lang convert.Language,
	rule parse.Rule,
) {
	parsedText := parse.TokenizeText(text, rule)
	SentenceCount=len(parsedText.GetSentences())
	for _, sentence := range parsedText.GetSentences() {
		convert.TextToRank(sentence, lang, textRank.GetRankData())
	}
}

func GetImportentWords(text string)([]string,error){
	tr:=textrank.NewTextRank()
	rule:=textrank.NewDefaultRule()
	language:=textrank.NewDefaultLanguage()
	algo:=textrank.NewChainAlgorithm()
	// Populate(tr,text,language,rule)
	tr.Populate(text,language,rule)
	tr.Ranking(algo)
	fmt.Println(SentenceCount)
	sentences := textrank.FindSentencesByRelationWeight(tr, 30)
	var values []string
	for _,lines:=range(sentences){
		// fmt.Println("done ")
		values=append(values, lines.Value)
	}
	return values,nil
}