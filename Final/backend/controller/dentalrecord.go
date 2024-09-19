package controller

import (
	"net/http"
	"time"
	"errors"
	"example.com/project/config"
	"example.com/project/entity"
	//"github.com/tanapon395/sa-67-example/config"
	//"github.com/tanapon395/sa-67-example/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"fmt"
)


func GetAllDentalRecord(c *gin.Context) {
	db := config.DB()
	var record []struct{
		FirstName 				string
		LastName 				string
		Age 					int
		Date 					time.Time `json:"-"` //่`json:"-"`ไม่ให้แสดงออกOut put
		FormattedDate 			string `json:"Date"`
		Fees 					float32
		NumberOfInstallment 	string
		StatusName 				string
		ID						uint
		PrintFees          		string   // feesที่แปลงแล้ว
		Birthday 				time.Time
	}
	result := db.Model(&entity.DentalRecord{}).
	Select("dental_records.id","dental_records.date","dental_records.Number_Of_Installment","statuses.Status_Name","patients.First_Name","patients.Last_Name","dental_records.fees","patients.birthday").
	Joins("inner join statuses on dental_records.status_id = statuses.id ").
	Joins("inner join patients on dental_records.patient_id = patients.id").
	Where("dental_records.payment_id IS NULL").Find(&record)//ต้องแก้กลับเป็นลบ NOT ออก

   if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
       // If there's a database error other than "record not found"
       c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})

       return

   }
   for i := range record {
	record[i].FormattedDate = record[i].Date.Format("2006-01-02 15:04:05") // Change this format to your preferred style
	
	record[i].PrintFees = fmt.Sprintf("%.2f",record[i].Fees)

	record[i].Age = calculateAge(record[i].Birthday)
	
}
	c.JSON(http.StatusOK, &record)
 }


 func PaymentDentalRecord(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()
	var payrecord []struct{
		ID                  uint
		FirstName           string
		LastName            string
		Sex                 string
		Age                 int
		Birthday 			time.Time
		Tel                 string
		BloodGroup          string
		DrugAllergy         string
		Chronicdisease     	string
		Description         string
		Date                time.Time `json:"-"` // Hide raw date field
		FormattedDate       string    `json:"Date"`
		Efirstname          string
		Elastname           string
		Fees                float32    // feesที่ยังไม่แปลง
		Installment         float32    // Installment ที่ยังไม่แปลง
		NumberOfInstallment string
		FormattedDate2      string `json:"Date2"`
		Pefirst_name        string
		Pelast_name         string
		PrintFees           string   // feesที่แปลงแล้ว
		PrintInstallment   	string    // Installment ที่แปลงแล้ว
		TreatmentName 		string
	}
	results := db.Model(&entity.DentalRecord{}).
		Select("dental_records.id", "dental_records.date", "dental_records.description", "dental_records.fees", "dental_records.installment", "dental_records.number_of_installment", "patients.first_name", "patients.last_name", "patients.tel", "blood_types.blood_group", "patients.drug_allergy", "patients.Chronicdisease", "employees.first_name AS efirstname", "employees.last_name AS elastname", "genders.sex","treatments.treatment_name","patients.birthday").
		Joins("inner join statuses on dental_records.status_id = statuses.id ").
		Joins("inner join patients on dental_records.patient_id = patients.id").
		Joins("inner join blood_types on patients.blood_type_id = blood_types.id").
		Joins("inner join employees on dental_records.employee_id = employees.id").
		Joins("inner join genders on patients.gender_id = genders.id").
		Joins("inner join Treatments on dental_records.treatment_id = treatments.id").
		//Joins("inner join employees as payment_employee on payments.employee_id = payment_employee.id").
		//Joins("inner join payments on dental_records.payment_id = payments.id").
		First(&payrecord, ID)

		// "payment_employee.first_name AS pefirst_name", "payment_employee.last_name AS pelast_name"
	
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	for i := range payrecord {
		// Format dates
		payrecord[i].FormattedDate2 = payrecord[i].Date.Format("2006-01-02")
		payrecord[i].FormattedDate = payrecord[i].Date.Format("2006-01-02 15:04:05")
		
		// // Format fees and installment to always show 2 decimal places
		payrecord[i].PrintFees = fmt.Sprintf("%.2f", payrecord[i].Fees)
		payrecord[i].PrintInstallment = fmt.Sprintf("%.2f", payrecord[i].Installment)

		payrecord[i].Age = calculateAge(payrecord[i].Birthday)
	}

	c.JSON(http.StatusOK, payrecord)
}

