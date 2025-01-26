package server

import (
	"log"
	"net/http"

	upload "github.com/Sayan-995/automate/upload"
	utils "github.com/Sayan-995/automate/utils"
	"github.com/gorilla/mux"
)
type server struct{
	listenAddress string
}
func CreateServer(listenAddress string)*server{
	return &server{
		listenAddress: listenAddress,
	}
}
func hello(w http.ResponseWriter,r *http.Request)error{
	return utils.WriteJSON(w,http.StatusAccepted,"hellow")
}
func (s *server)RunServer(){
	corsMiddleware := func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
            w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")
            
            // Handle preflight requests
            if r.Method == "OPTIONS" {
                w.WriteHeader(http.StatusOK)
                return
            }
            
            next.ServeHTTP(w, r)
        })
    }
	myRouter:=mux.NewRouter().StrictSlash(true)
    myRouter.Use(corsMiddleware)
	myRouter.HandleFunc("/upload",utils.GenerateHandleFunc(upload.HandleUploadPdf))
	myRouter.HandleFunc("/mark",utils.GenerateHandleFunc(upload.HandleGetImportantWords))
	myRouter.HandleFunc("/ask",utils.GenerateHandleFunc(upload.HandleUploadQuestion))
	myRouter.HandleFunc("/",utils.GenerateHandleFunc(hello))
	log.Fatal(http.ListenAndServe(s.listenAddress,myRouter))	
}