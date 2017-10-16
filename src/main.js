grapesjs.plugins.add('gjs-plugin-customrte', (editor, opts = {}) => {
  let c = opts;
  
  let rte;
  let defaults = {
    // CkEditor options
    options: {},
    
        // On which side of the element to position the toolbar
        // Available options: 'left|center|right'
    position: 'left',
  };


  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }
  editor.setCustomRte({
    enable(el, rte) {
      // If already exists I'll just focus on it
      //if(rte && rte.status != 'destroyed') {
      //console.log(rte)
      if(rte) {
        this.focus(el, rte);
      	return rte;
      }
     
      el.contentEditable = true;
      


      let rteToolbar = editor.RichTextEditor.getToolbarEl();
      [].forEach.call(rteToolbar.children, (child) => {
        //child.style.display = 'none';
        
        
        $(child).on("click", function() { 
          var doc = editor.Canvas.getBody().ownerDocument;
          var el = $(this);
          var comm = el.data('edit');
          var args = el.data('args');
          if (args) {
            args = args.replace('${content}', doc.getSelection());
            execCommand(doc, comm, args);
          } else {
            doc.execCommand(comm);
          }
          saveSelection();
        })
        
      });
      editor.RichTextEditor.add('PlaceHolder', {
        command: 'PlaceHolder',
        class: 'fa fa-plus-square-o',
        title: 'PlaceHolder',
      });  
      $( 'a[title="PlaceHolder"]').click(function() {
        
        var modal = editor.Modal;
        modal.setTitle("Please Select Available Token");

        modal.setContent('<select id="customVariable"></select><br /><button id="sbm">submit</button>')
        //var p = parseURL(window.location.href).args
        var p = c.param
        $('#customVariable').append($('<option>', { 
          value: "",
          text : 'Please Select' 
        }));
        $.each(p, function (i, item) {
          if(i != "" || Object.keys(i).length > 0){
            $('#customVariable').append($('<option>', { 
                value: item,
                text : i 
            }));
          }
        });
        modal.open();

        $("#sbm").on("click", function() { 
          
          el.contentEditable = true;
          //editor.trigger("customAdd")
          //model.set('content', document.querySelector("#customVariable").value);
          //console.log(document.querySelector("#customVariable").value)
          var canvasDoc = editor.Canvas.getBody().ownerDocument;
          // Insert text at the current pointer position
          //el.execCommand('insertHTML', false, '<p>a</p>');
          var val =  $('#customVariable').val()
          if(val != ""){
            //canvasDoc.execCommand("insertText", false, $('#customVariable').val());
            canvasDoc.execCommand("insertHTML", false, '<span data-gjs-removable="false" contenteditable="false">[[$' + $('#customVariable').val() + ']]</span>')
            //var model = editor.getModel()
            //model.setContent(val)
          }
          modal.close()
        })
      });
      
      //rte = editor.RichTextEditor
      this.focus(el, rte);
      this.rte = rte
      return rte;
    },

    disable(el, rte) {
      el.contentEditable = false;
      if(rte && rte.focusManager)
        rte.focusManager.blur(true);
    },

    focus(el, rte) {
      // Do nothing if already focused
      if (rte && rte.focusManager.hasFocus) {
        return;
      }
    
      el.contentEditable = true;
      rte && rte.focus();
    },
  });



  var selectedRange;
  let getCurrentRange = function getCurrentRange() {
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
  }
  let saveSelection = function saveSelection() {
    selectedRange = getCurrentRange();
  }

  let execCommand = function execCommand(doc, commandWithArgs, valueArg) {
    var commandArr = commandWithArgs.split(' '),
        command = commandArr.shift(),
        args = commandArr.join(' ') + (valueArg || '');
    //document.execCommand("insertHTML", false, "<span class='own-class'>"+ document.getSelection()+"</span>");
    try{
    editor.get(0).ownerDocument.execCommand("styleWithCSS", false, true);
    editor.get(0).ownerDocument.execCommand(command, 0, args);
    }catch(err){
      doc.execCommand("styleWithCSS", false, true);
      doc.execCommand(command, 0, args);
    }
    updateToolbar();
    editor.trigger('change');
    console.log(this)
  }


  // Parse a URL into its parts
  let parseURL = function(url)
  {
      var p = document.createElement('a');

      p.href = url;

      var obj = {
          'protocol' : p.protocol,
          'hostname' : p.hostname,
          'port' : p.port,
          'pathname' : p.pathname,
          'search' : p.search,
          'query' : p.search.substring(1),
          'args' : parseStr(p.search.substring(1)),
          'hash' : p.hash,
          'host' : p.host
      };

      return obj;
  }
  // Parse a query string
  let parseStr = function(string)
  {
      var args = string.split('&');
      var argsParsed = {};

      for (var i = 0; i < args.length; i++)
      {
          var arg = decodeURIComponent(args[i]);

          if (arg.indexOf('=') == -1)
          {
              argsParsed[arg.trim()] = true;
          }
          else
          {
              var kvp = arg.split('=');
              argsParsed[kvp[0].trim()] = kvp[1].trim();
          }
      }

      return argsParsed;
  }
});
