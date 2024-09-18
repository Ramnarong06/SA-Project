package employee

import (
	"net/http"

	"example.com/project/config"
	"example.com/project/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func GetAll(c *gin.Context) {
    var employees []entity.Employee

    db := config.DB()

    // Preload all the necessary relationships
    results := db.Preload("Gender").Preload("JobPosition").Preload("DentalRecord").Preload("Payment").Find(&employees)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, employees)
}


func Get(c *gin.Context) {
    ID := c.Param("id")
    var employee entity.Employee

    db := config.DB()

    // Preload relationships for Gender, JobPosition, DentalRecord, and Payment
    results := db.Preload("Gender").
        Preload("JobPosition").
        Preload("DentalRecord").
        Preload("Payment").
        First(&employee, ID)

    if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            // Respond with 404 if the record is not found
            c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
        } else {
            // Respond with a generic error
            c.JSON(http.StatusInternalServerError, gin.H{"error 1234": results.Error.Error()})
        }
        return
    }

    // Return the employee data with status 200
    c.JSON(http.StatusOK, employee)
}



func Update(c *gin.Context) {

   var employee entity.Employee

   EmployeeID := c.Param("id")

   db := config.DB()

   result := db.First(&employee, EmployeeID)

   if result.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
       return
   }

   if err := c.ShouldBindJSON(&employee); err != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
       return
   }


   result = db.Save(&employee)

   if result.Error != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
       return
   }
   c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}


func Delete(c *gin.Context) {

   id := c.Param("id")

   db := config.DB()

   if tx := db.Exec("DELETE FROM employees WHERE id = ?", id); tx.RowsAffected == 0 {
       c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
       return

   }

   c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}