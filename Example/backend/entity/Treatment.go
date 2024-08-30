package entity
import (
"gorm.io/gorm"
)
type Treatment struct {
	gorm.Model
	TreatmentName string
	Schedules [] Schedule `gorm:"foreignKey:TreatmentID"`
}