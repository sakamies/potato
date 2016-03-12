//TODO: make this something like APP.edit.prop


APP.doc.prop.getType = function (elm) {
  var type = elm.className.split(' ');
  type = type.find(function(item) {
    return item.match(/^type-/);
  });
  return type.substring(5);
}
APP.doc.prop.new = function (sel, type) {
  var template = APP.config.templates.prop.replace('$text', '');
  var newProp;
  var newSel;

  if (APP.utils.elementIsRow(sel.elm)) {
    newProp = $(sel.elm).append(template).children().last()[0];
    newSel = APP.select.element(newProp, sel);
  } else {
    newProp = $(sel.elm).after(template).next()[0];
    newSel = APP.select.element(newProp, sel);
  }

  if (!type) {
    APP.doc.prop.setType(newSel, APP.language.defaultType);
    console.log('no type given', newSel)
  } else {
    APP.doc.prop.setType(newSel, type);
    console.log('has type', newSel, type)
  }

  newSel = APP.select.text(newSel);

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}
APP.doc.prop.init = function (sel) {
  sel.elm.innerHTML = '';
  newSel = APP.select.element(sel.elm);
  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}
APP.doc.prop.del = function (sel) {
  if (sel.row.children.length === 1) {
    sel.row.remove();
  } else {
    sel.elm.remove();
  }
  APP.doc.history.add(APP.doc.elm.innerHTML);
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
APP.doc.prop.validate = function (sel, whitelist) {
  //TODO: check whitelist and highlight characters that are not on it
  //TODO: if prop is empty, delete it and select prev or next
  if (APP.utils.elementIsProp(sel.elm)) {
    //TODO: make the guts of this function into a more generic function so it can be used inside doc2dom function too
    var text = sel.elm.textContent;
    //check if element is only whitespace and highlight if it is
    if (text.match(/^\s+$/) || text === '') {
      sel.elm.classList.add('hilite');
    } else {
      sel.elm.classList.remove('hilite');
    }
  }
  return sel;
}
