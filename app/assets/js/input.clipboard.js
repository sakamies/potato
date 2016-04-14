APP.input.clipboard = function (event) {
  //TODO: clipboard handling
  var sel = APP.selection;
  console.log('cut/copy/paste', sel);
  var key = null;
  var context = APP.input.getContext(sel.elm);
  var mod = null
  //event.preventDefault();
}
