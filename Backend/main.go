package main

import (
	"os"
	server "github.com/Sayan-995/automate/server"
	"github.com/joho/godotenv"
	"github.com/unidoc/unipdf/v3/common"
	"github.com/unidoc/unipdf/v3/common/license"
)
func init() {
	godotenv.Load()
	err := license.SetMeteredKey(os.Getenv(`UNIPDF_API_KEY`))
	if err != nil {
		panic(err)
	}
	license.SetMeteredKeyUsageLogVerboseMode(true)
	common.SetLogger(common.NewConsoleLogger(common.LogLevelInfo))
}
func main(){
	listenAddress:=":8080"
	server:=server.CreateServer(listenAddress)
	server.RunServer()
}