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

/*สร้างฐานข้อมูล*/
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
		
		&entity.Patient{},&entity.Employee{},&entity.Gender{},&entity.BloodType{},&entity.JobPosition{},
		
		&entity.Schedule{},&entity.Tstatus{},&entity.Treatment{},
		
		&entity.DentalRecord{},&entity.Status{},
		
		&entity.Payment{},&entity.PaymentMethod{},
		
		&entity.Equipments{}, &entity.Requisitions{}, &entity.Restocks{},
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
	GenderMale := entity.Gender{Sex : "ชาย"}
	GenderFemale := entity.Gender{Sex : "หญิง"}

	db.FirstOrCreate(&GenderMale, &entity.Gender{Sex : "ชาย"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Sex : "หญิง"})

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
	JobPositionDentist := entity.JobPosition{Job: "ทันตแพทย์"}
	JobPositionFinance := entity.JobPosition{Job: "เจ้าหน้าที่การเงิน"}
	JobPositionPatientService := entity.JobPosition{Job: "เจ้าหน้าที่บริการคนไข้"}

	db.FirstOrCreate(&JobPositionDentist, &entity.JobPosition{Job: "ทันตแพทย์"})
	db.FirstOrCreate(&JobPositionFinance, &entity.JobPosition{Job: "เจ้าหน้าที่การเงิน"})
	db.FirstOrCreate(&JobPositionPatientService, &entity.JobPosition{Job: "เจ้าหน้าที่บริการคนไข้"})

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

	
	Patient3:=entity.Patient{
		FirstName :		"สมหญิง",
		LastName :		"สุขขี",
		Birthday :		dob,
		Weight : 		45,
		Height : 		150,
		DrugAllergy :		"ความดัน",
		Chronicdisease : 	"ย่าฆ่าเชื้อ",
		Tel :"0610000000",
		BloodTypeID :1,
		GenderID:1,
		}
	db.FirstOrCreate(&Patient3)
	
	//
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
	
	
	
	
	//
	hashedPassword, _ := HashPassword("123456")
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")

	Employee1	:=	&entity.Employee{
		FirstName: 		"รามณรงค์",
       	LastName:		"พันธเดช",
		BirthDay:		BirthDay,
		Address:		"ประเทศไทย",
		Tel:			"0822222222",
       	Email:     		"sa@gmail.com",
       	Password:  		hashedPassword,
       	GenderID:  		1,
		JobPositionID:  1,
	}

	db.FirstOrCreate(Employee1, &entity.Employee{
		Email: 			"sa@gmail.com",
	})
	hashedPassword2, _ := HashPassword("123456")
	//BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")

	Employee2	:=	&entity.Employee{
		FirstName: 		"สมชาย",
       	LastName:		"ใจดี",
		BirthDay:		BirthDay,
		Address:		"ประเทศไทย",
		Tel:			"0811111111",
       	Email:     		"sa2@gmail.com",
       	Password:  		hashedPassword2,
       	GenderID:  		1,
		JobPositionID:  1,
	}

	db.FirstOrCreate(Employee2, &entity.Employee{
		Email: 			"sa2@gmail.com",
	})

	// payment
	//hashedPassword2, _ := HashPassword("123456")
	//BirthDay2, _ := time.Parse("2006-01-02T00:00:00Z", "1988-11-12T00:00:00Z")
	//พนักงาน
	Employee := &entity.Employee{
 
		FirstName: "สุขสมัย",
 
		LastName:  "ใจสะอาด",
 
		Email:     "sa@gmail.com",
 
		Address: "โคราช",
 
		Password: hashedPassword,
 
		BirthDay:  BirthDay,
 
		GenderID:  1,

		JobPositionID: 1,
		
		Tel: "063-111-2222",
 
	}
	EmployeeDoctor := &entity.Employee{
 
		FirstName: "สมชาย",
 
		LastName:  "สายสุนทรีย์",
 
		Email:     "doctor@gmail.com",
 
		Address: "โคราช",
 
		Password: hashedPassword,
 
		BirthDay:  BirthDay,
 
		GenderID:  2,

		JobPositionID: 2,
		
		Tel: "063-111-4444",
 
	}
 
	db.FirstOrCreate(Employee, &entity.Employee{
 
		Email: "sa@gmail.com",
 
	})
	db.FirstOrCreate(EmployeeDoctor, &entity.Employee{
 
		Email: "doctor@gmail.com",
 
	})


	//Treatment
	ScrapeWayTartar:= entity.Treatment{TreatmentName: "ขูดหินปูน" }
	db.FirstOrCreate(&ScrapeWayTartar, &entity.Treatment{TreatmentName: "ขูดหินปูน"})
	//คนไข้
	Patient23:=entity.Patient{
		FirstName :"สมหญิง",
		LastName :"สุขขี",
		Birthday :BirthDay,
		Weight : 45,
		Height : 150,
		DrugAllergy :"ความดัน",
		Chronicdisease : "ย่าฆ่าเชื้อ",
		Tel :"061-000-0000",
		BloodTypeID :1,
		GenderID:1,
		}
	db.FirstOrCreate(&Patient23)

	
	
	//ชำระเงิน
	NowDate := time.Now()//เวลาปัจจุบัน
	Payment:=entity.Payment{
		Date :NowDate,

		PaymentMethodID : 1,

		EmployeeID : 2,
	}
	db.FirstOrCreate(&Payment)

	record := entity.DentalRecord{
		Date :NowDate,
		Description :"ฟันพุเยอะมาก",
		Fees :500.00,
		Installment: 0,
		NumberOfInstallment: "0/0",

		PatientID :1,
		
		EmployeeID :1,

		TreatmentID :1,
		
		StatusID :2,

		PaymentID: nil,
		}
	db.FirstOrCreate(&record)
}
