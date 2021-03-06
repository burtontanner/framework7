'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (component, watchFor, prevProps, prevState, callback) {
  if (!callback) return;

  var newValue = void 0;
  var oldValue = void 0;

  if (watchFor.indexOf('props') === 0) {
    newValue = component.props;
    oldValue = prevProps;
  } else if (watchFor.indexOf('state') === 0) {
    newValue = component.state;
    oldValue = prevState;
  }
  // state and props has 5 letters
  watchFor.slice(5).split('.').filter(function (part) {
    return part;
  }).forEach(function (part) {
    if (typeof newValue !== 'undefined' && newValue !== null) {
      newValue = newValue[part];
    }
    if (typeof oldValue !== 'undefined' && oldValue !== null) {
      oldValue = oldValue[part];
    }
  });

  if (oldValue === newValue) return;

  if (callback) callback(newValue, oldValue);
};