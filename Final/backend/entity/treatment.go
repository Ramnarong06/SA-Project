package entity
import (
"gorm.io/gorm"
)
type Treatment struct {
	gorm.Model
	TreatmentName string
	Schedule [] Schedule `gorm:"foreignKey:TreatmentID"`
}