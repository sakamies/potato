APP.input.getKeyModifiers = function (event) {
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
// APP.input.languageShortcuts = function (types) {
  //TODO: have some way to trigger an action based on language configs endsWith char
//   var arr = []
//   for (let key in types) {
//     let type = types[key];
//     for (let i = 0; i < type.endsWith.length; i++) {
//       let char = type.endsWith[i];
//       if (arr.indexOf(char) === -1) {
//         arr.push(char);
//       }
//     }
//   }
//   console.log(arr);
//   return arr;
// };
APP.input.getKeymap = function (key, ctx, mod) {
  return {
    new: {
      keypress: (key === 'n' && (mod.meta || mod.ctrl)),
      context: (ctx.app),
      preventDefault: true,
    },
    open: {
      keypress: (key === 'o' && (mod.meta || mod.ctrl)),
      context: (ctx.app),
      preventDefault: true,
    },
    save: {
      keypress: (key === 's' && (mod.meta || mod.ctrl)),
      context: (ctx.app),
      preventDefault: true,
    },
    undo: {
      keypress: (key === 'z' && (mod.meta || mod.ctrl)),
      context: (ctx.app),
      preventDefault: true,
    },
    redo: {
      keypress: (key === 'z' && (mod.metaShift || mod.ctrlShift)),
      context: (ctx.app),
      preventDefault: true,
    },
    selectPrev: {
      keypress: (key === 'left' && (!mod.any || mod.shift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    selectNext: {
      keypress: (key === 'right' && (!mod.any || mod.shift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    selectUp: {
      keypress: (key === 'up' && (!mod.any || mod.shift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    selectDown: {
      keypress: (key === 'down' && (!mod.any || mod.shift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    edit: {
      keypress: (key === '\n' && !mod.any),
      context: (ctx.doc),
      preventDefault: true,
    },
    escape: {
      keypress: (key === 'esc' && !mod.any),
      context: (ctx.doc),
      preventDefault: true,
    },
    newRow: {
      keypress: (key === '\n' && (mod.meta || mod.ctrl)),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    // newTextLine: {
    //Note to future self: will not be implemented
    // },
    moveUp: {
      keypress: (key === 'up' && mod.ctrl),
      context: (!ctx.text),
      preventDefault: true,
    },
    moveDown: {
      keypress: (key === 'down' && mod.ctrl),
      context: (!ctx.text),
      preventDefault: true,
    },
    indent: {
      keypress: (key === '\t' && !mod.any),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    outdent: {
      keypress: (key === '\t' && mod.shift),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    fold: {
      keypress: (key === '-' && !mod.any),
      context: (!ctx.text),
      preventDefault: true,
    },
    unfold: {
      keypress: (key === '+' && !mod.any),
      context: (!ctx.text),
      preventDefault: true,
    },
    toggleComment: {
      keypress: (key === '/' && (event.metaKey || event.ctrlKey)),
      context: (!ctx.text),
      preventDefault: true,
    },
    addProp: {
      keypress: (key === ' '),
      context: (!ctx.text),
      preventDefault: true,
    },
    deleteBW: {
      keypress: (key === '\b'),
      context: (!ctx.text),
      preventDefault: true,
    },
    deleteFW: {
      keypress: (key === 'delete'),
      context: (!ctx.text),
      preventDefault: true,
    },
    setPropType: {
      keypress: (key.match(/[0-9]/) && (mod.meta || mod.ctrl)),
      context: (ctx.prop),
      preventDefault: true,
    },
    //TODO: selectAll, selectNone
    //TODO: cut/copy/paste
    //TODO: cleanup pasted text (strip tags & inline styles)
    //TODO: alt+arrows should move along the tree in the doc (parent, child, silbings in the indented structure of the doc), kinda like alt+arrows moves accross word boundaries in regular text editing
  }
}
