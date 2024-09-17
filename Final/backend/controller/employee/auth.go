package employee


import (
   "errors"
   "net/http"
   "time"
   "github.com/gin-gonic/gin"
   "golang.org/x/crypto/bcrypt"
   "gorm.io/gorm"
   	"example.com/project/config"
	"example.com/project/entity"

   	"example.com/project/services"

)


type (

   Authen struct {
       Email    string `json:"email"`
       Password string `json:"password"`
   }


   signUp struct {
       	FirstName 		string   	`json:"first_name"`
       	LastName  		string    	`json:"last_name"`
		BirthDay  		time.Time 	`json:"birthday"`
		Address			string		`json:"address"`
		Tel				string		`json:"tel"`
       	Email     		string    	`json:"email"`
       	Password  		string    	`json:"password"`
       	GenderID  		uint      	`json:"gender_id"`
		JobPositionID  	uint      	`json:"jobposition_id"`
   }

)


func SignUp(c *gin.Context) {

   var payload signUp

   // Bind JSON payload to the struct
   if err := c.ShouldBindJSON(&payload); err != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
       return
   }


   db := config.DB()

   var employeeCheck entity.Employee


   // Check if the user with the provided email already exists

   result := db.Where("email = ?", payload.Email).First(&employeeCheck)

   if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {

       // If there's a database error other than "record not found"

       c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})

       return

   }


   if employeeCheck.ID != 0 {

       // If the user with the provided email already exists

       c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})

       return

   }


   // Hash the user's password

   hashedPassword, _ := config.HashPassword(payload.Password)


   // Create a new user

   employee := entity.Employee{

       	FirstName: 		payload.FirstName,
       	LastName:  		payload.LastName,
	   	BirthDay:		payload.BirthDay,
		Address:		payload.Address,
		Tel: 			payload.Tel,
       	Email:     		payload.Email,
       	Password:  		hashedPassword,
       	GenderID:  		payload.GenderID,
	   	JobPositionID:  payload.JobPositionID,

   }


   // Save the user to the database

   if err := db.Create(&employee).Error; err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

       return

   }


   c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})

}


func SignIn(c *gin.Context) {

   var payload Authen

   var employee entity.Employee


   if err := c.ShouldBindJSON(&payload); err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

       return

   }

   // ค้นหา user ด้วย Username ที่ผู้ใช้กรอกเข้ามา

   if err := config.DB().Raw("SELECT * FROM employees WHERE email = ?", payload.Email).Scan(&employee).Error; err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

       return

   }


   // ตรวจสอบรหัสผ่าน

   err := bcrypt.CompareHashAndPassword([]byte(employee.Password), []byte(payload.Password))

   if err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})

       return

   }


   jwtWrapper := services.JwtWrapper{

       SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",

       Issuer:          "AuthService",

       ExpirationHours: 24,

   }


   signedToken, err := jwtWrapper.GenerateToken(employee.Email)

   if err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})

       return

   }


   c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": employee.ID})


}