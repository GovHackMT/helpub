var express = require('express');
var router = express.Router();

//Index
router.get('/', function(req, res, next) {
	res.render('chamado');
});

//Listar
router.get('/listar', function(req, res, next) {
	req.rest.get("/chamado/listar",req.query,function(data,resp){
		res.json(data);
	});
});

//Selecionar
router.get('/selecionar', function(req, res, next) {
	req.rest.get("/chamado/selecionar?idchamado="+req.query.idchamado,null,function(data,resp){
		res.json(data);
	});
});

//Cancelar
router.post('/cancelar', function(req, res, next) {
	req.rest.post("/chamado/cancelar",req.body,function(data,resp){
		res.json(data);
	});
});

//Atender
router.post('/atender', function(req, res, next) {

	var obj = req.body;
	obj["idatendente"] = req.cookies["id-usuario"];

	req.rest.post("/chamado/atender",obj,function(data,resp){
		res.json(data);
	});
});

//Finalizar
router.post('/finalizar', function(req, res, next) {
	req.rest.post("/chamado/finalizar",req.body,function(data,resp){
		res.json(data);
	});
});

//Dashboard
router.get('/dashboard', function(req, res, next) {
	req.rest.get("/chamado/dashboard",req.body,function(data,resp){
		res.json(data);
	});
});

//Novos chamados
router.get('/novos', function(req, res, next) {
	req.rest.get("/chamado/listar-novos",req.body,function(data,resp){
		res.json(data);
	});
});

//Últimos maps 
router.get('/ultimos-maps', function(req, res, next) {
	req.rest.get("/chamado/ultimos-maps",req.body,function(data,resp){
		res.json(data);
	});
});

module.exports = router;
