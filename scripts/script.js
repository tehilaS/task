'use strict';

//task module
function taskModule(containerElement, lastedId, localStorageModule) {
    let textTaske = document.getElementById("taskContent");
    let textTaskeDate = document.getElementById("date");
    let textTaskeTime = document.getElementById("time");

    //get user value & create note
    function getUserValue() {

        let textTaske = document.getElementById("taskContent").value;
        let textTaskeDate = document.getElementById("date").value;
        let textTaskeTime = document.getElementById("time").value;
        var someDateString = moment(textTaskeDate).format("DD/MM/YYYY");
        var someDate = moment(someDateString, "DD/MM/YYYY");
        let finalDate = someDate["_i"];

//validate date
        let TaskeDate = document.getElementById("date");

        var errorMsg = document.getElementById("dateValue");
        errorMsg.innerHTML = "";

        if (valdateDate(finalDate)) {
            return (creatTodoTask(textTaske, finalDate, textTaskeTime));
        } else {
            emptyDate(textTaskeDate);
        }

        return null;
    }

//validate empty date
    function emptyDate(date) {
        //console.log("emptyDate");
        var alertDateMsg = document.createElement("div");
        alertDateMsg.innerHTML = "<p>" + "please enter valid date" + "</p>";
        alertDateMsg.className = "error";
        document.getElementById("dateValue").appendChild(alertDateMsg);
    }
//validate correct date
    function valdateDate(date) {

        // dd-MM-yyyy
        var dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g;
        var dateRes = dateRegex.test(date);

        if (!dateRes || (date = "")) {

            var alertDateMsg = document.createElement("div");
            alertDateMsg.innerHTML = "<p>" + "please enter valid date" + "</p>";
            alertDateMsg.className = "error";

            document.getElementById("dateValue").appendChild(alertDateMsg);
            console.log(alertDateMsg);


        } else {
            console.log("add note");
            return true;

        }
    }

//clear form input affter creating note
    function clearForm() {
        textTaske.value = "";
        textTaskeDate.value = "";
        textTaskeTime.value = "";
        //return getUserValue(textTaske,textTaskeDate,textTaskeTime)
    }

    function createNewTaskFromView() {
        return getUserValue();

    }

    function creatTodoTask(task, date, time, status) {
        return new TodoTask(task, date, time, status);

        function TodoTask(text, date, time, status) {
            this.id = lastedId++;
            this.text = text;
            this.date = date;
            this.time = time;
            this.status = status;
            localStorageModule.setLastedId(lastedId);
        }
    }


    function appendTodoTask(task) {
        return appendToHtml(task);
    }

    function appendToHtml(task) {

        var btnId = 'delete_task_' + task.id;

        const element = document.createElement("div");
        element.innerHTML = "<p>" + task.text + "</p>" + "<h5>" + task.date + "</h5>" + "<h6>" + task.time + "</h6>";
        element.className = "taskNote";
        const deleteBTN = document.createElement("button");
        deleteBTN.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
        deleteBTN.className = "delete-btn";
        element.appendChild(deleteBTN);
        element.setAttribute('id', "task_" + task.id);


        document.getElementById(containerElement).appendChild(element);
        deleteBTN.addEventListener('click', function (event) {

            localStorageModule.removeTaskById(task.id);
            var note = document.getElementById("task_" + task.id);
            note.remove();

        });

    }

    return {
        creatTodoTask: creatTodoTask,
        createNewTaskFromView: createNewTaskFromView,
        appendTodoTask: appendTodoTask,
        clearForm: clearForm


    }


}

var localStorageModule = new LocalStorageModule();
var lastedId = localStorageModule.getLastedId();
var t = taskModule("content", lastedId, localStorageModule);
var button = document.getElementById("saveTaskBtn");

var taskList = document.getElementById("lastedId");

var tasks = localStorageModule.getAllTasks();
//print to DOM from local storage
for (var i = 0; i < tasks.length; i++) {
    t.appendTodoTask(tasks[i]);
}
//print task to DOM
button.addEventListener("click", function (e) {
    e.preventDefault();
    let newTask = t.createNewTaskFromView();
    if (newTask != null) {
        let clearForm = t.clearForm();
        let printTask = t.appendTodoTask(newTask);

        localStorageModule.setTaskById(newTask.id, JSON.stringify(newTask));
    }
});
//local storage module
function LocalStorageModule() {

    function getTaskById(taskId) {
        return localStorage.getItem(taskId);
    }

    function setTaskById(id, taskJSON) {
        localStorage.setItem("taskManger_" + id, taskJSON);
    }

    function removeTaskById(taskID) {
        localStorage.removeItem("taskManger_" + taskID);
    }

    function getLastedId() {
        return localStorage.getItem("lasedId");
    }

    function setLastedId(lasedId) {
        localStorage.setItem("lasedId", lasedId);
    }

    function getAllTasks() {
        var i = 0,
            skey;
        var taskList = [];

        for (; skey = window.localStorage.key(i); i++) {
            if (skey.indexOf("taskManger_") > -1) {

                taskList.push(JSON.parse(window.localStorage.getItem(skey)));
            }
        }
        return taskList;
    }
    return {
        getTaskById: getTaskById,
        setTaskById: setTaskById,
        removeTaskById: removeTaskById,
        getLastedId: getLastedId,
        setLastedId: setLastedId,
        getAllTasks: getAllTasks
    }
}
