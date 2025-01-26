package utils

import (
	"encoding/json"
	"net/http"
)
const (
	ValidationPromptTemplate=`You are a helpful assistant tasked with evaluating the relevance of answers to questions based on provided context.

							Context: %s

							Question: %s

							Answer: %s

							Is the answer relevant to the question in the given context? Respond with only "Yes" or "No".
							Dont be Too much strict , if the answer is close enough of question then respond with Yes`
	QuestionAnsweringPromptTemplate=`You are an AI assistant. Answer the following question based strictly on the provided context.
									 Do not include any information outside the context or assume anything not explicitly stated.
									 Write the answer in a human friendly manner
									Context:
									%s

									Question:
									%s
									`
)


func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

type ApiFunc func(w http.ResponseWriter, r *http.Request) error

func GenerateHandleFunc(f ApiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusBadRequest, err.Error())
		}
	}
}