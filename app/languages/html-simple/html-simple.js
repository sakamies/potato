//TODO: make app.language object into html-simple.json and load that as APP.language.conf object and leave the parsing functions in html-simple.js
APP.language = {
  id: 'html-simple',
  name: 'HTML Simple',
  url: 'https://repo.url.here',
  'defaultType': 'name',
  'shortcuts': {1:'name', 2:'id', 3:'class', 4:'attribute', 5:'value', 6:'text'},
  types: {
    'name': {
      startsWith: [],
      whitelist: '[A-Za-z]*',
      endsWith: [' ', '.', '#'],
      next: ['attribute', 'class', 'id'],
    },
    'id': {
      startsWith: ['#'],
      //In CSS, identifiers (including element names, classes, and IDs in selectors) can contain only the characters [a-zA-Z0-9] and ISO 10646 characters U+00A1 and higher, plus the hyphen (-) and the underscore (_); they cannot start with a digit, or a hyphen followed by a digit. Identifiers can also contain escaped characters and any ISO 10646 character as a numeric code (see next item). For instance, the identifier "B&W?" may be written as "B\&W\?" or "B\26 W\3F".
      whitelist: '-?[_a-zA-Z]+[_a-zA-Z0-9-]*',
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
    },
    'class': {
      startsWith: ['.'],
      whitelist: '-?[_a-zA-Z]+[_a-zA-Z0-9-]*',
      endsWith: ['.', ' ', '#'],
      next: ['class', 'attribute', 'id'],
    },
    'attribute': {
      startsWith: [],
      whitelist: '',
      endsWith: [':', ' '],
      next: ['value', 'value'],
    },
    'value': {
      startsWith: ['"'],
      whitelist: '',
      escapeText: true, //TODO: should this be a regexp too? escape everything, or just a whitelist or blacklist?
      endsWith: ['"', ' '],
      next: ['attribute', 'value'],
    },
    'text': {
      startsWith: [' '],
      whitelist: '',
      escapeText: true,
      endsWith: [],
      next: ['text'],
    },
  },
  parse: function (text) {
    /*
      Language parsing needs to return an object in this format:
      {
        language: string
        rows: [
          {
            indentation: integer
            commented: boolean
            props: [
              {
                type: string
                text: string
              }
            ]
          }
        ]
      }
    */

    function process_node (domnode, depth) {
      //takes a domnode (that can have children), returns a bunch of potato rows

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
        //Handle whitespace only nodes
        //ignore text that's just a line break + tabs/spaces
        //TODO: how to handle the case where there's like "<span></span>text", so there's no whitespace after a tag. Since the text will be on its own row with indentation +1, that no whitespace situation should probably be noted somehow, maybe with the >< whitespace eating crocodiles syntax. Also if there's some text and then a line break, should the line break + whitespace be cleaned up?
        if (!domnode.textContent.match(/^\s*\n\s*$/)) {
          props.push({
            type: 'text',
            text: domnode.textContent
          });
          row = {
            indentation: depth * APP.config.view.indentation,
            props: props
          };
          rows.push(row);
        }
      }

      //if domnode is a comment
      else if (domnode.nodeType === 8) {
        console.log('comment node')
        //TODO: take comment contents and parse as html, but output the rows as commented out rows
        //make dom node (document.createElement or zepto $()?)
        //add content text as its innerhtml
        //run process_node on that dom node
        //add comment class to all rows that were returned
        //var comment = document.createElement('template');
        //comment.innerHTML = domnode.nodeValue;
        // rows = process_node(inputDom.content);
        props.push({
          type: 'text',
          text: domnode.textContent
        });
        row = {
          commented: true,
          indentation: depth * APP.config.view.indentation,
          props: props
        };
        rows.push(row);
        console.log(row)
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
          indentation: depth * APP.config.view.indentation,
          props: props
        };
        rows.push(row);
      }

      //if domnode is a full document or document fragment node, recurse over children
      else if (domnode.nodeType === 9 || domnode.nodeType === 11) {
        if (domnode.childNodes.length != 0) {
          for (var childNum = 0; childNum < domnode.childNodes.length; childNum++) {
            rows = rows.concat(process_node(domnode.childNodes[childNum], 0));
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
    /*
      doc spec
      {
        language: string
        rows: [
          {
            indentation: integer
            commented: boolean
            props: [
              {
                type: string
                text: string
              }
            ]
          }
        ]
      }
    */

    var text = '';
    for (var i = 0; i < doc.rows.length; i++) {
      /*TODO:
        check first prop, if type is name, write '<name ' and make a note somewhere that it's open
        if first prop type is id or class, write '<div ' and do the same as with name
          iterate props
            if prop is id, write 'id="prop.text"'
            if prop is class, write 'class="prop.text"'
            if prop is attr, write 'prop.text='
            if prop is value, write '"prop.text"';
            if prop is text, output text as is
        if first prop is text, iterate over props and output as is
        if doctype, write '<!DOCTYPE 2nd-prop.textContent>'
      */
      //TODO: language spec and app needs some smarts about what kind of props are allowed where, like a row that starts with text prop can't have element name and stuff after it
      doc.rows[i];
    }

    return text;
  }
};
