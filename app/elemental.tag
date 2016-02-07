<elemental>
  <div class="document">
    <row each={row, i in rows} class="row" i={i} row={row} onmousedown={app.input.rowMousedown}></row>
  </div>

  <div class="toolbar">
    <div>
      Add element [<kbd>Cmd + Enter</kbd>]
    </div>
    <div>
      Add attr [<kbd>Alt + Enter</kbd>]
    </div>
    <div>
      Add val [<kbd>Shift + Enter</kbd>]
    </div>
    <div>
      Add text [<kbd> </kbd>]
    </div>
    <div>
      Toggle comment [<kbd> </kbd>]
    </div>
  </div>

  <script>
    this.rows = opts.doc;
    setTimeout(function () {
      //TODO: set focus on .input, use focus event to select all text
      // app.input.selectText();
    }, 0);

    this.on('mount', function() {
      // this.inputTrap.focus();
    });

    this.on('update', function() {
      console.log('--- doc update ---');
      // this.inputTrap.focus();
      setTimeout(function () {
        //TODO: Ugh setTimeout, but I don't know how else to run functions right after mount/update
        // app.input.selectText();
      }, 0);
    });
  </script>
</elemental>


<row>
  <span class="index {hilite: hilite}">{i}</span>
  <div class="props {hilite: hilite} {comment: !enabled}" style="padding-left: {indent}ch">
    <prop each={prop, i in props} if="{i>=INDEX.PROPS}" class="prop" prop={prop} i={i}></prop>
  </div>


  <script>
    this.i = opts.i;
    this.indent = opts.row[INDEX.INDENT] * SYNTAX.TABWIDTH;
    this.enabled = opts.row[INDEX.ENABLED];
    this.type = opts.row[INDEX.TYPE];
    this.props = opts.row;

    if (this.i == app.selection.row.end) {
      app.selection.row.item = this;
      this.hilite = true;
    } else if (this.i.inRange(app.selection.row.end, app.selection.row.start)) {
      this.hilite = false;
    } else {
      this.hilite = false;
    }

    this.on('update', function() {
      console.log(this.hilite);
    });

  </script>
</row>

<prop>
  <input if={focus} class="input {type}" value={text} autofocus onfocus={app.input.focus} onkeydown={app.input.keydown} oninput={app.input.textInput} style="width: {text.length+.5}ch"><span if={!focus} class={type} onmousedown={app.input.propMousedown}>{text}</span>

  <script>
    this.i = opts.i;
    this.prop = opts.prop;
    if (this.i == INDEX.NAME) {
      this.type = 'name';
      this.text = opts.prop;
    } else if (typeof opts.prop == 'string') {
      this.type = 'attr-name'
      this.text = opts.prop;
    } else {
      this.type = 'attr-value'
      this.text = opts.prop[0];
    }
    if (this.parent.parent.hilite && app.selection.col.end == this.i) {
      app.selection.col.item = this;
      this.focus = true;
    } else {
      this.focus = false;
    }

    this.on('update', function(e) {

    });
  </script>
</prop>
