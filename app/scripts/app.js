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

	/* Task unit model */
	RabbitTask.Models.Task = Backbone.Model.extend({
		initialize: function() {
			this.validate(this.attributes);
			this.setPriorityName();
		},

		validate:function (attrs) {

			// is name valid
			if (_.isEmpty(attrs.title)) {
				return 'The task name cant be null';
			}

			// is priority valid
			if (!_.isNumber(parseInt(attrs.priority, 0))) {
				return 'Select a priority value';
			}
		},

		setPriorityName: function () {
			switch(this.get('priority')) {
			case 0 :
				this.set('priority', 'info');
				break;

			case 1 :
				this.set('priority', 'warning');
				break;

			case 2 :
				this.set('priority', 'danger');
				break;
			}

			return this;
		}
	});

	/* Task collection */
	RabbitTask.Collections.Tasks = Backbone.Collection.extend({
		model: RabbitTask.Models.Task,

		comparator: function (task) {
			return task.get('priority');
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
		},

		render:function () {
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
				title: this.$text.val(),
				priority: this.$priority.val()
			}, {
				validate: true
			});

			console.log(newTask);
		}
	});

	return RabbitTask;
});