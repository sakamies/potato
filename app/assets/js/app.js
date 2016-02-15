document.addEventListener('DOMContentLoaded', function(event) {

  //TODO: First load default document from somewhere, now it's hardcoded in index.html

  //Set up initial app state
  APP.state = {
    'mode': 'document', //document & text modes, so you can have normal keyboard interaction when editing a propertys text, maybe a tree mode also? would be best if the interactions worked without modes though
    'selection': {
      'elm': null,
      'row': null
    },
    'lastid': 9 //So each new element gets a new unique id
  };

  //TODO: document the doc api, the basic logic is that any edit takes in the current selection and returns a new selection
  APP.state.selection = APP.doc.open(document.querySelector('.document'));

  //TODO: copy input events from elemental-5
  APP.doc.elm.addEventListener('mousedown', APP.pointer.mousedown);
  APP.doc.elm.addEventListener('mouseup', APP.pointer.mouseup);
  APP.doc.elm.addEventListener('click', APP.pointer.click);
  APP.doc.elm.addEventListener('keydown', APP.keyboard.keydown);
});
