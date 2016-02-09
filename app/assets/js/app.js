app = {};

document.addEventListener('DOMContentLoaded', function(event) {

  //TODO: First load default document from somewhere, now it's hardcoded in index.html

  //Set up initial app state
  var state = {
    'mode': 'document',
    'sel': {
      'row': '#_0',
      'elm': document.querySelector('#_0 > :first-child')
      //'farthest': 0, // TODO: So you don't reset your column even if you go through a few rows that have only one column or so
    }
  };
  state.sel.elm.contentEditable = true;
  state.sel.elm.focus();
  document.execCommand('selectAll',false,null);

  //TODO: copy input events from elemental-5
  document.addEventListener('click', function(event) {
    var elm = event.target;
    var type = elm.nodeName;
    if (type == 'B' || type == 'I' || type == 'Q' || type == 'SPAN') {
      state.sel = app.selectElm(elm, state.sel);
    } else if (elm.classList.contains('row')) {
      state.sel = app.selectElm(elm.querySelector(':first-child + *'), state.sel);
    }
    console.log(state.sel);
  })
  document.addEventListener('keydown', function(event) {
    var mode = state.mode;
    var selection = state.sel;
    var key = keysight(event).key;

    if (key === 'left' && mode === 'document') {
      state.sel = app.selectPrev(selection);
      event.preventDefault();
    }
    if (key === 'right' && mode === 'document') {
      state.sel = app.selectNext(selection);
      event.preventDefault();
    }
    if (key === 'up' && mode === 'document') {
      state.sel = app.selectUp(selection);
      event.preventDefault();
    }
    if (key === 'down' && mode === 'document') {
      state.sel = app.selectDown(selection);
      event.preventDefault();
    }
  })
});
