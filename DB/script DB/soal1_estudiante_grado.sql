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
-- Table structure for table `estudiante_grado`
--

DROP TABLE IF EXISTS `estudiante_grado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante_grado` (
  `id_estudiante_grado` int(11) NOT NULL AUTO_INCREMENT,
  `id_estudiante` int(11) DEFAULT NULL,
  `id_grado` int(11) DEFAULT NULL,
  `anio_academico` year(4) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_estudiante_grado`),
  KEY `estudiante_grado_ibfk_1` (`id_estudiante`),
  KEY `estudiante_grado_ibfk_2` (`id_grado`),
  CONSTRAINT `estudiante_grado_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE,
  CONSTRAINT `estudiante_grado_ibfk_2` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante_grado`
--

LOCK TABLES `estudiante_grado` WRITE;
/*!40000 ALTER TABLE `estudiante_grado` DISABLE KEYS */;
INSERT INTO `estudiante_grado` VALUES (1,1,2,2025,1),(9,11,2,2025,1),(11,13,12,2025,1),(13,90,1,NULL,1),(14,91,1,NULL,1),(15,92,2,NULL,1),(16,93,2,NULL,1),(17,94,3,NULL,1),(18,95,3,NULL,1),(19,96,4,NULL,1),(20,97,4,NULL,1),(21,98,5,NULL,1),(22,99,5,NULL,1),(23,100,6,NULL,1),(24,101,6,NULL,1),(25,102,7,NULL,1),(26,103,7,NULL,1),(27,104,8,NULL,1),(28,105,8,NULL,1),(29,106,9,NULL,1),(30,107,9,NULL,1),(31,108,10,NULL,1),(32,109,10,NULL,1),(33,110,11,NULL,1),(34,111,11,NULL,1),(35,112,12,NULL,1),(36,113,12,NULL,1),(37,116,4,2025,1),(38,117,1,2025,1),(39,118,8,2025,1),(40,119,10,2025,1);
/*!40000 ALTER TABLE `estudiante_grado` ENABLE KEYS */;
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
