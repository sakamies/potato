
//Keyboard globals, although not all are constants

KEY = {};
KEY.UP = 38;
KEY.DOWN = 40;
KEY.LEFT = 37;
KEY.RIGHT = 39;
KEY.TAB = 9;
KEY.ENTER = 13;
KEY.BACKSPACE = 8;
KEY.SHIFT = false;
KEY.ALT = false;
KEY.CTRL = false;
KEY.META = false;
KEY.MODIFIERS = false;

KEY.UPDATE = function (event) {
  KEY.SHIFT = event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey;
  KEY.ALT = !event.shiftKey && event.altKey && !event.ctrlKey && !event.metaKey;
  KEY.CTRL = !event.shiftKey && !event.altKey && event.ctrlKey && !event.metaKey;
  KEY.META = !event.shiftKey && !event.altKey && !event.ctrlKey && event.metaKey;
  KEY.MODIFIERS = event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
}



// Pointer, for tracking mouse button down state etc

POINTER = {};
POINTER.DOWN = false;
POINTER.UPDATE = function (event) {
  //TODO: update POINTER.DOWN based on passed event
}



INDEX = {};
INDEX.INDENT = 0;
INDEX.ENABLED = 1;
INDEX.TYPE = 2;
INDEX.PROPS = 3;
INDEX.TEXT = 3;
INDEX.NAME = 3;
INDEX.ATTS = 4;



//Node type constant come direct from the browser, built in
//Node.ELEMENT_NODE and so on
//https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType



//Config how to display names, attrs, etf

SYNTAX = {};
//TODO: add syntax for tag start, tag end, props start, props end
SYNTAX.TABWIDTH = 2;
SYNTAX.INDENTATION = ' ';
SYNTAX.EQUALS = ':';
SYNTAX.QUOTES = [' "','"'];
SYNTAX.JOIN = ',';

// HTML style attrs and values
// SYNTAX = {};
// SYNTAX.INDENTATION = '  ';
// SYNTAX.EQUALS = '=';
// SYNTAX.QUOTES = ['"','"'];
// SYNTAX.JOIN = ' ';


//State for ui classes in html and stuff

STATE = {};
STATE.FOCUS = 'focus';
STATE.HILITE = 'hilite';
STATE.SELECTED = 'selected';
