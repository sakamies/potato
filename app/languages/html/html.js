//TODO: make APP.language object into html-simple.json and load that as APP.language.conf object and leave the parsing functions in html-simple.js
//TODO: language spec and app needs some smarts about what kind of props are allowed where, like a row that starts with text prop can't have element name and stuff after it. So like some kinda more general way to define a structure, so the app can visually show what's wonky
APP.language = {
  id: 'html',
  name: 'HTML',
  url: 'https://repo.url.here',
  defaultType: 'name',
  //TODO: replace shortcut key numbers with  startswith keys
  shortcuts: {1:'name', 2:'id', 3:'class', 4:'attribute', 5:'value', 6:'text'},
  types: {
    name: {
      whitelist: '[A-Za-z]*',
      startsWith: ['%'],//TODO: startsWith should maybe be a function that gets what the user typed and some other document context info and returns if the prop the user is editing should be of this type
      prev: [null], //means there can be no prev
      endsWith: [' ', '#', '.'],
      next: ['attribute', 'id', 'class'],
    },
    id: {
      //In CSS, identifiers (including element names, classes, and IDs in selectors) can contain only the characters [a-zA-Z0-9] and ISO 10646 characters U+00A1 and higher, plus the hyphen (-) and the underscore (_); they cannot start with a digit, or a hyphen followed by a digit. Identifiers can also contain escaped characters and any ISO 10646 character as a numeric code (see next item). For instance, the identifier "B&W?" may be written as "B\&W\?" or "B\26 W\3F".
      whitelist: '-?[_a-zA-Z]+[_a-zA-Z0-9-]*',
      startsWith: ['#', 'id:'],
      prev: ['name', null],
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
    },
    class: {
      whitelist: '-?[_a-zA-Z]+[_a-zA-Z0-9-]*',
      startsWith: ['.', 'class:'],
      prev: ['name', 'id', 'class', null],
      endsWith: [' ', '.'],
      next: ['attribute', 'class'],
    },
    attribute: {
      whitelist: '-?[_a-zA-Z]+[_a-zA-Z0-9-]*',
      startsWith: [':'],
      prev: ['name', 'id', 'class', 'attribute'],
      endsWith: [':', ' '],
      next: ['value', 'value', 'attribute'],
    },
    value: {
      whitelist: '',
      startsWith: ['"'],
      //TODO: add something like "dependsOn: {prev: ['attribute']}", so if you delete an attribute, the value goes with it. Comes in handy with css too, where deleting a property should delete its value
      prev: ['attribute'],
      endsWith: ['"', ' '],
      next: ['attribute'],
    },
    text: {
      whitelist: '',
      startsWith: [' '],
      prev: [null],
      endsWith: [],
      next: [null], //prev & next are null, thus text must be the only prop on the row
      //TODO: when trying to add a prop to this kind of row, create a new row with a new prop instead
    },
  }
};
