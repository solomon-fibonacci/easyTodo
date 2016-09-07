var $todoText = $("#inputText");
var $todoList = $.parseJSON(localStorage.getItem('todos'));
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
		todoList.children("ul").html(Mustache.render(template, data))
	}
	console.log("List loaded from local storage!");
}

function appendTodo(todoText, data) {
	//take what is in the input
	var newTask = {"task": todoText.val()};
	//add it to the to do list
	data.tasks.push(newTask);
	todoList.children("ul").html(Mustache.render(template, data))
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
	    	console.log("entered")
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
	console.log("Something happened here!");
	$listText = $(this).parent().next();
	console.log($(this)[0].checked);
	if ($listText.hasClass("done")) {
		$listText.removeClass("done");
		//had to use pure js cos i couldnt find a way to add/remove "checked" to/from the html with jquery
		//since im using local storage, its not just behaviour that matters, but the html too so that the checked state is "remembered"
		$(this)[0].removeAttribute("checked"); 
	} else {
		$listText.addClass("done");
		//had to use pure js cos i couldnt find a way to add/remove "checked" to/from the html with jquery
		//since im using local storage, its not just behaviour that matters, but the html too so that the checked state is "remembered"
		$(this)[0].setAttribute("checked", "checked");
	}
	saveList($todoList);
});

// delete button
$("#listDiv").on("click", ".delButton", function() {
	$(this).parent().parent().parent().remove();
	console.log("You've deleted an item permanently!");
	var remainingTasks = [];
	$(this).closest('ul').children().each(function() {
		var $this
	})
	saveList($todoList);
});