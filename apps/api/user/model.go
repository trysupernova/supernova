package user

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"github.com/trysupernova/supernova-api/supernova_tasks"
)

type User struct {
	ID    uint            `gorm:"primaryKey" json:"id"`
	Email string          `gorm:"type:varchar(255);uniqueIndex;column:email;not null" json:"email"`
	Name  string          `gorm:"type:varchar(255);column:name;not null" json:"name"`
	Hash  string          `gorm:"type:text;column:hash;not null" json:"-"` //hides from any json marshalling output
	Tasks []supernova_tasks.SupernovaTask `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"tasks"`

	CreatedAt time.Time      `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"column:updated_at" json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index,column:deleted_at" json:"deletedAt"`
}

type JWTToken struct {
	Token string `json:"token"`
}

func (u User) hashPassword(password string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), 4)
	return string(bytes)
}

func (u User) checkPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Hash), []byte(password))
	return err == nil
}

func (u User) generateJWT() (JWTToken, error) {
	signingKey := []byte(os.Getenv("JWT_SECRET"))
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 1 * 1).Unix(),
		"uid": u.ID,
	})
	tokenString, err := token.SignedString(signingKey)
	return JWTToken{tokenString}, err
}
