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

	/* Task unit model */
	RabbitTask.Models.Task = Backbone.Model.extend({
		defaults: {
			priority: 0,
			title: 'empty task :)'
		},

		initialize:function (){
			this.validate();
			this.setPriorityName();
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

		},

		validate:function (attrs) {
			// console.log(attrs);
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

	return RabbitTask;
});