APP.utils = {};

APP.utils.elementInDoc = function (elm) {
  return APP.utils.elementIsProp(elm) || APP.utils.elementIsRow(elm);
}
APP.utils.elementIsProp = function (elm) {
  return APP.config.tags.indexOf(elm.nodeName) != -1;
}
APP.utils.elementIsRow = function (elm) {
  //TODO: add these classes to config too, just like config.tags
  return elm.classList.contains('row') || elm.classList.contains('com');
}
