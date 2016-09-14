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
        this.$input.on('keyup', this.addItem.bind(this));
        this.$addButton.on('click', this.addItem.bind(this));
        this.$listDiv.on('change', '.todoCheckbox', this.tickItem.bind(this));
        this.$listDiv.on('click', '.delButton', this.deleteItem.bind(this));
        this.$listDiv.on('click', '.editButton', this.editItem.bind(this));
    },

    saveList: function() {
        var ingoingData = JSON.stringify({ tasks: this.tasks });
        localStorage.setItem('todos', ingoingData);
    },

    render: function() {
        //todo: fix display date format ... inconsistent DoW length
        var filterDate = moment(this.displayDate, 'ddd, Do MMMM').format('DDMMYYYY');
        var filteredTasks = this.tasks.filter(function(t) {
            return t.date == filterDate;
        })
        var data = {
            tasks: filteredTasks,
            displayDate: this.displayDate,
        };
        var todaysDate = moment().format('dddd, Do MMMM')
        if (this.displayDate != todaysDate) {
            this.$input.prop('disabled', true);
        }
        this.$ul.html(Mustache.render(this.template, data));
        this.$displayDate.html(this.displayDate);
        this.$ul.children('li').each(function(index, item) {
            var $item = $(item);
            var $text = $item.children('.todoItemText');
            var $editBox = $item.children('.editBox')
            var $checkbox = $text.siblings('.todoCheckbox');

            $item.data('ischecked') ?
                $text.addClass('done') :
                $text.removeClass('done');

            $text.hasClass('done') ?
                $checkbox[0].setAttribute("checked", "checked") :
                $checkbox[0].removeAttribute("checked");
        });
    },

    renderError: function(errorMsg) { // todo: fix the repeating
        this.$errorSpan.html(errorMsg);
        this.$errorSpan.fadeOut(500);
        this.$errorSpan.fadeIn(1000);
        this.$errorSpan.delay(10000).fadeOut(1000);
    },

    addItem: function(event) {
        if (this.isValid(this.$input.val()) == 'valid') {
            if (event.type == 'click' || $(event.which)[0] == 13) {
                if (!event) {
                    console.log('you tryna add item with button');
                }
                var id;
                var newTask;
                var taskDate = moment().format('DDMMYYYY');
                var listLength = this.tasks.length;
                if (listLength > 0) {
                    id = (this.tasks[listLength - 1].itemid) + 1;
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
            var errorMsg;
            this.isValid(this.$input.val()) == 'longer' ?
                errorMsg = 'Please limit your entry to 140 characters.' :
                errorMsg = 'Entry cannot be empty.';
            this.renderError(errorMsg);
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

    editItem: function(event) {
        console.log("Coming for ya!");
        var $text = $(event.target).siblings('.todoItemText');
        $text.hide();
        var $box = $(event.target).siblings('.editBox');
        $box.show();
        debugger;
    },

    goBack: function() {
        this.displayDate = moment(this.displayDate, 'ddd, Do MMMM').subtract(1, 'days').format('ddd, Do MMMM');
        this.render();
    },

    goForward: function() {
        this.displayDate = moment(this.displayDate, 'ddd, Do MMMM').add(1, 'days').format('ddd, Do MMMM');
        this.render();
    },
};

todoApp.init();
