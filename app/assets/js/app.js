document.addEventListener('DOMContentLoaded', function(event) {

  //TODO: First load default document from somewhere, now it's hardcoded in index.html

  APP.doc.elm = document.querySelector('.document'); //TODO: parse document from some data, preferably read in some HAML

  //Set up initial app state
  APP.state = {
    'mode': 'document', //document & text modes, so you can have normal keyboard interaction when editing a propertys text, maybe a tree mode also? would be best if the interactions worked without modes though
    'lastid': 9 //So each new element gets a new unique id
  };

  //Select first property of first row
  APP.state.selection = APP.select.element(APP.doc.elm.querySelector('#_0 > :first-child'));

  //TODO: copy input events from elemental-5
  APP.doc.elm.addEventListener('click', APP.click);
  APP.doc.elm.addEventListener('keydown', APP.keyboard.keydown);
});
