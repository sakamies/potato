//Require selection
//Require config

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
APP.doc.new = function (language) {
  var newDoc = document.querySelector('#empty-document').content.querySelector('.document');
  return APP.doc.open(newDoc);
}
APP.doc.open = function (data) {
  var doc = document.querySelector('.document');
  doc.innerHTML = $(data).html();
  APP.doc.elm = doc;

  //TODO: determine language type
  //TODO: parse language styles from language definition

  //TODO: reading a file in should generate ids for rows

  //TODO: this needs its own module for parsing and stuff
  var cssArray = APP.doc.language.entities.map(function(ent, i) {
    return `
      .e${i} {
        color: ${ent.color};
        margin-left: ${ent.spacing[0]}ch;
        margin-right: ${ent.spacing[1]}ch;
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
  //TODO: Update helper ui/toolbar to match settings

  var newSel = APP.select.element(APP.doc.elm.querySelector('.rows > :first-child'));
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}
APP.doc.save = function (sel) {
  localStorage.setItem('document', APP.doc.elm.outerHTML);
  return sel;
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
  APP.doc.history.data = APP.doc.history.data.slice(0, APP.doc.history.index + 1);
  APP.doc.history.data.push(data);
  APP.doc.history.index = APP.doc.history.index + 1;
}



//Takes selection, returns new selection
APP.doc.row.new = function (sel) {
  //TODO: if the current selection has children, add new first child to it, if it doesn't, add a new sibling, so, indent +1 or indent ==
  var indentation = parseInt(sel.row.style.marginLeft);
  var nextIndentation = parseInt($(sel.row).next().css('margin-left'));
  if (nextIndentation && indentation < nextIndentation) {
    indentation = nextIndentation;
  }
  var template = APP.config.templates.row.replace('0ch', indentation + 'ch');
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
  sel.row.remove();
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
  sel.row.style.marginLeft = (parseInt(sel.row.style.marginLeft) + 2) + 'ch';
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indentationing does not modify selection
}
APP.doc.row.outdent = function (sel) {
  sel.row.style.marginLeft = (parseInt(sel.row.style.marginLeft) - 2) + 'ch';
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indenting does not modify selection
}
APP.doc.row.toggleComment = function (sel) {
  sel.row.classList.toggle('row');

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indenting does not modify selection
}

APP.doc.prop.getType = function (elm) {
  if (APP.utils.elementIsProp(elm)) {
    var typeClass = elm.className.match(/e[0-9]/)[0];
    var type = parseInt(typeClass.substring(1));
    return type; //number that matches the index of the entity in the language definition
  } else {
    return false;
  }
}
APP.doc.prop.new = function (sel, type) {
  console.log('prop.new()');
  var template = APP.config.templates.prop;
  var prop;

  if (APP.utils.elementIsRow(sel.elm)) {
    sel = APP.select.element(sel.elm.lastChild, sel);
  }
  prop = $(sel.elm).after(template).next()[0];
  if (!type) {
    prop.classList.add('e0');
  } else {
    prop.classList.add('e' + type);
  }
  sel = APP.select.next(sel);
  sel = APP.select.text(sel);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}
APP.doc.prop.init = function (sel) {
  sel.elm.innerHTML = '';
  newSel = APP.select.element(sel.elm);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}
APP.doc.prop.del = function (sel) {
  if (sel.row.children.length === 0) {
    sel.row.remove();
  } else {
    sel.elm.remove();
  }
  APP.doc.history.add(APP.doc.elm.innerHTML);
  //TODO: on selection, if elm & row are null, when pressing down, select first thing in document, when pressing up, select last thing in document
  return {elm: null, row: null};
}
APP.doc.prop.delBW = function (sel) {
  var prev = APP.select.prev(sel);
  var next;

  if (prev !== sel) {
    APP.doc.prop.del(sel);
    return prev;
  } else {
    next = APP.select.next(sel);
    if (next !== sel) {
      APP.doc.prop.del(sel);
      return next;
    }
  }
  return APP.doc.prop.init(sel);
}
APP.doc.prop.delFW = function (sel) {
  var next = APP.select.next(sel);
  var prev;

  if (next !== sel) {
    APP.doc.prop.del(sel);
    return next;
  } else {
    prev = APP.select.prev(sel);
    if (prev !== sel) {
      APP.doc.prop.del(sel);
      return prev;
    }
  }
  return APP.doc.prop.init(sel);
}

APP.doc.prop.setType = function (sel, type) {
  if (type === -1) {type = 9};
  if (type < APP.doc.language.entities.length) {
    var className = sel.elm.className;
    className = className.replace(/e[0-9]/, '');
    sel.elm.className = className;
    sel.elm.classList.add('e' + type);
    APP.doc.history.add(APP.doc.elm.innerHTML);
  }
  return sel;
}
