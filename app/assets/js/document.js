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

APP.doc.init = function () {
  APP.doc.elm.addEventListener('mousedown', APP.pointer.mousedown);
  APP.doc.elm.addEventListener('mouseup', APP.pointer.mouseup);
  APP.doc.elm.addEventListener('click', APP.pointer.click);
  APP.doc.elm.addEventListener('dblclick', APP.pointer.doubleclick);
  APP.doc.elm.addEventListener('keydown', APP.input.keydown);
  APP.doc.elm.addEventListener('input', APP.input.input);
}

//TODO: open/save/createDom etc should probably be its own file, maybe document.js and editing.js for functions editing the document
//File handling
APP.doc.new = function (language) {
  $.get('/languages/html-simple/html-simple.html', function(response){
    var sel = APP.doc.open(response);
    APP.doc.init();
    APP.selection = sel;
  });
}
APP.doc.open = function (data) {
  if (!data) {
    data = localStorage.getItem('potato-doc');
  }
  var doc = APP.language.parse(data);
  var dom = APP.doc.createDom(doc);
  $('.document').replaceWith(dom);
  APP.doc.elm = document.querySelector('.document');
  APP.doc.language = doc.language;

  //TODO: determine language type
  //TODO: reading a file in should generate ids for rows after the input file has been parsed, also generate row numers and have add/remove for row nums when adding o removing rows from doc

  //TODO: Generate helper ui/toolbar to match settings, something like css vocabulary would be cool

  var newSel = APP.select.element(APP.doc.elm.querySelector('.rows > :first-child'));
  APP.doc.history.add(APP.doc.elm.innerHTML);
  APP.doc.init();
  return newSel;
}
APP.doc.save = function () {
  //TODO: parse .document dom into abstact object format
  var saveText = APP.language.stringify(APP.doc.elm);
  localStorage.setItem('potato-doc', saveText);
}
APP.doc.createDom = function (doc) {
  //takes in doc as object, returns rows as dom
  //TODO: actually returns html, not dom, make it return dom?
  /*
    //doc object spec:
    {
      language: string
      rows: [
        {
          indentation: integer
          commented: boolean
          props: [
            type: integer
            text: string
          ]
        }
      ]
    }
  */
  var rows = doc.rows;
  var row;
  var elm;

  var outDoc = APP.config.templates.doc;
  var outRows = '';
  var outRow;
  var outProp;

  for (var i = 0; i < rows.length; i++) {
    row = rows[i];
    outRow = '';

    for (var j = 0; j < row.props.length; j++) {
      //TODO: move creating the prop into its own function
      //TODO: if prop is whitespace only, highlight it somehow
      //TODO: check prop against its type whitelist, refactor prop.validate() so it can be used here too
      prop = row.props[j];
      outProp = '';
      outProp = APP.config.templates.prop.replace('$type', `type-${prop.type}`);
      outProp = outProp.replace('$text', prop.text);
      outRow += outProp;
    }

    outRow = APP.config.templates.row.replace('$prop', outRow);
    outRow = outRow.replace('0ch', row.indentation + 'ch');
    outRows += outRow;
  }

  outDoc = outDoc.replace('$class', `document ${doc.language}`);
  outDoc = outDoc.replace('$rows', outRows);
  return outDoc;
}


//TODO: input actions should trigger history instead of app.doc.something functions, so if the app internally composes editing functions, it shouldn't create many history entries
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
  //TODO: use app.doc.prop.new here instead of repeating code
  var indentation = APP.doc.row.getIndentation(sel.row);
  var nextIndentation = APP.doc.row.getIndentation($(sel.row).next()[0]);
  if (nextIndentation && indentation < nextIndentation) {
    indentation = nextIndentation;
  }
  var propTemplate = APP.config.templates.prop.replace('$text', '');
  propTemplate = propTemplate.replace('$type', APP.language.defaultType);
  var rowTemplate = APP.config.templates.row.replace('$prop', propTemplate);
  rowTemplate = rowTemplate.replace('0ch', indentation + 'ch');
  var firstProp = $(sel.row).after(rowTemplate).next().children().first()[0];
  var newSel = APP.select.element(firstProp, sel);
  newSel = APP.select.text(newSel);
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
  sel.elm.blur();
  sel.elm.focus();

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}

APP.doc.row.moveDown = function (sel) {
  $row = $(sel.row);
  var $next = $row.next();
  if ($next.length != 0) {
    $row.before($next);
  }
  sel.elm.blur();
  sel.elm.focus();

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}

APP.doc.row.getIndentation = function (row) {
  if (row) {
    return parseInt(row.style.paddingLeft);
  } else {
    return null;
  }
}
APP.doc.row.setIndentation = function (row, indentation) {
  row.style.paddingLeft = indentation + 'ch';
}
APP.doc.row.indent = function (sel) {
  var indentation = APP.doc.row.getIndentation(sel.row);
  APP.doc.row.setIndentation(sel.row, indentation + 2);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indentationing does not modify selection
}
APP.doc.row.outdent = function (sel) {
  var indentation = APP.doc.row.getIndentation(sel.row);
  if (indentation > 0) {
    APP.doc.row.setIndentation(sel.row, indentation - 2);
    APP.doc.history.add(APP.doc.elm.innerHTML);
  }
  return sel; //indenting does not modify selection
}
APP.doc.row.toggleComment = function (sel) {
  sel.row.classList.toggle('comment');

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel; //indenting does not modify selection
}

APP.doc.prop.getType = function (elm) {
  console.log('getType()', elm);
  var type = elm.className.split(' ');
  type = type.find(function(item) {
    console.log('type.find()', item, item.match(/^type-/));
    return item.match(/^type-/);
  });
  console.log('type is', type);
  return type.substring(5);
}
APP.doc.prop.new = function (sel, type) {
  console.log('prop.new()', sel, type);
  var template = APP.config.templates.prop.replace('$text', '');
  var newProp;

  if (APP.utils.elementIsRow(sel.elm)) {
    console.log('add prop to row');
    newProp = $(sel.elm).append(template).children().last()[0];
    sel = APP.select.element(newProp, sel);
  } else {
    console.log('add prop after prop');
    newProp = $(sel.elm).after(template).next()[0];
    sel = APP.select.element(newProp, sel);
  }

  if (!type) {
    APP.doc.prop.setType(sel, APP.language.defaultType);
    console.log('no type given', sel)
  } else {
    APP.doc.prop.setType(sel, type);
    console.log('has type', sel, type)
  }

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
  console.log('setType()', sel, type)
  var className = sel.elm.className;
  className = className.replace(/(type-[a-z0-9]*)|(\$type)/ig, `type-${type}`);
  sel.elm.className = className;
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return sel;
}