func GetReceipt(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()
	var payrecord []struct{
		FirstName           string
		LastName            string
		Sex                 string
		//Age                 uint
		Tel                 string
		BloodGroup          string
		DrugAllergy         string
		Chronicdisease     string
		Description         string
		Date                time.Time `json:"-"` // Hide raw date field
		FormattedDate       string    `json:"Date"`
		Efirstname          string
		Elastname           string
		Fees                float32    // feesที่ยังไม่แปลง
		Installment         float32    // Installment ที่ยังไม่แปลง
		NumberOfInstallment string
		ID                  uint
		FormattedDate2      string `json:"Date2"`
		Pefirst_name        string
		Pelast_name         string
		PrintFees           string   // feesที่แปลงแล้ว
		PrintInstallment   	string    // Installment ที่แปลงแล้ว
		TreatmentName 		string
	}
	results := db.Model(&entity.DentalRecord{}).
		Select("dental_records.id", "dental_records.date", "dental_records.description", "dental_records.fees", "dental_records.installment", "dental_records.number_of_installment", "patients.first_name", "patients.last_name", "patients.tel", "blood_types.blood_group", "patients.drug_allergy", "patients.Chronicdisease", "employees.first_name AS efirstname", "employees.last_name AS elastname", "genders.sex","payment_employee.first_name AS Pefirst_name","payment_employee.last_name AS Pelast_name","treatments.treatment_name").
		Joins("inner join statuses on dental_records.status_id = statuses.id ").
		Joins("inner join patients on dental_records.patient_id = patients.id").
		Joins("inner join blood_types on patients.blood_type_id = blood_types.id").
		Joins("inner join employees on dental_records.employee_id = employees.id").
		Joins("inner join genders on patients.gender_id = genders.id").
		Joins("inner join employees as payment_employee on payments.employee_id = payment_employee.id").
		Joins("inner join payments on dental_records.payment_id = payments.id").
		Joins("inner join Treatments on dental_records.treatment_id = treatments.id").
		First(&payrecord, ID)

		// "payment_employee.first_name AS pefirst_name", "payment_employee.last_name AS pelast_name"
	
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	for i := range payrecord {
		// Format dates
		payrecord[i].FormattedDate2 = payrecord[i].Date.Format("2006-01-02")
		payrecord[i].FormattedDate = payrecord[i].Date.Format("2006-01-02 15:04:05")
		
		// // Format fees and installment to always show 2 decimal places
		payrecord[i].PrintFees = fmt.Sprintf("%.2f", payrecord[i].Fees)
		payrecord[i].PrintInstallment = fmt.Sprintf("%.2f", payrecord[i].Installment)
	}

	c.JSON(http.StatusOK, payrecord)
}


// func GetReceipt(c *gin.Context) {
// 	ID := c.Param("id")
// 	db := config.DB()
// 	var receipt []struct{
// 		ID uint
// 		FirstName string
// 		LastName string
// 		Description string
// 		Date time.Time `json:"-"` //่`json:"-"`ไม่ให้แสดงออกOut put
// 		FormattedDate string `json:"Date"`
		
// 		Efirstname string
// 		Elastname string
// 		Fees float32
// 		Pefirst_name string
// 		Pelast_name string
// 	}
// 	results := db.Model(&entity.DentalRecord{}).
// 	Select("dental_records.id","dental_records.date","dental_records.description","dental_records.fees","patients.first_name","patients.last_name","employees.first_name AS efirstname","employees.last_name AS elastname","payment_employee.first_name AS pefirst_name","payment_employee.last_name AS pelast_name") .
// 	Joins("inner join patients on dental_records.patient_id = patients.id").
// 	Joins("inner join payments on dental_records.payment_id = payments.id").
// 	Joins("inner join employees on dental_records.employee_id = employees.id").
// 	Joins("inner join employees as payment_employee on payments.employee_id = payment_employee.id").
// 	First(&receipt,ID)
// 	//results := db.Preload("Patient").Preload("Employee").Preload("Treatment").Preload("Status").Preload("Patient.BloodType").Preload("Patient.Gender").Preload("Employee.Gender").Preload("Employee.JobPosition").Preload("Payment").Preload("Payment.PaymentMethod").Find(&payrecord)
// 	if results.Error != nil {
 
// 		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
 
// 		return
 
// 	}
// 	for i := range receipt {
		
// 		receipt[i].FormattedDate = receipt[i].Date.Format("2006-01-02 15:04:05")
		
// 	}
// 	// if results.ID == 0{
// 	// 	c.JSON(http.StatusNoContent, gin.H{})
// 	// 	return
// 	// }
 
// 	c.JSON(http.StatusOK,receipt)
//  }


