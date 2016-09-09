var $todoText = $("#inputText");
if ($.trim(localStorage.getItem('todos')).length > 0) {
	var $todoList = $.parseJSON(localStorage.getItem('todos'));
} else {
	localStorage.setItem('todos', '{"tasks": []}');
	var $todoList = $.parseJSON(localStorage.getItem('todos'));
}

var template = $("#todo-template").html();

function saveList(todoList) {
	var newData = JSON.stringify(todoList);
   	localStorage.setItem('todos', newData);
   	console.log("Todo Saved!");
   	//return false;
}

function loadStoredList() {
	var data = "{}";
	if(localStorage.getItem('todos')) {
		data = $todoList;
		$("#listDiv").children("ul").html(Mustache.render(template, data))
	}
	console.log($('.todoLi').children());
	$.each($(".todoLi"), function() {
		if($(this).data('ischecked')) {
			$(this).find('.todoItem')[0].setAttribute("checked", "checked");
			$(this).find('.todoItemText').addClass('done');
		}
	});
	console.log("List loaded from local storage!");
}

function appendTodo(todoText, data) {
	if (data.tasks.length > 0) {
		var id = (data.tasks[data.tasks.length - 1].itemid) + 1 ; // increment the last id by 1
	} else {
		var id = 1;
	}
	//take what is in the input
	var newTask = {itemid: id, task: todoText.val(), ischecked: 0};
	//add it to the to do list
	data.tasks.push(newTask);
	$("#listDiv").children("ul").html(Mustache.render(template, data))
	//reset the input
	todoText.val("");
	saveList(data);

}


$("document").ready(function() {
	$("#errorSpan").hide();
	loadStoredList();
	console.log("Page loaded successfully!");
})


// appending by "add" button
$("#addItem").click(function() {
	if ($.trim($todoText.val()).length > 0) {
		if ($.trim($todoText.val()).length > 140){
			console.log("You don fucked up!")
    		$("#errorSpan").fadeIn(1000)
    		$("#errorSpan").delay(10000).fadeOut(1000)
    	} else {
	    	console.log("enteredclick")
	    	appendTodo($todoText, $todoList);
	    }
	}
});

// appending by "enter" key
$todoText.keydown(function(event) {
	if ($.trim($todoText.val()).length > 0) {
	    if (event.which == 13) {
	    	if ($.trim($todoText.val()).length > 140){
	    		$("#errorSpan").fadeIn(1000)
	    		$("#errorSpan").delay(10000).fadeOut(1000)
	    	} else {
		    	console.log("entered")
		    	appendTodo($todoText, $todoList);
		    }
	    }
	}
});


// .on() is used here because some of the elements here are added after the page load.
$("#listDiv").on("change", ".todoItem", function() {
	console.log("check/uncheck!");
	$listText = $(this).parent().next(); //closest("todoItemText");
	console.log($(this)[0].checked);
	console.log($listText);
	$listText.toggleClass("done");
	changedItemID = $(this).closest('li').data('itemid');
	$.each($todoList.tasks, function() {
		if(this.itemid === changedItemID) {
			console.log(this.ischecked);
			this.ischecked = 1 - this.ischecked; //toggle between 0 and 1
			console.log(this.ischecked);
		}
	});
	console.log($todoList);
	$(this).hasClass('done') ? $(this)[0].removeAttribute("checked") : $(this)[0].setAttribute("checked", "checked");
	saveList($todoList);
});

// delete button
$("#listDiv").on("click", ".delButton", function() {
	var deletedItemID = $(this).closest('li').data('itemid');
	console.log(deletedItemID);
	console.log($todoList);
	var remainingItems = $todoList.tasks.filter(function(obj) {
		return obj.itemid != deletedItemID;
	});
	console.log(remainingItems);
	console.log(deletedItemID);
	console.log(remainingItems);
	$todoList.tasks = remainingItems;
	$(this).closest('li').remove();
	console.log("You've deleted an item permanently!");
	saveList($todoList);
});