package entity
import (
	`gorm.io/gorm`
)
type Gender struct {
	gorm.Model
	Sex 			string
	Patient 		[]Patient `gorm:"foreignKey:GenderID"`
}