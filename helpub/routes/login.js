var express = require('express');
var router = express.Router();

//Index
router.get('/', function(req, res, next) {
  res.render('login');
});

//Autenticar
router.post('/autenticar', function(req, res, next) {
	req.rest.post("/usuario/autenticar",req.body,function(data,resp){
		if(data.status){
		  	res.cookie("id-usuario", data.data[0].idusuario, {
	            httpOnly: true,
	            path: "/"
		     });
			res.redirect(302,"/principal");
		}else{
			res.redirect(302,"/login/?status=acesso-invalido");
		}
	});

});

module.exports = router;
