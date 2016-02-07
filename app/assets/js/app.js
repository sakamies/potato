app = {};

app.input = new ElementalInputEvents;
app.doc = new ElementalDocument;



// Properties for tracking selection state
app.selection = {row: {}, col: {}};

app.selection.row.item;
app.selection.row.start = 0;
app.selection.row.end = 0;

app.selection.col.item;
app.selection.col.end = INDEX.PROPS; // INDENT, COMMENT are not selectable, start selection where node properties start
app.selection.col.farthest = INDEX.PROPS; // So you don't reset your column even if you go through a few rows that have only one column



// Functions for modifying selection state
app.select = {};
app.select.row = function (amount, rows, collapse) {

  var oldEnd = app.selection.row.end;
  var oldStart = app.selection.row.start;
  var min = 0;
  var max = rows.length;
  var colRecall ;

  // Clip selection at document bounds
  if (app.selection.row.end + amount > min - 1 && app.selection.row.end + amount < max) {
    app.selection.row.end += amount;
  } else if (amount < 0) {
    app.selection.row.end = min;
  } else {
    app.selection.row.end = max - 1;
  }

  // Collapse selection by default
  if (collapse !== false) {
    app.selection.row.start = app.selection.row.end;
  }

  // Try to return caret to the column where it was before, when selecting a row
  colRecall = app.selection.col.farthest - app.selection.col.end;
  app.select.col(colRecall , rows[app.selection.row.end]);

  // Return whether selection changed or not
  if (oldEnd == app.selection.row.end && oldStart == app.selection.row.start) {
    return false;
  } else {
    return true;
  }
}
app.select.col = function (amount, row, collapse) {

  var oldCol = app.selection.col.end;
  var min = INDEX.PROPS;
  var max = row.length;

  if (app.selection.col.end + amount > min - 1 && app.selection.col.end + amount < max) {
    app.selection.col.end += amount;
    app.selection.col.farthest = app.selection.col.end;
  } else if (amount < 0) {
    app.selection.col.end = min;
  } else {
    app.selection.col.end = max - 1;
  }

  // TODO: implement selection range & collapsing to cols
  // if (!collapse) {
  // } else {
  //   app.selection.row.start = app.selection.row.end;
  // }

  // app.input.selectText();

  if (oldCol == app.selection.col.end) {
    return false; // Selection didn't change
  } else {
    return true; // Selection changed
  }
}
app.select.next = function (rows) {
  var change = app.select.col(1, rows[app.selection.row.end]);
  if (!change) {
    var row = rows[app.selection.row.end];
    app.select.row(1, rows);
    app.select.col(row.length * -1, row);
  }
}

document.addEventListener("DOMContentLoaded", function(event) {

  console.log('mockdoc', mockdoc);

  //TODO: how to open an html file and convert it to an array?
  riot.mount('elemental', {'doc': mockdoc});
});

