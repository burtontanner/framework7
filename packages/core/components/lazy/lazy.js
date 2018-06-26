'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = require('dom7');

var _dom2 = _interopRequireDefault(_dom);

var _ssrWindow = require('ssr-window');

var _utils = require('../../utils/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Lazy = {
  destroy: function destroy(pageEl) {
    var $pageEl = (0, _dom2.default)(pageEl).closest('.page');
    if (!$pageEl.length) return;
    if ($pageEl[0].f7LazyDestroy) {
      $pageEl[0].f7LazyDestroy();
    }
  },
  create: function create(pageEl) {
    var app = this;
    var $pageEl = (0, _dom2.default)(pageEl).closest('.page').eq(0);

    // Lazy images
    var lazyLoadImages = $pageEl.find('.lazy');
    if (lazyLoadImages.length === 0 && !$pageEl.hasClass('lazy')) return;

    // Placeholder
    var placeholderSrc = app.params.lazy.placeholder;

    if (placeholderSrc !== false) {
      lazyLoadImages.each(function (index, lazyEl) {
        if ((0, _dom2.default)(lazyEl).attr('data-src') && !(0, _dom2.default)(lazyEl).attr('src')) (0, _dom2.default)(lazyEl).attr('src', placeholderSrc);
      });
    }

    // load image
    var imagesSequence = [];
    var imageIsLoading = false;

    function onImageComplete(lazyEl) {
      if (imagesSequence.indexOf(lazyEl) >= 0) {
        imagesSequence.splice(imagesSequence.indexOf(lazyEl), 1);
      }
      imageIsLoading = false;
      if (app.params.lazy.sequential && imagesSequence.length > 0) {
        imageIsLoading = true;
        app.lazy.loadImage(imagesSequence[0], onImageComplete);
      }
    }

    function lazyHandler() {
      app.lazy.load($pageEl, function (lazyEl) {
        if (app.params.lazy.sequential && imageIsLoading) {
          if (imagesSequence.indexOf(lazyEl) < 0) imagesSequence.push(lazyEl);
          return;
        }
        imageIsLoading = true;
        app.lazy.loadImage(lazyEl, onImageComplete);
      });
    }

    function attachEvents() {
      $pageEl[0].f7LazyAttached = true;
      $pageEl.on('lazy', lazyHandler);
      $pageEl.on('scroll', lazyHandler, true);
      $pageEl.find('.tab').on('tab:mounted tab:show', lazyHandler);
      app.on('resize', lazyHandler);
    }
    function detachEvents() {
      $pageEl[0].f7LazyAttached = false;
      delete $pageEl[0].f7LazyAttached;
      $pageEl.off('lazy', lazyHandler);
      $pageEl.off('scroll', lazyHandler, true);
      $pageEl.find('.tab').off('tab:mounted tab:show', lazyHandler);
      app.off('resize', lazyHandler);
    }

    // Store detach function
    if (!$pageEl[0].f7LazyDestroy) {
      $pageEl[0].f7LazyDestroy = detachEvents;
    }

    // Attach events
    if (!$pageEl[0].f7LazyAttached) {
      attachEvents();
    }

    // Run loader on page load/init
    lazyHandler();
  },
  isInViewport: function isInViewport(lazyEl) {
    var app = this;
    var rect = lazyEl.getBoundingClientRect();
    var threshold = app.params.lazy.threshold || 0;

    return rect.top >= 0 - threshold && rect.left >= 0 - threshold && rect.top <= app.height + threshold && rect.left <= app.width + threshold;
  },
  loadImage: function loadImage(imageEl, callback) {
    var app = this;
    var $imageEl = (0, _dom2.default)(imageEl);

    var bg = $imageEl.attr('data-background');
    var src = bg || $imageEl.attr('data-src');
    if (!src) return;
    function onLoad() {
      $imageEl.removeClass('lazy').addClass('lazy-loaded');
      if (bg) {
        $imageEl.css('background-image', 'url(' + src + ')');
      } else {
        $imageEl.attr('src', src);
      }
      if (callback) callback(imageEl);
      $imageEl.trigger('lazy:loaded');
      app.emit('lazyLoaded', $imageEl[0]);
    }

    function onError() {
      $imageEl.removeClass('lazy').addClass('lazy-loaded');
      if (bg) {
        $imageEl.css('background-image', 'url(' + (app.params.lazy.placeholder || '') + ')');
      } else {
        $imageEl.attr('src', app.params.lazy.placeholder || '');
      }
      if (callback) callback(imageEl);
      $imageEl.trigger('lazy:error');
      app.emit('lazyError', $imageEl[0]);
    }
    var image = new _ssrWindow.window.Image();
    image.onload = onLoad;
    image.onerror = onError;
    image.src = src;

    $imageEl.removeAttr('data-src').removeAttr('data-background');

    // Add loaded callback and events
    $imageEl.trigger('lazy:load');
    app.emit('lazyLoad', $imageEl[0]);
  },
  load: function load(pageEl, callback) {
    var app = this;
    var $pageEl = (0, _dom2.default)(pageEl);
    if (!$pageEl.hasClass('page')) $pageEl = $pageEl.parents('.page').eq(0);
    if ($pageEl.length === 0) {
      return;
    }
    $pageEl.find('.lazy').each(function (index, lazyEl) {
      var $lazyEl = (0, _dom2.default)(lazyEl);
      if ($lazyEl.parents('.tab:not(.tab-active)').length > 0) {
        return;
      }
      if (app.lazy.isInViewport(lazyEl)) {
        if (callback) callback(lazyEl);else app.lazy.loadImage(lazyEl);
      }
    });
  }
};
exports.default = {
  name: 'lazy',
  params: {
    lazy: {
      placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXCwsK592mkAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==',
      threshold: 0,
      sequential: true
    }
  },
  create: function create() {
    var app = this;
    _utils2.default.extend(app, {
      lazy: {
        create: Lazy.create.bind(app),
        destroy: Lazy.destroy.bind(app),
        loadImage: Lazy.loadImage.bind(app),
        load: Lazy.load.bind(app),
        isInViewport: Lazy.isInViewport.bind(app)
      }
    });
  },

  on: {
    pageInit: function pageInit(page) {
      var app = this;
      if (page.$el.find('.lazy').length > 0 || page.$el.hasClass('lazy')) {
        app.lazy.create(page.$el);
      }
    },
    pageAfterIn: function pageAfterIn(page) {
      var app = this;
      if (page.$el.find('.lazy').length > 0 || page.$el.hasClass('lazy')) {
        app.lazy.create(page.$el);
      }
    },
    pageBeforeRemove: function pageBeforeRemove(page) {
      var app = this;
      if (page.$el.find('.lazy').length > 0 || page.$el.hasClass('lazy')) {
        app.lazy.destroy(page.$el);
      }
    },
    tabMounted: function tabMounted(tabEl) {
      var app = this;
      var $tabEl = (0, _dom2.default)(tabEl);
      if ($tabEl.find('.lazy').length > 0 || $tabEl.hasClass('lazy')) {
        app.lazy.create($tabEl);
      }
    },
    tabBeforeRemove: function tabBeforeRemove(tabEl) {
      var app = this;
      var $tabEl = (0, _dom2.default)(tabEl);
      if ($tabEl.find('.lazy').length > 0 || $tabEl.hasClass('lazy')) {
        app.lazy.destroy($tabEl);
      }
    }
  }
};