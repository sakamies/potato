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

APP.keyboard.keydown = function (event) {
  //TODO: check that the event originated from the doc
  var mode = APP.state.mode;
  var sel = APP.state.selection;
  var key = keysight(event).key;
  var mod = APP.keyboard.getModifiers(event);

  //Navigation & selection
  if (mode === 'document' && !mod.any) {
    if (key === 'left') {
      event.preventDefault();
      sel = APP.select.prev(sel);
    }
    if (key === 'right') {
      event.preventDefault();
      sel = APP.select.next(sel);
    }
    if (key === 'up') {
      event.preventDefault();
      sel = APP.select.up(sel);
    }
    if (key === 'down') {
      event.preventDefault();
      sel = APP.select.down(sel);
    }
    APP.state.selection = sel;
  }

  //Editing of rows
  if (key === '\t' && !mod.any) {
    //TODO: mode indenting into their own editing functions, make editing.js or actions.js something
    var indent = sel.row.firstChild;
    event.preventDefault();
    if (indent.nodeType === 3) {
      indent.textContent = indent.textContent + '  '; //TODO: use indentation from config here
    } else {
      $(sel.row).prepend('  ');
    }
  }
  if (key === '\t' && mod.shift) {
    var indent = sel.row.firstChild;
    event.preventDefault();
    if (indent.nodeType === 3) {
      indent.textContent = indent.textContent.replace('  ', ''); //TODO: use indentation from config here
    }
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
}
