package entity
import (
	"time"
	"gorm.io/gorm"
)

type Patient struct {
	gorm.Model
	FirstName 		string
	LastName 		string
	Birthday 		time.Time `gorm:"type:DATE;not null;"`
	Weight 			int
	Height 			int
	Sex 			string
	BloodType 		string
	DrugAllergy 	string
	Chronicdisease 	string
	Tel 			string
	
	Schedules [] Schedule `gorm:"foreignKey:PatientID"`
}