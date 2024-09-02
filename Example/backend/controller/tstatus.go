package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// GET /genders
func ListTstatuss(c *gin.Context) {
	var tStatus []entity.Tstatus

	db := config.DB()

	db.Find(&tStatus)

	c.JSON(http.StatusOK, &tStatus)
}