require.config({
  paths: {
  jquery: '../bower_components/jquery/jquery',
    bootstrapAffix: '../bower_components/sass-bootstrap/js/affix',
    bootstrapAlert: '../bower_components/sass-bootstrap/js/alert',
    bootstrapButton: '../bower_components/sass-bootstrap/js/button',
    bootstrapCarousel: '../bower_components/sass-bootstrap/js/carousel',
    bootstrapCollapse: '../bower_components/sass-bootstrap/js/collapse',
    bootstrapDropdown: '../bower_components/sass-bootstrap/js/dropdown',
    bootstrapPopover: '../bower_components/sass-bootstrap/js/popover',
    bootstrapScrollspy: '../bower_components/sass-bootstrap/js/scrollspy',
    bootstrapTab: '../bower_components/sass-bootstrap/js/tab',
    bootstrapTooltip: '../bower_components/sass-bootstrap/js/tooltip',
    bootstrapTransition: '../bower_components/sass-bootstrap/js/transition',
    bootstrapModal: '../bower_components/sass-bootstrap/js/modal',
    backbone: '../bower_components/backbone/backbone',
    underscore: '../bower_components/underscore/underscore'
  },
  shim: {
    bootstrapAffix: {
      deps: ['jquery']
    },
    bootstrapAlert: {
      deps: ['jquery']
    },
    bootstrapButton: {
      deps: ['jquery']
    },
    bootstrapCarousel: {
      deps: ['jquery']
    },
    bootstrapCollapse: {
      deps: ['jquery']
    },
    bootstrapDropdown: {
      deps: ['jquery']
    },
    bootstrapPopover: {
      deps: ['jquery']
    },
    bootstrapScrollspy: {
      deps: ['jquery']
    },
    bootstrapTab: {
      deps: ['jquery']
    },
    bootstrapTooltip: {
      deps: ['jquery']
    },
    bootstrapTransition: {
      deps: ['jquery']
    },
    backbone: {
      deps: ['underscore']
    },
    app: {
      deps: ['backbone']
    }
  }
});

require(['app','jquery', 'bootstrapButton', 'bootstrapModal'], function (app, $) {
  'use strict';
  
  // use app here
  window.RabbitTask = app;

  var model = new RabbitTask.Models.Task();
  var view = new RabbitTask.Views.Task({model: model});
  console.log(view.el);
});
