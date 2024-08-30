package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)


func ListTreatment(c *gin.Context) {
	var treatment []entity.Treatment

	db := config.DB()

	db.Find(&treatment)

	c.JSON(http.StatusOK, &treatment)
}