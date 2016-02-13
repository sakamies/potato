//Require selection
//Require keysight

APP.keyboard = {};

APP.keyboard.getModifiers = function (event) {
  return {
    shift: event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey,
    alt: !event.shiftKey && event.altKey && !event.ctrlKey && !event.metaKey,
    ctrl: !event.shiftKey && !event.altKey && event.ctrlKey && !event.metaKey,
    meta: !event.shiftKey && !event.altKey && !event.ctrlKey && event.metaKey,
    any: event.shiftKey || event.altKey || event.ctrlKey || event.metaKey
  }
}

//TODO: make a keymap that's something like {key+mods: action}
APP.keyboard.keydown = function (event) {
  var mode = APP.state.mode;
  var sel = APP.state.selection;
  var key = keysight(event).key; //TODO: use as module
  var mod = APP.keyboard.getModifiers(event);

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

  //Editing of rows
  if (key === '\t' && !mod.any) {
    event.preventDefault();
    sel = APP.doc.row.indent(sel);
  }
  if (key === '\t' && mod.shift) {
    event.preventDefault();
    sel = APP.doc.row.outdent(sel);
  }

  //add & delete props
  if (key === ' ' && !mod.any) {
    event.preventDefault();
    sel = APP.doc.prop.new(sel);
  }
  if (key === '\b' && !mod.any) {
    event.preventDefault();
    sel = APP.doc.prop.del(sel);
  }

  if (key === '\n') {
    console.log('add row')
    //TODO: platform especific keymaps because of meta/cmd/ctrl differences
    event.preventDefault();
    sel = APP.doc.row.new(sel);
  }

  //add row
  //delete row
  //move row up
  //move row down
  //cut copy paste

  //Editing properties
  //add prop
  //delete prop
  //cut copy paste

  APP.state.selection = sel;
}
