APP.input.keypress = function (event) {
  event.preventDefault();
}
APP.input.keydown = function (event) {
  //TODO: this keydown handler could be abstracted to some sort of action runner in the actions.js, so I could use an action say like APP.actions('selectUp', key, context, sel); so I could then add for example a 'selectTo' action and a selectTo entry to the keymap, which would then become actionmap and have pointer events too.
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
  let sel = APP.selection;
  let types = APP.language.types;
  let selElmType = APP.doc.prop.getType(sel.elm);
  let textContent = sel.elm.textContent;
  let textSel = window.getSelection();
  let textRange = textSel.getRangeAt(0);
  let allSelected = sel.elm.textContent.length === textRange.startOffset + textRange.endOffset

  //sel = APP.doc.prop.validate(sel);

  //try figuring out the type the user wants based on language rules
  for (let typeName in types) {
    let type = types[typeName];
    let startStringMatch = type.startsWith.indexOf(textContent) !== -1;
    let prevTypeName = APP.doc.prop.getType(sel.elm.previousSibling);
    let prevTypeMatch = type.prev.indexOf(prevTypeName) !== -1;
    if (startStringMatch && prevTypeMatch) {
      sel = APP.doc.prop.init(sel, typeName);
      return;
    }
  }
  //if the prop has some content, check the last char of the prop to determine if the user wants to start a new prop of some type
  if (textContent.length > 1) {
    let char = textContent.substring(textContent.length - 1);
    let nextTypeName = types[selElmType].endsWith.indexOf(char);
    nextTypeName = types[selElmType].next[nextTypeName];
    if (nextTypeName in types) {
      sel.elm.innerHTML = textContent.substr(0, textContent.length - 1);
      sel = APP.doc.prop.new(sel, nextTypeName);
      APP.selection = sel;
    }
  }

  APP.selection = sel;
}
