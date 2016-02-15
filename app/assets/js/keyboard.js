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
    any: event.shiftKey || event.altKey || event.ctrlKey || event.metaKey
  }
}

//TODO: make a keymap that's something like {key: action, key: action, etc...}
//TODO: platform especific keymaps? because of meta/cmd/ctrl differences
APP.keyboard.keydown = function (event) {
  var mode = APP.state.mode;
  var sel = APP.state.selection;
  var key = keysight(event).key; //TODO: use as module
  var mod = APP.keyboard.getModifiers(event);

  //TODO: check if the whole property is selected, if not, then let backspace work as normal

  //TODO: check what class of prop is selected, then check startswith & endswith properties from language config and act accordingly

  //Navigation & selection
  if (key === 'left' && !mod.any) {
    event.preventDefault();
    sel = APP.select.prev(sel);
  }
  else if (key === 'right' && !mod.any) {
    event.preventDefault();
    sel = APP.select.next(sel);
  }
  else if (key === 'up' && !mod.any) {
    event.preventDefault();
    sel = APP.select.up(sel);
  }
  else if (key === 'down' && !mod.any) {
    event.preventDefault();
    sel = APP.select.down(sel);
  }

  //Editing rows
  if (key === '\n') {
    event.preventDefault();
    sel = APP.doc.row.new(sel);
  }
  if (key === '\b' && (mod.meta || mod.ctrl)) {
    event.preventDefault();
    sel = APP.doc.row.del(sel);
  }
  if (key === 'up' && mod.ctrl) {
    //TODO: platform especific keymaps because of meta/cmd/ctrl differences
    event.preventDefault();
    sel = APP.doc.row.moveUp(sel);
  }
  if (key === 'down' && mod.ctrl) {
    //TODO: platform especific keymaps because of meta/cmd/ctrl differences
    event.preventDefault();
    sel = APP.doc.row.moveDown(sel);
  }
  if (key === '\t' && !mod.any) {
    event.preventDefault();
    sel = APP.doc.row.indent(sel);
  }
  if (key === '\t' && mod.shift) {
    event.preventDefault();
    sel = APP.doc.row.outdent(sel);
  }

  //Editing properties
  if (key === ' ' && !mod.any) {
    //TODO: read keylist from language definition
    //TODO: detect which key was pressed and compare to language definition
    //TODO: Add entity type that matches the keypress
    event.preventDefault();
    sel = APP.doc.prop.new(sel);
  }
  if (key === '\b' && !mod.any) {
    event.preventDefault();
    sel = APP.doc.prop.del(sel);
  }
  if ((/[0-9]/).test(key) && (mod.meta || mod.ctrl)) {
    event.preventDefault();
    console.log(parseInt(key));
    sel = APP.doc.prop.assign(sel, parseInt(key)-1);
  }


  //Undo/redo
  if (key === 'z' && (mod.meta || mod.ctrl)) {
    event.preventDefault();
    sel = APP.doc.history.undo(sel);
  }
  //TODO: make dealing with double modifier keys simpler
  if (key === 'z' && (event.metaKey && event.shiftKey && !event.altKey && !event.ctrlKey) || (event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey)) {
    event.preventDefault();
    sel = APP.doc.history.redo();
  }

  //move row up
  //move row down
  //cut copy paste

  APP.state.selection = sel;
}
