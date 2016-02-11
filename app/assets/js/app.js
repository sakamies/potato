APP = {};

document.addEventListener('DOMContentLoaded', function(event) {

  //TODO: First load default document from somewhere, now it's hardcoded in index.html

  //Set up initial app state
  APP.state = {
    'mode': 'document', //document & property modes, so you can have normal keyboard interaction when editing a propertys text
    //'selection': {
      //'row': document.querySelector('#_0'),
      //'elm':
      //'farthest': 0, // TODO: So you don't reset your column even if you go through a few rows that have only one column or so
    //}
  };

  //Select first property of first row
  APP.state.selection = APP.select.element(document.querySelector('#_0 > :first-child'));

  //TODO: copy input events from elemental-5
  document.addEventListener('click', APP.click);
  document.addEventListener('keydown', APP.keyboard.keydown);
});
