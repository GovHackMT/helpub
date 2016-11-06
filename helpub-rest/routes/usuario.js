var express = require('express');
var router  = express.Router();
var MySQL   = require("../class/mysql-connection")();
var SHA256 =  require("crypto-js").SHA256;

//Autenticar post
router.post('/autenticar', function(req, res, next) {
    var sql = "SELECT * FROM usuario WHERE cpf = ? AND senha = ? LIMIT 1";
    MySQL.queryBind(sql,[
       req.body.cpf.replace("-","").replace(/\./g,'').replace(" ",""),
       SHA256(req.body.senha).toString()
      ],function(err, rows){
  		var result = {
  			status:false,
  			data: rows,
  			err:err
  		}
  		if(rows && rows.length > 0){
  			result.status = true;
  		}
		res.json(result);
   	});

});

//Listar solicitações
router.get('/listar-solicitacoes', function(req, res, next) {
  var query = "SELECT * FROM chamado_priorizado WHERE cpf_autor = ? OR (deviceid = ? AND numtelefone = ?) ";
  MySQL.queryBind(query,[
      req.query.cpf.replace("-","").replace(/\./g,'').replace(" ",""),
      req.query.deviceid,
      (req.query.phonenumber || "")
      ],function(err, rows){
      res.json(rows);
  });
});

//Salvar
router.post('/salvar', function(req, res, next) {
  var query = "INSERT INTO usuario (nomecompleto,cpf,sexo,datanascimento,endereco,senha,tipousuario) VALUES ('"+req.body.nome+"', '"+req.body.cpf+"', '"+req.body.sexo+"', '"+req.body.dtNasc+"','"+req.body.endereco+"','"+SHA256(req.body.senha)+"','C')";
  MySQL.query(query,function(err, rows, fields, conn){
      conn.end();
      res.json(rows);
  });
});

module.exports = router;
