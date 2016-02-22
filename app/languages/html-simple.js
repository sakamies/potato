//TODO: on app launch, construct a map of type name to type index, so it's easier and faster to refer to types by name in code
APP.language = {
  id: 'html-simple',
  name: 'HTML Simple',
  url: 'http://potato?',
  tokens: [
    { //the first entity is the default type
      name: 'name',
      color: '#f92772',
      startsWith: [],
      contains: '', //TODO: this should probably be a regexp, an array of characters is kinda unwieldy, for now, it's only used to check if the entity can be whitespace only or not
      endsWith: [' ', '.', '#'],
      next: ['attribute', 'class', 'id'],
      before: '', //always render this text before an entity of this type
      after: '', //always render this text after an entity of this type
      spacing: [0,0],
    },
    {
      name: 'id',
      color: '#be84ff',
      startsWith: ['#'],
      contains: '',
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
      before: '#',
      after: '',
      spacing: [0,0],
    },
    {
      name: 'class',
      color: '#f6aa10',
      startsWith: ['.'],
      contains: '',
      endsWith: ['.', ' ', '#'],
      next: ['class', 'attribute', 'id'],
      before: '.',
      after: '',
      spacing: [0,0],
    },
    {
      name: 'attribute',
      color: '#a6e22d',
      startsWith: [],
      contains: '',
      endsWith: [':', ' '],
      next: ['value', 'value'],
      before: '',
      after: ':',
      spacing: [1,0],
    },
    {
      name: 'value',
      color: '#e6db74',
      startsWith: ['"'],
      contains: ' ',
      endsWith: ['"', ' '],
      next: ['attribute', 'value'],
      before: '',
      after: '',
      spacing: [0,0],
    },
    {
      name: 'text',
      color: '#ffffff',
      startsWith: [' '],
      contains: ' ',
      endsWith: [],
      next: ['text'],
      before: '',
      after: '',
      spacing: [0,0],
    },
  ],
  parse: function (text) {
    //takes in text as this definitions text format, returns rows
    var doc = JSON.parse(text);
    var rows = doc.rows;
    var row;
    var elm;

    var outRows = '';
    var outRow;
    var outProp;

    for (var i = 0; i < rows.length; i++) {
      row = rows[i];
      outRow = '';

      for (var j = 0; j < row.elms.length; j++) {
        elm = row.elms[j];
        outProp = '';
        outProp = APP.config.templates.prop.replace('e0', 'e'+elm.type);
        outProp = outProp.replace('$text', elm.text);
        outRow += outProp;
      }

      outRow = APP.config.templates.row.replace('$prop', outRow);
      outRow = outRow.replace('0ch', row.indentation + 'ch');
      outRows += outRow;
    }

    return outRows;
  },
  stringify: function (doc) {
    //Takes in the dom from the editor, outputs it as the text format that the open function can parse
    var rows = doc.querySelectorAll('.row');
    var outRows = [];
    var out = {};

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var outRow = {indentation: 0, commented: false, elms: []};
      if (row.classList.contains('com')) {
        outRow.commented = true;
      }
      rowElms = rows[i].querySelectorAll('i');
      outRow.indentation = APP.doc.row.getIndentation(row);
      for (var j = 0; j < rowElms.length; j++) {
        var elm = rowElms[j];
        var outElm = {
          type: APP.doc.prop.getType(elm),
          text: elm.textContent,
        }
        outRow.elms.push(outElm);
      }
      outRows.push(outRow);
    }

    var out = {rows: outRows};
    return JSON.stringify(out);
  }
};
