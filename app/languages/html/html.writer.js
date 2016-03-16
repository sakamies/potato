APP.language.write = function (doc) {
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
    if (r > 0) { indentSpaces = '\n' + indentSpaces }

    //Open comment if necessary
    if (row.commented && commentOpen === false) {
      html += indentSpaces + '<!--';
      commentOpen = true;
      endTags.push({tag: '-->', indentation: indentation});
    }

    //Add indentation before tag/text
    html += indentSpaces;

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
        html+= ` ${prop.text}`; //Text props are separated by a space, just like attrs
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
};
