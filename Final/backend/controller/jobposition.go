package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)


func JobPosition(c *gin.Context) {
	var jobposition []entity.JobPosition
	db := config.DB()
	db.Find(&jobposition)
	c.JSON(http.StatusOK, &jobposition)
}