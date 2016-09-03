let $todoText = $("#inputText");
let $todoList = $("#listDiv");

$("#addItem").click(function() {
	//take what is in the input
	let itemMarkup = `<p><input type="checkbox" name="todoItem" value="" class="todoItem"> ${ $todoText.val() }</p>`;
	$todoList.append(itemMarkup);
	$todoText.val("");

	//add it to the to do list
});