//TODO: make APP.language object into html-simple.json and load that as APP.language.conf object and leave the parsing functions in html-simple.js
//TODO: language spec and app needs some smarts about what kind of props are allowed where, like a row that starts with text prop can't have element name and stuff after it
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

      //TODO: does not output the lang="en" attribute on html tag! maybe it borks the first attribute in the doc or the browser somehow ignores the tag?

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
        row = {
          commented: false,
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
        //TODO: how to handle the case where there's like "<span></span>text", so there's no whitespace after a tag. Since the text will be on its own row that no whitespace situation should probably be noted somehow, maybe with the >< whitespace eating crocodiles syntax. Also if there's some text and then a line break, should the line break + whitespace be cleaned up?
        //Handle whitespace only nodes
        //ignore text that's just a line break + tabs/spaces
        if (!domnode.textContent.match(/^\s*\n\s*$/)) {
          props.push({
            type: 'text',
            text: domnode.textContent.trim(),
          });
          row = {
            commented: false,
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
      }

      //if domnode is doctype
      else if (domnode.nodeType === 10) {
        props.push({
          type: 'name',
          text: '!doctype'
        });
        props.push({
          type: 'text',
          text: domnode.name
        });
        row = {
          commented: false,
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
    console.log('html-simple.stringify', doc);

    var html = '';
    var self_closing_tags = ['!doctype', 'area','base','br','col','command','embed','hr','img','input','keygen','link','meta','param','source','track','wbr'];
    var openTags = [];
    var rows = doc.rows;

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var firstProp = row.props[0];
      var tagName = null;
      var selfClosing = false;
      var rowToClose;
      var indentation = row.indentation;

      if (r > 0) { html += '\n'}
      html += ' '.repeat(indentation);

      //Start tag if the row doesn't start with text
      if (firstProp.type === 'name') {
        html += `<`;
        tagName = firstProp.text;
      } else if (firstProp.type !== 'text') {
        html += '<div';
        tagName = 'div';
      }

      //add started tag to open tags so they can be closed later
      selfClosing = self_closing_tags.indexOf(tagName) !== -1
      if (tagName !== null && selfClosing === false) {
        openTags.push({tagName: tagName, indentation: indentation});
      }

      //Write out all props
      //TODO: check for !DOCTYPE tagName and uppercase it
      for (var p = 0; p < row.props.length; p++) {
        var prop = row.props[p];
        if (prop.type === 'name') {
          html+= `${prop.text}`;
        }
        if (prop.type === 'id') {
          html+= ` id="${prop.text}"`;
        }
        if (prop.type === 'class') {
          html+= ` class="${prop.text}"`;
        }
        if (prop.type === 'attribute') {
          html+= ` ${prop.text}`;
        }
        if (prop.type === 'value') {
          html+= `="${prop.text}"`;
        }
        if (p > 0 && prop.type === 'text') {
          html+= ` ${prop.text}`; //separate text props inside tags and multiple text props on a row with a space, so you can add any code as text inside a tag if you like
        } else if (prop.type === 'text') {
          html+= `${prop.text}`;
        }
      }

      //end tag
      if (tagName !== null) {
        html += '>';
      }

      //close tags that are indented more than the next row
      if (r < rows.length - 1) {
        var nextRow = rows[r+1];
        for (var t = openTags.length - 1; t >= 0; t--) {
          if (nextRow.indentation <= openTags[t].indentation) {
            //TODO: make closeRow into its own function
            rowToClose = openTags.pop();
            html += '\n' + ' '.repeat(rowToClose.indentation) + `</${rowToClose.tagName}>`;
            console.log('nextRow', nextRow, 'rowToClose', rowToClose);
            if (nextRow.indentation == rowToClose.indentation) {
              break;
            }
          }
        }
      }
    }

    //close all unclosed tags after writing all rows
    for (var i = openTags.length - 1; i >= 0; i--) {
      rowToClose = openTags.pop();
      html += '\n' + ' '.repeat(rowToClose.indentation) + `</${rowToClose.tagName}>`;
    }

    console.log(html);
    return html;
  }
};





