//Require selection
//Require config

//TODO: each edit should add something to the undo stack

APP.doc = {
  elm: null, //refers to the dome element that contains this document
  row: {}, //row edit functions
  prop: {}, //property edit functions
  history: {
    index: 0,
    data: []
  } //undo stack //TODO: write a simple manager
};


//File handling
APP.doc.open = function (data) {
  APP.doc.elm = data;
  APP.doc.history.add(data.innerHTML);
}
APP.doc.save = function (data) {
}


//History
APP.doc.history.undo = function (sel) {
  if (APP.doc.history.index > 1) {
    APP.doc.history.index = APP.doc.history.index - 1;
    APP.doc.elm.innerHTML = APP.doc.history.data[APP.doc.history.index];
    return APP.select.element(document.querySelector('.focus'));
  }
  return sel;
}

APP.doc.history.redo = function () {
}

APP.doc.history.add = function (data) {
  console.log('add history')
  //TODO: there's something flaky about adding history in the editing functions, sometimes undo skips two steps backwards
  APP.doc.history.data = APP.doc.history.data.slice(0, APP.doc.history.index + 1);
  APP.doc.history.data.push(data);
  APP.doc.history.index = APP.doc.history.index + 1;
  //console.log(APP.doc.history.index, APP.doc.history.data)
}




//Takes selection, returns new selection
APP.doc.row.new = function (sel) {
  APP.doc.history.add(APP.doc.elm.innerHTML);

  var template = APP.config.templates.row;
  var firstProp = $(sel.row).after(template).next().children().first()[0];

  return APP.select.element(firstProp, sel);
}

APP.doc.row.del = function (sel) {
  APP.doc.history.add(APP.doc.elm.innerHTML);

  var newSel = APP.select.down(sel);
  if (newSel === sel) {
    newSel = APP.select.up(sel);
  }
  $(sel.row).remove();

  return newSel;
}

APP.doc.row.moveUp = function (sel) {
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}

APP.doc.row.moveDown = function (sel) {
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}

APP.doc.row.indent = function (sel) {
  APP.doc.history.add(APP.doc.elm.innerHTML);

  var indentation = sel.row.firstChild;
  if (indentation.nodeType === 3) {
    indentation.textContent = indentation.textContent + '  '; //TODO: use indentation from config
  } else {
    $(sel.row).prepend('  ');
  }

  return sel; //indentationing does not modify selection
}

APP.doc.row.outdent = function (sel) {
  APP.doc.history.add(APP.doc.elm.innerHTML);

  var indentation = sel.row.firstChild;
  if (indentation.nodeType === 3) {
    indentation.textContent = indentation.textContent.replace('  ', ''); //TODO: use indentation from config
  }

  return sel; //indenting does not modify selection
}

APP.doc.prop.new = function (sel) {
  APP.doc.history.add(APP.doc.elm.innerHTML);

  var template = APP.config.templates.prop;
  var prop = $(sel.elm).after(template).next()[0];

  return APP.select.element(prop, sel);
}

APP.doc.prop.del = function (sel) {
  APP.doc.history.add(APP.doc.elm.innerHTML);

  var newSel = APP.select.prev(sel);
  var $elm = $(sel.elm);
  if ($elm.siblings().length === 0) {
    $(sel.row).remove();
  } else {
    $(sel.elm).remove();
  }

  return newSel;
}
