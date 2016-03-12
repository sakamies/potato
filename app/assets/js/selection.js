/*
  //Selection (sel) object looks like this:
  {
    'row': <dom element reference>,
    'elm': <dom element reference>,
    'farthest': 0, // TODO: Implement farthest selection so you don't reset your column even if you go through a few rows that have only one column or so
  }
*/

APP.selection = {
  'row': null,
  'elm': null,
  'farthest': 0,
};
//TODO: refactor selection to work with indexes instead of element references, that way the selection is separate from the document and easier to reason about. Clicking an element requires finding out its index, which might be slow on large documents.

APP.select = {};

APP.select.element = function (newElm, oldSel) {
  //Takes new element to select and current selection, returns new selection
  //TODO: Should additive selection track selected stuff in the seletion object, or just sprinkle classes to the document and clean them up with selectors here?
  //TODO: selection object should be an array of selected things
  //if you give in the old selection, the selection collapses to sel, if you don't give in sel, the selection is additive
  var row;
  //Clean up old selection
  if (oldSel && oldSel.elm !== null) {
    oldSel.elm.classList.remove('selected');
    oldSel.elm.classList.remove('focus');
    oldSel.elm.classList.remove('editing');
    oldSel.elm.removeAttribute('tabindex');
    oldSel.elm.contentEditable = false;
    window.getSelection().removeAllRanges();
  }
  newElm.classList.add('selected');
  newElm.classList.add('focus');
  newElm.tabIndex = 0;
  newElm.focus();

  if (APP.utils.elementIsRow(newElm)) {
    row = newElm;
  } else {
    row = newElm.parentElement;
  }
  return {'elm': newElm, row: row};
}
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
APP.select.row = function (sel) {
  return APP.select.element(sel.elm.parentElement, sel);
}
APP.select.next = function (sel) {
  //TODO: skip folded rows, make folding work first
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
  //TODO: skip folded rows, make folding work first
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
  //TODO: skip folded rows, make folding work first
  if (APP.utils.elementIsRow(sel.elm)) {
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
  //TODO: skip folded rows, make folding work first
  if (APP.utils.elementIsRow(sel.elm)) {
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

APP.select.fold = function (sel) {
  // TODO: collapse all children of an element into a [...] or something, that gets skipped when navigating the doc, like in sublime
  //TODO: needs some logig to selection navigation when elements are collapsed
}
APP.select.unfold = function (sel) {
  // TODO: expand collapsed elements
}
