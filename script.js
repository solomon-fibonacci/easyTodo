let $todoText = $("#inputText");
let $todoList = $("#listDiv");

function appendTodo(todoText, todoList) {
	//take what is in the input
	let itemMarkup = `<p><input type="checkbox" name="todoItem" value="${ todoText.val() }" class="todoItem"> ${ todoText.val() }</p>`;
	//add it to the to do list
	todoList.append(itemMarkup);
	//reset the input
	todoText.val("");
}


// appending by "add" button
$("#addItem").click(function() {
	if ($.trim($todoText.val()).length > 0) {
		appendTodo($todoText, $todoList);
	}
});

// appending by "enter" key
$todoText.keydown(function(event) {
	if ($.trim($todoText.val()).length > 0) {
	    if (event.which == 13) appendTodo($todoText, $todoList);
	}
});




$("#listDiv").on("change", ".todoItem", function() {
	if ($(this).parent().hasClass("done")) {
		$(this).parent().removeClass()
	} else {
		$(this).parent().addClass("done");
	}
});