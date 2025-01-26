package upload

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	// "io/ioutil"
	// "os"
	"strings"

	// "fmt"
	"net/http"
	"path/filepath"

	"mime/multipart"

	twd "github.com/Sayan-995/automate/Twd"
	"github.com/Sayan-995/automate/mark"
	mod "github.com/Sayan-995/automate/model"
	"github.com/Sayan-995/automate/utils"
	u "github.com/Sayan-995/automate/utils"

	// "github.com/unidoc/unipdf/v3/extractor"
	// "github.com/unidoc/unipdf/v3/model"
	"github.com/ledongthuc/pdf"
)

const(
	maxSize=10<<20
)
func HandleUploadPdf(w http.ResponseWriter, r *http.Request) error {
	if err := r.ParseMultipartForm(maxSize); err != nil {
		fmt.Println("big")
		return err
	}
	
	file, header, err := r.FormFile("pdf")
	if err != nil {
		return u.WriteJSON(w, http.StatusBadRequest, "Error getting the file")
	}
	defer file.Close()
	
	if filepath.Ext(header.Filename) != ".pdf" {
		fmt.Println("came1")
		return u.WriteJSON(w, http.StatusBadRequest, "Only PDF files are allowed")
	}
	
	reader, err := pdf.NewReader(file, header.Size)
	if err != nil {
		fmt.Println("came2")
		return err
	}
	
	var totText string
	for pageNum := 1; pageNum <= reader.NumPage(); pageNum++ {
		page := reader.Page(pageNum)
		text, err := page.GetPlainText(nil)
		if err != nil {
			fmt.Println("came3")
			return err
		}
		totText += text
	}
	fmt.Println(totText)
	// mark.GetImportentWords(totText)
	twd.AddText(totText)
	twd.G.Collection,err=twd.G.BuildVectorStore(totText)
	if err!=nil{
		return err
	}
	return u.WriteJSON(w, http.StatusOK, "PDF uploaded successfully")
}
func HandleGetImportantWords(w http.ResponseWriter, r *http.Request) error {
	if err := r.ParseMultipartForm(maxSize); err != nil {
		fmt.Println("big")
		return err
	}
	file, header, err := r.FormFile("pdf")
	if err != nil {
		return u.WriteJSON(w, http.StatusBadRequest, "Error getting the file")
	}
	defer file.Close()
	
	if filepath.Ext(header.Filename) != ".pdf" {
		fmt.Println("came1")
		return u.WriteJSON(w, http.StatusBadRequest, "Only PDF files are allowed")
	}
	reader, err := pdf.NewReader(file, header.Size)
	if err != nil {
		fmt.Println("came2")
		return err
	}
	var totText string
	for pageNum := 1; pageNum <= reader.NumPage(); pageNum++ {
		page := reader.Page(pageNum)
		text, err := page.GetPlainText(nil)
		if err != nil {
			fmt.Println("came3")
			return err
		}
		totText += text
	}
	fmt.Println(totText)
	sentences,err:=mark.GetImportentWords(totText)
	if(err!=nil){
		return err
	}
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add PDF file
	part, err := writer.CreateFormFile("pdf", "document.pdf")
	if err != nil {
		return err
	}
	io.Copy(part, file)
	writer.WriteField("sentences", strings.Join(sentences, ","))
	writer.Close()
	
    req, err := http.NewRequest("POST", "https://test-production-3826.up.railway.app/highlight-pdf", body)
    if err != nil {
        return err
    }
    req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    // Direct PDF download
    w.Header().Set("Content-Type", "application/pdf")
    w.Header().Set("Content-Disposition", "attachment; filename=highlighted.pdf")
    
    _, err = io.Copy(w, resp.Body)
    if err!=nil{
		return err;
	}
	return u.WriteJSON(w,http.StatusOK,"pdf highlighted successfully")
}

func HandleUploadQuestion(w http.ResponseWriter, r *http.Request)error{
	var question string
	err:=json.NewDecoder(r.Body).Decode(&question)
	if(err!=nil){
		return err
	}
	twd.AddQuestion(question)
	res,err:=mod.CreateRunable(twd.G)
	if(err!=nil){
		return err
	}
	ans,err:=res.Invoke(twd.G)
	if(err!=nil){
		return err
	}
	return utils.WriteJSON(w,http.StatusOK,ans)
}