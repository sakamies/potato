function ElementalDocument (data) {
  //TODO: add support for node type 7, which means that the node type is yet to be determined, this allows for writing emmet abbreviations or anything else in the row text cell, and processing the input after the user presses enter
  this.data = data || [0, true,  7,  ''];
}

ElementalDocument.prototype.add = {};
//TODO: refactor so add/del/move functions have row/rows built in and don't need them passed into them, so any event can trigger these, not just ones where we have the context
ElementalDocument.prototype.add.row = function (rows) {
  //TODO: mutates the rows array, this kind of magic might lead to confusion later, should it be done this way?
  var prevRow = rows[app.selection.row.end];
  var nextRow = rows[app.selection.row.end+1];
  var indent = app.determineNewIndent(prevRow, nextRow);
  var type = 1;
  //TODO: Should determine new row tagname based on context
  var newRow = [indent, true,  type,  'div'];
  rows.splice(app.selection.row.end+1, 0, newRow);
  app.select.row(1, rows);
}
ElementalDocument.prototype.add.attribute = function (row) {
  var newAttr = 'attr';
  row.splice(app.selection.col.end+1, 0, newAttr);
}
ElementalDocument.prototype.add.value = function (row) {
  var newValue = ['value'];
  row.splice(app.selection.col.end+1, 0, newValue);
}

ElementalDocument.prototype.del = {};
ElementalDocument.prototype.del.row = function (rows) {
  //TODO: mutates the rows array, this kind of magic will lead to confusion later
  //TODO: removing a row is pretty much the same as unwrap, so it should unindent all rows until the next sibling of this node
    var changeTop = Math.min(app.selection.row.start, app.selection.row.end);
    var changeBottom = Math.max(app.selection.row.start, app.selection.row.end);
    rows.splice(changeTop, changeBottom-changeTop+1);
    app.selection.row.end = changeTop-1;
    app.selection.row.start = app.selection.row.end;

    //TODO: use app.select.row instead of manipulating selection object
    //app.select.row(-1, rows);
}
ElementalDocument.prototype.del.prop = function (row) {
  row.splice(app.selection.col.end, 1);
}
ElementalDocument.prototype.del.attribute = function (row) {
}
ElementalDocument.prototype.del.value = function (row) {
}


ElementalDocument.prototype.determineNewIndent = function (prev, next) {
  //Gets indents of element above and below and determines what indentation should go between when making a new row
  if (next == undefined) {
    next = prev;
  };
  var indent = [prev[INDEX.INDENT], next[INDEX.INDENT]]
  if (indent[0] == indent[1]) {
    return indent[0];
  } else if (indent[0] < indent[1]) {
    return indent[0] + 1;
  } else {
    return indent[0];
  }
}
