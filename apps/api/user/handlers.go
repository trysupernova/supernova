package user

import (
	"errors"
	"log"
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/trysupernova/supernova-api/db"
	customHTTP "github.com/trysupernova/supernova-api/http"
	"gorm.io/gorm"

	"github.com/gorilla/mux"
)

func ShowHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	db.DB.First(&user, r.Header.Get("userId"))
	customHTTP.NewSuccessResponse(w, http.StatusOK, customHTTP.SuccessResponse[User]{Message: "User found", StatusCode: http.StatusOK, Data: user})
}

func CreateHandler(w http.ResponseWriter, r *http.Request) {
	var userBody struct {
		Email    string `json:"email"`
		Name     string `json:"name"`
		Password string `json:"password"`
	}
	if err := customHTTP.ParseBodyJSON(r, &userBody); err != nil {
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, "Error: "+err.Error())
		return
	}
	var user User
	//get password hash
	user.Email = userBody.Email
	user.Name = userBody.Name
	user.Hash = user.hashPassword(userBody.Password)
	err := db.DB.Create(&user).Error
	if err != nil {
		customHTTP.NewErrorResponse(w, http.StatusUnauthorized, "Error: "+err.Error())
		return
	}
	customHTTP.NewSuccessResponse(w, http.StatusOK, customHTTP.SuccessResponse[User]{Message: "User created", StatusCode: http.StatusOK, Data: user})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var userBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := customHTTP.ParseBodyJSON(r, &userBody); err != nil {
		log.Println(userBody)
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, "Error: "+err.Error())
		return
	}
	var user User
	db.DB.Where("email = ?", userBody.Email).Find(&user)
	if user.checkPassword(userBody.Password) {
		token, err := user.generateJWT()
		if err != nil {
			customHTTP.NewErrorResponse(w, http.StatusUnauthorized, "Error: "+err.Error())
			return
		}
		customHTTP.NewSuccessResponse(w, http.StatusOK, customHTTP.SuccessResponse[string]{Message: "User logged in", StatusCode: http.StatusOK, Data: token.Token})
	} else {
		customHTTP.NewErrorResponse(w, http.StatusUnauthorized, "Password incorrect")
		return
	}
}

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var user User
	var users []User

	db.DB.First(&user, params["userId"])
	db.DB.Delete(&user)

	db.DB.Find(&users)
	customHTTP.NewSuccessResponse(w, http.StatusOK, customHTTP.SuccessResponse[[]User]{Message: "User deleted", StatusCode: http.StatusOK, Data: users})
}

func ForgotPasswordHandler(w http.ResponseWriter, r *http.Request) {
	var userBody struct {
		Email string `json:"email"`
	}
	if err := customHTTP.ParseBodyJSON(r, &userBody); err != nil {
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, "Error: "+err.Error())
		return
	}
	var user User
	db.DB.Where("email = ?", userBody.Email).Find(&user)
	if user.ID == 0 {
		customHTTP.NewErrorResponse(w, http.StatusUnauthorized, "User not found")
		return
	}
	// send email for forgot password
	err := user.generateAndSendPasswordReset()
	if err != nil {
		customHTTP.NewErrorResponse(w, http.StatusUnauthorized, "Error: "+err.Error())
		return
	}
	customHTTP.NewSuccessResponse(w, http.StatusOK, customHTTP.SuccessResponse[any]{Message: "Password reset token generated", StatusCode: http.StatusOK})
}

func ChangePasswordHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Password string `json:"password" valid:"required~password is required"`
		Token    string `json:"token" valid:"required~token is required"`
	}

	if err := customHTTP.ParseBodyJSON(r, &body); err != nil {
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, "Error: "+err.Error())
		return
	}

	if _, err := govalidator.ValidateStruct(body); err != nil {
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, "Error: "+err.Error())
		return
	}

	requestingUserId, err := verifyPasswordResetToken(body.Token)
	if err != nil {
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, "Error: "+err.Error())
		return
	}

	// update their password
	var user User
	// find the user first; if not associated to the correct user then
	// err out
	if err := db.DB.First(&user, requestingUserId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			customHTTP.NewErrorResponse(w, http.StatusBadRequest, "User not found")
			return
		}
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, "Error: "+err.Error())
		return
	}
	user.Hash = user.hashPassword(body.Password)
	if err := db.DB.Save(&user).Error; err != nil {
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, "Error: "+err.Error())
		return
	}

	customHTTP.NewSuccessResponse(w, http.StatusOK, customHTTP.SuccessResponse[any]{Message: "Password updated", StatusCode: http.StatusOK})
}
