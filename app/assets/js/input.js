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
      sel = APP.doc.new();
      return false;
    },
    open: function (event) {
      sel = APP.doc.open(localStorage.getItem('document'));
      return false;
    },
    save: function (event) {
      sel = APP.doc.save();
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
      if (!APP.utils.elementIsText(sel.elm)) {
        sel = APP.select.prev(sel);
        return false;
      }
      return true;
    },
    selectNext: function (event) {
      if (!APP.utils.elementIsText(sel.elm)) {
        sel = APP.select.next(sel);
        return false;
      }
      return true;
    },
    selectUp: function (event) {
      if (!APP.utils.elementIsText(sel.elm)) {
        sel = APP.select.up(sel);
        return false;
      }
      return true;
    },
    selectDown: function (event) {
      if (!APP.utils.elementIsText(sel.elm)) {
        sel = APP.select.down(sel);
        return false;
      }
      return true;
    },
    edit: function (event) {
      if (APP.utils.elementIsRow(sel.elm)) {
        sel = APP.select.element(sel.row.children[0], sel);
        return false;
      } else if (APP.utils.elementIsText(sel.elm)) {
        sel = APP.select.element(sel.elm, sel);
        APP.doc.history.add(APP.doc.elm.innerHTML);
        return true;
      } else {
        sel = APP.select.text(sel);
        return false;
      }
    },
    escape: function (event) {
      if (APP.utils.elementIsText(sel.elm)) {
        //if element is contenteditable, deselect text and select the element
        sel = APP.select.element(sel.elm, sel);
      } else if (APP.utils.elementIsProp(sel.elm)) {
        //if it's an element, select its row
        sel = APP.select.row(sel);
      }
      return false;
    },
    newRow: function (event) {
      //TODO: doesn't work yet
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
    expandRow: function (event) {
      console.log('expand row');
      return false;
    },
    collapseRow: function (event) {
      console.log('collapse row');
      return false;
    },
    toggleCommentRow: function (event) {
      sel = APP.doc.row.toggleComment(sel);
      return false;
    },
    assignPropType: function (event) {
      //-1, because pressing 1 should assing the first thing in the entities array and pressing 0 should assing type 9 accordingly
      if (APP.utils.elementIsProp(sel.elm)) {
        sel = APP.doc.prop.setType(sel, parseInt(key)-1);
        return false;
      }
      return true;
    },
    deleteBW: function () {
      if (!APP.utils.elementIsText(sel.elm)) {
        sel = APP.doc.prop.delBW(sel);
        return false;
      }
      return true;
    },
    deleteFW: function () {
      if (!APP.utils.elementIsText(sel.elm)) {
        sel = APP.doc.prop.delFW(sel);
        return false;
      }
      return true;
    },
    addProp: function (event) {
      if (!APP.utils.elementIsText(sel.elm)) {
        sel = APP.doc.prop.new(sel);
        var type = APP.doc.prop.getType(sel.elm.previousSibling);
        if (type !== false) {
          var nextType = APP.doc.language.entities[type].next[0];
          for (var i = 0; i < APP.doc.language.entities.length; i++) {
            if (APP.doc.language.entities[i].name === nextType) {
              sel = APP.doc.prop.setType(sel, i);
              return false;
            }
          }
        }
        return false;
      }
      return true;
    },
  }

  var keymap = {
    new: (key === 'n' && (mod.meta || mod.ctrl)),
    open: (key === 'o' && (mod.meta || mod.ctrl)),
    save: (key === 's' && (mod.meta || mod.ctrl)),
    undo: (key === 'z' && (mod.meta || mod.ctrl)),
    redo: (key === 'z' && (mod.metaShift || mod.ctrlShift)),

    toggleSyntax: (key === 'esc' && mod.alt),
    selectPrev: (key === 'left' && !mod.any),
    selectNext: (key === 'right' && !mod.any),
    selectUp: (key === 'up' && !mod.any),
    selectDown: (key === 'down' && !mod.any),
    edit: (key === '\n' && !mod.any),
    escape: (key === 'esc' && !mod.any),
    newRow: (key === '\n' && (mod.meta || mod.ctrl)),
    deleteRow: (key === '\b' && (mod.meta || mod.ctrl)),
    moveRowUp: (key === 'up' && mod.ctrl),
    moveRowDown: (key === 'down' && mod.ctrl),
    indentRow: (key === '\t' && !mod.any),
    outdentRow: (key === '\t' && mod.shift),
    expandRow: (key === '+' && !mod.any),
    collapseRow: (key === '-' && !mod.any),
    toggleCommentRow: (key === '/' && (mod.metaShift || mod.ctrlShift)),
    addProp: (key === ' '),
    deleteBW: (key === '\b'),
    deleteFW: (key === 'delete'),
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
  var selElmType = APP.doc.prop.getType(sel.elm);
  //var whitelist = /[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]/; //TODO: whitelisted or blacklisted characters should be based on language definition
  //Like blacklisting startsWith & endsWith characters inside a prop, then highlighting them
  var textContent = sel.elm.textContent;
  var textSel = window.getSelection();
  var textRange = textSel.getRangeAt(0);
  var allSelected = sel.elm.textContent.length === textRange.startOffset + textRange.endOffset

  //if prop is of default type, try figuring out what type the user wants by looking at the first typed character
  if (textContent.length < 3 && selElmType === 0) {
    for (var i = 0; i < APP.doc.language.entities.length; i++) {
      if (APP.doc.language.entities[i].startsWith.indexOf(textContent) !== -1) {
        sel = APP.doc.prop.init(sel);
        sel = APP.doc.prop.setType(sel, i);
        APP.selection = sel;
        return;
      }
    }
  }
  //if the prop has some content, check the last char of the prop to determine if the user wants to start a new prop of some type
  else if (textContent.length > 1) {
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
