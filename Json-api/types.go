package main

import (
	"time"
)

type Customer struct {
	ID            int       `json:"id"`
	CreatedAt     time.Time `json:"created_at"`
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	Email         string    `json:"email"`
	Phone         string    `json:"phone"`
}
type Transaction struct {
	ID             int       `json:"id"`
	CustomerID     int       `json:"customer_id"`
	TransactionType string   `json:"transaction_type"`
	Amount         float64   `json:"amount"`
	BalanceAfter   float64   `json:"balance_after"`
	CreatedAt      time.Time `json:"created_at"`
	Reference      string    `json:"reference"`
	Status         string    `json:"status"`
}
type Account struct {
	ID            int       `json:"id"`
	CustomerID    int       `json:"customer_id"`
	AccountNumber int       `json:"account_number"`
	Balance       float64   `json:"balance"`
	CreatedAt     time.Time `json:"created_at"`
	Status        string    `json:"status"`
}
type Audit struct {
	ID          int       `json:"id"`
	Entity      string    `json:"entity"`
	EntityID    int       `json:"entity_id"`
	Action      string    `json:"action"`
	Changes     string    `json:"changes"`
	PerformedBy string    `json:"performed_by"`
	CreatedAt   time.Time `json:"created_at"`
}
type createAccountRequest struct {
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	Email         string    `json:"email"`
	Phone         string    `json:"phone"`
}