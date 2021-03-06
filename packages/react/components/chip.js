'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils/utils');

var _utils2 = _interopRequireDefault(_utils);

var _mixins = require('../utils/mixins');

var _mixins2 = _interopRequireDefault(_mixins);

var _reactComponentDispatchEvent = require('../runtime-helpers/react-component-dispatch-event.js');

var _reactComponentDispatchEvent2 = _interopRequireDefault(_reactComponentDispatchEvent);

var _reactComponentSlots = require('../runtime-helpers/react-component-slots.js');

var _reactComponentSlots2 = _interopRequireDefault(_reactComponentSlots);

var _reactComponentSetProps = require('../runtime-helpers/react-component-set-props.js');

var _reactComponentSetProps2 = _interopRequireDefault(_reactComponentSetProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var F7Chip = function (_React$Component) {
  _inherits(F7Chip, _React$Component);

  function F7Chip(props, context) {
    _classCallCheck(this, F7Chip);

    return _possibleConstructorReturn(this, (F7Chip.__proto__ || Object.getPrototypeOf(F7Chip)).call(this, props, context));
  }

  _createClass(F7Chip, [{
    key: 'onClick',
    value: function onClick(event) {
      this.dispatchEvent('click', event);
    }
  }, {
    key: 'onDeleteClick',
    value: function onDeleteClick(event) {
      this.dispatchEvent('delete', event);
    }
  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var props = self.props;
      var media = props.media,
          text = props.text,
          deleteable = props.deleteable,
          className = props.className,
          id = props.id,
          style = props.style,
          mediaTextColor = props.mediaTextColor,
          mediaBgColor = props.mediaBgColor,
          outline = props.outline;

      var mediaEl = void 0;
      var labelEl = void 0;
      var deleteEl = void 0;

      if (media || self.slots && self.slots.media) {
        var mediaClasses = _utils2.default.classNames('chip-media', mediaTextColor && 'text-color-' + mediaTextColor, mediaBgColor && 'bg-color-' + mediaBgColor);
        mediaEl = _react2.default.createElement('div', {
          className: mediaClasses
        }, media || this.slots['media']);
      }

      if (text || self.slots && self.slots.text) {
        labelEl = _react2.default.createElement('div', {
          className: 'chip-label'
        }, text, this.slots['text']);
      }

      if (deleteable) {
        deleteEl = _react2.default.createElement('a', {
          href: '#',
          className: 'chip-delete',
          onClick: self.onDeleteClick.bind(self)
        });
      }

      var classes = _utils2.default.classNames(className, 'chip', {
        'chip-outline': outline
      }, _mixins2.default.colorClasses(props));
      return _react2.default.createElement('div', {
        id: id,
        style: style,
        className: classes,
        onClick: self.onClick.bind(self)
      }, mediaEl, labelEl, deleteEl);
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(events) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return _reactComponentDispatchEvent2.default.apply(undefined, [this, events].concat(args));
    }
  }, {
    key: 'slots',
    get: function get() {
      return (0, _reactComponentSlots2.default)(this.props);
    }
  }]);

  return F7Chip;
}(_react2.default.Component);

(0, _reactComponentSetProps2.default)(F7Chip, Object.assign({
  id: [String, Number],
  media: String,
  text: [String, Number],
  deleteable: Boolean,
  mediaBgColor: String,
  mediaTextColor: String,
  outline: Boolean
}, _mixins2.default.colorProps));

exports.default = F7Chip;