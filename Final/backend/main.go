package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/controller"
)

const PORT = "8000"

func main() {

	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	router := r.Group("")
	{
		
		//Schedule Routes
		router.GET("/schedules", controller.ListSchedules)
		router.GET("/schedule/:id", controller.GetSchedule)
		router.POST("/schedules", controller.CreateSchedule)
		router.PATCH("/updateschedules", controller.UpdateSchedule)
		router.DELETE("/schedules/:id", controller.DeleteSchedule)
		router.GET("/getschedulebydate/:date", controller.GetScheduleByDate)
		router.PATCH("/updateschedulestatus/:id", controller.UpdateScheduleStatus)
		
		router.GET("/patients", controller.ListPatients)
		router.GET("/treatments", controller.ListTreatment)
		router.GET("/tstatuss", controller.ListTstatuss)
		
		// ระบบชำระเงิน
		router.GET("/record",controller.GetAllDentalRecord)
      	router.GET("/saverecord",controller.GetSaveDentalRecord)
      	router.GET("/PaymentRecord/:id",controller.PaymentDentalRecord)
      	router.GET("/Receipt/:id",controller.GetReceipt)
      	router.GET("/SaveRecord",controller.GetSaveDentalRecord)
      	router.POST("/newPayment", controller.CreatePayment)
      	router.POST("/newDentalRecord", controller.CreateDentalRecord)
      	router.DELETE("/deleteDentalRecord/:id", controller.DeleteDentalRecord)
      	router.DELETE("/deletePayment/:id", controller.DeletePayment)
      	router.PATCH("/uprecord/:id", controller.UpdateDentalRecord)
      	router.PUT("/uprecordpay/:id", controller.UpdateDentalRecordPayment)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
