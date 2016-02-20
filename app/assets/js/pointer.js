//Require selection

APP.pointer = {};

APP.pointer.mousedown = function (event) {
  var sel = APP.selection;
  var elm = event.target;
  var $elm = $(elm);
  if ($elm.hasClass('row') || $elm.parent().hasClass('row')) {
    sel = APP.select.element(elm, sel);
    APP.selection = sel;
  }
}
APP.pointer.mouseup = function (event) {
  event.preventDefault();
}
APP.pointer.click = function(event) {
  event.preventDefault();
}
