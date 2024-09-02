package entity

import (
	"time"

	"gorm.io/gorm"
)

type Schedule struct {
	gorm.Model
	Date        	time.Time `gorm:"type:DATE;not null;"`

	PatientID   	uint
	Patient     	Patient `gorm:"foriegnKey:PatientID"`

	TreatmentID 	uint
	Treatment    	Treatment `gorm:"foriegnKey:TreatmentID"`

	TstatusID   	uint
	Tstatus			Tstatus `gorm:"foriegnKey:TStatusID"`
}
