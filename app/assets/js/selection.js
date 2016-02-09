//takes new element to select and current selection, returns new selection
app.selectElm = function select (elm, sel) {
  sel.elm.contentEditable = false;
  elm.contentEditable = true;
  elm.focus();
  document.execCommand('selectAll',false,null);
  return {'elm': elm, row: elm.parentElement.id};
}

app.selectNext = function select (sel) {
  var newElm = sel.elm;
  var $newElm = $(sel.elm).next();
  if ($newElm.length !== 0) {
    newElm = $newElm[0];
  }
  return app.selectElm(newElm, sel);
}
app.selectPrev = function select (sel) {
  var newElm = sel.elm;
  var $newElm = $(sel.elm).prev();
  if ($newElm.length !== 0) {
    newElm = $newElm[0];
  }
  return app.selectElm(newElm, sel);
}
app.selectUp = function select (sel) {
  var newElm = sel.elm;
  var $newElm = $(sel.elm).parent().prev();
  var index = $(sel.elm).index();
  var children;

  if ($newElm.length !== 0) {
    $children = $newElm.children();
    if ($children.length > index) {
      newElm = $children[index];
    } else if ($newElm.length !== 0) {
      newElm = $children[$newElm.length-1];
    }
  }
  return app.selectElm(newElm, sel);
}
app.selectDown = function select (sel) {
  var newElm = sel.elm;
  var $newElm = $(sel.elm).parent().next();
  var index = $(sel.elm).index();
  var children;

  if ($newElm.length !== 0) {
    $children = $newElm.children();
    if ($children.length > index) {
      newElm = $children[index];
    } else if ($newElm.length !== 0) {
      newElm = $children[$newElm.length-1];
    }
  }
  return app.selectElm(newElm, sel);
}
