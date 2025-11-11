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
-- Table structure for table `funcionario`
--

DROP TABLE IF EXISTS `funcionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario` (
  `id_funcionario` int(11) NOT NULL AUTO_INCREMENT,
  `numero_documento` varchar(20) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `cargo` varchar(50) DEFAULT NULL,
  `id_escolaridad` int(11) DEFAULT NULL,
  `arl` varchar(50) DEFAULT NULL,
  `foto` text DEFAULT NULL,
  PRIMARY KEY (`id_funcionario`),
  KEY `numero_documento` (`numero_documento`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_escolaridad` (`id_escolaridad`),
  CONSTRAINT `funcionario_ibfk_1` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`),
  CONSTRAINT `funcionario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `funcionario_ibfk_3` FOREIGN KEY (`id_escolaridad`) REFERENCES `nivel_escolaridad` (`id_escolaridad`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario`
--

LOCK TABLES `funcionario` WRITE;
/*!40000 ALTER TABLE `funcionario` DISABLE KEYS */;
INSERT INTO `funcionario` VALUES (1,NULL,2,'Profesor',3,'Arl Sura',NULL),(2,NULL,5,'Profesor',2,'Arl Sura',NULL),(3,NULL,6,'Profesor',1,'Arl Sura',NULL),(6,'1001',14,'Profesor',1,'ARL Sura',NULL),(8,'1151472244',7,'Administrador',1,'ARL Sura',NULL),(9,'1151472245',8,'Profesor',2,'ARL Sura',NULL),(10,'1151472246',9,'Coordinador',1,'ARL Sura',NULL),(11,'1151472247',5,'Secretaria',2,'ARL Sura',NULL),(12,'1151472248',6,'Orientador',1,'ARL Sura',NULL),(13,'2001',2,'Coordinador General',1,'ARL Positiva',NULL),(18,'987654321',40,'Profesor de Matemáticas',NULL,'SURA',NULL),(19,'1234567890',41,'Profesora de Ciencias',NULL,'SURA',NULL),(20,'6798746148',44,'Profesor',NULL,'sura',NULL),(21,'531684946151',45,'profesor',NULL,'sura',NULL),(22,'79867453',46,'Secretaria',NULL,'No aplica',NULL),(23,'6874153',47,'Secretaria',NULL,'No aplica',NULL),(24,'54684864',48,'Secretaria',NULL,'No aplica',NULL),(26,'4000021',154,'Secretaria',NULL,'No aplica',NULL),(27,'1030672573',158,'profesor',NULL,'sura',NULL),(28,'1129844703',159,'Secretaria',NULL,'No aplica',NULL);
/*!40000 ALTER TABLE `funcionario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-11 22:10:12
