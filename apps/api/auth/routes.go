package auth

import "github.com/trysupernova/supernova-api/router"

var Routes = router.RoutePrefix{
	Prefix: "/auth",
	SubRoutes: []router.Route{
		{
			Name:        "AuthHandle",
			Method:      "GET",
			Pattern:     "/{provider}",
			HandlerFunc: AuthHandler,
			Protected:   false,
		},
		{
			Name:        "CallbackHandle",
			Method:      "GET",
			Pattern:     "/{provider}/callback",
			HandlerFunc: CallbackHandler,
			Protected:   false,
		},
	},
}
