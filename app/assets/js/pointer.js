//Require selection

APP.pointer = {};

APP.pointer.mousedown = function (event) {
  var elm = event.target;
  var sel = APP.selection;

  if (APP.utils.elementIsProp(elm)) {
    sel = APP.select.element(elm, sel);
  } else if (APP.utils.elementIsRow(elm)) {
    event.preventDefault(); //TODO: Mousedown preventdefault prevents dragging too, want to have dragging stuff around later
    sel = APP.select.element(elm.querySelector(':first-child'), sel);
  }
  APP.selection = sel;
}
APP.pointer.mouseup = function (event) {
  event.preventDefault();
}
APP.pointer.click = function(event) {
  event.preventDefault();
}
