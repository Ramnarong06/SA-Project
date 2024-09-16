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
		&entity.Gender{},
		&entity.BloodType{},
		&entity.DentalRecord{},
		&entity.Employee{},
		&entity.JobPosition{},
		&entity.Payment{},
		&entity.PaymentMethod{},
		&entity.Status{},
	)
	

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

	// Gender
	GenderMale := entity.Gender{Sex : "Male"}
	GenderFemale := entity.Gender{Sex : "Female"}

	db.FirstOrCreate(&GenderMale, &entity.Gender{Sex : "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Sex : "Female"})

	// BloodType
	BloodO:= entity.BloodType{BloodGroup: "O"}
	BloodA:= entity.BloodType{BloodGroup: "A"}
	BloodB:= entity.BloodType{BloodGroup: "B"}
	BloodAB:= entity.BloodType{BloodGroup: "AB"}

	db.FirstOrCreate(&BloodO, &entity.BloodType{BloodGroup : "O"})
	db.FirstOrCreate(&BloodA, &entity.BloodType{BloodGroup : "A"})
	db.FirstOrCreate(&BloodB, &entity.BloodType{BloodGroup : "B"})
	db.FirstOrCreate(&BloodAB, &entity.BloodType{BloodGroup : "AB"})

	//แผนกพนักงาน
	jobFinance := entity.JobPosition{Job : "Finance"}
	db.FirstOrCreate(&jobFinance, &entity.JobPosition{Job: "Finance"})

	//วิธีชำระเงิน
	transfer:= entity.PaymentMethod{MethodName: "โอน"}//เอาไว้เช็คในฐานข้อมูลว่ามีคำนี้หรือยัง
	cash := entity.PaymentMethod{MethodName: "เงินสด"}
	creditcard := entity.PaymentMethod{MethodName: "บัตรเครดิต"}
	db.FirstOrCreate(&transfer, &entity.PaymentMethod{MethodName: "โอน"})
	db.FirstOrCreate(&cash, &entity.PaymentMethod{MethodName: "เงินสด"})
	db.FirstOrCreate(&creditcard, &entity.PaymentMethod{MethodName: "บัตรเครดิต"})

	//status
	StatusPaid:= entity.Status{StatusName: "ชำระแล้ว"}
	StatusNotPaid:= entity.Status{StatusName: "ยังไม่ชำระ"}
	db.FirstOrCreate(&StatusPaid, &entity.Status{StatusName : "ชำระแล้ว"})
	db.FirstOrCreate(&StatusNotPaid, &entity.Status{StatusName: "ยังไม่ชำระ"})


	dob := getDOB(2011, 4, 2)


	Patient := &entity.Patient{
		FirstName: 		"นรชาติ",
		LastName:  		"ติวางวาย",
		Birthday:   	dob,
		Weight:   		66,
		Height:  		166,
		GenderID:		1,
		BloodTypeID:	1,
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
		Height:  		176,
		GenderID:		1,
		BloodTypeID:	2,
		DrugAllergy:	"-",
		Chronicdisease:	"-",
		Tel:			"1111111111",
	}
	db.FirstOrCreate(&Patient2, entity.Patient{
		FirstName: "รามณรงค์",
		LastName:  "พันธเดช",
	})
	
	//ชำระเงิน
	NowDate := time.Now()//เวลาปัจจุบัน
	Payment:=entity.Payment{
		Date :NowDate,
		PaymentMethodID : 1,
		EmployeeID : 1,
	}
	//db.FirstOrCreate(&Payment)
	db.FirstOrCreate(&Payment, entity.Payment{
		Date :NowDate,
		PaymentMethodID : 1,
		EmployeeID : 1,
	})

	record := entity.DentalRecord{
		Date:					NowDate,
		Description:			"ฟันพุ",
		Fees:					500,
		Installment: 			0,
		NumberOfInstallment: 	"0/0",
		PatientID:				1,
		EmployeeID:				1,
		TreatmentID:			1,
		StatusID:				1,
		PaymentID: 				nil,
	}
	//db.FirstOrCreate(&record)
	db.FirstOrCreate(&record, entity.DentalRecord{
		Date:					NowDate,
		Description:			"ฟันพุ",
		Fees:					500,
		Installment: 			0,
		NumberOfInstallment: 	"0/0",
		PatientID:				1,
		EmployeeID:				1,
		TreatmentID:			1,
		StatusID:				1,
		PaymentID: 				nil,
	})

}
