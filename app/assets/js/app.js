document.addEventListener('DOMContentLoaded', function(event) {

  //TODO: First load default document from somewhere, now it's hardcoded in index.html


  //TODO: document the doc api, the basic logic is that any edit takes in the current selection and returns a new selection
  APP.selection = APP.doc.open(document.querySelector('.document'));

  //TODO: copy input events from elemental-5
  APP.doc.elm.addEventListener('mousedown', APP.pointer.mousedown);
  APP.doc.elm.addEventListener('mouseup', APP.pointer.mouseup);
  APP.doc.elm.addEventListener('click', APP.pointer.click);
  APP.doc.elm.addEventListener('keydown', APP.input.keydown);
  APP.doc.elm.addEventListener('input', APP.input.input);
});
