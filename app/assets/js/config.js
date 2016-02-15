APP.config = {
};

//TODO: make color scheming possibble by giving a color map in the format: {'color': ['things','that','this','color','applies','to']} like {'#f92772': ['html.name', 'css.selector']}
APP.config.colors = [
  '#f8f8f2', //light
  '#828380', //lightgray
  '#75715e', //gray1
  '#49483E', //gray2
  '#383830', //gray3
  '#272822', //dark
  '#f92772', //red
  '#be84ff', //purple
  '#a6e22d', //green
  '#e6db74', //yellow
  '#f6aa10', //orange
  '#66d9ef', //blue
]
APP.config.templates = {
  'prop': '<i class=""> </i>',
  'row': '<div id="" class="row"><i class="e0"> </i></div>'
}
APP.config.indentation = '  '; //TODO: use this in the indent handler

//TODO: load language from somewhere separately and have some config UI

APP.config.keymap = {

};


// // Pointer, for tracking mouse button down state etc

// POINTER = {};
// POINTER.DOWN = false;
// POINTER.UPDATE = function (event) {
//   //TODO: update POINTER.DOWN based on passed event
// }
