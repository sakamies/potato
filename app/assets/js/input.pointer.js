//Require selection

APP.pointer = {};

// APP.pointer.dragging = false;
// APP.pointer.getState = function (event) {
  //TODO: pointer dragging logic, should use native dragging if possibble
// }

APP.pointer.mousedown = function (event) {
  var sel = APP.selection;
  var elm = event.target;
  if (APP.utils.elementInDoc(elm) && !APP.utils.elementIsText(elm)) {
    sel = APP.select.element(elm, sel);
    event.preventDefault();
    APP.selection = sel;
  }
}
APP.pointer.mouseup = function (event) {
  var sel = APP.selection;
  var elm = event.target;
  if (!APP.utils.elementIsText(elm)) {
    event.preventDefault();
  }
}
APP.pointer.click = function(event) {
  event.preventDefault();
}
APP.pointer.doubleclick = function(event) {
  var key = 'dblclick';
  var sel = APP.selection;
  var context = APP.input.getContext(event);
  if (!context.text) {
    var newSel = APP.actions.edit(key, context, sel);
    APP.selection = newSel;
  }
}
