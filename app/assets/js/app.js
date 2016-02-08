app = {};

document.addEventListener("DOMContentLoaded", function(event) {

  //TODO: First load default document from somewhere, now it's hardcoded in index.html

  //Set up initial app state
  var state = {
    'sel': {
      'row': '#_0',
      'elm': document.querySelector('#_0 > :first-child + *')
    }
  };
  state.sel.elm.contentEditable = true;
  state.sel.elm.focus();
  document.execCommand('selectAll',false,null);

  //TODO: copy input events from elemental-5
  document.addEventListener("click", function(event) {
    var elm = event.target;
    var type = elm.nodeName;
    if (type == 'B' || type == 'I' || type == 'Q' || type == 'SPAN') {
      state.sel = app.selectElm(elm, state.sel);
    } else if (elm.classList.contains('row')) {
      state.sel = app.selectElm(elm.querySelector(':first-child + *'), state.sel);
    }
    console.log(state.sel)
  })
});
