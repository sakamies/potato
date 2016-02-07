var appstate = {};

document.addEventListener("DOMContentLoaded", function(event) {

  //Load default document from somewhere, now it's hardcoded in index.html

  var initialSelection = document.querySelector('#id0 > :first-child + *');
  initialSelection.contentEditable = true;
  initialSelection.focus();
  document.execCommand('selectAll',false,null);
  appstate.selection = initialSelection;

  //TODO: copy input events from elemental-5
});

document.addEventListener("click", function(event) {
  appstate.selection.contentEditable = false;
  var elm = event.target;
  var type = elm.nodeName;
  if (type == 'A' || type == 'B' || type == 'I' || type == 'Q' || type == 'SPAN') {
    elm.contentEditable = true;
    elm.focus();
    document.execCommand('selectAll',false,null);
    appstate.selection = elm;
  };
})
