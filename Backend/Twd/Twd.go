package twd

import (
	"context"

	"github.com/Sayan-995/automate/model"
)

var G *model.GraphState=&model.GraphState{
	Text: "",
	Question: "",
	Document: "",
	GeneratedAnswer: "",
	Model: nil,
	Context: context.Background(),
}

func AddText(Text string){
	G.Text=Text
}
func AddQuestion(Question string){
	G.Question=Question
}

