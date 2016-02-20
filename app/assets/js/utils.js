APP.utils = {};

APP.utils.elementInDoc = function (elm) {
  return APP.utils.elementIsProp(elm) || APP.utils.elementIsRow(elm);
}
APP.utils.elementIsProp = function (elm) {
  return elm.nodeName === 'I'; //TODO: don't hardcode things
}
APP.utils.elementIsRow = function (elm) {
  return elm.classList.contains('row');  //TODO: don't hardcode things
}