func GetSaveDentalRecord(c *gin.Context) {
	db := config.DB()
	var saverecord []struct{
		ID 						uint `json:"-"`
		FirstName 				string
		LastName 				string
		Age 					int
		Fees  					float32 
		NumberOfInstallment		string
		MethodName 				string
		Date 					time.Time `json:"-"` //่`json:"-"`ไม่ให้แสดงออกOut put
		FormattedDate 			string `json:"Date"`
		StatusName 				string
		Efirst_name 			string
		Elast_name 				string
		PrintFees           	string   // feesที่แปลงแล้ว
		Birthday 				time.Time
	}
	result := db.Model(&entity.DentalRecord{}).
	Select("dental_records.id","payments.date","dental_records.Number_Of_Installment","statuses.Status_Name","patients.birthday","patients.First_Name","patients.Last_Name","dental_records.fees","payment_employee.First_Name AS Efirst_name","payment_employee.Last_Name AS Elast_name","payment_methods.method_name").
	Joins("inner join statuses on dental_records.status_id = statuses.id ").
	Joins("inner join patients on dental_records.patient_id = patients.id").
	Joins("inner join payments on dental_records.payment_id = payments.id").
	Joins("inner join employees as payment_employee on payments.employee_id = payment_employee.id").
	Joins("inner join payment_methods on payments.payment_method_id = payment_methods.id").
	Where("dental_records.payment_id IS NOT NULL").Find(&saverecord)

   if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
       // If there's a database error other than "record not found"
       c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})

       return

   }
   // อัปเดต StatusID เป็น 2 สำหรับแต่ละเรคอร์ดที่ถูกดึงมา
	for i := range saverecord {
		// อัปเดตฟิลด์ StatusID ของแต่ละเรคอร์ดที่ดึงมา
		db.Model(&entity.DentalRecord{}).Where("id = ?", saverecord[i].ID).Update("StatusID", 1)
		// จัดรูปแบบวันที่ให้เป็นไปตามที่ต้องการ
		saverecord[i].FormattedDate = saverecord[i].Date.Format("2006-01-02 15:04:05")
		saverecord[i].PrintFees = fmt.Sprintf("%.2f", saverecord[i].Fees)

		saverecord[i].Age = calculateAge(saverecord[i].Birthday)
	}
	c.JSON(http.StatusOK, &saverecord)
 }

func calculateAge(BirthDay time.Time) int {
	now := time.Now()
	years := now.Year() - BirthDay.Year()

	// ตรวจสอบว่าเดือนและวันเกิดของปีนี้มาถึงหรือยัง ถ้ายังก็ลดอายุลง 1
	if now.YearDay() < BirthDay.YearDay() {
		years--
	}
	return years
}

// func GetDentalRecord(c *gin.Context) {
// 	ID := c.Param("paymentid")
// 	var recordpay entity.DentalRecord 
// 	db := config.DB()
// 	results := db.Preload("Treatment").First(&recordpay,ID)
// 	if results.Error != nil {
 
// 		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
 
// 		return
// 	}
// 	if recordpay.ID == 0{
 
// 		c.JSON(http.StatusNoContent, gin.H{})
 
// 		return
// 	}
 
// 	c.JSON(http.StatusOK,recordpay)
//  }


func CreateDentalRecord(c *gin.Context) {
	var newDentalRecord entity.DentalRecord
	// Bind the JSON request body to the newRecord variable
	if err := c.ShouldBindJSON(&newDentalRecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	newDentalRecord.Date = time.Now()
	newDentalRecord.StatusID = 2
	newDentalRecord.PaymentID = nil
	// Connect to the database
	db := config.DB()
	// Save the new record to the database
	result := db.Create(&newDentalRecord)
	// Error handling
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	// Return success response
	c.JSON(http.StatusCreated, gin.H{"message": "Record created successfully", "data": newDentalRecord})
}


func UpdateDentalRecord(c *gin.Context) {
	var uprecord entity.DentalRecord
	ID := c.Param("id")
	db := config.DB()
	result := db.First(&uprecord,ID)
	if result.Error != nil {
 
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
 
		return
 
	}
	if err := c.ShouldBindJSON(&uprecord); err != nil {
 
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
 
		return
 
	}
	result = db.Save(&uprecord)
 
	if result.Error != nil {
 
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
 
		return
 
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
 
 }

 
func DeleteDentalRecord(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM dental_records WHERE id = ?", ID); tx.RowsAffected == 0 {
 
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
 
		return
 
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
 }

 func DeletePayment(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM payments WHERE id = ?", ID); tx.RowsAffected == 0 {
 
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
 
		return
 
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
 }

 