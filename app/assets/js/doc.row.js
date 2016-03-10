//TODO: make this something like APP.edit.row

//Takes selection, returns new selection
APP.doc.row.new = function (sel) {
  var indentation = APP.doc.row.getIndentation(sel.row);
  var nextIndentation = APP.doc.row.getIndentation($(sel.row).next()[0]);
  if (indentation < nextIndentation) {
    indentation = nextIndentation;
  }
  var rowTemplate = APP.config.templates.row.replace('$prop', '');
  var newRow = $(sel.row).after(rowTemplate).next()[0];
  APP.doc.row.setIndentation(newRow, indentation);
  var newSel = APP.select.element(newRow, sel);
  newSel = APP.doc.prop.new(newSel);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}

APP.doc.row.del = function (sel) {
  var newSel = APP.select.down(sel);
  if (newSel === sel) {
    newSel = APP.select.up(sel);
  }
  sel.row.remove();
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}

APP.doc.row.moveUp = function (sel) {
  $row = $(sel.row);
  var $prev = $row.prev();
  if ($prev.length != 0) {
    $row.after($prev);
  }
  sel.elm.blur();
  sel.elm.focus();

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}

APP.doc.row.moveDown = function (sel) {
  $row = $(sel.row);
  var $next = $row.next();
  if ($next.length != 0) {
    $row.before($next);
  }
  sel.elm.blur();
  sel.elm.focus();

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}

APP.doc.row.getIndentation = function (row) {
  if (row) {
    return parseInt(row.style.paddingLeft);
  } else {
    return 0;
  }
}
APP.doc.row.setIndentation = function (row, indentation) {
  row.style.paddingLeft = indentation + 'ch';
}
APP.doc.row.indent = function (sel) {
  var indentation = APP.doc.row.getIndentation(sel.row);
  APP.doc.row.setIndentation(sel.row, indentation + 2);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indentationing does not modify selection
}
APP.doc.row.outdent = function (sel) {
  var indentation = APP.doc.row.getIndentation(sel.row);
  if (indentation > 0) {
    APP.doc.row.setIndentation(sel.row, indentation - 2);
    APP.doc.history.add(APP.doc.elm.innerHTML);
  }
  return sel; //indenting does not modify selection
}
APP.doc.row.toggleComment = function (sel) {
  sel.row.classList.toggle('comment');

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indenting does not modify selection
}
