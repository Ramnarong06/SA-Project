package controller

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// POST /schedules
func CreateSchedule(c *gin.Context) {
	var input struct {
		FirstName   string `json:"first_name" binding:"required"`
		LastName    string `json:"last_name" binding:"required"`
		Date        time.Time `json:"date" binding:"required"`
		TreatmentID uint   `json:"treatment_id" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ค้นหา Patient ด้วย FirstName และ LastName
	var patient entity.Patient
	if err := db.Where("first_name = ? AND last_name = ?", input.FirstName, input.LastName).First(&patient).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "patient not found"})
		return
	}

	// ค้นหา Treatment ด้วย ID
	var treatment entity.Treatment
	if err := db.First(&treatment, input.TreatmentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "treatment not found"})
		return
	}
	

	// สร้าง Schedule
	s := entity.Schedule{
		Date:        input.Date,
		PatientID:   patient.ID,
		TreatmentID: treatment.ID,
		Status:      "Pending", // สถานะเริ่มต้นเป็น Pending
	}

	// บันทึกลงฐานข้อมูล
	if err := db.Create(&s).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Schedule created successfully", "data": s})
}

// GET /schedule/:id
func GetSchedule(c *gin.Context) {
	ID := c.Param("id")
	var schedule entity.Schedule

	db := config.DB()
	results := db.Preload("Patient").Preload("Treatment").First(&schedule, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if schedule.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, schedule)
}

// GET /schedules
func ListSchedules(c *gin.Context) {
	var schedules []entity.Schedule

	db := config.DB()
	results := db.Preload("Patient").Preload("Treatment").Find(&schedules)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, schedules)
}

// DELETE /schedules/:id
func DeleteSchedule(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM schedules WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /schedules/:id
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
