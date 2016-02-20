//Require selection

APP.pointer = {};

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
  var sel = APP.selection;
  var elm = event.target;
  if (APP.utils.elementInDoc(elm) && !APP.utils.elementIsText(elm)) {
    sel = APP.select.text(sel);
    event.preventDefault();
    APP.selection = sel;
  }
}
