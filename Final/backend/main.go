package main

import (
	"net/http"

	"example.com/project/config"
	"example.com/project/controller"
	"example.com/project/controller/employee"
	"example.com/project/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {

	// open connection database
	config.ConnectionDB()
	// Generate databases
	config.SetupDatabase()
	r := gin.Default()

	r.Use(CORSMiddleware())
	r.POST("/signup", employee.SignUp)
	r.POST("/signin", employee.SignIn)

	router := r.Group("")

	
	router2 := r.Group("api")
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
		router2.GET("/record",controller.GetAllDentalRecord)
		router2.GET("/saverecord",controller.GetSaveDentalRecord)
		router2.GET("/PaymentRecord/:id",controller.PaymentDentalRecord)
		router2.GET("/Receipt/:id",controller.GetReceipt)
		router2.GET("/SaveRecord",controller.GetSaveDentalRecord)
		router2.POST("/newPayment", controller.CreatePayment)
		router2.POST("/newDentalRecord", controller.CreateDentalRecord)
		router2.DELETE("/deleteDentalRecord/:id", controller.DeleteDentalRecord)
		router2.DELETE("/deletePayment/:id", controller.DeletePayment)
		router2.PATCH("/uprecord/:id", controller.UpdateDentalRecord)
		router2.PUT("/uprecordpay/:id", controller.UpdateDentalRecordPayment)
		
		router.Use(middlewares.Authorizes())

		//login employee
		router.PATCH("/employee/:id", employee.Update)
		router.GET("/employees", employee.GetAll)
		router.GET("/employee/:id", employee.Get)
		router.DELETE("/employee/:id", employee.Delete)

	}
	r.GET("/genders", controller.ListGenders)

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
