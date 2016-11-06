$(document).ready(function(_e){

    $('.cpf-mask').mask('000.000.000-00');

    //Validador de cpf
    jQuery.validator.addMethod('cpf', function (value, element) {
         var Soma; var Resto; Soma = 0;
         var cpf = value;
         cpf = cpf.replace(/[^0-9]+/g, '');
        if (cpf == '00000000000')
            return false;
            for (i = 1; i <= 9; i++)
            Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
            Resto = (Soma * 10) % 11; if ((Resto == 10) || (Resto == 11))
            Resto = 0; if (Resto != parseInt(cpf.substring(9, 10)))
            return false; Soma = 0; for (i = 1; i <= 10; i++)
            Soma = Soma +
         parseInt(cpf.substring(i - 1, i)) * (12 - i);
         Resto = (Soma * 10) % 11; if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(cpf.substring(10, 11))) {
            return false;
        }
         return true;
    }, 'Informe um CPF válido.');

    $(window).load(function(e){
        var splitUrl = window.location.pathname.split("/");
        splitUrl.shift();
        $("#menu-app li").removeClass("active");
        $("*[data-menu-url='"+splitUrl[0]+"']").parent("li").addClass("active")
    });


        //Novos chamados
        /*setInterval(function(){
           Util.ajax({
              url:"/chamado/listar-novos",
              method:"GET",
              data:{},
              done:function(payload){
    
              }
            });
        },5000);*/





});