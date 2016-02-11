APP.click = function(event) {
  var elm = event.target;
  if (APP.utils.elementIsProp(elm)) {
    APP.state.selection = APP.select.element(elm, APP.state.selection);
  } else if (APP.utils.elementIsRow(elm)) {
    APP.state.selection = APP.select.element(elm.querySelector(':first-child'), APP.state.selection);
  }
}
