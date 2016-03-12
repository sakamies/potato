APP.actions = {
  new: function (key, context, sel) {
    //TODO: new action should launch a new window that inits itself
    var newSel = APP.doc.new();
    return newSel;
  },
  open: function (key, context, sel) {
    var newSel = APP.doc.open();
    return newSel;
  },
  save: function (key, context, sel) {
    //TODO: does not yet work completely, outputs html to the console but does not save it anywhere
    APP.doc.save();
    return sel;
  },
  undo: function (key, context, sel) {
    var newSel = APP.doc.history.undo(sel);
    return newSel;
  },
  redo: function (key, context, sel) {
    var newSel = APP.doc.history.redo(sel);
    return newSel;
  },
  selectPrev: function (key, context, sel) {
    //TODO: Check for shift key and handle additive selection
    //TODO: on selection, if nothing is selected (elm & row are null), when pressing down, select first thing in document, when pressing up, select last thing in document
    //TODO: additive selection

    var newSel = APP.select.prev(sel);
    return newSel;
  },
  selectNext: function (key, context, sel) {
    var newSel = APP.select.next(sel);
    return newSel;
  },
  selectUp: function (key, context, sel) {
    var newSel = APP.select.up(sel);
    return newSel;
  },
  selectDown: function (key, context, sel) {
    var newSel = APP.select.down(sel);
    return newSel;
  },
  edit: function (key, context, sel) {
    var newSel;
    if (context.row) {
      newSel = APP.select.element(sel.row.children[0], sel);
    } else if (context.text) {
      newSel = APP.doc.prop.validate(sel);
      newSel = APP.select.element(sel.elm, sel);
      APP.doc.history.add(APP.doc.elm.innerHTML);
    } else {
      newSel = APP.select.text(sel);
    }
    return newSel || sel;
  },
  escape: function (key, context, sel) {
    var newSel;
    if (context.text) {
      newSel = APP.select.element(sel.elm, sel);
    } else if (context.prop) {
      newSel = APP.select.row(sel);
    }
    return newSel || sel;
  },
  newRow: function (key, context, sel) {
    var newSel = APP.doc.row.new(sel);
    return newSel;
  },
  moveRowUp: function (key, context, sel) {
    var newSel = APP.doc.row.moveUp(sel);
    return newSel;
  },
  moveRowDown: function (key, context, sel) {
    var newSel = APP.doc.row.moveDown(sel);
    return newSel;
  },
  indentRow: function (key, context, sel) {
    var newSel = APP.doc.row.indent(sel);
    return newSel;
  },
  outdentRow: function (key, context, sel) {
    var newSel = APP.doc.row.outdent(sel);
    return newSel;
  },
  unfoldRow: function (key, context, sel) {
    console.log('unfold/expand row');
    return newSel;
  },
  foldRow: function (key, context, sel) {
    console.log('fold/collapse row');
    return newSel;
  },
  toggleCommentRow: function (key, context, sel) {
    APP.doc.row.toggleComment(sel);
    return sel;
  },
  setPropType: function (key, context, sel) {
    APP.doc.prop.setType(sel, APP.language.shortcuts[key]);
    return sel;
  },
  deleteBW: function (key, context, sel) {
    var newSel = APP.doc.prop.delBW(sel);
    return newSel;
  },
  deleteFW: function (key, context, sel) {
    var newSel = APP.doc.prop.delFW(sel);
    return newSel;
  },
  addProp: function (key, context, sel) {
    var type;
    var nextType;
    var newSel = APP.doc.prop.new(sel);
    if (newSel.elm.previousSibling) {
      type = APP.doc.prop.getType(newSel.elm.previousSibling);
      nextType = APP.language.types[type].next[0];
      newSel = APP.doc.prop.setType(newSel, nextType);
    } else {
      newSel = APP.doc.prop.setType(newSel, APP.language.defaultType);
    }
    return newSel;
  },
}
