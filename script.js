let $todoText = $("#inputText");
let $todoList = $("#listDiv");

function saveList(todoList) {
	let todos = todoList.html();
   	localStorage.setItem('todos', todos);
   	console.log("Todo Saved!");
   	return false;
}

function loadStoredList(todoList) {
	if(localStorage.getItem('todos')) {
		todoList.html(localStorage.getItem('todos'));
	}
	console.log("List loaded from local storage!");
}

function appendTodo(todoText, todoList) {
	//take what is in the input
	let itemMarkup = `
	<p>
		<input type="checkbox" name="todoItem" value="${ todoText.val() }" class="todoItem"> 
		<span class="todoItemText">${ todoText.val() }</span> &nbsp 
		<button class="delButton">del</button>
	</p>
	`;
	//add it to the to do list
	todoList.append(itemMarkup);
	//reset the input
	todoText.val("");
}


$("document").ready(function() {
	loadStoredList($todoList);
	console.log("Page loaded successfully!")
})


// appending by "add" button
$("#addItem").click(function() {
	if ($.trim($todoText.val()).length > 0) {
		appendTodo($todoText, $todoList);
		saveList($todoList);
	}
});

// appending by "enter" key
$todoText.keydown(function(event) {
	if ($.trim($todoText.val()).length > 0) {
	    if (event.which == 13) {
	    	appendTodo($todoText, $todoList);
	    	saveList($todoList);
	    }
	}
});


// .on() is used here because some of the elements here are added after the page load.
$("#listDiv").on("change", ".todoItem", function() {
	console.log("Something happened here!");
	console.log($(this)[0].checked);
	if ($(this).next().hasClass("done")) {
		$(this).next().removeClass("done");
		//had to use pure js cos i couldnt find a way to add/remove "checked" to/from the html with jquery
		//since im using local storage, its not just behaviour that matters, but the html too so that the checked state is "remembered"
		$(this)[0].removeAttribute("checked"); 
	} else {
		$(this).next().addClass("done");
		//had to use pure js cos i couldnt find a way to add/remove "checked" to/from the html with jquery
		//since im using local storage, its not just behaviour that matters, but the html too so that the checked state is "remembered"
		$(this)[0].setAttribute("checked", "checked");
	}
	saveList($todoList);
});

// delete button
$("#listDiv").on("click", ".delButton", function() {
	$(this).parent().remove();
	console.log("You've deleted an item permanently!");
	saveList($todoList);
});