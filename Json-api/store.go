package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

type PostgreStore struct {
	db *sql.DB
}
func CreatePgStore() (*PostgreStore,error) {
	connStr := "host=localhost port=1234 dbname=Transaction user=postgres password=S9@dUTTA connect_timeout=10 sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if(err!=nil){
		fmt.Println("error while creating")
		return nil,err;
	}
	err=db.Ping()
	if(err!=nil){
		fmt.Println("error while Pinging")
		return nil,err
	}
	return &PostgreStore{
		db: db,
	},nil;
}
func (s *PostgreStore)init()error {
	return s.CreateTables()
}
func (s *PostgreStore)CreateTables() error {
	query:=`
	CREATE TABLE IF NOT EXISTS customer (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
	);
	CREATE TABLE IF NOT EXISTS transaction (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    amount FLOAT NOT NULL CHECK (amount > 0),
    balance_after FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(255),
    status VARCHAR(50) NOT NULL
	);
	CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    accountNumber SERIAL NOT NULL,
    balance FLOAT NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL
	);
	CREATE TABLE IF NOT EXISTS audit (
    id SERIAL PRIMARY KEY,
    entity VARCHAR(255) NOT NULL,
    entity_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    changes TEXT NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`
	_,err:=s.db.Exec(query)
	if(err!=nil){
		return err
	}
	fmt.Println("Table Created Successfully")
	return nil
}
func ScanIntoCustomers(rows *sql.Rows) (*Customer, error) {
	customer := new(Customer)
	err := rows.Scan(
		&customer.ID,
		&customer.CreatedAt,
		&customer.FirstName,
		&customer.LastName,
		&customer.Email,
		&customer.Phone,
	)
	if err != nil {
		return nil, err
	}
	return customer, nil
}
func(s *PostgreStore) GetCustomers()([]*Customer,error ){
	query:="SELECT * FROM customer;"
	var customers []*Customer
	result,err:=s.db.Query(query)
	if(err!=nil){
		return customers,err
	}
	for result.Next(){
		customer,err:=ScanIntoCustomers(result)
		if(err!=nil){
			return nil,err
		}
		customers = append(customers, customer)
	}
	return customers,nil
}
func(s *PostgreStore) GetCustomerById(id int)(*Customer,error){
	query:=`SELECT * FROM customer WHERE id = $1;`
	result,err:=s.db.Query(query,id)
	if(err!=nil){
		return nil,err
	}
	for result.Next(){
		customer,err:=ScanIntoCustomers(result)
		return customer,err
	}
	return nil,fmt.Errorf("Customer with id %d not found",id)
}
func(s *PostgreStore) CreateCustomer(customer Customer)error {
	tx,err:=s.db.Begin()
	if(err!=nil){
		return err;
	}
	defer tx.Rollback()
	query:=`INSERT INTO customer (first_name, last_name, email, phone) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id`
	rows,err:=tx.Query(query,customer.FirstName, customer.LastName, customer.Email, customer.Phone)
	if(err!=nil){
		return err
	}
	var id int
	err=rows.Scan(&id)
	if(err!=nil){
		return err
	}
	query=`INSERT INTO account(customer_id, balance, status)
	VALUES ($1, $2, $3) 
	`
	_,err=tx.Exec(query,id,0.0,"active")
	if(err!=nil){
		return err
	}
	return tx.Commit()
}
