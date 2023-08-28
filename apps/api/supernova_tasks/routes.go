package supernova_tasks

import "github.com/trysupernova/supernova-api/router"

var Routes = router.RoutePrefix{
	Prefix: "/tasks",
	SubRoutes: []router.Route{
		{
			Name:        "MyTasks",
			Method:      "GET",
			Pattern:     "",
			HandlerFunc: ShowMyTasksHandler,
			Protected:   true,
		},
		{
			Name:        "CreateTask",
			Method:      "POST",
			Pattern:     "",
			HandlerFunc: CreateTaskHandler,
			Protected:   true,
		},
		{
			Name:        "EditTask",
			Method:      "PUT",
			Pattern:     "/{id}",
			HandlerFunc: EditTaskHandler,
			Protected:   true,
		},
		{
			Name:        "DeleteTask",
			Method:      "DELETE",
			Pattern:     "/{id}",
			HandlerFunc: DeleteTaskHandler,
			Protected:   true,
		},
	},
}
