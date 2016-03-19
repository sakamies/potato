//TODO: make APP.language object into html-simple.json and load that as APP.language.conf object and leave the parsing functions in html-simple.js
//TODO: language spec and app needs some smarts about what kind of props are allowed where, like a row that starts with text prop can't have element name and stuff after it. So like some kinda more general way to define a structure, so the app can visually show what's wonky
APP.language.parse = function (string) {
  //console.log('parse()', string)
  var rows = HTMLstring(string);
  var doc = {
    language: 'html-simple',
    rows: rows
  }
  return doc;

  function HTMLstring (htmltext, depth, commented) {
    var rows = [];
    if (!depth) {
      depth = 0;
    }
    if (htmltext.indexOf('<!DOCTYPE') != -1 || htmltext.indexOf('<!doctype') != -1) {
      inputDom = document.implementation.createHTMLDocument('');
      inputDom.documentElement.innerHTML = htmltext;
      rows = rows.concat(domNode(inputDom, depth, commented));
    } else {
      inputDom = document.createElement('template');
      inputDom.innerHTML = htmltext;
      rows = rows.concat(domNode(inputDom.content, depth, commented));
    }
    return rows;
  };
  function domNode (domnode, depth, commented) {
    //takes a domnode (that can have children), returns an array of rows
    var rows = [];
    if (domnode.nodeType === 1) {
      rows = rows.concat(elementNode(domnode, depth, commented));
    }
    else if (domnode.nodeType === 3 && !domnode.textContent.match(/^\s*\n\s*$/)) {
      var textRow = textNode(domnode, depth, commented);
      if (textRow) {
        rows = rows.concat(textRow);
      }
    }
    else if (domnode.nodeType === 8) {
      rows = rows.concat(commentNode(domnode, depth, commented));
    }
    else if (domnode.nodeType === 10) {
      rows = rows.concat(doctypeNode(domnode, depth, commented));
    }
    //if domnode is a full document or document fragment node, recurse over children
    else if (domnode.nodeType === 9 || domnode.nodeType === 11) {
      rows = rows.concat(documentNode(domnode, depth, commented));
    }

    return rows;
  };
  function elementNode (elNode, depth, commented) {
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
        rows = rows.concat(domNode(elNode.childNodes[childNum], depth+1, commented));
      }
    }
    return rows;
  };
  function textNode (textNode, depth, commented) {
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
  };
  function commentNode (commentNode, depth, commented) {
    var rows = [];
    var comment = commentNode.textContent;
    commented = true;
    rows = rows.concat(HTMLstring(comment, depth, commented));
    return rows;
  };
  function doctypeNode (doctypeNode, depth, commented) {
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
  };
  function documentNode (docNode, depth, commented) {
    var rows = [];
    if (docNode.childNodes.length != 0) {
      for (var childNum = 0; childNum < docNode.childNodes.length; childNum++) {
        rows = rows.concat(domNode(docNode.childNodes[childNum], depth, commented));
      }
    }
    return rows;
  };

};