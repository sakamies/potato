APP.select = {};
//takes new element to select and current selection, returns new selection
APP.select.element = function (elm, sel) {
  //TODO: collapsing & additive/diffing selection with shift key
  if (sel) {
    //take care of old selection, if there is such
    sel.elm.parentElement.classList.remove('selected');
    sel.elm.contentEditable = false;
  }

  elm.parentElement.classList.add('selected');
  elm.contentEditable = true;
  elm.focus();
  document.execCommand('selectAll',false,null);

  return {'elm': elm, row: elm.parentElement};
}

APP.select.next = function (sel) {
  var newElm = sel.elm;
  var $newElm = $(sel.elm).next();
  if ($newElm.length !== 0) {
    newElm = $newElm[0];
  }
  return APP.select.element(newElm, sel);
}
APP.select.prev = function (sel) {
  var newElm = sel.elm;
  var $newElm = $(sel.elm).prev();
  if ($newElm.length !== 0) {
    newElm = $newElm[0];
  }
  return APP.select.element(newElm, sel);
}
APP.select.up = function (sel) {
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
  return APP.select.element(newElm, sel);
}
APP.select.down = function select (sel) {
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
  return APP.select.element(newElm, sel);
}
