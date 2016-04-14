APP.input = {};

APP.input.init = function (target) {
  target.addEventListener('mousedown', APP.pointer.mousedown);
  target.addEventListener('mouseup', APP.pointer.mouseup);
  target.addEventListener('click', APP.pointer.click);
  target.addEventListener('dblclick', APP.pointer.doubleclick);
  target.addEventListener('keydown', APP.input.keydown);
  target.addEventListener('input', APP.input.textInput);
  target.addEventListener('cut', APP.input.clipboard);
  target.addEventListener('copy', APP.input.clipboard);
  target.addEventListener('paste', APP.input.clipboard);
}
//Getting context is shared for all events
APP.input.getContext = function (target) {
  var text = APP.utils.elementIsText(target);
  var prop = APP.utils.elementIsProp(target);
  var row = APP.utils.elementIsRow(target);
  var doc = prop || row || text;
  return {
    text: text,
    prop: prop,
    row: row,
    doc: doc,
    app: true,
  }
}
