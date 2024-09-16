package entity

import (
	"time"

	"gorm.io/gorm"
)

type DentalRecord struct {
	gorm.Model
	Date                time.Time 
	Description         string    
	Fees                float32   
	Installment         float32   
	NumberOfInstallment string    

	PatientID   		uint
	Patient     		Patient `gorm:"foriegnKey:PatientID"`

	EmployeeID 			uint     
	Employee   			Employee `gorm:"foriegnKey:EmployeeID"`

	TreatmentID 		uint      
	Treatment   		Treatment `gorm:"foriegnKey:TreatmentID"`

	StatusID 			uint   
	Status   			Status `gorm:"foriegnKey:StatusID"`

	PaymentID 			*uint   `json:"paymentid"`
	Payment   			*Payment `gorm:"foreignKey:PaymentID" json:"payment" constraint:"OnDelete:SET NULL"` // ความสัมพันธ์แบบหนึ่งต่อหนึ่ง
}
