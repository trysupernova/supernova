package supernova_tasks

import (
	"time"

	"gorm.io/gorm"
)

type SupernovaTask struct {
	ID               uint   `gorm:"primaryKey" json:"id"`
	Title            string `gorm:"type:varchar(255);column:title;not null" json:"title"`
	Done             bool   `gorm:"column:done;not null" json:"done"`
	ExpectedDuration uint   `gorm:"column:expected_duration" json:"expectedDuration"`
	UserID           uint   `gorm:"column:user_id;not null" json:"userId"`

	CreatedAt time.Time      `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"column:updated_at" json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index,column:deleted_at" json:"deletedAt"`
}
