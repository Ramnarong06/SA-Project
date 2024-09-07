package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

func ListPatients(c *gin.Context) {
	var patient []entity.Patient

	db := config.DB()

	db.Find(&patient)

	c.JSON(http.StatusOK, &patient)
}