package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// POST /users
func CreateSchedule(c *gin.Context) {
	var schedule entity.Schedule

	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&schedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// 
	var patient entity.Patient
	db.First(&patient, schedule.PatientID)
	if patient.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "patient not found"})
		return
	}

	// 
	var treatment entity.Treatment
	db.First(&treatment, schedule.TreatmentID)
	if treatment.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "treatment not found"})
		return
	}

	//
	var tstatus entity.Tstatus
	db.First(&tstatus, schedule.TstatusID)
	if tstatus.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "tStatus not found"})
		return
	}


	// 
	s := entity.Schedule{
		Date:			schedule.Date,
		PatientID:		schedule.PatientID,
		Patient:		patient,
		TreatmentID:	schedule.TreatmentID,
		Treatment:		treatment,
		TstatusID: 		schedule.TstatusID,	
		Tstatus:		tstatus,		
	}

	// บันทึก
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