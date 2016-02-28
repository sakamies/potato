/*
- iterate over given dom elements
  - iterate over attributes of element
  - iterate over children
    - for each child, recurse
  - return html (or maybe abstracted data format, so any parser can output that and the app can consume that, so a language definition is not tied to the editor dom)
*/

function process_node (domnode, depth) {

  if (!depth) { depth = 0; }

  var propTemplate = APP.config.templates.prop;
  var rowTemplate = APP.config.templates.prop;
  var props = '';
  var row = '';
  var out = '';

  //if domnode is an element
  if (domnode.nodeType === 1) {
    //make props for row
    props += propTemplate.replace('$text', domnode.nodeName.toLowerCase());
    props += domnode.attributes.map(function(attr, i, attrs) {
      var prop = '';
      prop += propTemplate.replace('$text', attr.name).replace('e0', 'e3');
      prop += propTemplate.replace('$text', attr.value).replace('e0', 'e4');
      return prop
    }).join('');

    //make row
    row = rowTemplate.replace('$prop', props);
    row = row.replace('0ch', depth + 'ch');

    out += row;

    //recurse over children, if there are any and add to output after row
    if (domnode.childNodes.length != 0) {
      for (var childNum = 0; childNum < domnode.childNode.length; childNum++) {
        out += process_node(domnode.childNode[childNum], depth+1);
      }
    }
  }

  // if domnode is text
  else if (domnode.nodeType === 3) {
    //render text as the first prop
    props = prop.replace('$text', domnode.textContent); //Need escaping?

    //make row
    row = rowTemplate.replace('$prop', props);
    row = row.replace('0ch', depth + 'ch');
  }

  //if domnode is a comment
  else if (domnode.nodeType === 8) {
    //take comment contents and parse as html, but output the rows as commented out rows
    //make dom node (document.createElement or zepto $()?)
    //add content text as its innerhtml
    //run process_node on that dom node
    //add comment class to all rows that were returned
  }

  //if domnode is doctype
  else if (domnode.nodeType === 10) {
    props += propTemplate.replace('$text', 'doctype');
    props += propTemplate.replace('$text', domnode.name).replace('e0', 'e5');

    //make row
    row = rowTemplate.replace('$prop', props);
    row = row.replace('0ch', depth + 'ch');
  }

  //if domnode is a full document or document fragment node, recurse over children
  else if (domnode.nodeType === 10 || domnode.nodeType === 11) {
    for (var childNum = 0; childNum < domnode.childNode.length; childNum++) {
      out += process_node(domnode.childNode[childNum], depth+1);
    }
  }


  out += var row = '';;

  return out;
}
