$(document).ready(function(_e){

  var Document = $(this);
  var myMap = null;
  var myMarker = [];
  var centerCoords = null;

  var Page = {
    loaded:false,
    options:{
      debug:false
    },
    controller:{
      liveDashboard: function(){
        setInterval(function(){
           Util.ajax({
              url:"/chamado/dashboard",
              method:"GET",
              data:{},
              done:function(payload){
                //Aberto
                $("#cmh-aberto").text(payload.data[0].qtd);
                //Atendido
                $("#cmh-atendido").text(payload.data[1].qtd);
                //Cancelado
                $("#cmh-cancelado").text(payload.data[2].qtd);
                //Finalizado
                $("#cmh-finalizado").text(payload.data[3].qtd);
                //Trote
                $("#cmh-trote").text(payload.data[4].qtd);
              }
            });


         Util.ajax({
              url:"/chamado/ultimos-maps",
              method:"GET",
              data:{},
              done:function(payload){
                myMarker = [];
                console.log(payload);
                if(payload.data.length > 0){
                  for(let i=0;i<payload.data.length;i++){
                       Page.controller.setMarker(payload.data[i].latitude,payload.data[i].longitude);
                  }
                }
              }
            });


        },5000);
      },
      loadMap:function(lat,lng){

        var myLatLng = {lat: -15.625605, lng: -56.090570};
        centerCoords = new google.maps.LatLng(myLatLng.lat, myLatLng.lng);
        myMap = new google.maps.Map(document.getElementById('myMap'), {
          zoom: 12,
          center: centerCoords
        });

      },
      setMarker:function(lat,lng){
        var lating = new google.maps.LatLng(lat, lng);
        myMarker.push(new google.maps.Marker({
          position: lating,
          map: myMap,
          title: 'Origem do envio'
        }));
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
        Page.controller.liveDashboard();
        Page.controller.loadMap();


      },
      click: {}
    }
  };
  Page.event.load();
});

