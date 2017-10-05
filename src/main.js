grapesjs.plugins.add('gjs-plugin-customrte', (editor, opts = {}) => {
  let c = opts;

  let defaults = {
  };



  editor.setCustomRte({
    enable(el, rte) {
      // If already exists I'll just focus on it
      //if(rte && rte.status != 'destroyed') {
      if(rte ) {
        this.focus(el, rte);
      	return rte;
      }

      el.contentEditable = true;

      editor.RichTextEditor.add('PlaceHolder', {
        command: 'PlaceHolder',
        class: 'fa fa-link',
        title: 'PlaceHolder',
      });  

      let rteToolbar = editor.RichTextEditor.getToolbarEl();
      [].forEach.call(rteToolbar.children, (child) => {
      	//child.style.display = 'none';
      });

      $( 'a[title="PlaceHolder"]').click(function() {
        
        var modal = editor.Modal;
        modal.setTitle("Please Select Available Token");

        modal.setContent('<select id="customVariable"></select><br /><button id="sbm">submit</button>')
        var p = parseURL(window.location.href)
        $('#customVariable').append($('<option>', { 
          value: "",
          text : 'Please Select' 
        }));
        $.each(p.args, function (i, item) {
          if(i != "" || Object.keys(i).length > 0){
            $('#customVariable').append($('<option>', { 
                value: item,
                text : item 
            }));
          }
        });
        modal.open();

        $("#sbm").on("click", function() { 
          console.log(el)
          el.contentEditable = true;
          //editor.trigger("customAdd")
          //model.set('content', document.querySelector("#customVariable").value);
          //console.log(document.querySelector("#customVariable").value)
          var canvasDoc = editor.Canvas.getBody().ownerDocument;
          // Insert text at the current pointer position
          //el.execCommand('insertHTML', false, '<p>a</p>');
          var val =  $('#customVariable').val()
          if(val != ""){
            canvasDoc.execCommand("insertText", false, $('#customVariable').val());
          }
          modal.close()
        })
      });


      this.focus(el, rte);
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
