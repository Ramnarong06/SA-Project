package entity
import (
	`gorm.io/gorm`
)

type JobPosition struct{
	gorm.Model
	Job 		string 		`json:"job"`
	Employee 	[]Employee	`gorm:"foriegnKey:JobPositionID"`
}