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
      loadGrid:function(){
        Util.ajax({
          url:"/chamado/listar",
          method:"GET",
          data:{},
          done:function(payload){
            setTimeout(function(){
              if(payload.data.length > 0){
                $("#loading-chamado").hide();

                $("#box-legenda,#box-table-chamado,#box-filtro-chamado").fadeIn();
                var html,situacaoCor,situacaoCorBg,destino,ocorrencia = "";
                for(var i=0;i<payload.data.length;i++){
                  //Situação
                  if(payload.data[i].situacao === "A"){
                    situacaoCor = "#31708f";
                    situacaoCorBg = "#d9edf7";
                  }else if(payload.data[i].situacao === "E"){
                    situacaoCor = "#8a6d3b";
                    situacaoCorBg = "#fcf8e3";
                  }else if(payload.data[i].situacao === "C"){
                    situacaoCor = "#a94442";
                    situacaoCorBg = "#f2dede";                    
                  }else if(payload.data[i].situacao === "F"){
                    situacaoCor = "#3c763d";
                    situacaoCorBg = "#dff0d8";                    
                  }

                    //Destino
                  if(payload.data[i].destino === "B"){
                    destino = "Bombeiro";
                  }else if(payload.data[i].destino === "C"){
                    destino = "Polícia Civil";
                  }else if(payload.data[i].destino === "M"){
                    destino = "Polícia Militar";
                  }

                  //Destino
                  if(payload.data[i].tipoocorrencia === "AC"){
                    ocorrencia = "Acidente";
                  }else if(payload.data[i].tipoocorrencia === "AS"){
                    ocorrencia = "Assalto";
                  }else if(payload.data[i].tipoocorrencia === "HO"){
                    ocorrencia = "Homicídio";
                  }else if(payload.data[i].tipoocorrencia === "IN"){
                    ocorrencia = "Incêndio";
                  }else if(payload.data[i].tipoocorrencia === "RO"){
                    ocorrencia = "Roubo/Furto";
                  }else if(payload.data[i].tipoocorrencia === "SE"){
                    ocorrencia = "Sequestro";
                  }else if(payload.data[i].tipoocorrencia === "VI"){
                    ocorrencia = "Violência doméstica";
                  }else if(payload.data[i].tipoocorrencia === "TE"){
                    ocorrencia = "Tentativa de Homicídio";
                  }

                  html += "<tr data-id='"+payload.data[i].idchamado +"' data-situacao='"+payload.data[i].situacao+"' style='background-color:"+situacaoCorBg+" !important;' data-ocorrencia='"+payload.data[i].tipoocorrencia+"'>";
                  html += "<td style='color:"+situacaoCor+" !important;'>"+payload.data[i].idchamado+"</td>";
                  html += "<td style='color:"+situacaoCor+" !important;'>"+payload.data[i].numtelefone+"</td>";
                  html += "<td style='color:"+situacaoCor+" !important;'>"+ocorrencia+"</td>";
                  html += "<td style='color:"+situacaoCor+" !important;'>"+destino+"</td>";
                  html += "<td style='color:"+situacaoCor+" !important;'>"+moment(payload.data[i].datacadastro).format("DD-MM-YYYY HH:mm:ss")+"</td>";
                  html += "<td>";
                  html += "<button data-id='"+payload.data[i].idchamado+"' class='btn-mais-informacoes btn btn-primary btn-xs'><i class='fa fa-plus'></i> Mais informações</button>";
                  html += "</td>";
                  html += "</tr>";
                }

                $("#table-chamado tbody").html(html);

              }else if(payload.data.length === 0){
                $("#table-chamado tbody").html("<tr class='text-center'><td colspan='4'><i class='fa fa-info-circle'></i> Não foram encontrados chamados no momento.</td></tr>");
              }
            },500);
          }
        });
      },
      loadMap:function(lat,lng){
        myMarker = [];
        var myLatLng = {lat: lat, lng: lng};
        centerCoords = new google.maps.LatLng(myLatLng.lat, myLatLng.lng);
        myMap = new google.maps.Map(document.getElementById('myMap'), {
          zoom: 16,
          center: centerCoords
        });

        myMarker.push(new google.maps.Marker({
          position: myLatLng,
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

        Page.controller.loadGrid();   
      },
      change: {
        filtrar:["#filtrar-chamado",function(e){
          var value = $(this).val();
          $("#table-chamado tbody tr").hide();
          $("#tr-no-filter").hide();
          if(value === "*"){
           $("#table-chamado tbody tr").fadeIn();
          $("#tr-no-filter").hide();
          }else{
            var lst = $("#table-chamado tbody tr[data-ocorrencia='"+value+"']");
            if(lst.length === 0){
                if($("#tr-no-filter").length === 0){
                 $("#table-chamado tbody").append("<tr id='tr-no-filter' class='text-center'><td colspan='4'><i class='fa fa-info-circle'></i> Não foram encontrados chamados para esse filtro no momento.</td></tr>");
                }else{
                  $("#tr-no-filter").show();
                }
            }else{
               lst.fadeIn();
            }
          }
          $(".opacity-hover:first").trigger("click");
        }]
      },
      click:{
        filtrarSituacao:[".opacity-hover",function(e){
          var situacao = $(this).attr("data-situacao");
          var tipoOcorrencia = $("#filtrar-chamado").val();
          $("#table-chamado tbody tr").hide();


          if(situacao === "*" && tipoOcorrencia === "*"){
            $("#table-chamado tbody tr").not("#tr-no-filter").show();
          }else if(situacao === "*" && tipoOcorrencia != "*"){
            $("#table-chamado tbody tr[data-ocorrencia='"+tipoOcorrencia+"']").show();
          }else if(situacao != "*" && tipoOcorrencia != "*"){
            $("#table-chamado tbody tr[data-situacao='"+situacao+"'][data-ocorrencia='"+tipoOcorrencia+"']").show();
          }else if(situacao != "*" && tipoOcorrencia === "*"){
            $("#table-chamado tbody tr[data-situacao='"+situacao+"']").show();
          }


          if($("#table-chamado tbody tr:visible").length === 0){
            if($("#tr-no-filter").length === 0){
             $("#table-chamado tbody").append("<tr id='tr-no-filter' class='text-center'><td colspan='4'><i class='fa fa-info-circle'></i> Não foram encontrados chamados para esse filtro no momento.</td></tr>");
            }else{
              $("#tr-no-filter").show();
            }
          }

          $(".opacity-hover").removeClass("opacity-hover-active");
          $(this).addClass("opacity-hover-active");
        }],
        cancelarChamado:["#btn-cancelar-chamado",function(e){

          if(!$("#container-comentario").is(":visible")){
            if(confirm("Você deseja realmente cancelar esse chamado?")){
              $(".container-tab").hide();
              $("#tabs-geral,.container-tab,#btn-atender-chamado,#btn-finalizar-chamado").hide();

              $("#box-is-trote,#container-comentario,#btn-cancelar-chamado").show();
            }
          }else{
            var idChamado = $("#modal-id-chamado").val();
             Util.ajax({
                url:"/chamado/cancelar",
                method:"POST",
                data:{
                  idchamado: idChamado,
                  observacao: $("#observacao").val(),
                  trote: ($("#isTrote").is(":checked")) ? "S" : "N"
                },
                done:function(payload){
                  $("#isTrote").prop("checked",false);
                  $("#observacao").val("");
                  $("#table-chamado tbody tr[data-id='"+idChamado+"']").css({
                    backgroundColor:"#f2dede"
                  }).attr("data-situacao","C");

                    $("#table-chamado tbody tr[data-id='"+idChamado+"']").find(" > td").css({
                      color: "#a94442"
                    });

                  $(".opacity-hover:first").trigger("click");
                  $("#modal-chamado").modal("hide");

                 Util.printAlert({
                      type:"success",
                      icon: "check",
                      message: "Chamado cancelado com sucesso.",
                      container: "#console"
                  });
                }
              });

          }
        }],
        atenderChamado:["#btn-atender-chamado",function(e){

            if(confirm("Você deseja realmente atender esse chamado?")){
               var idChamado = $("#modal-id-chamado").val();
               Util.ajax({
                  url:"/chamado/atender",
                  method:"POST",
                  data:{
                    idchamado: idChamado
                  },
                  done:function(payload){
                    $("#table-chamado tbody tr[data-id='"+idChamado+"']").css({
                      backgroundColor:"#fcf8e3"
                    }).attr("data-situacao","E");

                    $("#table-chamado tbody tr[data-id='"+idChamado+"']").find(" > td").css({
                      color: "#8a6d3b"
                    });


                    $(".opacity-hover:first").trigger("click");
                    $("#modal-chamado").modal("hide");

                    Util.printAlert({
                        type:"success",
                        icon: "check",
                        message: "Chamado atendido com sucesso.",
                        container: "#console"
                    });

                  }
                });
            }
        }],
        finalizarChamado:["#btn-finalizar-chamado",function(e){

          if(!$("#container-comentario").is(":visible")){
            if(confirm("Você deseja realmente finalizar esse chamado?")){
              $(".container-tab").hide();
              $("#box-is-trote,#tabs-geral,.container-tab,#btn-atender-chamado,#btn-cancelar-chamado").hide();

              $("#container-comentario,#btn-finalizar-chamado").show();


            }
          }else{
            var idChamado = $("#modal-id-chamado").val();
             Util.ajax({
                url:"/chamado/finalizar",
                method:"POST",
                data:{
                  idchamado: idChamado,
                  observacao: $("#observacao").val(),
                  trote: ($("#isTrote").is(":checked")) ? "S" : "N"
                },
                done:function(payload){
                  $("#isTrote").prop("checked",false);
                  $("#observacao").val("");
                  $("#table-chamado tbody tr[data-id='"+idChamado+"']").css({
                    backgroundColor:"#dff0d8"
                  }).attr("data-situacao","F");

                   $("#table-chamado tbody tr[data-id='"+idChamado+"']").find(" > td").css({
                      color: "#3c763d"
                    });

                  $(".opacity-hover:first").trigger("click");
                  $("#modal-chamado").modal("hide");

                 Util.printAlert({
                      type:"success",
                      icon: "check",
                      message: "Chamado finalizadp com sucesso.",
                      container: "#console"
                  });
                }
              });

          }
        }],
        maisInformacoes:[".btn-mais-informacoes",function(){
          var modal = $("#modal-chamado");
          modal.modal("show");
          $("#first-tab").find("a").trigger("click");
          var value = $(this).attr("data-id");
          $("#modal-id-chamado").val(value);
            Util.ajax({
              url:"/chamado/selecionar",
              method:"GET",
              data:{
                idchamado:value
              },
              done:function(payload){

                var obj = payload.data[0];
                var autor,cpfAutor,atendente,cpfAtendente, finalizadoEm,canceladoEm,atendidoEm,situacao,trote,observacao,destino = "";

                //Situação
                if(obj.situacao === "A"){
                  situacao = "Em aberto";
                  $("#btn-cancelar-chamado,#btn-atender-chamado").show();
                  $("#btn-finalizar-chamado").hide();
                }else if(obj.situacao === "E"){
                  situacao = "Em andamento";
                  $("#btn-cancelar-chamado").show();
                  $("#btn-atender-chamado").hide();
                  $("#btn-finalizar-chamado").show();
                }else if(obj.situacao === "C"){
                  situacao = "Cancelado";
                  $("#btn-cancelar-chamado").hide();
                  $("#btn-atender-chamado").hide();
                  $("#btn-finalizar-chamado").hide();
                }else if(obj.situacao === "F"){
                  situacao = "Finalizado";
                  $("#btn-cancelar-chamado").hide();
                  $("#btn-atender-chamado").hide();
                  $("#btn-finalizar-chamado").hide();
                }

                //Trote
                if(obj.trote === null){
                  trote = "-";
                }else if(obj.trote === "S"){
                  trote = "Sim";
                }else if(obj.trote === "N"){
                  trote = "Não";
                }

                //Observação
                if(obj.observacao === null){
                  observacao = "-";
                }else{
                  observacao = obj.observacao;
                }

                //Destino
                if(obj.destino === "B"){
                  destino = "Bombeiro";
                }else if(obj.destino === "C"){
                  destino = "Polícia Civil";
                }else if(obj.destino === "M"){
                  destino = "Polícia Militar";
                }

                //Atendido em
                if(obj.dataatendimento != null){
                  atendidoEm = moment(obj.dataatendimento).format("DD-MM-YYYY HH:mm:ss");
                }else{
                  atendidoEm = "Ainda não atendido";
                }

                //Cancelado em
                if(obj.datacancelamento != null){
                  canceladoEm = moment(obj.datacancelamento).format("DD-MM-YYYY HH:mm:ss");
                }else{
                  canceladoEm = "-";
                }

                //Finalizado em
                if(obj.datafechamento != null){
                  finalizadoEm = moment(obj.datafechamento).format("DD-MM-YYYY HH:mm:ss");
                }else{
                  finalizadoEm = "-";
                }

                //Atendente
                if(obj.nome_atendente != null){
                  atendente = obj.nome_atendente
                }else{
                  atendente = "-";
                }

                //CPF atendimento
                if(obj.cpf_atendente != null){
                  cpfAtendente = obj.cpf_atendente;
                }else{
                  cpfAtendente = "-";
                }

                //Autor
                if(obj.nome_autor != null){
                  autor = obj.nome_autor
                }else{
                  autor = "-";
                }

                //CPF Autor
                if(obj.cpf_autor != null){
                  cpfAutor = obj.cpf_autor;
                }else{
                  cpfAutor = "-";
                }

                 //Descrição
                if(obj.descricao.length === 0){
                  obj.descricao = "Não informada";
                }

                $("#t-codigo").html("<strong>Código:</strong> " + obj.idchamado);
                $("#t-situacao").html("<strong>Situação:</strong> " + situacao);
                $("#t-celular").html("<strong>SIM Serial Autor:</strong> " + obj.numtelefone);
                $("#t-descricao").html("<strong>Descrição:</strong><br/>" + obj.descricao);
                $("#t-trote").html("<strong>Trote?:</strong> " + trote);
                $("#t-observacao").html("<strong>Observação:</strong><br/>" + observacao);
                $("#t-destino").html("<strong>Observação:</strong> " + destino);
                
                $("#t-atendente").html("<strong>Atendente:</strong> " + atendente + " CPF: " + cpfAtendente);
                $("#t-autor").html("<strong>Autor:</strong> " + autor + " CPF: " + cpfAutor);
                $("#t-codigo-dispositivo").html("<strong>IMEI:</strong> " + obj.deviceid);
                $("#t-enviado-em").html("<strong>Enviado em:</strong> " + moment(obj.datacadastro).format("DD-MM-YYYY HH:mm:ss"));
                $("#t-atentido-em").html("<strong>Atendido em:</strong> " +atendidoEm);
                $("#t-cancelado-em").html("<strong>Cancelado em:</strong> " + canceladoEm);
                $("#t-concluido-em").html("<strong>Finalizado em:</strong> " + finalizadoEm);

               $("#loading-chamado-modal").hide();
               $("#tabs-geral,#container-geral").fadeIn();

               if(obj.pathimagem){
                 $("#foto").attr("src", "http://172.16.14.146:5001/static/uploads/"+obj.pathimagem).show();
                  $("#foto-tab").show();
               }else{
                 $("#foto-tab").hide();
               }

                Page.controller.loadMap(obj.latitude,obj.longitude);       

              }
            });
        }],
        alternarTabs:["#tabs-geral li",function(e){
            var href = $(this).find("a").attr("href").replace("#","");
            $(".container-tab").hide();
            $("#container-"+href).fadeIn();
            if(href === "mapa"){
                setTimeout(function(){
                   google.maps.event.trigger(myMap, "resize");
                  myMap.setCenter(centerCoords);
                 },1000);
            }
        }]
      }
    }
  };
  Page.event.load();
});

