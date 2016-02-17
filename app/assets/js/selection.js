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
APP.select.element = function (elm, sel) {
  //TODO: collapsing & additive/diffing selection with shift key
  if (sel && sel.elm !== null) {
    var textContent = sel.elm.textContent;
    var allowedContent = APP.doc.language.entities[APP.doc.prop.getType(sel)].contains;
    //delete prop if empty and can't be whitespace only, else deselect prop
    if (textContent === ' ' && allowedContent !== ' ') {
      if (sel.elm.parentElement.children.length === 1) {
        sel.row.remove();
      } else {
        sel.elm.remove();
      }
    } else {
      sel.elm.parentElement.classList.remove('selected');
      sel.elm.classList.remove('focus');
      sel.elm.contentEditable = false;
    }
  }

  elm.parentElement.classList.add('selected');
  elm.classList.add('focus');
  elm.contentEditable = true;
  elm.focus();
  document.execCommand('selectAll',false,null);

  return {'elm': elm, row: elm.parentElement};
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
  var $newSelElm = $(sel.elm).parent().prev();
  var index = $(sel.elm).index();
  var children;

  if ($newSelElm.length !== 0) {
    $children = $newSelElm.children();
    if ($children.length > index) {
      return APP.select.element($children[index], sel);
    } else if ($newSelElm.length !== 0) {
      return APP.select.element($children[$newSelElm.length-1], sel);
    }
    //TODO: implement farthest selection
  }
  return sel;
}
APP.select.down = function select (sel) {
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
  }
  return sel;
}

APP.select.collapse = function function_name(argument) {
  // TODO: collapse all children of an element into a [...] or something, that gets skipped when navigating the doc, like in sublime
}
APP.select.expand = function function_name(argument) {
  // TODO: expand collapsed elements
}
