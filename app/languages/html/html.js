//TODO: make APP.language object into html-simple.json and load that as APP.language.conf object and leave the parsing functions in html-simple.js
//TODO: language spec and app needs some smarts about what kind of props are allowed where, like a row that starts with text prop can't have element name and stuff after it. So like some kinda more general way to define a structure, so the app can visually show what's wonky
APP.language = {
  id: 'html',
  name: 'HTML',
  url: 'https://repo.url.here',
  defaultType: 'name',
  shortcuts: {1:'name', 2:'id', 3:'class', 4:'attribute', 5:'value', 6:'text'},
  types: {
    name: {
      startsWith: [],
      whitelist: '[A-Za-z]*',
      endsWith: [' ', '.', '#'],
      next: ['attribute', 'class', 'id'],
    },
    id: {
      startsWith: ['#'],
      //In CSS, identifiers (including element names, classes, and IDs in selectors) can contain only the characters [a-zA-Z0-9] and ISO 10646 characters U+00A1 and higher, plus the hyphen (-) and the underscore (_); they cannot start with a digit, or a hyphen followed by a digit. Identifiers can also contain escaped characters and any ISO 10646 character as a numeric code (see next item). For instance, the identifier "B&W?" may be written as "B\&W\?" or "B\26 W\3F".
      whitelist: '-?[_a-zA-Z]+[_a-zA-Z0-9-]*',
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
    },
    class: {
      startsWith: ['.'],
      whitelist: '-?[_a-zA-Z]+[_a-zA-Z0-9-]*',
      endsWith: ['.', ' ', '#'],
      next: ['class', 'attribute', 'id'],
    },
    attribute: {
      startsWith: [],
      whitelist: '',
      endsWith: [':', ' '],
      next: ['value', 'value'],
    },
    value: {
      startsWith: ['"'],
      whitelist: '',
      escapeText: true, //TODO: should this be a regexp too? escape everything, or just a whitelist or blacklist?
      endsWith: ['"', ' '],
      next: ['attribute', 'value'],
    },
    text: {
      startsWith: [' '],
      whitelist: '',
      escapeText: true,
      endsWith: [],
      next: ['text'],
    },
  }
};
