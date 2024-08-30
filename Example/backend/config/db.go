package config

import (
    "fmt"
    "time"

    "github.com/tanapon395/sa-67-example/entity" // Adjust the import path
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
    return db
}

func ConnectionDB() {
    database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }
    fmt.Println("connected database")
    db = database
}
const (
    DateTime = "2006-01-02 15:04:05"
    DateOnly = "2006-01-02"
)


func SetupDatabase() {

    db.AutoMigrate(
		&entity.User{},
		&entity.Gender{},
		&entity.Schedule{},
		&entity.Patient{},
		&entity.Treatment{},
	)

	GenderMale := entity.Gender{Name: "Male"}
	GenderFemale := entity.Gender{Name: "Female"}

	db.FirstOrCreate(&GenderMale, &entity.Gender{Name: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Name: "Female"})

    TreatmentCleaning := entity.Treatment{TreatmentName: "ขูดหินปูน"}
    db.FirstOrCreate(&TreatmentCleaning, &entity.Treatment{TreatmentName: "ขูดหินปูน"})

    TreatmentFillTeeth := entity.Treatment{TreatmentName: "อุดฟัน"}
    db.FirstOrCreate(&TreatmentFillTeeth, &entity.Treatment{TreatmentName: "อุดฟัน"})

    TreatmentPullTooth := entity.Treatment{TreatmentName: "ถอนฟัน"}
    db.FirstOrCreate(&TreatmentPullTooth, &entity.Treatment{TreatmentName: "ถอนฟัน"})


	hashedPassword, _ := HashPassword("123456")
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")
	User := &entity.User{
		FirstName: "Software",
		LastName:  "Analysis",
		Email:     "sa@gmail.com",
		Password:  hashedPassword,
		BirthDay:  BirthDay,
		GenderID:  1,
	}
	db.FirstOrCreate(User, &entity.User{
		Email: "sa@gmail.com",
	})
	
	
	BirthDay2 := time.Date(2000, time.January, 2, 0, 0, 0, 0, time.UTC)
	BirthDay2.Format("2006-02-01")

	Patient := &entity.Patient{
		FirstName: 		"นรชาติ",
		LastName:  		"ติวางวาย",
		Birthday:   	BirthDay2,
		Weight:   		66,
		Height:  		166,
		Sex:  			"Male",
		BloodType:		"A",
		DrugAllergy:	"-",
		Chronicdisease:	"-",
		Tel:			"0000000000",
	}
	db.FirstOrCreate(&Patient, entity.Patient{
		FirstName: "นรชาติ",
		LastName:  "ติวางวาย",
	})

    currentTime := time.Now()
	
    Schedule := &entity.Schedule{
        Date:       	currentTime,
        PatientID:  	1,
        TreatmentID: 	1,
        Status:     	"Pending",
    }

    db.FirstOrCreate(&Schedule, entity.Schedule{
        Date:       currentTime,
        PatientID:  1,
        TreatmentID: 1,
        Status:     "Pending",
    })
}