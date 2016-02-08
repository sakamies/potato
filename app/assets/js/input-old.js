function ElementalInputEvents () {
}

ElementalInputEvents.prototype.keydown = function (e) {
  //Here this refers to the riot tag that called app.keydown()
  //console.log('key:', e.which);
  KEY.UPDATE(e);
  var change = {};
  //TODO: activate autofill when writing an element name
  //TODO: attributes should autofill from a predetermined list/lists, like html attributes, angular attributes, riot attributes, etc etc

  if (e.which == KEY.UP && !KEY.MODIFIERS) {
    //move selection caret up one row
    event.preventDefault();
    app.select.row(-1, this.rows);
  }
  if (e.which == KEY.DOWN && !KEY.MODIFIERS) {
    //move selection caret down one row
    event.preventDefault();
    app.select.row(1, this.rows);
  }
  if (e.which == KEY.UP && KEY.SHIFT) {
    //move selection caret up one row and add to selection
    event.preventDefault();
    app.select.row(-1, this.rows, false);
  }
  if (e.which == KEY.DOWN && KEY.SHIFT) {
    //move selection caret down one row and add to selection
    event.preventDefault();
    app.select.row(1, this.rows, false);
  }
  if (e.which == KEY.LEFT && !KEY.MODIFIERS) {
    //move selection caret left one col
    event.preventDefault();
    app.select.col(-1, this.rows[app.selection.row.end]);
  }
  if (e.which == KEY.RIGHT && !KEY.MODIFIERS) {
    //move selection caret right one col
    event.preventDefault();
    app.select.col(1, this.rows[app.selection.row.end]);
  }


  if (e.which == KEY.TAB && !KEY.MODIFIERS) {
    //indent selected item
    event.preventDefault();
    this.rows[app.selection.row.end][INDEX.INDENT] += 1;
  }
  if (e.which == KEY.TAB && KEY.SHIFT) {
    //unindent selected item
    event.preventDefault();
    this.rows[app.selection.row.end][INDEX.INDENT] -= 1;
  }
  if (e.which == KEY.UP && KEY.CTRL) {
    //move selected item up one row
    //TODO: handle moving multiple selected rows
    event.preventDefault();
    this.rows.move(app.selection.row.end, app.selection.row.end-1);
    app.select.row(-1, this.rows);
  }
  if (e.which == KEY.DOWN && KEY.CTRL) {
    //move selected item down one row
    event.preventDefault();
    this.rows.move(app.selection.row.end, app.selection.row.end+1);
    app.select.row(1, this.rows);
  }

  if (e.which == KEY.ENTER && !KEY.MODIFIERS) {
    event.preventDefault();
    app.select.next(this.rows);
  }
  if (e.which == KEY.ENTER && KEY.META) {
    //make new row, element by default
    event.preventDefault();
    app.doc.add.row(this.rows);
  }
  if (e.which == KEY.ENTER && KEY.ALT) {
    //add attribute to selected row
    app.doc.add.attribute(this.rows[app.selection.row.end]);
    app.select.col(1, this.rows[app.selection.row.end]);
  }
  if (e.which == KEY.ENTER && KEY.SHIFT) {
    //add value to selected row
    app.doc.add.value(this.rows[app.selection.row.end]);
    app.select.col(1, this.rows[app.selection.row.end]);
  }

  if (e.which == KEY.BACKSPACE && KEY.META) {
    //remove selected elements
    event.preventDefault();
    app.doc.del.row(this.rows);
  }
  if (e.which == KEY.BACKSPACE && (KEY.ALT || KEY.SHIFT)) {
    //remove selected property
    event.preventDefault();
    //TODO: check that if trying to remove node name, remove the whole nore, or something like that
    app.doc.del.prop(this.rows[app.selection.row.end]);
    app.select.col(-1, this.rows[app.selection.row.end])
  }

  return true;
}

ElementalInputEvents.prototype.textInput = function (e) {
  // TODO: on input/change, put the input trap text into the focused thing in the data
  // var selItem = this.rows[app.selection.row.end][app.selection.col.end];
  // if (typeof selItem == 'string') {
  //   this.rows[app.selection.row.end][app.selection.col.end] = e.currentTarget.value;
  // } else if (selItem.constructor === Array) {
  //   this.rows[app.selection.row.end][app.selection.col.end][0] = e.currentTarget.value;
  // }

  this.text = e.target.value;
}



ElementalInputEvents.prototype.rowMousedown = function (e) {

  app.selection.row.end = e.item.i;
  app.selection.row.start = e.item.i;

  app.selection.row.item.hilite = false;
  e.item.hilite = true;
  app.selection.row.item = e.item;

  var isProp = e.target.classList.contains('name') || e.target.classList.contains('attr-name') || e.target.classList.contains('attr-value') || e.target.classList.contains('text');
  // Select first col if click didn't hit a prop to be selected
  if (!isProp) {
    app.select.col(row.length * -1, row);
  }

  return true;

}

ElementalInputEvents.prototype.propMousedown = function (e) {

  //TODO: this should just use app.select.col(colnumber)
  //TODO: refactor app.select.x functions to support this more direct data manipulation approach
  //TODO: app.select.col/row should take in an index, not a relative number, events will always have context, so they can say this.i+1 for the select function
  //TODO: select functions should take in the event object and context too

  app.selection.col.end = this.i;

  app.selection.col.item.focus = false;
  this.focus = true;
  app.selection.col.item = this;

  setTimeout(function () {
    document.querySelector('.input').focus();
  }, 0);
}

ElementalInputEvents.prototype.focus = function (e) {
  var input = e.target;
  input.setSelectionRange(0, input.value.length)
}
