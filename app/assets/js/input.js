//Require selection
//Require keysight

APP.input = {};

APP.input.getModifiers = function (event) {
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
APP.input.keypress = function (event) {
  event.preventDefault();
}
APP.input.keydown = function (event) {
  var sel = APP.selection;
  var keydef = keysight(event); //TODO: use as module
  var key = keydef.key;
  var char = keydef.char;
  var mod = APP.input.getModifiers(event);

  var actions = {
    new: function (event) {
      alert('open!');
      return false;
    },
    open: function (event) {
      //TODO: open dom from localstorage, just like APP.doc.new()
      alert('open!');
      return false;
    },
    save: function (event) {
      //TODO: save dom to localstorage
      alert('save!');
      return false;
    },
    undo: function (event) {
      sel = APP.doc.history.undo(sel);
      return false;
    },
    redo: function (event) {
      sel = APP.doc.history.redo(sel);
      return false;
    },
    toggleSyntax: function (event) {
      APP.doc.elm.classList.toggle('show-syntax');
      APP.doc.elm.classList.toggle('hide-syntax');
      return false;
    },
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
    //TODO: delete row forward delete deleteRowFW with delete
    //TODO: delete row backward delete deleteRowBW with backspace
    //TODO: add functions for these into document.js
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
      sel = APP.doc.row.toggleComment(sel);
      return false;
    },
    assignPropType: function (event) {
      //-1, because pressing 1 should assing the first thing in the entities array and pressing 0 should assing type 9 accordingly
      sel = APP.doc.prop.assign(sel, parseInt(key)-1);
      return false;
    },
    deletePropBW: function () {
      sel = APP.doc.prop.delBW(sel);
      return false;
    },
    deletePropFW: function () {
      sel = APP.doc.prop.delFW(sel);
      return false;
    },
    eraseProp: function (event) {
      var textContent = sel.elm.textContent;
      var textSel = window.getSelection();
      var textRange = textSel.getRangeAt(0);
      var allSelected = sel.elm.textContent.length === textRange.startOffset + textRange.endOffset

      //if typed backspace and the prop is in initial state, delete it
      if (textContent === ' ' && allSelected) {
        if (key === '\b') {
          sel = APP.doc.prop.delBW(sel);
        } else {
          sel = APP.doc.prop.delFW(sel);
        }
        APP.selection = sel;
        return false;
      }
      //if typed backspace and if the props text is selected, clear the prop to its initial state, or if the prop somehow ends up empty, init it too
      else if (allSelected || textContent === '') {
        sel = APP.doc.prop.init(sel);
        APP.selection = sel;
        return false;
      }
      return true;
    },
    addProp: function (event) {
      sel = APP.doc.prop.new(sel);
      return false;
    },
  }

  var keymap = {
    open: (key === 'o' && (mod.meta || mod.ctrl)),
    save: (key === 's' && (mod.meta || mod.ctrl)),
    undo: (key === 'z' && (mod.meta || mod.ctrl)),
    redo: (key === 'z' && (mod.metaShift || mod.ctrlShift)),

    toggleSyntax: (key === 'esc' && mod.alt),
    selectPrev: (key === 'left' && !mod.any),
    selectNext: (key === 'right' && !mod.any),
    selectUp: (key === 'up' && !mod.any),
    selectDown: (key === 'down' && !mod.any),
    newRow: (key === '\n' && !mod.any),
    deleteRow: (key === '\b' && (mod.meta || mod.ctrl)),
    moreRowUp: (key === 'up' && mod.ctrl),
    moveRowDown: (key === 'down' && mod.ctrl),
    indentRow: (key === '\t' && !mod.any),
    outdentRow: (key === '\t' && mod.shift),
    toggleCommentRow: (key === '/' && (mod.metaShift || mod.ctrlShift)),
    addProp: (key === '\n' && mod.alt),
    deletePropBW: (key === '\b' && mod.alt),
    deletePropFW: (key === 'delete' && mod.alt),
    eraseProp: ((key === '\b' && !mod.any) || key === 'delete' && !mod.any),
    assignPropType: ((/[0-9]/).test(key) && (mod.meta || mod.ctrl)),
    //selectAll, selectNone, cut/copy/paste(needs some work on multiselection)
  }

  for (action in keymap) {
    if (keymap[action] && keymap.hasOwnProperty(action)) {
      if (actions[action](event) === false) { //action returns true or false, telling if the browser default should be supressed
        event.preventDefault();
      }
    }
  }

  APP.selection = sel;
}

APP.input.input = function (event) {
  var sel = APP.selection;
  var selElmType = APP.doc.prop.getType(sel);
  var whitelist = /[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]/;
  var textContent = sel.elm.textContent;
  var textSel = window.getSelection();
  var textRange = textSel.getRangeAt(0);
  var allSelected = sel.elm.textContent.length === textRange.startOffset + textRange.endOffset

  //if prop gets emptied, reinit it
  if (textContent === '') {
    sel = APP.doc.prop.init(sel);
    APP.selection = sel;
    return;
  }

  //if prop is of default type, try figuring out what type the user wants by looking at the first typed character
  else if (textContent.length < 3 && selElmType === 0) {
    for (var i = 0; i < APP.doc.language.entities.length; i++) {
      if (APP.doc.language.entities[i].startsWith.indexOf(textContent) !== -1) {
        sel = APP.doc.prop.init(sel);
        sel = APP.doc.prop.assign(sel, i);
        APP.selection = sel;
        return;
      }
    }
  }
  //if the prop has some content, check the last inserted char to determine if the user wants to start a new prop of some type
  else if (textContent.length > 1 && textSel.isCollapsed && textRange.endOffset === textContent.length) {
    var lastChar = textContent.substring(textContent.length - 1);
    var nextType = APP.doc.language.entities[selElmType].endsWith.indexOf(lastChar);
    if (nextType !== -1) {
      nextType = APP.doc.language.entities[selElmType].next[nextType];
      for (var i = 0; i < APP.doc.language.entities.length; i++) {
        if (APP.doc.language.entities[i].name === nextType) {
          sel.elm.innerHTML = textContent.substr(0, textContent.length - 1);
          sel = APP.doc.prop.new(sel, i);
          APP.selection = sel;
          return;
        }
      }
    }
  }
}
