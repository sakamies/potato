//Require selection
//Require keysight

APP.keyboard = {};

APP.keyboard.getModifiers = function (event) {
  //return unique modifier presses, so there's no need no negate other keys every time
  return {
    shift: event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey,
    alt: !event.shiftKey && event.altKey && !event.ctrlKey && !event.metaKey,
    ctrl: !event.shiftKey && !event.altKey && event.ctrlKey && !event.metaKey,
    meta: !event.shiftKey && !event.altKey && !event.ctrlKey && event.metaKey,
    any: event.shiftKey || event.altKey || event.ctrlKey || event.metaKey,
    metaShift: event.metaKey && event.shiftKey && !event.altKey && !event.ctrlKey,
    ctrlShift: event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey,
  }
}

//TODO: make a keymap that's something like {key: action, key: action, etc...}
//TODO: platform especific keymaps? because of meta/cmd/ctrl differences
APP.keyboard.keydown = function (event) {
  var sel = APP.selection;
  var keydef = keysight(event); //TODO: use as module
  var key = keydef.key;
  var char = keydef.char;
  var mod = APP.keyboard.getModifiers(event);

  var actions = {
    selectPrev: function (event) {
      sel = APP.select.prev(sel);
      return false;
    },
    selectNext: function (event) {
      sel = APP.select.next(sel);
      return false;
    },
    selectUp: function (event) {
      sel = APP.select.up(sel);
      return false;
    },
    selectDown: function (event) {
      sel = APP.select.down(sel);
      return false;
    },
    newRow: function (event) {
      sel = APP.doc.row.new(sel);
      return false;
    },
    deleteRow: function (event) {
      sel = APP.doc.row.del(sel);
      return false;
    },
    moveRowUp: function (event) {
      sel = APP.doc.row.moveUp(sel);
      return false;
    },
    moveRowDown: function (event) {
      sel = APP.doc.row.moveDown(sel);
      return false;
    },
    indentRow: function (event) {
      sel = APP.doc.row.indent(sel);
      return false;
    },
    outdentRow: function (event) {
      sel = APP.doc.row.outdent(sel);
      return false;
    },
    toggleCommentRow: function (event) {
      console.log('togglecomment');
      sel = APP.doc.row.toggleComment(sel);
      return false;
    },
    assignPropType: function (event) {
      console.log('assignPropType()', key, parseInt(key));
      sel = APP.doc.prop.assign(sel, parseInt(key)-1);
      return false;
    },
    deleteProp: function (event) {
      var textSel = window.getSelection();
      sel = APP.doc.prop.del(sel);
      return false;
    },
    addProp: function (event) {
      console.log('addprop');
      _TODO!{
      /*
        if sel.elm contents are ' ' and they're selected
        get typed character
        check char against startsWith of all entity types
        assign type if applicable
      */
      /*
        if selection collapsed & not at start
        get typed character
        get entity type from lang def
        check char against endswith array
        assign type from next array with endswith index
      */
      /*
        else type normally, return true
      */
      if (false) {

        sel = APP.doc.prop.new(sel);
        return false;
      }
      return true;
    },
    undo: function (event) {
      sel = APP.doc.history.undo(sel);
      return false;
    },
    redo: function (event) {
      sel = APP.doc.history.redo(sel);
      return false;
    },
  }

  var keymap = {
    selectPrev: (key === 'left' && !mod.any),
    selectNext: (key === 'right' && !mod.any),
    selectUp: (key === 'up' && !mod.any),
    selectDown: (key === 'down' && !mod.any),
    newRow: (key === '\n'),
    deleteRow: (key === '\b' && (mod.meta || mod.ctrl)),
    moreRowUp: (key === 'up' && mod.ctrl),
    moveRowDown: (key === 'down' && mod.ctrl),
    indentRow: (key === '\t' && !mod.any),
    outdentRow: (key === '\t' && mod.shift),
    toggleCommentRow: (key === '/' && (mod.metaShift || mod.ctrlShift)),
    assignPropType: ((/[0-9]/).test(key) && (mod.meta || mod.ctrl)),
    deleteProp: (key === '\b' && !mod.any),
    addProp: (/^[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]/.test(key) && !mod.any),
    undo: (key === 'z' && (mod.meta || mod.ctrl)),
    redo: (key === 'z' && (mod.metaShift || mod.ctrlShift)),
  }

  for (action in keymap) {
    if (keymap[action] && keymap.hasOwnProperty(action)) {
      if (actions[action](event) == false) { //action returns true or false, telling if the browser default should be supressed
        event.preventDefault();
      }
    }
  }

  APP.selection = sel;
}
