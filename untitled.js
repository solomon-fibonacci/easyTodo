var todoApp = {
    init: function() {
        this.loadList();
        this.cacheDom();
        this.bindEvents();
        this.render();
    },

    loadList: function() {
        if ($.trim(localStorage.getItem('todos')).length > 0) {
            this.tasks = $.parseJSON(localStorage.getItem('todos')).tasks;
        } else {
            this.tasks = [];
        }
    },

    cacheDom: function() {
        this.$doc = $('#container');
        this.$forwardButton = this.$doc.find('forward');
        this.$backButton = this.$doc.find('back');
        this.$input = this.$doc.find('#inputText');
        this.$addButton = this.$doc.find('#addItem');
        this.$listDiv = this.$doc.find('#listDiv');
        this.$ul = this.$doc.find('ul');
        this.template = this.$doc.find('#todoTemplate').html();
    },

    bindEvents: function() {
        this.$forwardButton.on('click', this.goForward.bind(this));
        this.$backButton.on('click', this.goBack.bind(this));
        this.$input.on('keydown', this.addItem.bind(this));
        this.$addButton.on('click', this.addItem.bind(this));
        this.$listDiv.on('change', '.todoItem', this.tickItem.bind(this));
        this.$listDiv.on('click', '.delButton', this.deleteItem.bind(this));
        this.$listDiv.on('click', '.editButton', this.editItem.bind(this));
    },

    saveList: function() {
        var ingoingData = JSON.stringify({ tasks: this.tasks });
        localStorage.setItem('todos', ingoingData);
    },

    render: function() {
        var data = {
            tasks: this.tasks;
        };
        this.$ul.html(Mustache.render(this.template, data));
        $.each(this.$ul.children('li'), function(index, $item) {
            var $text = $item.children('.todoItemText')
            $text.hasClass('done') ? $text[0].removeAttribute("checked") : $text[0].setAttribute("checked", "checked");
        })
    },

    addItem: function(event) {
        if (this.isValid(this.$input.val())) {
            if (!event || event.which == 13) {
                var id;
                var newTask;
                var taskDate = moment().format('DDMMYYYY');
                var listLength = this.tasks.length;
                if (listLength > 0) {
                    id = (this.tasks[listLength - 1].itemID) + 1;
                } else {
                    id = 1;
                }
                newTask = { itemid: id, task: this.$input.val(), ischecked: 0, date: taskDate };
                this.tasks.push(newTask);
                this.$input.val('');
                this.render();
                this.saveList();
            }
        } else {
            // do something about errors here.
        }
    },

    isValid: function(input) {
        if (input.length < 140 || !input.legnth > 0) {
            return false;
        }
        return true;
    },

    tickItem: function(event) {
        var $tickedItem = $(event.target).siblings('.todoItemText');
        var $tickedItem.toggleClass("done");
        var tickedItemID = $tickedItem.closest('li').data('itemid');
        $.each(this.tasks, function(index, task) {
            if (task.itemid === tickedItemID) {
                task.ischecked = 1 - task.ischecked; //toggle between 0 and 1
            }
        });
        this.render();
        this.saveList();
    },

    deleteItem: function(event) {
        var deletedItemID = $(event.target).closest('li').data('itemid');
        this.tasks = this.tasks.filter(function(obj) {
            return obj.itemid != deletedItemID;
        });
        this.render();
        this.saveList();
    },

    editItem: function() {

    },

    goBack: function() {

    },

    goForward: function() {

    },
};

peopleApp.init();

















var $todoText = $("#inputText");
var todoList;
if ($.trim(localStorage.getItem('todos')).length > 0) {
    todoList = $.parseJSON(localStorage.getItem('todos'));
    console.log(todoList);
} else {
    todoList = { tasks: [] };
}

console.log(todoList);

var template = $("#todo-template").html();

function saveList(list) {
    var newData = JSON.stringify(list);
    localStorage.setItem('todos', newData);
    console.log("Todo Saved!");
}

function renderStoredList(data, filterDate) {
    var date = filterDate || moment().format("DDMMYYYY");
    var listToRender = {};
    listToRender.tasks = data.tasks.filter(function(t) {
        return t.date == date;
    });
    $("h2").html(moment(date, "DDMMYYYY").format("dddd, Do MMMM"));
    $("#listDiv").children("ul").html(Mustache.render(template, listToRender));
    $.each($(".todoLi"), function() {
        if ($(this).data('ischecked')) {
            $(this).find('.todoItem')[0].setAttribute("checked", "checked");
            $(this).find('.todoItemText').addClass('done');
        }
    });
}

function appendTodo(todoText, data) {
    if (data.tasks.length > 0) {
        var id = (data.tasks[data.tasks.length - 1].itemid) + 1; // increment the last id by 1
    } else {
        var id = 1;
    }
    //take what is in the input
    taskDate = moment().format("DDMMYYYY");
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

$("#back").click(function() {
    var prevDate = moment($("h2").text(), "ddd, Do MMMM").subtract(1, "days").format("DDMMYYYY");
    renderStoredList(todoList, prevDate);
})

$("#forward").click(function() {
    var nextDate = moment($("h2").text(), "ddd, Do MMMM").add(1, "days").format("DDMMYYYY");
    renderStoredList(todoList, nextDate);
})

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

$("#listDiv").on("click", ".editButton", function() {
    console.log("jdfghj");
    console.log($(this).parents('div.editButton'));
});
