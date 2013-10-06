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

		initialize: function (){
			this.validate();
		},

		validate: function (attrs) {
			console.log(attrs);
		}
	});

	/* Task collection */
	RabbitTask.Collections.Tasks = Backbone.Collection.extend({
		model: RabbitTask.Models.Task
	});

	/* View for one task */
	RabbitTask.Views.Task = Backbone.View.extend({
		tagName: 'tr',

		template: RabbitTask.Helpers.template('[data-template="task"]'),

		initialize: function () {
			this.render();
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
		}
	});

	return RabbitTask;
});