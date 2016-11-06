var express = require('express');
var router  = express.Router();
var MySQL   = require("../class/mysql-connection")();
var uuid    = require('uuid');

//Listar
router.get('/listar', function(req, res, next) {
    MySQL.query("SELECT * FROM chamado_priorizado",function(err, rows, fields, conn){
      conn.end();
    res.json({
        status:true,
        data: rows,
        err:err
      });
    });
});

//Selecionar
router.get('/selecionar', function(req, res, next) {
    MySQL.query("SELECT * FROM chamado_priorizado WHERE idchamado = '"+req.query.idchamado+"' ",function(err, rows, fields, conn){
      conn.end();
    res.json({
        status:true,
        data: rows,
        err:err
      });
    });
});

//Cancelar
router.post('/cancelar', function(req, res, next) {

	var trote = req.body.trote;
	var observacao = req.body.observacao;

	if(!trote){
		trote = "N";
	}

	if(!observacao){
		observacao = "";
	}

	var query = "UPDATE chamado SET trote='"+trote+"',situacao = 'C', datacancelamento = NOW(), observacao = '"+observacao+"'  WHERE idchamado = "+req.body.idchamado+"";
   
    MySQL.query(query,function(err, rows, fields, conn){
	      conn.end();
	      res.json({
	        status:true,
	        data: rows,
	        err:err
	      });
    });
});

//Atender
router.post('/atender', function(req, res, next) {
	var query = "UPDATE chamado SET situacao = 'E', dataatendimento = NOW(), idatendente = '"+req.body.idatendente+"'  WHERE idchamado = "+req.body.idchamado+"";
    MySQL.query(query,function(err, rows, fields, conn){
	      conn.end();
	      res.json({
	        status:true,
	        data: rows,
	        err:err
	      });
    });

});

//Finalizar
router.post('/finalizar', function(req, res, next) {

	var trote = req.body.trote;
	var observacao = req.body.observacao;

	if(trote == undefined){
		trote = "N";
	}

	var query = "UPDATE chamado SET trote='"+trote+"', situacao = 'F', datafechamento = NOW(), observacao = '"+observacao+"'  WHERE idchamado = "+req.body.idchamado+"";
   
    MySQL.query(query,function(err, rows, fields, conn){
	      conn.end();
	      res.json({
	        status:true,
	        data: rows,
	        err:err
	      });
    });
});

//Dashboard
router.get('/dashboard', function(req, res, next) {
	var query = "SELECT * FROM chamado_dashboard";
    MySQL.query(query,function(err, rows, fields, conn){
	      conn.end();
	      res.json({
	        status:true,
	        data: rows,
	        err:err
	      });
    });
});

//Listar novos
router.get('/listar-novos', function(req, res, next) {
	var query = "SELECT * FROM chamado_dashboard";
    MySQL.query(query,function(err, rows, fields, conn){
	      conn.end();
	      res.json({
	        status:true,
	        data: rows,
	        err:err
	      });
    });
});

//Salvar
router.post('/salvar', function(req, res, next) {

	var salvarChamado = function(imgName){
		    var query = "INSERT INTO chamado (latitude,longitude,numtelefone,deviceid,descricao,tipoocorrencia,pathimagem,idautor) VALUES ("+req.body.latitude+", "+req.body.longitude+", '"+req.body.phoneNumber+"', '"+req.body.deviceId+"','"+(req.body.description || '')+"','"+req.body.type+"','"+(imgName || '')+"',"+(req.body.idusuario || 'null')+")";
		   
		    MySQL.query(query,function(err, rows, fields, conn){
			      conn.end();
			      res.json({
			        status:true,
			        data: rows,
			        err:err
			      });
	    });
	};

	var imgName = uuid.v4()+".jpeg";

	if(req.body.img){

		var base64Data = req.body.img.replace(/^data:image\/jpeg;base64,/, "");


		require("fs").writeFile("./public/uploads/"+imgName, base64Data, 'base64', function(err) {
	  		if(err) throw err;
	  		salvarChamado(imgName);
		});
	}else{
	  		salvarChamado("");
	}

});

//Últimos maps
router.get('/ultimos-maps', function(req, res, next) {
	var query = "select latitude, longitude from chamado where datacadastro >= subdate(now(), '1 00:00')";
    MySQL.query(query,function(err, rows, fields, conn){
	      conn.end();
	      res.json({
	        status:true,
	        data: rows,
	        err:err
	      });
    });
});

module.exports = router;
