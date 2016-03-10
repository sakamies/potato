APP.input.keypress = function (event) {
  event.preventDefault();
}
APP.input.keydown = function (event) {
  var sel = APP.selection;
  var keydef = keysight(event); //TODO: use as module
  var key = keydef.key;
  var char = keydef.char;
  var context = APP.input.getContext(event);
  var mod = APP.input.getKeyModifiers(event);
  var keymap = APP.input.getKeymap(key, context, mod);

  for (action in keymap) {
    if (
        keymap.hasOwnProperty(action) &&
        keymap[action].keypress &&
        keymap[action].context
    ) {
      //TODO: check if action returns a new selection and modify selection only if it does
      console.log('action', action+':', keymap[action]);
      var newSel = APP.actions[action](key, context, sel);
      if (keymap[action].preventDefault) {
        event.preventDefault();
      }
    }
  }
  APP.selection = newSel || sel;
}

APP.input.textInput = function (event) {
  //TODO: use getContext here too so the important bits can be scoped to editing a props text
  var sel = APP.selection;
  var selElmType = APP.doc.prop.getType(sel.elm);
  //var whitelist = /[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]/; //TODO: whitelisted or blacklisted characters should be based on language definition
  //Like blacklisting startsWith & endsWith characters inside a prop, then highlighting them
  var textContent = sel.elm.textContent;
  var textSel = window.getSelection();
  var textRange = textSel.getRangeAt(0);
  var allSelected = sel.elm.textContent.length === textRange.startOffset + textRange.endOffset

  sel = APP.doc.prop.validate(sel);

  //if prop is of default type, try figuring out what type the user wants by looking at the first typed character(s?)
  if (textContent.length < 3 && selElmType === 0) {
    for (var i = 0; i < APP.language.types.length; i++) {
      if (APP.language.types[i].startsWith.indexOf(textContent) !== -1) {
        sel = APP.doc.prop.init(sel);
        sel = APP.doc.prop.setType(sel, i);
        APP.selection = sel;
        return;
      }
    }
  }
  //if the prop has some content, check the last char of the prop to determine if the user wants to start a new prop of some type
  else if (textContent.length > 1) {
    var lastChar = textContent.substring(textContent.length - 1);
    var nextType = APP.language.types[selElmType].endsWith.indexOf(lastChar);

    if (nextType !== -1) {
      nextType = APP.language.types[selElmType].next[nextType];
      for (var i = 0; i < APP.language.types.length; i++) {
        if (APP.language.types[i].name === nextType) {
          sel.elm.innerHTML = textContent.substr(0, textContent.length - 1);
          sel = APP.doc.prop.new(sel, i);
          APP.selection = sel;
          return;
        }
      }
    }
  }
}
