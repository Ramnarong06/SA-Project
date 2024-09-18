package entity

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	FirstName 	string 		`json:"first_name"`
	LastName 	string		`json:"last_name"`
	BirthDay 	time.Time 	`json:"birthday"`
	Address 	string 		`json:"address"`
	Tel 		string 		`json:"tel"`		
	Email 		string 		`json:"email"`
	Password 	string 		`json:"-"`

	GenderID 		uint 			`json:"gender_id"`
	Gender 			Gender			`gorm:"foriegnKey:GenderID"`

	JobPositionID 	uint 			`json:"jobposition_id"`
	JobPosition 	JobPosition		`gorm:"foriegnKey:JobPositionID"`

	DentalRecord 	[]DentalRecord	`gorm:"foriegnKey:EmployeeID"`

	Payment 		[]Payment		`gorm:"foriegnKey:EmployeeID"`

	Requisitions	[]Requisitions	`gorm:"foriegnKey:EmployeeID`

	Restocks		[]Restocks		`gorm:"foriegnKey:EmployeeID"`
}