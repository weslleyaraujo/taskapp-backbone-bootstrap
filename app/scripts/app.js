/*global define, Backbone, _ */
define([], function () {
	'use strict';
	// setting underscore delimiters
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	var RabbitTask = {
		Views: {},
		Models: {},
		Collections: {},
		Helpers: {}
	};

	/* Template helper */
	RabbitTask.Helpers.template = function (selector) {
		return _.template($(selector).html());
	};

	/* Error helper */
	RabbitTask.Helpers.modalError = function (model) {
		this.$el = $('#alertModal');
		this.$el.find('.message-placeholder').html('<p>'+ model.validationError +'</p>');
		this.$el.modal('show');
	};


	/* Task unit model */
	RabbitTask.Models.Task = Backbone.Model.extend({
		initialize: function() {
			this.setPriorityName();
			this.on('change', this.setPriorityName);
		},

		validate:function (attrs) {
			if (_.isEmpty(attrs.title)) {
				return 'The task name cant be null';
			}

			if (_.isEmpty(attrs.priority) || _.isNaN(attrs.priority)) {
				return 'Select a priority value';
			}
		},

		setPriorityName: function () {
			var priority = parseInt(this.get('priority'));
			switch(priority) {
			case 1 :
				this.set('priority_name', 'info');
				break;

			case 2 :
				this.set('priority_name', 'warning');
				break;

			case 3 :
				this.set('priority_name', 'danger');
				break;

			default :
				this.set('priority_name', 'info');
				break;
			}

			return this;
		}
	});

	/* Task collection */
	RabbitTask.Collections.Tasks = Backbone.Collection.extend({
		model: RabbitTask.Models.Task,

		comparator: function (task) {
			return -task.get('priority');
		}
	});

	/* View for one task */
	RabbitTask.Views.Task = Backbone.View.extend({
		tagName: 'tr',

		template: RabbitTask.Helpers.template('[data-template="task"]'),

		events: {
			'click a[href="#editModal"]' : 'setEdition'
		},

		setEdition: function () {
			this.setPriority(this.model.get('priority'));
			this.$title.val(this.model.get('title'));
			this.$cid.val(this.model.cid);
		},

		setPriority: function(priority) {
			this.$editForm.find('input[name="priority"][value="'+ priority +'"]').trigger('click');
		},

		initialize:function () {
			this.render();
			this.cacheElements();
		},

		render:function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		cacheElements: function () {
			this.$editForm = $('#editModal');
			this.$title = this.$editForm.find('input[name="title"]');
			this.$cid = this.$editForm.find('input[name="cid"]');
		}
	});

	/* Task view collection */
	RabbitTask.Views.Tasks = Backbone.View.extend({
		el: '#taskList',

		initialize:function() {
			this.render();
			this.collection.on('add', this.render, this);
			this.collection.on('change', this.render, this);
		},

		render:function () {
			this.collection.sort();
			this.$el.html('');
			this.collection.each(function (model) {
				this.addOne(model);
			}, this);
		},

		addOne:function (model) {
			var taskView = new RabbitTask.Views.Task({
				model: model
			});
			this.$el.append(taskView.el);
		}
	});

	/* Add task view */
	RabbitTask.Views.addTask = Backbone.View.extend({
		el: '#addTask',

		initialize: function () {
		},

		getPriority: function () {
			// this.$priority = this.$el.find('input[name="priority"]:checked');
		},

		events: {
			'submit': 'onSubmit'
		},

		onSubmit: function(e) {
			e.preventDefault();

			console.log(this.$el.serializeArray());
			var newTask = new RabbitTask.Models.Task();

			if (!newTask.isValid()) {
				RabbitTask.Helpers.modalError(newTask);
				return;
			}

			this.collection.add(newTask);
		}
	});

	/* Edit form view */
	RabbitTask.Views.EditTask = Backbone.View.extend({
		el: '.form-horizontal',

		initialize: function () {
			this.$modalBox = $('#editModal');
		},

		events: {
			'submit' : 'onSubmit'
		},

		onSubmit: function (e) {
			e.preventDefault();
			this.setValues(this.$el.serializeArray());
			this.setModel(this.cid.value);
			this.set();
			this.$modalBox.modal('hide');
		},

		setValues: function(arr) {
			_.each(arr, function(obj) {
				this.getValue(arr, obj.name);
			}, this);
		},

		getValue: function(arr, name) {
			this[name] = _.where(arr, {
				name: name
			})[0];
		},

		setModel: function (cid) {
			this.model = this.collection.get(cid);
		},

		set: function() {
			this.model.set({
				title: this.title.value,
				priority: this.priority.value
			});
		}

	});

	return RabbitTask;
});
