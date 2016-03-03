//TODO: make app.language object into html-simple.json and load that as APP.language.conf object and leave the parsing functions in html-simple.js
APP.language = {
  id: 'html-simple',
  name: 'HTML Simple',
  url: 'http://potato?',
  //TODO: move syntax rendering to a css file that's named after the language
  'defaultType': 'name',
  'typeShortcuts': {1:'name', 2:'id', 3:'class', 4:'attribute', 5:'value', 6:'text'},
  types: {
    'name': { //the first one is the default type
      color: '#f92772',
      startsWith: [],
      contains: '', //TODO: this should probably be a regexp, an array of characters is kinda unwieldy, for now, it's only used to check if the entity can be whitespace only or not
      endsWith: [' ', '.', '#'],
      next: ['attribute', 'class', 'id'],
      before: '', //always render this text before an entity of this type
      after: '', //always render this text after an entity of this type
      spacing: [0,0],
    },
    'id': {
      color: '#be84ff',
      startsWith: ['#'],
      contains: '',
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
      before: '#',
      after: '',
      spacing: [0,0],
    },
    'class': {
      color: '#f6aa10',
      startsWith: ['.'],
      contains: '',
      endsWith: ['.', ' ', '#'],
      next: ['class', 'attribute', 'id'],
      before: '.',
      after: '',
      spacing: [0,0],
    },
    'attribute': {
      color: '#a6e22d',
      startsWith: [],
      contains: '',
      endsWith: [':', ' '],
      next: ['value', 'value'],
      before: '',
      after: ':',
      spacing: [1,0],
    },
    'value': {
      color: '#e6db74',
      startsWith: ['"'],
      contains: ' ',
      endsWith: ['"', ' '],
      next: ['attribute', 'value'],
      before: '',
      after: '',
      spacing: [0,0],
    },
    'text': {
      color: '#ffffff',
      startsWith: [' '],
      contains: ' ',
      endsWith: [],
      next: ['text'],
      before: '',
      after: '',
      spacing: [0,0],
    },
  },
  parse: function (text) {
    /*
      Language parsing needs to return an object in this format:
      {
        language: html-simple
        rows: [
          {
            indentation: integer
            commented: boolean
            props: [
              {
                type: integer
                text: string
              }
            ]
          }
        ]
      }
    */

    function process_node (domnode, depth) {
      //takes a domnode (that can have children), returns a bunch of potato rows
      //TODO: handle whitespace only nodes (eg. line breaks between well indented html) somehow nicely

      if (!depth) { depth = 0; }

      var props = [];
      var row = {};
      var rows = [];

      //if domnode is an element
      //TODO: make a function for each, element, text, comment, doctype & document/fragment
      if (domnode.nodeType === 1) {
        props.push({
          type: 'name',
          text: domnode.nodeName.toLowerCase()
        });

        for (var atidx = 0; atidx < domnode.attributes.length; atidx++) {
          props.push({
            type: 'attribute',
            text: domnode.attributes[atidx].name
          });
          props.push({
            type: 'value',
            text: domnode.attributes[atidx].value
          });
        };

        //TODO: make a functions for creating a row to keep it DRY creating the row into a function
        console.log('depth', depth);
        row = {

          indentation: depth * APP.config.view.indentation,
          props: props
        };
        rows.push(row);

        //recurse over children, if there are any and add to output after row
        if (domnode.childNodes.length != 0) {
          for (var childNum = 0; childNum < domnode.childNodes.length; childNum++) {
            rows = rows.concat(process_node(domnode.childNodes[childNum], depth+1));
          }
        }
      }

      // if domnode is text
      else if (domnode.nodeType === 3) {
        props.push({
          type: 'text',
          text: domnode.textContent
        });
        row = {
          indentation: depth,
          props: props
        };
        rows.push(row);
      }

      //if domnode is a comment
      else if (domnode.nodeType === 8) {
        //take comment contents and parse as html, but output the rows as commented out rows
        //make dom node (document.createElement or zepto $()?)
        //add content text as its innerhtml
        //run process_node on that dom node
        //add comment class to all rows that were returned
        return {indentation: 0, commented: true, props: [{type: 5, text: 'TODO: comments'}]};
      }

      //if domnode is doctype
      else if (domnode.nodeType === 10) {
        props.push({
          type: 'name',
          text: '!doctype'
        });
        props.push({
          type: 'text',
          text: ' ' + domnode.name
        });
        row = {
          indentation: depth,
          props: props
        };
        rows.push(row);
      }

      //if domnode is a full document or document fragment node, recurse over children
      else if (domnode.nodeType === 9 || domnode.nodeType === 11) {
        if (domnode.childNodes.length != 0) {
          for (var childNum = 0; childNum < domnode.childNodes.length; childNum++) {
            rows = rows.concat(process_node(domnode.childNodes[childNum], depth+1));
          }
        }
        return rows;
      }
      return rows;
    }

    var inputDom = null;
    var rows = [];
    if (text.indexOf('<!DOCTYPE') != -1) {
      inputDom = document.implementation.createHTMLDocument('');
      inputDom.documentElement.innerHTML = text;
      rows = process_node(inputDom);
    } else {
      inputDom = document.createElement('template');
      inputDom.innerHTML = text;
      rows = process_node(inputDom.content);
    }
    var doc = {
      language: 'html-simple',
      rows: rows
    }
    return doc;
  },
  stringify: function (doc) {
    //TODO: parse abstract object format to plain html
    var rows = doc.querySelectorAll('.row');
    var outRows = [];
    var out = {};

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var outRow = {indentation: 0, commented: false, props: []};
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
