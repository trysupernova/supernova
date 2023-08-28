package user

import (
	"log"
	"net/http"

	"github.com/trysupernova/supernova-api/db"
	customHTTP "github.com/trysupernova/supernova-api/http"

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
