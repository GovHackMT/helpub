var express = require('express');
var router = express.Router();

//Index
router.get('/', function(req, res, next) {
  res.render('principal');
});

//Selecionar
router.get('/ultimos-chamados-maps', function(req, res, next) {
	req.rest.get("/chamado/ultimos-maps",null,function(data,resp){
		res.json(data);
	});
});


module.exports = router;
