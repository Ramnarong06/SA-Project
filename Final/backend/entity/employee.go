package entity

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	FirstName 	string 		
	LastName 	string		
	BirthDay 	time.Time 	
	Address 	string 		
	Tel 		string 				
	Email 		string 		
	Password 	string 		

	GenderID 		uint 			
	Gender 			Gender			`gorm:"foriegnKey:GenderID"`

	JobPositionID 	uint 			
	JobPosition 	JobPosition		`gorm:"foriegnKey:JobPositionID"`

	DentalRecord 	[]DentalRecord	`gorm:"foriegnKey:EmployeeID"`

	Payment 		[]Payment		`gorm:"foriegnKey:EmployeeID"`

	Requisitions	[]Requisitions	`gorm:"foriegnKey:EmployeeID`

	Restocks		[]Restocks		`gorm:"foriegnKey:EmployeeID"`
}