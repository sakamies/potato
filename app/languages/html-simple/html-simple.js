//TODO: make APP.language object into html-simple.json and load that as APP.language.conf object and leave the parsing functions in html-simple.js
//TODO: language spec and app needs some smarts about what kind of props are allowed where, like a row that starts with text prop can't have element name and stuff after it. So like some kinda more general way to define a structure, so the app can visually show what's wonky
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
  parseElementNode: function (elNode, depth, commented) {
    var rows = [];
    var props = [];
    props.push({
      type: 'name',
      text: elNode.nodeName.toLowerCase()
    });

    for (var atidx = 0; atidx < elNode.attributes.length; atidx++) {
      props.push({
        type: 'attribute',
        text: elNode.attributes[atidx].name
      });
      props.push({
        type: 'value',
        text: elNode.attributes[atidx].value
      });
    };
    row = {
      commented: commented,
      indentation: depth * APP.config.view.indentation,
      props: props
    };
    rows.push(row);

    //recurse over children, if there are any and add to output after row
    if (elNode.childNodes.length != 0) {
      for (var childNum = 0; childNum < elNode.childNodes.length; childNum++) {
        rows = rows.concat(APP.language.parseNode(elNode.childNodes[childNum], depth+1, commented));
      }
    }
    return rows;
  },
  parseTextNode: function (textNode, depth, commented) {
    //TODO: how to handle the case where there's like "<span></span>text", so there's no whitespace after a tag. Since the text will be on its own row that no whitespace situation should probably be noted somehow, maybe with the >< whitespace eating crocodiles syntax. Also if there's some text and then a line break, should the line break + whitespace be cleaned up?
    //TODO: handle whitespace inside pre, code, textarea (etc?) elements somehow. Check ['pre', 'code'].indexOf(parentNode.nodeName)
    var props = [];
    var row = {};
    var rows = [];
    props.push({
      type: 'text',
      text: textNode.textContent.trim(),
    });
    row = {
      commented: commented,
      indentation: depth * APP.config.view.indentation,
      props: props
    };
    rows.push(row);
    return rows;
  },
  parseCommentNode: function (commentNode, depth, commented) {
    var rows = [];
    var comment = commentNode.textContent;
    commented = true;
    rows = rows.concat(APP.language.parseHTML(comment, depth, commented));
    return rows;
  },
  parseDoctypeNode: function (doctypeNode, depth, commented) {
    var props = [];
    var row = {};
    var rows = [];
    props.push({
      type: 'name',
      text: '!doctype'
    });
    props.push({
      type: 'text',
      text: doctypeNode.name
    });
    row = {
      commented: commented,
      indentation: depth * APP.config.view.indentation,
      props: props
    };
    rows.push(row);
    return rows;
  },
  parseDocumentNode: function (docNode, depth, commented) {
    var rows = [];
    if (docNode.childNodes.length != 0) {
      for (var childNum = 0; childNum < docNode.childNodes.length; childNum++) {
        rows = rows.concat(APP.language.parseNode(docNode.childNodes[childNum], depth, commented));
      }
    }
    return rows;
  },
  parseNode: function (domnode, depth, commented) {
    //takes a domnode (that can have children), returns an array of rows
    var rows = [];
    if (domnode.nodeType === 1) {
      rows = rows.concat(APP.language.parseElementNode(domnode, depth, commented));
    }
    else if (domnode.nodeType === 3 && !domnode.textContent.match(/^\s*\n\s*$/)) {
      var textRow = APP.language.parseTextNode(domnode, depth, commented);
      if (textRow) {
        rows = rows.concat(textRow);
      }
    }
    else if (domnode.nodeType === 8) {
      rows = rows.concat(APP.language.parseCommentNode(domnode, depth, commented));
    }
    else if (domnode.nodeType === 10) {
      rows = rows.concat(APP.language.parseDoctypeNode(domnode, depth, commented));
    }
    //if domnode is a full document or document fragment node, recurse over children
    else if (domnode.nodeType === 9 || domnode.nodeType === 11) {
      rows = rows.concat(APP.language.parseDocumentNode(domnode, depth, commented));
    }

    return rows;
  },
  parseHTML: function (htmltext, depth, commented) {
    var rows = [];
    if (!depth) {
      depth = 0;
    }
    if (htmltext.indexOf('<!DOCTYPE') != -1 || htmltext.indexOf('<!doctype') != -1) {
      inputDom = document.implementation.createHTMLDocument('');
      inputDom.documentElement.innerHTML = htmltext;
      rows = rows.concat(APP.language.parseNode(inputDom, depth, commented));
    } else {
      inputDom = document.createElement('template');
      inputDom.innerHTML = htmltext;
      rows = rows.concat(APP.language.parseNode(inputDom.content, depth, commented));
    }
    return rows;
  },
  parse: function (string) {
    //console.log('parse()', string)
    var rows = APP.language.parseHTML(string);
    var doc = {
      language: 'html-simple',
      rows: rows
    }
    return doc;
  },
  stringify: function (doc) {
    var html = '';
    var selfClosingTags = ['!doctype', 'area','base','br','col','command','embed','hr','img','input','keygen','link','meta','param','source','track','wbr'];
    var endTags = [];
    var commentOpen = false;
    var rows = doc.rows;

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var firstProp = row.props[0];
      var tagName = null;
      var selfClosing = false;
      var tagToClose;
      var indentation = row.indentation;
      var indentSpaces = ' '.repeat(indentation);

      //Open comment if necessary
      if (row.commented && commentOpen === false) {
        html += '\n' + indentSpaces + '<!--';
        commentOpen = true;
        endTags.push({tag: '-->', indentation: indentation});
      }

      //Add indentation before tag/text
      if (r === 0) {
        html += indentSpaces;
      } else {
        html += '\n' + indentSpaces;
      }

      //Start tag if the row doesn't start with text
      if (firstProp.type === 'name') {
        html += `<`;
        tagName = firstProp.text;
      } else if (firstProp.type !== 'text') {
        html += '<div';
        tagName = 'div';
      }

      selfClosing = selfClosingTags.indexOf(tagName) !== -1
      //Add started tag to a list of tags that need closing
      if (tagName !== null && selfClosing === false) {
        endTags.push({tag: `</${tagName}>`, indentation: indentation});
      }

      //Write out all props
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
        //TODO: if text is only spaces, start / end tags for the element should be on the same row, so when reading the file in, the content don't get eaten away
        if (p === 0 && prop.type === 'text') {
          html+= `${prop.text}`;
        } else if (prop.type === 'text') {
          html+= ` ${prop.text}`; //Text props are separated by a space on any row
        }
      }

      //Close the start tag
      if (tagName !== null) {
        html += '>';
      }

      //Write end tags & close comments
      if (r < rows.length - 1) {
        var nextRow = rows[r+1];
        //Write end tags for rows that are indented more than the next row, comments will be closed according to the tree too, as they are included in tagsToClose, thus elements that are siblings and are both commented, get their own comment blocks
        for (var t = endTags.length - 1; t >= 0; t--) {
          if (nextRow.indentation <= endTags[t].indentation) {
            tagToClose = endTags.pop();
            html += '\n' + ' '.repeat(tagToClose.indentation) + tagToClose.tag;
            if (tagToClose.tag === '-->') {
              commentOpen = false;
            }
          } else {
            break;
          }
        }
      }
    }

    //close all unclosed tags after writing all rows
    for (var i = endTags.length - 1; i >= 0; i--) {
      tagToClose = endTags.pop();
      html += '\n' + ' '.repeat(tagToClose.indentation) + tagToClose.tag;
    }

    console.log(html);
    return html;
  }
};
