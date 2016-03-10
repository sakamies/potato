APP.config = {
};

APP.config.view = {
  'word-wrap': true,
  'indentation': 2, //how many spaces for indentation
}

APP.config.templates = {
  'prop': '<i class="$type">$text</i>',
  'row': '<div id="" class="row" style="padding-left: 0ch">$prop</div>',
  'doc': '<div data-lang="$lang" class="$class"><style></style><div class="rownums"></div><div class="rows">$rows</div></div>',
}
