package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)

func ListPatients(c *gin.Context) {
	var patient []entity.Patient

	db := config.DB()

	db.Find(&patient)

	c.JSON(http.StatusOK, &patient)
}

func SelectPatients(c *gin.Context) {
	var patient []entity.Patient

	db := config.DB()

	db.Find(&patient)

	c.JSON(http.StatusOK, &patient)
}