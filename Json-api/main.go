package main

import (
	"fmt"
	"log"
)
func main(){
	fmt.Println("starting server.....")
	store,err:=CreatePgStore();
	if(err!=nil){
		log.Fatal("error creating server ",err)
	}
	run(MakeApiServer(":1234",store))
}