//Require selection
//Require config

//TODO: each edit should add something to the undo stack

APP.doc = {
  language: null,
  elm: null, //refers to the dom element that contains this document
  row: {}, //row edit functions
  prop: {}, //property edit functions
  history: {
    index: -1,
    data: []
  },
  'lastid': 9,
};


//File handling
APP.doc.open = function (data) {
  APP.doc.elm = data;
  //TODO: determine language type
  //TODO: parse language styles from language definition

  //TODO: this needs its own module for parsing and stuff
  var cssArray = APP.doc.language.entities.map(function(ent, i) {
    return `
      .e${i} {
        color: ${ent.color};
        margin-left: ${ent.margin[0]}ch;
        margin-right: ${ent.margin[1]}ch;
      }
      .e${i}::before {
        content: '${ent.before}';
      }
      .e${i}::after {
        content: '${ent.after}';
      }
      .e${i}::selection {
        color: white;
        background: ${ent.color};
      }
    `
  });
  var css = '<style>'+cssArray.join('')+'</style>';
  $(APP.doc.elm).prepend(css);


  //TODO: Update ui to match settings
  var newSel = APP.select.element(APP.doc.elm.querySelector('#_0 > :first-child'));
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}
APP.doc.save = function (data) {
}


//History
APP.doc.history.undo = function (sel) {
  if (APP.doc.history.index > 0) {
    APP.doc.history.index = APP.doc.history.index - 1;
    APP.doc.elm.innerHTML = APP.doc.history.data[APP.doc.history.index];
    return APP.select.element(document.querySelector('.focus'));
  }
  return sel;
}

APP.doc.history.redo = function (sel) {
  if (APP.doc.history.index < APP.doc.history.data.length - 1) {
    APP.doc.history.index = APP.doc.history.index + 1;
    APP.doc.elm.innerHTML = APP.doc.history.data[APP.doc.history.index];
    return APP.select.element(document.querySelector('.focus'));
  }
  return sel;
}

APP.doc.history.add = function (data) {
  //TODO: there's something flaky about adding history in the editing functions, sometimes undo skips two steps backwards
  APP.doc.history.data = APP.doc.history.data.slice(0, APP.doc.history.index + 1);
  APP.doc.history.data.push(data);
  APP.doc.history.index = APP.doc.history.index + 1;
}




//Takes selection, returns new selection
APP.doc.row.new = function (sel) {
  //TODO: if the current selection has children, add new first child to it, if it doesn't, add a new sibling, so, indent +1 or indent ==
  var template = APP.config.templates.row;
  var firstProp = $(sel.row).after(template).next().children().first()[0];
  var newSel = APP.select.element(firstProp, sel);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}

APP.doc.row.del = function (sel) {
  var newSel = APP.select.down(sel);
  if (newSel === sel) {
    newSel = APP.select.up(sel);
  }
  $(sel.row).remove();
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}

APP.doc.row.moveUp = function (sel) {
  $row = $(sel.row);
  var $prev = $row.prev();
  if ($prev.length != 0) {
    $row.after($prev);
  }

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}

APP.doc.row.moveDown = function (sel) {
  $row = $(sel.row);
  var $next = $row.next();
  if ($next.length != 0) {
    $row.before($next);
  }

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}

APP.doc.row.indent = function (sel) {
  var indentation = sel.row.firstChild;
  if (indentation.nodeType === 3) {
    indentation.textContent = indentation.textContent + '  '; //TODO: use indentation from config
  } else {
    $(sel.row).prepend('  ');
  }
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indentationing does not modify selection
}
APP.doc.row.outdent = function (sel) {
  var indentation = sel.row.firstChild;
  if (indentation.nodeType === 3) {
    indentation.textContent = indentation.textContent.replace('  ', ''); //TODO: use indentation from config
  }
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indenting does not modify selection
}
APP.doc.row.toggleComment = function (sel) {
  sel.row.classList.toggle('row');
  sel.row.classList.toggle('com');

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indenting does not modify selection
}

APP.doc.prop.new = function (sel, type) {
  var template = APP.config.templates.prop;
  var prop = $(sel.elm).after(template).next()[0];
  if (!type) {
    prop.classList.add('e0');
  } else {
    prop.classList.add('e' + type);
  }
  var newSel = APP.select.element(prop, sel);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}

APP.doc.prop.del = function (sel) {
  var newSel = APP.select.prev(sel);
  var $elm = $(sel.elm);
  if ($elm.siblings().length === 0) {
    $(sel.row).remove();
  } else {
    $(sel.elm).remove();
  }
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}

APP.doc.prop.assign = function (sel, type) {
  var className = sel.elm.className;
  className = className.replace(/e[0-9]/, '');
  sel.elm.className = className;
  sel.elm.classList.add('e' + type);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}
