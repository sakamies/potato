//Require selection
//Require config

APP.doc = {
  elm: null,
  row: {},
  prop: {}
};

APP.doc.open = function () {
  // TODO
}
APP.doc.save = function () {
  // TODO
}

//Takes selection, returns new selection
APP.doc.row.new = function (sel) {
  var template = APP.config.templates.row;
  var firstProp = $(sel.row).after(template).next().children().first()[0];
  return APP.select.element(firstProp, sel);
}
APP.doc.row.del = function (sel) {

}
APP.doc.row.moveUp = function (sel) {

}
APP.doc.row.moveDown = function (sel) {

}
APP.doc.row.indent = function (sel) {
  var indentation = sel.row.firstChild;
  if (indentation.nodeType === 3) {
    indentation.textContent = indentation.textContent + '  '; //TODO: use indentation from config
  } else {
    $(sel.row).prepend('  ');
  }
  return sel; //indentationing does not modify selection
}
APP.doc.row.outdent = function (sel) {
  var indentation = sel.row.firstChild;
  if (indentation.nodeType === 3) {
    indentation.textContent = indentation.textContent.replace('  ', ''); //TODO: use indentation from config
  }
  return sel; //indenting does not modify selection
}

APP.doc.prop.new = function (sel) {
  var template = APP.config.templates.prop;
  var prop = $(sel.elm).after(template).next()[0];
  return APP.select.element(prop, sel);
}
APP.doc.prop.del = function (sel) {
  var newSel = APP.select.prev(sel);
  var $elm = $(sel.elm);
  if ($elm.siblings().length === 0) {
    $(sel.row).remove();
  } else {
    $(sel.elm).remove();
  }
  return newSel;
}
