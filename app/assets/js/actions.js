APP.actions = {
  new: function (key, context, sel) {
    //TODO: new action should launch a new window that inits itself
    let newSel = APP.doc.new();
    return newSel;
  },
  open: function (key, context, sel) {
    let newSel = APP.doc.open();
    return newSel;
  },
  save: function (key, context, sel) {
    APP.doc.save();
    return sel;
  },
  undo: function (key, context, sel) {
    let newSel = APP.doc.history.undo(sel);
    return newSel;
  },
  redo: function (key, context, sel) {
    let newSel = APP.doc.history.redo(sel);
    return newSel;
  },
  cut: function (key, context, sel, event) {
    //TODO: copy, then delFW
    let newSel = sel;
    return newSel;
  },
  copy: function (key, context, sel, event) {
    //TODO: just copy
    let newSel = sel;
    return newSel;
  },
  paste: function (key, context, sel, event) {
    //TODO: paste in place of selection, or after selection?
    let newSel = sel;
    return newSel;
  },
  selectPrev: function (key, context, sel) {
    //TODO: Check for shift key and handle additive selection
    //TODO: on selection, if nothing is selected (elm & row are null), when pressing down, select first thing in document, when pressing up, select last thing in document
    //TODO: additive selection

    let newSel = APP.select.prev(sel);
    return newSel;
  },
  selectNext: function (key, context, sel) {
    let newSel = APP.select.next(sel);
    return newSel;
  },
  selectUp: function (key, context, sel) {
    let newSel = APP.select.up(sel);
    return newSel;
  },
  selectDown: function (key, context, sel) {
    let newSel = APP.select.down(sel);
    return newSel;
  },
  edit: function (key, context, sel) {
    let newSel;
    if (context.row) {
      newSel = APP.select.element(sel.row.children[0], sel);
    } else if (context.text) {
      //TODO: this is the same as escape, combine them somehow?
      newSel = APP.select.element(sel.elm, sel);
      newSel = APP.doc.prop.validate(sel);
      APP.doc.history.add(APP.doc.elm.innerHTML);
    } else {
      newSel = APP.select.text(sel);
    }
    return newSel || sel;
  },
  escape: function (key, context, sel) {
    let newSel;
    if (context.text) {
      newSel = APP.select.element(sel.elm, sel);
      newSel = APP.doc.prop.validate(sel);
      APP.doc.history.add(APP.doc.elm.innerHTML);
    } else if (context.prop) {
      newSel = APP.select.row(sel);
    }
    return newSel || sel;
  },
  newRow: function (key, context, sel) {
    let newSel = APP.doc.row.new(sel);
    return newSel;
  },
  //NOTE: A row is a row, you can't add a new line to a text prop, you can only create a new row and type on that
  // newTextLine: function (key, context, sel) {
  // },
  moveUp: function (key, context, sel) {
    let newSel;
    if (context.row) {
      newSel = APP.doc.row.moveUp(sel);
    } else {
      newSel = APP.doc.prop.moveUp(sel);
    }
    return newSel;
  },
  moveDown: function (key, context, sel) {
    let newSel;
    if (context.row) {
      newSel = APP.doc.row.moveDown(sel);
    } else if (context.prop) {
      newSel = APP.doc.prop.moveDown(sel);
    }
    return newSel;
  },
  moveRight: function (key, context, sel) {
    let newSel;
    if (context.row) {
      newSel = APP.doc.row.indent(sel);
    } else if (context.prop) {
      newSel = APP.doc.prop.moveRight(sel);
    }
    return newSel;
  },
  moveRight: function (key, context, sel) {
    let newSel;
    if (context.row) {
      newSel = APP.doc.row.outdent(sel);
    } else if (context.prop) {
      newSel = APP.doc.prop.moveLeft(sel);
    }
    return newSel;
  },
  fold: function (key, context, sel) {
    console.log('fold/collapse row');
    return newSel;
  },
  unfold: function (key, context, sel) {
    console.log('unfold/expand row');
    return newSel;
  },
  toggleComment: function (key, context, sel) {
    APP.doc.row.toggleComment(sel);
    return sel;
  },
  setPropType: function (key, context, sel) {
    APP.doc.prop.setType(sel, APP.language.shortcuts[key]);
    return sel;
  },
  deleteBW: function (key, context, sel) {
    let newSel = APP.doc.prop.delBW(sel);
    return newSel;
  },
  deleteFW: function (key, context, sel) {
    let newSel = APP.doc.prop.delFW(sel);
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
