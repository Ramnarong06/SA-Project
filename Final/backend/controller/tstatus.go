package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)

// GET /genders
func ListTstatuss(c *gin.Context) {
	var tStatus []entity.Tstatus

	db := config.DB()

	db.Find(&tStatus)

	c.JSON(http.StatusOK, &tStatus)
}