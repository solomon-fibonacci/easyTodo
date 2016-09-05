var $todoText = $("#inputText");
var $todoList = $("#listDiv");

function saveList(todoList) {
	let todos = todoList.children("ul").html();
   	localStorage.setItem('todos', todos);
   	console.log("Todo Saved!");
   	//return false;
}

function loadStoredList(todoList) {
	if(localStorage.getItem('todos')) {
		todoList.children("ul").html(localStorage.getItem('todos'));
	}
	console.log("List loaded from local storage!");
}

function appendTodo(todoText, todoList) {
	//take what is in the input
	let itemMarkup = `
	<li>
		<div class="listItemDiv">
			<div class="todoItemCheckbox">
				<input type="checkbox" name="todoItem" value="${ todoText.val() }" class="todoItem">
			</div>
			<div class="todoItemText">${ todoText.val() }</div>
			<div class="delDiv">
				<button class="delButton"><i class="fa fa-trash" aria-hidden="true"></i></button>
			</div>
		</div>
	</li>
	`;
	//add it to the to do list
	todoList.children("ul").append(itemMarkup);
	//reset the input
	todoText.val("");
}


$("document").ready(function() {
	loadStoredList($todoList);
	console.log("Page loaded successfully!");
})


// appending by "add" button
$("#addItem").click(function() {
	if ($.trim($todoText.val()).length > 0) {
		console.log("clicked2");
		appendTodo($todoText, $todoList);
		saveList($todoList);
	}
});

// appending by "enter" key
$todoText.keydown(function(event) {
	if ($.trim($todoText.val()).length > 0) {
	    if (event.which == 13) {
	    	console.log("entered")
	    	appendTodo($todoText, $todoList);
	    	saveList($todoList);
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
	saveList($todoList);
});