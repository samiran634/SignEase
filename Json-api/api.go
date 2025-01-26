package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)
type ApiServer struct{
	listenAddr string
	store *PostgreStore
}
type ApiError struct{
	Error string `json:"error"`
}
func MakeApiServer(listenAddr string,store *PostgreStore) *ApiServer{
	return &ApiServer{
		listenAddr: listenAddr,
		store: store,
	}
}
func run(s *ApiServer){
	MyRouter:=mux.NewRouter().StrictSlash(true)
	MyRouter.HandleFunc("/accounts",generateHandleFunc(s.handleAccount))
	MyRouter.HandleFunc("/accounts/{id}",generateHandleFunc(handleGetAccountById)).Methods("GET")
	err:=s.store.init()
	if(err!=nil){
		log.Fatal("error in starting server")
	}
	log.Fatal(http.ListenAndServe(s.listenAddr,MyRouter))
}
func (s *ApiServer)handleAccount(w http.ResponseWriter, r *http.Request)error {
	switch r.Method{
	case "GET":
		return s.handleGetAccount(w,r);
	case "POST":
		return s.handleCreateAccount(w,r);
	case "DELETE":
		return s.handleDeleteAccount(w,r);
	case "PUT":
		return s.handleUpdateAccount(w,r);
	default:
		return fmt.Errorf("method not allowed %s",r.Method)
	}
}
func handleGetAccountById(w http.ResponseWriter, r *http.Request) error {
	json.NewEncoder(w).Encode("account by id Endpoint Hit")
	return nil
}

func (s *ApiServer)handleGetAccount(w http.ResponseWriter, r *http.Request) error {
	json.NewEncoder(w).Encode("all account Endpoint Hit")
	var customers []*Customer
	var err error
	customers,err=s.store.GetCustomers()
	if(err!=nil){
		return err
	}
	err=json.NewEncoder(w).Encode(customers)
	return err
}
func (s *ApiServer)handleCreateAccount(w http.ResponseWriter, r *http.Request) error {
	json.NewEncoder(w).Encode("create Endpoint Hit")
	req:=&createAccountRequest{}
	err:=json.NewDecoder(r.Body).Decode(req)
	if(err!=nil){
		return err
	}
	customer:=Customer{
		FirstName: req.FirstName,
		LastName: req.LastName,
		Email: req.Email,
		Phone: req.Phone,
	}
	err=s.store.CreateCustomer(customer)
	if(err!=nil){
		return err
	}
	return WriteJSON(w,http.StatusOK,"Customer added")
}
func (s *ApiServer)handleUpdateAccount(w http.ResponseWriter, r *http.Request) error {
	json.NewEncoder(w).Encode("update Endpoint Hit")
	return nil
}
func (s *ApiServer)handleDeleteAccount(w http.ResponseWriter, r *http.Request) error {
	json.NewEncoder(w).Encode("delete Endpoint Hit")
	return nil
}

type ApiFunc func(http.ResponseWriter,*http.Request) error

func WriteJSON(w http.ResponseWriter,status int,v any)error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func generateHandleFunc(f ApiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request){
		if err:=f(w,r);err!=nil{
			WriteJSON(w,http.StatusBadRequest,ApiError{
				Error: err.Error(),
			})
		}
	}
}