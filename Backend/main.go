package main

import (
	server "github.com/Sayan-995/automate/server"
	"github.com/joho/godotenv"
)
func init() {
	godotenv.Load()
}
func main(){
	listenAddress:=":8080"
	server:=server.CreateServer(listenAddress)
	server.RunServer()
}