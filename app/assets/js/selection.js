app.selectElm = function select (elm, sel) {
  sel.elm.contentEditable = false;
  elm.contentEditable = true;
  elm.focus();
  document.execCommand('selectAll',false,null);
  return {'elm': elm, row: elm.parentElement.id};
}

app.selectUp = function select (sel) {
  //TODO: find what needs to be selected, then use app.selectElm to select it and return its return
}
app.selectDown = function select (sel) {
  //TODO: ditto for this and others as in selectUp
}
app.selectNext = function select (sel) {

}
app.selectPrev = function select (sel) {

}
