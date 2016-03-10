APP.input = {};

//Getting context is shared for all events
APP.input.getContext = function (event) {
  var text = APP.utils.elementIsText(event.target);
  var prop = APP.utils.elementIsProp(event.target);
  var row = APP.utils.elementIsRow(event.target);
  var doc = prop || row || text;
  return {
    text: text,
    prop: prop,
    row: row,
    doc: doc,
    app: true,
  }
}
