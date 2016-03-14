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
      context: (ctx.doc),
      preventDefault: true,
    },
    // newTextLine: {
    //   keypress: (key === '\n' && (mod.meta || mod.ctrl)),
    //   context: (ctx.text),
    //   preventDefault: true,
    // },
    moveRowUp: {
      keypress: (key === 'up' && mod.ctrl),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    moveRowDown: {
      keypress: (key === 'down' && mod.ctrl),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    indentRow: {
      keypress: (key === '\t' && !mod.any),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    outdentRow: {
      keypress: (key === '\t' && mod.shift),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    unfoldRow: {
      keypress: (key === '+' && !mod.any),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    foldRow: {
      keypress: (key === '-' && !mod.any),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    toggleCommentRow: {
      keypress: (key === '/' && (event.metaKey || event.ctrlKey)),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    addProp: {
      keypress: (key === ' '),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    deleteBW: {
      keypress: (key === '\b'),
      context: (ctx.row || ctx.prop),
      preventDefault: true,
    },
    deleteFW: {
      keypress: (key === 'delete'),
      context: (ctx.row || ctx.prop),
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
