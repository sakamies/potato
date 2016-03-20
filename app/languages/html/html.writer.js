APP.language.write = function (doc) {
  let html = '';
  let selfClosingTags = ['!doctype', 'area','base','br','col','command','embed','hr','img','input','keygen','link','meta','param','source','track','wbr'];
  let endTags = [];
  let commentOpen = false;
  let rows = doc.rows;

  for (let r = 0; r < rows.length; r++) {
    let row = rows[r];
    let tagName = null;
    let selfClosing = false;
    let tagToClose;
    let indentation = row.indentation;
    let indentSpaces = ' '.repeat(indentation);
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
    if (row.props[0].type === 'name') {
      tagName = row.props.shift().text;
      html += `<${tagName}`;
    }
    else if (row.props.length > 0 && row.props[0].type !== 'text') {
      tagName = 'div';
      html += '<div';
    }

    //Add started tag to a list of tags that need closing, but only if the tag is not self closing
    selfClosing = (selfClosingTags.indexOf(tagName) !== -1);
    if (tagName !== null && selfClosing === false) {
      endTags.push({tag: `</${tagName}>`, indentation: indentation});
    }

    //Write out all props, id, classes, attributes, in order
    console.log(row.props);
    if (row.props.length > 0 && row.props[0].type === 'id') {
      let idText = row.props.shift().text;
      html+= ` id="${idText}"`;
    }
    //Iterate over classes
    if (row.props.length > 0 && row.props[0].type === 'class') {
      html+= ` class="${row.props.shift().text}`;
      while (row.props.length > 0 && row.props[0].type === 'class') {
        html+= ` ${row.props.shift().text}`;
      }
      html+= '"';
    }
    //Iterate over attributes
    if (row.props) {
      for (let p = 0; p < row.props.length; p++) {
        let prop = row.props[p];
        if (prop.type === 'attribute') {
          html+= ` ${prop.text}`;
        }
        else if (prop.type === 'value') {
          html+= `="${prop.text}"`;
        }
        //TODO: if text is only spaces, start / end tags for the element should be on the same row, so when reading the file in, the content don't get eaten away
        else if (p === 0) {
          html+= `${prop.text}`;
        } else {
          html+= ` ${prop.text}`; //Text props are separated by a space, just like attrs
        }
      }
    }

    //Close the start tag
    if (tagName !== null) {
      html += '>';
    }

    //Write end tags & close comments
    if (r < rows.length - 1) {
      let nextRow = rows[r+1];
      //Write end tags for rows that are indented more than the next row, comments will be closed according to the tree too, as they are included in tagsToClose, thus elements that are siblings and are both commented, get their own comment blocks
      for (let t = endTags.length - 1; t >= 0; t--) {
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
  for (let i = endTags.length - 1; i >= 0; i--) {
    tagToClose = endTags.pop();
    html += '\n' + ' '.repeat(tagToClose.indentation) + tagToClose.tag;
  }

  console.log(html);
  return html;
};
