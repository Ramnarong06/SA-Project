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

func getDOB(year, month, day int) time.Time {
    dob := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
    return dob
}

func SetupDatabase() {

    db.AutoMigrate(
		&entity.User{},
		&entity.Gender{},
		&entity.Schedule{},
		&entity.Patient{},
		&entity.Treatment{},
		&entity.Tstatus{},
	)
	// Gender
	GenderMale := entity.Gender{Name: "Male"}
	GenderFemale := entity.Gender{Name: "Female"}

	db.FirstOrCreate(&GenderMale, &entity.Gender{Name: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Name: "Female"})

	// Treatment
    TreatmentCleaning := entity.Treatment{TreatmentName: "ขูดหินปูน"}
	TreatmentFillTeeth := entity.Treatment{TreatmentName: "อุดฟัน"}
	TreatmentPullTooth := entity.Treatment{TreatmentName: "ถอนฟัน"}

    db.FirstOrCreate(&TreatmentCleaning, &entity.Treatment{TreatmentName: "ขูดหินปูน"})
    db.FirstOrCreate(&TreatmentFillTeeth, &entity.Treatment{TreatmentName: "อุดฟัน"})
    db.FirstOrCreate(&TreatmentPullTooth, &entity.Treatment{TreatmentName: "ถอนฟัน"})

	// TStatus
	TStatusPending := entity.Tstatus{TStatusName: "Pending"}
	TStatusDone := entity.Tstatus{TStatusName: "Done"}

	db.FirstOrCreate(&TStatusPending, &entity.Tstatus{TStatusName: "Pending"})
	db.FirstOrCreate(&TStatusDone, &entity.Tstatus{TStatusName: "Done"})

	// Create User
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
	
	// const (
	// 	//TimeFormat1 to format date into
	// 	TimeFormat1 = "2006-01-02"
	// 	//TimeFormat2 Other format to format date time
	// 	TimeFormat2 = "January 02, 2006"
	// )
	

	// Create Patient
	//BirthDay2 := time.Date(2000, time.January, 2, 0, 0, 0, 0, time.UTC)
	dob := getDOB(2011, 4, 2)
	//BirthDay = dob.Format(TimeFormat1);

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
	
 
	// Create Schedule
    currentTime := time.Now().AddDate(0, 0, -1)
    Schedule := &entity.Schedule{
        Date:       	currentTime,
        PatientID:  	1,
        TreatmentID: 	1,
        TstatusID:     	1,
    }

    db.FirstOrCreate(&Schedule, entity.Schedule{
        Date:       	currentTime,
        PatientID:  	1,
        TreatmentID: 	1,
        TstatusID:     	1,
    })
}
