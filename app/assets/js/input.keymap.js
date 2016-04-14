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
    ctrlMeta: event.metaKey && event.ctrlKey && !event.altKey && !event.shiftKey,
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
    //TODO: make this an array instead of an object
    new: {
      action: 'new',
      keypress: (key === 'n' && (mod.meta || mod.ctrl)),
      context: (ctx.app),
      preventDefault: true,
    },
    open: {
      action: 'open',
      keypress: (key === 'o' && (mod.meta || mod.ctrl)),
      context: (ctx.app),
      preventDefault: true,
    },
    save: {
      action: 'save',
      keypress: (key === 's' && (mod.meta || mod.ctrl)),
      context: (ctx.app),
      preventDefault: true,
    },
    undo: {
      action: 'undo',
      keypress: (key === 'z' && (mod.meta || mod.ctrl)),
      context: (ctx.app),
      preventDefault: true,
    },
    redo: {
      action: 'redo',
      keypress: (key === 'z' && (mod.metaShift || mod.ctrlShift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    selectPrev: {
      action: 'selectPrev',
      keypress: (key === 'left' && (!mod.any || mod.shift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    selectNext: {
      action: 'selectNext',
      keypress: (key === 'right' && (!mod.any || mod.shift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    selectUp: {
      action: 'selectUp',
      keypress: (key === 'up' && (!mod.any || mod.shift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    selectDown: {
      action: 'selectDown',
      keypress: (key === 'down' && (!mod.any || mod.shift)),
      context: (!ctx.text),
      preventDefault: true,
    },
    edit: {
      action: 'edit',
      keypress: (key === '\n' && !mod.any),
      context: (ctx.doc),
      preventDefault: true,
    },
    escape: {
      action: 'escape',
      keypress: (key === 'esc' && !mod.any),
      context: (ctx.doc),
      preventDefault: true,
    },
    newRow: {
      action: 'newRow',
      keypress: (key === '\n' && (mod.meta || mod.ctrl)),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    // newTextLine: {
    //Note to future self: will not be implemented
    // },
    moveUp: {
      action: 'moveUp',
      keypress: (key === 'up' && mod.ctrl),
      context: (!ctx.text),
      preventDefault: true,
    },
    moveDown: {
      action: 'moveDown',
      keypress: (key === 'down' && mod.ctrl),
      context: (!ctx.text),
      preventDefault: true,
    },
    moveRight: {
      action: 'moveRight',
      keypress: (key === '\t' && !mod.any),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    moveLeft: {
      action: 'moveLeft',
      keypress: (key === '\t' && mod.shift),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    fold: {
      action: 'fold',
      keypress: (key === '-' && !mod.any),
      context: (!ctx.text),
      preventDefault: true,
    },
    unfold: {
      action: 'unfold',
      keypress: (key === '+' && !mod.any),
      context: (!ctx.text),
      preventDefault: true,
    },
    toggleComment: {
      action: 'toggleComment',
      keypress: (key === '/' && (event.metaKey || event.ctrlKey)),
      context: (!ctx.text),
      preventDefault: true,
    },
    addProp: {
      action: 'addProp',
      keypress: (key === ' '),
      context: (!ctx.text),
      preventDefault: true,
    },
    deleteBW: {
      action: 'deleteBW',
      keypress: (key === '\b'),
      context: (!ctx.text),
      preventDefault: true,
    },
    deleteFW: {
      action: 'deleteFW',
      keypress: (key === 'delete'),
      context: (!ctx.text),
      preventDefault: true,
    },
    setPropType: {
      action: 'setPropType',
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
