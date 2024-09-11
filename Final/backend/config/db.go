package config

import (
    "fmt"
    "time"
    "example.com/project/entity"
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

func getDOB(year, month, day int) time.Time {
    dob := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
    return dob
}

func SetupDatabase() {

    db.AutoMigrate(
		&entity.Schedule{},
		&entity.Patient{},
		&entity.Treatment{},
		&entity.Tstatus{},
	)
	

	// Treatment
    TreatmentCleaning := entity.Treatment{TreatmentName: "ขูดหินปูน"}
	TreatmentFillTeeth := entity.Treatment{TreatmentName: "อุดฟัน"}
	TreatmentPullTooth := entity.Treatment{TreatmentName: "ถอนฟัน"}

    db.FirstOrCreate(&TreatmentCleaning, &entity.Treatment{TreatmentName: "ขูดหินปูน"})
    db.FirstOrCreate(&TreatmentFillTeeth, &entity.Treatment{TreatmentName: "อุดฟัน"})
    db.FirstOrCreate(&TreatmentPullTooth, &entity.Treatment{TreatmentName: "ถอนฟัน"})


	TStatusPending := entity.Tstatus{TStatusName: "Pending"}
	TStatusDone := entity.Tstatus{TStatusName: "Done"}

	db.FirstOrCreate(&TStatusPending, &entity.Tstatus{TStatusName: "Pending"})
	db.FirstOrCreate(&TStatusDone, &entity.Tstatus{TStatusName: "Done"})


	dob := getDOB(2011, 4, 2)


	Patient := &entity.Patient{
		FirstName: 		"นรชาติ",
		LastName:  		"ติวางวาย",
		Birthday:   	dob,
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

	Patient2 := &entity.Patient{
		FirstName: 		"รามณรงค์",
		LastName:  		"พันธเดช",
		Birthday:   	dob,
		Weight:   		66,
		Height:  		166,
		Sex:  			"Male",
		BloodType:		"A",
		DrugAllergy:	"-",
		Chronicdisease:	"-",
		Tel:			"1111111111",
	}
	db.FirstOrCreate(&Patient2, entity.Patient{
		FirstName: "รามณรงค์",
		LastName:  "พันธเดช",
	})
	

}
