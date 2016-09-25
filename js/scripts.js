var $ = require('jquery');
var moment = require('moment');
var Mustache = require('mustache');

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
        this.displayDate = moment().format("dddd, Do MMMM");
    },

    cacheDom: function() {
        this.$doc = $('#container');
        this.$forwardButton = this.$doc.find('#forward');
        this.$backButton = this.$doc.find('#back');
        this.$displayDate = this.$doc.find('h2');
        this.$inputForm = this.$doc.find('#inputForm');
        this.$input = this.$doc.find('#inputText');
        this.$errorSpan = this.$doc.find('#errorSpan');
        this.$addButton = this.$doc.find('#addItem');
        this.$listDiv = this.$doc.find('#listDiv');
        this.$ul = this.$doc.find('ul');
        this.template = this.$doc.find('#todoTemplate').html();
    },

    bindEvents: function() {
        this.$forwardButton.on('click', this.goForward.bind(this));
        this.$backButton.on('click', this.goBack.bind(this));
        this.$inputForm.on('submit', this.addItem.bind(this));
        this.$input.on('focus', this.render.bind(this));
        this.$listDiv.on('change', '.todoCheckbox', this.tickItem.bind(this));
        this.$listDiv.on('click', '.delButton', this.deleteItem.bind(this));
        this.$listDiv.on('click', '.editButton', this.renderEditBox.bind(this));
        this.$listDiv.on('submit', '.editBox', this.updateItem.bind(this));
    },

    saveList: function() {
        var ingoingData = JSON.stringify({ tasks: this.tasks });
        localStorage.setItem('todos', ingoingData);
    },

    filterTasks: function() {
        var filterDate = moment(this.displayDate, 'ddd, Do MMMM').format('DDMMYYYY');
        var filteredTasks = this.tasks.filter(function(t) {
            return t.date === filterDate;
        });
        var data = {
            tasks: filteredTasks,
        };
        return data;
    },

    render: function() {
        var data = this.filterTasks(),
            todaysDate = moment();
        this.$input.val('');
        this.$ul.html(Mustache.render(this.template, data));
        console.log(Mustache.render(this.template, data));
        this.$displayDate.html(this.displayDate);
        if (moment(this.displayDate, 'dddd, Do MMMM').isBefore(todaysDate, 'day')) {
            this.$input.prop('disabled', true);
            this.$ul.children('li').find('.editButton').hide();
        } else {
            this.$input.prop('disabled', false);
        }
        this.renderCheckboxes();
    },

    renderCheckboxes: function() {
        this.$ul.children('li').each(function(index, item) {
            var $item = $(item),
                $text = $item.children('.todoItemText'),
                $checkbox = $text.siblings('.todoCheckbox');
            if ($item.data('ischecked')) {
                $text.addClass('done');
                $checkbox[0].setAttribute("checked", "checked");
            } else {
                $text.removeClass('done');
                $checkbox[0].removeAttribute("checked");
            }
        });
    },

    renderError: function(errorType) {
        console.log('Hey there!');
        var errorMsg = errorType == 'longer' ? 'Please limit your entry to 140 characters.' : 'Entry cannot be empty.';
        console.log(errorMsg);
        this.$errorSpan.html(errorMsg);
        console.log(this.$errorSpan);
        this.$errorSpan.fadeIn(1000);
        this.$errorSpan.delay(10000).fadeOut(1000);
    },

    renderEditBox: function(event) {
        var $items = $(event.target).closest('ul').find('.todoItemText');
        var $boxes = $(event.target).closest('ul').find('.editBox');
        $boxes.hide();
        $items.fadeIn(150);
        var $text = $(event.target).closest('li').find('.todoItemText');
        $text.fadeOut(50, function() {
            var $box = $(event.target).closest('li').find('.editBox');
            $box.children('input').val($.trim($text.contents().text()));
            $box.addClass('visibleEditBox').fadeIn(150);
        });
    },

    addItem: function(event) {
        event.preventDefault();
        var input = $(event.target).find('#inputText').val();
        var validationResult = this.isValid(input);
        if (validationResult === 'valid') {
            var taskDate = moment(this.displayDate, 'dddd, Do MMMM').format('DDMMYYYY');
            var newTask = { itemid: this.tasks.length + 1, task: input, ischecked: 0, date: taskDate };
            this.tasks.push(newTask);
            this.render();
            this.saveList();
        } else {
            this.renderError(validationResult);
        }
    },

    updateItem: function(event) {
        event.preventDefault();
        var input = $(event.target).find('input').val();
        var validationResult = this.isValid(input);
        if (validationResult === 'valid') {
            var itemid = $(event.target).closest('li').data('itemid');
            $.each(this.tasks, function(index, task) { // consider using javascript ".find"
                if (task.itemid === itemid) { // consider using the index of the array for id
                    task.task = input;
                }
            });
            this.render();
            this.saveList();
        } else {
            this.renderError(validationResult);
        }
    },

    isValid: function(input) {
        if (input.length > 140) {
            return 'longer';
        } else if (input.length < 1) {
            return 'empty';
        } else {
            return 'valid';
        }
    },

    tickItem: function(event) {
        var $tickedItem = $(event.target).siblings('.todoItemText');
        var tickedItemID = $tickedItem.closest('li').data('itemid');
        $.each(this.tasks, function(index, task) { //try .find
            if (task.itemid === tickedItemID) {
                task.ischecked = 1 - task.ischecked;
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

    goBack: function() {
        this.displayDate = moment(this.displayDate, 'dddd, Do MMMM').subtract(1, 'days').format('dddd, Do MMMM');
        this.render();
    },

    goForward: function() {
        this.displayDate = moment(this.displayDate, 'dddd, Do MMMM').add(1, 'days').format('dddd, Do MMMM');
        this.render();
    },
};

todoApp.init();