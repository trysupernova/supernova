package auth

import (
	"fmt"
	"net/http"

	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"github.com/trysupernova/supernova-api/db"
	customHTTP "github.com/trysupernova/supernova-api/http"
	"github.com/trysupernova/supernova-api/user"
	"github.com/trysupernova/supernova-api/utils"
)

func AuthHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	goth.UseProviders(
		google.New(
			utils.GetConfig().GOOGLE_CLIENT_ID,
			utils.GetConfig().GOOGLE_CLIENT_SECRET,
			fmt.Sprintf("%s/auth/google/callback", utils.GetConfig().THIS_URL),
		),
	)
	// try to get the user without re-authenticating
	if gothUser, err := gothic.CompleteUserAuth(w, r); err == nil {
		customHTTP.NewSuccessResponse(
			w,
			http.StatusOK,
			customHTTP.SuccessResponse[goth.User]{
				Message:    "User found",
				StatusCode: http.StatusOK,
				Data:       gothUser,
			})
	} else {
		gothic.BeginAuthHandler(w, r)
	}
}

func CallbackHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	userProfile, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		fmt.Fprintln(w, err)
		return
	}
	// create the user if there's no user with that email
	dbUser := user.SupernovaUser{}
	db.DB.Where("email = ?", userProfile.Email).First(&dbUser)
	if dbUser.ID == 0 {
		// User does not exist, create a new one
		newUser := user.SupernovaUser{
			Email: userProfile.Email,
			Name:  userProfile.Name,
		}
		db.DB.Create(&newUser)
	}

	// send back token
	// else tell them that their email is already registered under another provider (optionally tell them which one)
	http.Redirect(w, r, utils.GetConfig().BASE_URL_WEB_APP, http.StatusTemporaryRedirect)
}
