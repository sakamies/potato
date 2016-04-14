//TODO: make this something like APP.edit.prop


APP.doc.prop.getType = function (elm) {
  if (elm) {
    let type = elm.className.split(' ');
    type = type.find(function(item) {
      return item.match(/^type-/);
    });
    return type.substring(5);
  } else {
    return null;
  }
}
APP.doc.prop.new = function (sel, type) {
  let template = APP.config.templates.prop.replace('$text', '');
  let newProp;
  let newSel;

  if (APP.utils.elementIsRow(sel.elm)) {
    newProp = $(sel.elm).append(template).children().last()[0];
    newSel = APP.select.element(newProp, sel);
  } else {
    newProp = $(sel.elm).after(template).next()[0];
    newSel = APP.select.element(newProp, sel);
  }

  if (!type) {
    APP.doc.prop.setType(newSel, APP.language.defaultType);
  } else {
    APP.doc.prop.setType(newSel, type);
  }

  newSel = APP.select.text(newSel);

  APP.doc.history.add(APP.doc.elm.innerHTML);
  return newSel;
}
APP.doc.prop.init = function (sel, type) {
  let newSel = sel;
  sel.elm.innerHTML = '';
  if (type) {
    newSel = APP.doc.prop.setType(sel, type);
  }
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
  let prev = APP.select.prev(sel);
  let next;

  //TODO: make APP.doc.prop.prev() and .next functions so this logic doesn't need to be repeadet, it's needed both when selecting and when deleting stuff
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
  let next = APP.select.next(sel);
  let prev;

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
  if (type) {
    let className = sel.elm.className;
    className = className.replace(/(type-[a-z0-9]*)|(\$type)/ig, `type-${type}`);
    sel.elm.className = className;
    APP.doc.history.add(APP.doc.elm.innerHTML);
  }
  return sel;
}
APP.doc.prop.validate = function (sel, whitelist) {
  let newSel = sel;
  //TODO: check whitelist and highlight characters that are not on it
  //TODO: if prop is empty, delete it and select prev or next
  if (APP.utils.elementIsProp(sel.elm)) {
    //TODO: make the guts of this function into a more generic function so it can be used inside doc2dom function too
    let text = sel.elm.textContent;
    //check if element is only whitespace and highlight if it is
    if (text === '') {
      newSel = APP.doc.prop.delBW(sel);
    } else if (text.match(/^\s+$/)) {
      sel.elm.classList.add('hilite');
    } else {
      sel.elm.classList.remove('hilite');
    }
  } else {
    newSel = sel;
  }
  return newSel;
}
