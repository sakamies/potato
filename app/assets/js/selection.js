//Selection (sel) object looks like this:
//{
  //'row': <dom element reference>,
  //'elm': <dom element reference>,
  //'farthest': 0, // TODO: So you don't reset your column even if you go through a few rows that have only one column or so
//}

APP.selection = {
  'elm': null,
  'row': null,
  'farthest': 0,
};

APP.select = {};

//takes new element to select and current selection, returns new selection
//TODO: if you give in the old selection, the selection collapses to sel, if you don't give in sel, the selection is additive
APP.select.text = function (sel) {

  //collapse selection
  sel = APP.select.element(sel.elm, sel);

  //set as editable and select
  sel.elm.contentEditable = true;
  sel.elm.focus();
  sel.elm.classList.add('editing');
  window.getSelection().selectAllChildren(sel.elm);
  return sel;
}
APP.select.element = function (newElm, sel) {
  var row;
  //TODO: check if the selection is the same as the old one, if yes, return the same object
  // if (sel && elm === sel.elm) {
  //   return sel;
  // }
  //TODO: additive selection and all, do this old selection check with $('.selected') & $('.focus')
  if (sel && sel.elm !== null) {
    sel.elm.classList.remove('selected');
    sel.elm.classList.remove('focus');
    sel.elm.classList.remove('editing');
    sel.elm.removeAttribute('tabindex');
    sel.elm.contentEditable = false;
    window.getSelection().removeAllRanges();
  }
  newElm.classList.add('selected');
  newElm.classList.add('focus');
  newElm.tabIndex = 0;
  newElm.focus();

  if (newElm.classList.contains('row')) {
    row = newElm;
  } else {
    row = newElm.parentElement;
  }
  return {'elm': newElm, row: row};
}
APP.select.row = function (sel) {
  return APP.select.element(sel.elm.parentElement, sel);
}
APP.select.next = function (sel) {
  var $newSelElm = $(sel.elm).next();
  if ($newSelElm.length !== 0) {
    return APP.select.element($newSelElm[0], sel);
  } else {
    $newSelElm = $(sel.elm).parent().next().children().first();
    if ($newSelElm.length !== 0) {
      return APP.select.element($newSelElm[0], sel);
    }
  }
  return sel;
}
APP.select.prev = function (sel) {
  var $newSelElm = $(sel.elm).prev();
  if ($newSelElm.length !== 0) {
    return APP.select.element($newSelElm[0], sel);
  } else {
    $newSelElm = $(sel.elm).parent().prev().children().last();
    if ($newSelElm.length !== 0) {
      return APP.select.element($newSelElm[0], sel);
    }
  }
  return sel;
}
APP.select.up = function (sel) {
  if (sel.elm.classList.contains('row')) {
    return APP.select.prev(sel);
  }
  var $newSelElm = $(sel.elm).parent().prev();
  var index = $(sel.elm).index();
  var $children;
  if ($newSelElm.length !== 0) {
    $children = $newSelElm.children();
    if ($children.length > index) {
      return APP.select.element($children[index], sel);
    } else if ($newSelElm.length !== 0) {
      return APP.select.element($children[$newSelElm.length-1], sel);
    }
    //TODO: implement farthest selection
  } else {
    return sel;
  }
}
APP.select.down = function select (sel) {
  if (sel.elm.classList.contains('row')) {
    return APP.select.next(sel);
  }
  var $newSelElm = $(sel.elm).parent().next();
  var index = $(sel.elm).index();
  var children;

  if ($newSelElm.length !== 0) {
    $children = $newSelElm.children();
    if ($children.length > index) {
      return APP.select.element($children[index], sel);
    } else if ($newSelElm.length !== 0) {
      return APP.select.element($children[$newSelElm.length-1], sel);
    }
  } else {
    return sel;
  }
}

APP.select.collapse = function (sel) {
  // TODO: collapse all children of an element into a [...] or something, that gets skipped when navigating the doc, like in sublime
  //TODO: needs some logig to selection navigation when elements are collapsed
}
APP.select.expand = function (sel) {
  // TODO: expand collapsed elements
}
