-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: soal1
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `estudiante`
--

DROP TABLE IF EXISTS `estudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante` (
  `id_estudiante` int(11) NOT NULL AUTO_INCREMENT,
  `numero_documento` varchar(20) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_eps` int(11) DEFAULT NULL,
  `id_estado_academico` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_estudiante`),
  KEY `numero_documento` (`numero_documento`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_estado_academico` (`id_estado_academico`),
  KEY `idx_estudiante_eps_estado` (`id_eps`,`id_estado_academico`),
  CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`),
  CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `estudiante_ibfk_3` FOREIGN KEY (`id_eps`) REFERENCES `eps` (`id_eps`),
  CONSTRAINT `estudiante_ibfk_4` FOREIGN KEY (`id_estado_academico`) REFERENCES `estado_academico` (`id_estado_academico`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante`
--

LOCK TABLES `estudiante` WRITE;
/*!40000 ALTER TABLE `estudiante` DISABLE KEYS */;
INSERT INTO `estudiante` VALUES (1,'3001',3,1,1),(3,'4422475111',15,1,1),(11,'98765432',27,3,1),(13,'554615449846',30,6,1),(15,'12345678',36,1,1),(16,'1265418646',38,1,1),(17,'548465498',42,5,1),(90,'1001001',121,1,1),(91,'1001002',122,1,1),(92,'1001003',123,1,1),(93,'1001004',124,1,1),(94,'1001005',125,1,1),(95,'1001006',126,1,1),(96,'1001007',127,1,1),(97,'1001008',128,1,1),(98,'1001009',129,1,1),(99,'1001010',130,1,1),(100,'1001011',131,1,1),(101,'1001012',132,1,1),(102,'1001013',133,1,1),(103,'1001014',134,1,1),(104,'1001015',135,1,1),(105,'1001016',136,1,1),(106,'1001017',137,1,1),(107,'1001018',138,1,1),(108,'1001019',139,1,1),(109,'1001020',140,1,1),(110,'1001021',141,1,1),(111,'1001022',142,1,1),(112,'1001023',143,1,1),(113,'1001024',144,1,1),(114,'10010025',145,5,1),(115,'10010026',147,5,1),(116,'10010027',149,5,1),(117,'1151472265',151,3,1),(118,'benavides',155,2,1),(119,'f2548624',156,5,1);
/*!40000 ALTER TABLE `estudiante` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-11 22:10:10
