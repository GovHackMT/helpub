$(document).ready(function(_e){

  var Document = $(this);

  var Page = {
    loaded:false,
    options:{
      debug:false
    },
    controller:{
      loadValidation: function(){
        $("#form-login").validate({
            rules: {
                cpf: {
                    cpf:true,
                    required:true
                },
                senha:{
                  required:true
                }
            }
        });
        Page.loaded = true;
      }
    },
    event: {
      load:function(e){
        if(Page.options.debug){
          Util.showTimingResults();
        }
        var eventsKeys = Object.keys(Page.event);
        var eventsKeysLength = eventsKeys.length;
        if(eventsKeysLength > 0){
          for(var i=0;i < eventsKeysLength;i++){
            var eventFunctions = Object.keys(Page.event[eventsKeys[i]]);
            var eventFunctionsLength = eventFunctions.length;
            if(eventFunctionsLength > 0){
                for(var x=0;x < eventFunctionsLength;x++){
                  var property = Page.event[eventsKeys[i]][eventFunctions[x]];
                  if(eventsKeys[i] == 'load'){
                    window.on('load',Page.event.load);
                  }else{
                    var selector = property[0];
                    var func = property[1];
                    Document.on(eventsKeys[i], selector , func);
                  }
                }
            }
          }
        }
        Page.controller.loadValidation();
      },
      click: {
        submitForm:["#submit-form",function(e){
          if($(this).valid()){
            $("#form-login").submit();
          }
        }]
      }
    }
  };
  Page.event.load();
});

