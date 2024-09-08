package controller

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// POST /users
func CreateSchedule(c *gin.Context) {
    var requestBody struct {
        Date        time.Time `json:"Date"`
        Tel         string    `json:"Tel"`
        TreatmentID uint      `json:"TreatmentID"`
        TstatusID   uint      `json:"TstatusID"`
    }

    // Bind JSON request เข้าตัวแปร requestBody
    if err := c.ShouldBindJSON(&requestBody); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // หา Patient โดยใช้หมายเลขโทรศัพท์ (Tel)
    var patient entity.Patient
    if err := db.Where("tel = ?", requestBody.Tel).First(&patient).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "patient not found"})
        return
    }

    // หา Treatment ตาม TreatmentID
    var treatment entity.Treatment
    if err := db.First(&treatment, requestBody.TreatmentID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "treatment not found"})
        return
    }

    // หา Tstatus ตาม TstatusID
    // var tstatus entity.Tstatus
    // if err := db.First(&tstatus, requestBody.TstatusID).Error; err != nil {
    //     c.JSON(http.StatusNotFound, gin.H{"error": "tStatus not found"})
    //     return
    // }

    // สร้าง Schedule ใหม่ โดยใช้ข้อมูลที่ได้จากการหา Patient และอื่นๆ
    previousDate := requestBody.Date.AddDate(0, 0, 1)
    s := entity.Schedule{
        Date:        	previousDate,
        PatientID:   	patient.ID,
        Patient:     	patient,
        TreatmentID: 	requestBody.TreatmentID,
        Treatment:   	treatment,
        // TstatusID:   requestBody.TstatusID,
        // Tstatus:     tstatus,
		TstatusID:		1,
		// Tstatus:     	tstatus,
    }

    // บันทึกข้อมูล Schedule ใหม่ลงในฐานข้อมูล
    if err := db.Create(&s).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": s})
}

// GET /user/:id
func GetSchedule(c *gin.Context) {
	ID := c.Param("id")
	var schedule entity.Schedule

	db := config.DB()
	//
	results1 := db.Preload("Treatment").First(&schedule, ID)
	if results1.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results1.Error.Error()})
		return
	}
	//
	results2 := db.Preload("Tstatus").First(&schedule, ID)
	if results2.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results2.Error.Error()})
		return
	}
	//


	if schedule.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, schedule)
}

// GET /users
func ListSchedules(c *gin.Context) {

	var schedule []entity.Schedule

	db := config.DB()
	results1 := db.Preload("Treatment").Find(&schedule)
	if results1.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results1.Error.Error()})
		return
	}
	//
	results2 := db.Preload("Tstatus").Find(&schedule)
	if results2.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results2.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, schedule)
}

//
func DeleteSchedule(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM schedules WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /users
func UpdateSchedule(c *gin.Context) {
	var schedule entity.Schedule

	ScheduleID := c.Param("id")

	db := config.DB()
	result := db.First(&schedule, ScheduleID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&schedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&schedule)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

//GET /schedules/:date
// func GetScheduleByDate(c *gin.Context) {
//     dateParam := c.Param("date")

//     // แปลงค่า dateParam เป็นรูปแบบ time.Time
//     date, err := time.Parse("2006-01-02", dateParam)
//     if err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{
//             "error":         "Invalid date format. Use YYYY-MM-DD",
//             "provided_date": dateParam,
//         })
//         return
//     }

//     // ลบวันที่ไป 1 วัน
//     previousDate := date.AddDate(0, 0, -1)

//     var schedules []entity.Schedule

//     db := config.DB()
//     // Query หาข้อมูล Schedule โดยเทียบเฉพาะวันที่ที่ลบไป 1 วัน
//     results := db.Preload("Treatment").Preload("Tstatus").
//         Where("DATE(date) = ?", previousDate.Format("2006-01-02")).Find(&schedules)
    
//     if results.Error != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
//         return
//     }

//     if len(schedules) == 0 {
//         c.JSON(http.StatusNotFound, gin.H{"message": "No schedules found for the provided date"})
//         return
//     }

//     c.JSON(http.StatusOK, schedules)
// }
//
func GetScheduleByDate(c *gin.Context) {
    dateParam := c.Param("date")

    // แปลงค่า dateParam เป็นรูปแบบ time.Time
    date, err := time.Parse("2006-01-02", dateParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error":         "Invalid date format. Use YYYY-MM-DD",
            "provided_date": dateParam,
        })
        return
    }

    // ลบวันที่ไป 1 วัน
    previousDate := date.AddDate(0, 0, 0)

    var schedules []entity.Schedule

    db := config.DB()
    // Query หาข้อมูล Schedule โดยเทียบเฉพาะวันที่ที่ลบไป 1 วัน
    results := db.Preload("Treatment").Preload("Patient").
        Where("DATE(date) = ?", previousDate.Format("2006-01-02")).Find(&schedules)
    
    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    if len(schedules) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"message": "No schedules found for the provided date"})
        return
    }

    // สร้าง slice เพื่อเก็บข้อมูลที่จัดรูปใหม่
    var response []gin.H
    for _, schedule := range schedules {
        // นำข้อมูลที่ต้องการใส่ใน response
        response = append(response, gin.H{
            "TreatmentName": schedule.Treatment.TreatmentName,
            "FirstName":     schedule.Patient.FirstName,
            "LastName":      schedule.Patient.LastName,
        })
    }

    // คืนค่าเป็น JSON ที่มีรูปแบบตามที่ต้องการ
    c.JSON(http.StatusOK, response)
}

func UpdateScheduleStatus(c *gin.Context) {
    ScheduleID := c.Param("id")

    
    var schedule entity.Schedule
    db := config.DB()
	result := db.First(&schedule, ScheduleID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
    //
    var input struct {
        TstatusID uint `json:"TstatusID"`  // รับ TstatusID จาก request body
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
   
    schedule.TstatusID = input.TstatusID  // อัปเดตสถานะ

    if err := config.DB().Save(&schedule).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}





