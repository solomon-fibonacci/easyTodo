var $todoText = $("#inputText");
if ($.trim(localStorage.getItem('todos')).length > 0) {
    var todoList = $.parseJSON(localStorage.getItem('todos'));
} else {
    var todoList = {tasks: []};
}

var template = $("#todo-template").html();
function getTodaysDate() {
	var today = new Date();
    var day = today.getDate();
    day < 10 ? day = "0" + day.toString() : day.toString();
    var month = today.getMonth() + 1;
    month < 10 ? month = "0" + month.toString() : month.toString();
    var year = today.getFullYear();
    year < 10 ? year = "0" + year.toString() : year.toString();
    return day + month + year;
}
function saveList(list) {
    var newData = JSON.stringify(list);
    localStorage.setItem('todos', newData);
    console.log("Todo Saved!");
    //return false;
}

function renderStoredList(storedList) {
	storedList.date = getTodaysDate();
	console.log(storedList);
    $("#listDiv").children("ul").html(Mustache.render(template, storedList))
    $.each($(".todoLi"), function() {
        if ($(this).data('ischecked')) {
            $(this).find('.todoItem')[0].setAttribute("checked", "checked");
            $(this).find('.todoItemText').addClass('done');
        }
    });
    console.log("List loaded from local storage!");
}

function appendTodo(todoText, data) {
    if (data.tasks.length > 0) {
        var id = (data.tasks[data.tasks.length - 1].itemid) + 1; // increment the last id by 1
    } else {
        var id = 1;
    }
    //take what is in the input
    taskDate = getTodaysDate();
    var newTask = { itemid: id, task: todoText.val(), ischecked: 0, date: taskDate };
    //add it to the to do list
    data.tasks.push(newTask);
    $("#listDiv").children("ul").html(Mustache.render(template, data))
        //reset the input
    todoText.val("");
    saveList(data);

}


$("document").ready(function() {
    renderStoredList(todoList);
    console.log("Page loaded successfully!");
})


// appending by "add" button
$("#addItem").click(function() {
    if ($.trim($todoText.val()).length > 0) {
        if ($.trim($todoText.val()).length > 140) {
            console.log("Input too long!")
            $("#errorSpan").fadeIn(1000)
            $("#errorSpan").delay(10000).fadeOut(1000)
        } else {
            appendTodo($todoText, todoList);
        }
    }
});

// appending by "enter" key
$todoText.keydown(function(event) {
    if ($.trim($todoText.val()).length > 0) {
        if (event.which == 13) {
            if ($.trim($todoText.val()).length > 140) {
                $("#errorSpan").fadeIn(1000)
                $("#errorSpan").delay(10000).fadeOut(1000)
            } else {
                appendTodo($todoText, todoList);
            }
        }
    }
});


// .on() is used here because some of the elements here are added after the page load.
$("#listDiv").on("change", ".todoItem", function() {
    console.log("check/uncheck!");
    $listText = $(this).next(); //closest("todoItemText");
    $listText.toggleClass("done");
    changedItemID = $(this).closest('li').data('itemid');
    $.each(todoList.tasks, function() {
        if (this.itemid === changedItemID) {
            this.ischecked = 1 - this.ischecked; //toggle between 0 and 1
        }
    });
    $(this).hasClass('done') ? $(this)[0].removeAttribute("checked") : $(this)[0].setAttribute("checked", "checked");
    saveList(todoList);
});

// delete button
$("#listDiv").on("click", ".delButton", function() {
    var deletedItemID = $(this).closest('li').data('itemid');
    var remainingItems = todoList.tasks.filter(function(obj) {
        return obj.itemid != deletedItemID;
    });
    todoList.tasks = remainingItems;
    $(this).closest('li').remove();
    console.log("You've deleted an item permanently!");
    saveList(todoList);
});
