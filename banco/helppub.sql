-- MySQL dump 10.16  Distrib 10.1.16-MariaDB, for Win32 (AMD64)
--
-- Host: localhost    Database: helpub
-- ------------------------------------------------------
-- Server version	10.1.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `helpub`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `helpub` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `helpub`;

--
-- Table structure for table `chamado`
--

DROP TABLE IF EXISTS `chamado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chamado` (
  `idchamado` int(11) NOT NULL AUTO_INCREMENT,
  `tipoocorrencia` enum('AC','AS','HO','IN','RO','SE','TE','VI') NOT NULL COMMENT 'AC-Acidente\nAS-Assalto\nHO-Homicídio\nIN-Incêndio\nRO-Roubo/Furto\nSE-Sequestro\nTE-Tentativa de Homicídio\nVI-Violência doméstica',
  `destino` enum('B','C','M') NOT NULL COMMENT 'B-Bombeiro\nC-Polícia Civil\nM-Polícia Militar',
  `descricao` varchar(255) DEFAULT NULL,
  `idatendente` int(11) DEFAULT NULL,
  `datacadastro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idautor` int(11) DEFAULT NULL,
  `deviceid` varchar(100) NOT NULL,
  `numtelefone` varchar(20) NOT NULL,
  `pathimagem` varchar(255) DEFAULT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `situacao` enum('A','C','E','F') NOT NULL DEFAULT 'A' COMMENT 'A-Aberto\nE-Em andamento\nC-Cancelado\nF-Finalizado',
  `observacao` varchar(255) DEFAULT NULL,
  `trote` enum('S','N') DEFAULT NULL,
  `dataatendimento` datetime DEFAULT NULL,
  `datacancelamento` datetime DEFAULT NULL,
  `datafechamento` datetime DEFAULT NULL,
  PRIMARY KEY (`idchamado`),
  KEY `chamado_autor_idx` (`idautor`),
  KEY `chamado_atendente_idx` (`idatendente`),
  CONSTRAINT `chamado_atendente` FOREIGN KEY (`idatendente`) REFERENCES `usuario` (`idusuario`),
  CONSTRAINT `chamado_autor` FOREIGN KEY (`idautor`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`127.0.0.1`*/ /*!50003 trigger chamado_destino_bi
before insert on chamado for each row
  set new.destino =
    case new.tipoocorrencia
      when 'AC' then 'B'
      when 'AS' then 'M'
      when 'HO' then 'M'
      when 'IN' then 'B'
      when 'RO' then 'M'
      when 'SE' then 'C'
      when 'TE' then 'M'
      when 'VI' then 'M'
    end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary table structure for view `chamado_priorizado`
--

DROP TABLE IF EXISTS `chamado_priorizado`;
/*!50001 DROP VIEW IF EXISTS `chamado_priorizado`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `chamado_priorizado` (
  `idchamado` tinyint NOT NULL,
  `tipoocorrencia` tinyint NOT NULL,
  `destino` tinyint NOT NULL,
  `descricao` tinyint NOT NULL,
  `idatendente` tinyint NOT NULL,
  `datacadastro` tinyint NOT NULL,
  `idautor` tinyint NOT NULL,
  `deviceid` tinyint NOT NULL,
  `numtelefone` tinyint NOT NULL,
  `pathimagem` tinyint NOT NULL,
  `longitude` tinyint NOT NULL,
  `latitude` tinyint NOT NULL,
  `situacao` tinyint NOT NULL,
  `observacao` tinyint NOT NULL,
  `trote` tinyint NOT NULL,
  `dataatendimento` tinyint NOT NULL,
  `datacancelamento` tinyint NOT NULL,
  `datafechamento` tinyint NOT NULL,
  `prioridade` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `idusuario` int(11) NOT NULL AUTO_INCREMENT,
  `nomecompleto` varchar(150) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `tipousuario` enum('O','C','P') NOT NULL COMMENT 'O-Operador\nC-Cidadao\nP-Publico',
  `datacadastro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endereco` text,
  `sexo` enum('F','M') DEFAULT NULL,
  `datanascimento` date DEFAULT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `cpf_UNIQUE` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Current Database: `helpub`
--

USE `helpub`;

--
-- Final view structure for view `chamado_priorizado`
--

/*!50001 DROP TABLE IF EXISTS `chamado_priorizado`*/;
/*!50001 DROP VIEW IF EXISTS `chamado_priorizado`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`127.0.0.1` SQL SECURITY DEFINER */
/*!50001 VIEW `chamado_priorizado` AS select `chamado`.`idchamado` AS `idchamado`,`chamado`.`tipoocorrencia` AS `tipoocorrencia`,`chamado`.`destino` AS `destino`,`chamado`.`descricao` AS `descricao`,`chamado`.`idatendente` AS `idatendente`,`chamado`.`datacadastro` AS `datacadastro`,`chamado`.`idautor` AS `idautor`,`chamado`.`deviceid` AS `deviceid`,`chamado`.`numtelefone` AS `numtelefone`,`chamado`.`pathimagem` AS `pathimagem`,`chamado`.`longitude` AS `longitude`,`chamado`.`latitude` AS `latitude`,`chamado`.`situacao` AS `situacao`,`chamado`.`observacao` AS `observacao`,`chamado`.`trote` AS `trote`,`chamado`.`dataatendimento` AS `dataatendimento`,`chamado`.`datacancelamento` AS `datacancelamento`,`chamado`.`datafechamento` AS `datafechamento`,(case `chamado`.`tipoocorrencia` when 'TE' then 1 when 'HO' then 2 when 'RO' then 3 when 'VI' then 4 else 9 end) AS `prioridade` from `chamado` where (`chamado`.`situacao` = 'A') order by (case `chamado`.`tipoocorrencia` when 'TE' then 1 when 'HO' then 2 when 'RO' then 3 when 'VI' then 4 else 9 end),`chamado`.`idchamado` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-05 19:52:27
