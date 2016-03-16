//Require selection
//Require config

APP.doc = {
  language: null,
  elm: null, //dom element that contains this document
  rowsElm: null, //dom element that contains rows
  row: {}, //row edit functions
  prop: {}, //property edit functions
};

/*
  Internal abstract data format for the document is this:
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

APP.doc.init = function () {
  APP.doc.elm.addEventListener('mousedown', APP.pointer.mousedown);
  APP.doc.elm.addEventListener('mouseup', APP.pointer.mouseup);
  APP.doc.elm.addEventListener('click', APP.pointer.click);
  APP.doc.elm.addEventListener('dblclick', APP.pointer.doubleclick);
  APP.doc.elm.addEventListener('keydown', APP.input.keydown);
  APP.doc.elm.addEventListener('input', APP.input.textInput);
}

//TODO: dom2doc & doc2dom should be a function APP.doc.rows(), without parameters, it should return dom2doc result and with a paameter of a potato document js object, it should return doc2dom. Then all row editing functions would be a part of that function. Ugh, maybe.
APP.doc.new = function (language) {
  //var defaultUrl = '/languages/html/html.html';
  var defaultUrl = '/languages/html/html.sample.html';
  //var defaultUrl = '/languages/html/html-amazon.com.html';
  $.get(defaultUrl, function(response){
    var sel = APP.doc.open(response);
    APP.doc.init();
    APP.selection = sel;
  });
}
APP.doc.open = function (data) {
  if (!data) {
    data = localStorage.getItem('potato-html');
  }
  var doc = APP.language.parse(data);
  var dom = APP.doc.doc2dom(doc);
  $('.document').replaceWith(dom);
  APP.doc.elm = document.querySelector('.document');
  APP.doc.language = doc.language;

  //TODO: determine language type
  //TODO: reading a file in should generate ids for rows after the input file has been parsed, also generate row numers and have add/remove for row nums when adding o removing rows from doc

  //TODO: Generate helper ui/toolbar to match settings, something like css vocabulary would be cool

  var newSel = APP.select.element(APP.doc.elm.querySelector('.rows > :first-child'));
  APP.doc.history.add(APP.doc.elm.innerHTML);
  APP.doc.init();
  return newSel;
}
APP.doc.doc2dom = function (doc) {
  //takes in doc as object, returns rows as dom
  //TODO: actually returns html, not dom, make it return dom?
  /*
    //doc object spec:
    {
      language: string
      rows: [
        {
          indentation: integer
          commented: boolean
          props: [
            type: string
            text: string
          ]
        }
      ]
    }
  */
  var rows = doc.rows;
  var row;
  var elm;

  var outDoc = APP.config.templates.doc;
  var outRows = '';
  var outRow;
  var outProp;

  for (var i = 0; i < rows.length; i++) {
    row = rows[i];
    outRow = '';

    for (var j = 0; j < row.props.length; j++) {
      //TODO: move creating the prop into its own function
      //TODO: check prop against its type whitelist, refactor prop.validate() so it can be used here too
      prop = row.props[j];
      outProp = '';
      if (prop.text.match(/^\s+$/) || prop.text === '') {
        outProp = APP.config.templates.prop.replace('$type', `type-${prop.type} hilite`);
      } else {
        outProp = APP.config.templates.prop.replace('$type', `type-${prop.type}`);
      }
      outProp = outProp.replace('$text', prop.text);
      outRow += outProp;
    }

    outRow = APP.config.templates.row.replace('$prop', outRow);
    if (row.commented) {
      outRow = outRow.replace('row', 'row comment');
    }
    outRow = outRow.replace('0ch', row.indentation + 'ch');
    outRows += outRow;
  }

  outDoc = outDoc.replace('$class', 'document');
  outDoc = outDoc.replace('$lang', doc.language);
  outDoc = outDoc.replace('$rows', outRows);
  return outDoc;
}

APP.doc.save = function (dest) {
  //console.log('doc.save()', !dest);
  //TODO: should take in a parameter on where to save
  //TODO: parse .document dom into abstact object format
  var doc = APP.doc.dom2doc(APP.doc.elm);
  var html = APP.language.write(doc);
  if (!dest) {
    localStorage.setItem('potato-html', html);
    console.log(localStorage.getItem('potato-html', html));
  }
}
APP.doc.dom2doc = function (dom) {
  //Takes in dom from editor, returns doc as object
  var language  = $(dom).data('lang');
  var doc = {'language': language, 'rows': []}

  $(dom).find('.row').each(function(index, rowEl) {
    var props = []
    $(rowEl).children().each(function(index, propEl) {
      props.push({
        type: APP.doc.prop.getType(propEl),
        text: propEl.textContent, //TODO: escape or don't escape text content based on language config (APP.language.types[type].escapeText)
      });
    });

    //TODO: make commenting & indentation into functions that are like row.comment & row.indentation that take their get/set actions as parameters, so there's a jquery style api for editing the document
    if (rowEl.classList.contains('comment')) {
      var commented = true;
    }
    var row = {
      'indentation': APP.doc.row.getIndentation(rowEl),
      'commented': commented,
      'props': props,
    };
    doc.rows.push(row);

  });

  //console.log('dom2doc', dom, doc);
  return doc;
}

