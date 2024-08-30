package entity
import (
	"time"
	"gorm.io/gorm"
)

type Schedule struct {
	gorm.Model

	Date 		time.Time `gorm:"type:DATE;not null;"`
	PatientID 	uint
	//Patient 	Patient `gorm:"foreignKey:PatientID"`

	TreatmentID uint
	//Treatment 	Treatment `gorm:"foreignKey:TreatmentID"`

	Status 		string
}

type CustomTime struct {
    time.Time
}
