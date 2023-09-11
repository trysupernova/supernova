package user

import (
	"context"
	"errors"
	"fmt"
	"time"

	"crypto/rand"
	"encoding/base64"

	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
	"github.com/trysupernova/supernova-api/db"
	"github.com/trysupernova/supernova-api/email"
	"github.com/trysupernova/supernova-api/supernova_tasks"
	"github.com/trysupernova/supernova-api/utils"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const (
	resetEmailFrom           = "Supernova <notifications@trysupernova.one>"
	resetEmailSubject        = "Password Reset"
	resetTokenLength         = 32
	resetTokenExpiryDuration = 10 * time.Minute
)

type SupernovaUser struct {
	ID    uint                            `gorm:"primaryKey" json:"id"`
	Email string                          `gorm:"type:varchar(255);uniqueIndex;column:email;not null" json:"email"`
	Name  string                          `gorm:"type:varchar(255);column:name;not null" json:"name"`
	Hash  string                          `gorm:"type:text;column:hash" json:"-"` //hides from any json marshalling output
	Tasks []supernova_tasks.SupernovaTask `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"tasks"`

	CreatedAt time.Time      `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"column:updated_at" json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index,column:deleted_at" json:"deletedAt"`
}

type JWTToken struct {
	Token string `json:"token"`
}

func (u SupernovaUser) hashPassword(password string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), 4)
	return string(bytes)
}

func (u SupernovaUser) checkPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Hash), []byte(password))
	return err == nil
}

func (u SupernovaUser) generateJWT() (JWTToken, error) {
	signingKey := []byte(utils.GetConfig().JWT_SECRET)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 1 * 1).Unix(),
		"uid": u.ID,
	})
	tokenString, err := token.SignedString(signingKey)
	return JWTToken{tokenString}, err
}

func (u SupernovaUser) generateAndSendPasswordReset() error {
	// generate the token
	var token string
	var err error
	for {
		token, err = GenerateRandomID(resetTokenLength)
		if err != nil {
			return err
		}
		cmd := db.Redis.Get(context.Background(), token)
		if errors.Is(cmd.Err(), redis.Nil) {
			// key haven't been used so quit the loop and set the token
			break
		}
	}

	// create a temporary token that lasts for 10 minutes in our Redis store
	// use Redis SetEX command to set the token with an expiration time of 10 minutes
	// key = token & value = user ID
	// user ID is for us to verify that this token belongs to the user in /verify
	cmd := db.Redis.SetEx(context.Background(), token, fmt.Sprint(u.ID), resetTokenExpiryDuration)
	if cmd.Err() != nil {
		return cmd.Err()
	}

	// compile the templated email
	compiledEmail, err := email.CompileEmailForgotPassword(fmt.Sprintf("%s/forgot-password/verify?token=%s", utils.GetConfig().BASE_URL_WEB_APP, token))
	if err != nil {
		return err
	}

	// send the email
	emailClient := email.New()
	if _, err := emailClient.SendEmail(email.EmailSend{
		From:    resetEmailFrom,
		To:      []string{u.Email},
		Subject: resetEmailSubject,
		Body:    compiledEmail,
	}); err != nil {
		return err
	}

	return nil
}

func verifyPasswordResetToken(token string) (string, error) {
	// check if token exists in Redis store
	// if it does, then we can allow the user to reset their password and delete the token
	// if it doesn't, then we can't allow the user to reset their password
	cmd := db.Redis.Get(context.Background(), token)

	// key doesn't exist
	if errors.Is(cmd.Err(), redis.Nil) {
		return "", utils.NewAppError(ErrStaleToken, "Invalid token; token may have expired")
	}

	// the value of the key is the user id
	// as stored in the generateAndSendPasswordReset function
	userId := cmd.Val()

	// delete the token from Redis
	icmd := db.Redis.Del(context.Background(), token)
	if icmd.Err() != nil {
		return "", icmd.Err()
	}
	return userId, nil
}

// GenerateRandomID generates a random string of length n
func GenerateRandomID(length int) (string, error) {
	randomBytes := make([]byte, length)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(randomBytes)[:length], nil
}
