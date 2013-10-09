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

		initialize:function () {
			this.render();
		},

		render:function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	/* Task view collection */
	RabbitTask.Views.Tasks = Backbone.View.extend({
		el: '#taskList',

		initialize:function() {
			this.render();
			this.collection.on('add', this.render, this);
		},

		render:function () {
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
			this.$text = this.$el.find('input[type="text"]');
		},

		getPriority: function () {
			this.$priority = this.$el.find('input[name="priority"]:checked');
		},

		events: {
			'submit': 'onSubmit'
		},

		onSubmit: function(e) {
			e.preventDefault();
			this.getPriority();

			var newTask = new RabbitTask.Models.Task({
				'title': this.$text.val(),
				'priority': this.$priority.val()
			});
			if (!newTask.isValid()) {
				RabbitTask.Helpers.modalError(newTask);
				return;
			}
			this.collection.add(newTask);
			console.log(this.collection);
		}
	});

	return RabbitTask;
});
