package user

import "github.com/trysupernova/supernova-api/router"

var Routes = router.RoutePrefix{
	Prefix: "/users",
	SubRoutes: []router.Route{
		{
			Name:        "UsersShow",
			Method:      "GET",
			Pattern:     "/me",
			HandlerFunc: ShowHandler,
			Protected:   true,
		},
		{
			Name:        "UsersCreate",
			Method:      "POST",
			Pattern:     "",
			HandlerFunc: CreateHandler,
			Protected:   false,
		},
		{
			Name:        "UsersLogin",
			Method:      "POST",
			Pattern:     "/login",
			HandlerFunc: LoginHandler,
			Protected:   false,
		},
		{
			Name:        "ForgotPassword",
			Method:      "POST",
			Pattern:     "/forgot-password",
			HandlerFunc: ForgotPasswordHandler,
			Protected:   false,
		},
		{
			Name:        "ChangePassword",
			Method:      "POST",
			Pattern:     "/forgot-password/verify",
			HandlerFunc: ChangePasswordHandler,
			Protected:   false,
		},
	},
}
