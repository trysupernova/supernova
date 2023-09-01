package supernova_tasks

import (
	"net/http"
	"strconv"

	"github.com/trysupernova/supernova-api/db"
	customHTTP "github.com/trysupernova/supernova-api/http"
)

/*
Show all user tasks based on the filters
*/
func ShowMyTasksHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.Header.Get("userId")
	var tasks []SupernovaTask
	db.DB.Where("user_id = ?", userId).Find(&tasks)
	customHTTP.NewSuccessResponse(w, http.StatusOK, customHTTP.SuccessResponse[[]SupernovaTask]{Message: "Tasks found", StatusCode: http.StatusOK, Data: tasks})
}

/*
Create a new task
*/
func CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
	var taskBody struct {
		Title            string `json:"title"`
		ExpectedDuration uint   `json:"expectedDuration,omitempty"`
	}
	if err := customHTTP.ParseBodyJSON(r, &taskBody); err != nil {
		customHTTP.NewErrorResponse(w, http.StatusBadRequest, err)
		return
	}
	var task SupernovaTask
	task.Title = taskBody.Title
	task.ExpectedDuration = taskBody.ExpectedDuration
	// parse userId from header
	userIdInt, err := strconv.ParseInt(r.Header.Get("userId"), 10, 64)
	if err != nil {
		customHTTP.NewErrorResponse(w, http.StatusInternalServerError, err)
		return
	}
	task.UserID = uint(userIdInt)
	err = db.DB.Create(&task).Error
	if err != nil {
		customHTTP.NewErrorResponse(w, http.StatusInternalServerError, err)
		return
	}
	customHTTP.NewSuccessResponse(w, http.StatusOK, customHTTP.SuccessResponse[SupernovaTask]{Message: "Task created", StatusCode: http.StatusOK, Data: task})
}

/*
Edit a task
*/
func EditTaskHandler(w http.ResponseWriter, r *http.Request) {

}

/*
Delete a task
*/
func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {

}
