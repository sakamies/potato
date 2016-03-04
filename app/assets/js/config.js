APP.config = {
};

APP.config.view = {
  'word-wrap': true,
  'indentation': 2, //how many spaces for indentation
}

//TODO: color theming? something like .tmtheme format?
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
  'prop': '<i class="$type">$text</i>',
  'row': '<div id="" class="row" style="padding-left: 0ch">$prop</div>',
  'doc': '<div data-lang="$lang" class="$class"><style></style><div class="rownums"></div><div class="rows">$rows</div></div>',
}
