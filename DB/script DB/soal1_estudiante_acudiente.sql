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
-- Table structure for table `estudiante_acudiente`
--

DROP TABLE IF EXISTS `estudiante_acudiente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante_acudiente` (
  `id_estudiante_acudiente` int(11) NOT NULL AUTO_INCREMENT,
  `id_estudiante` int(11) NOT NULL,
  `id_acudiente` int(11) NOT NULL,
  `id_relacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_estudiante_acudiente`),
  KEY `id_estudiante` (`id_estudiante`),
  KEY `id_acudiente` (`id_acudiente`),
  KEY `id_relacion` (`id_relacion`),
  CONSTRAINT `fk_ea_acudiente` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`) ON DELETE CASCADE,
  CONSTRAINT `fk_ea_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE,
  CONSTRAINT `fk_ea_relacion` FOREIGN KEY (`id_relacion`) REFERENCES `relacion_acudiente` (`id_relacion`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante_acudiente`
--

LOCK TABLES `estudiante_acudiente` WRITE;
/*!40000 ALTER TABLE `estudiante_acudiente` DISABLE KEYS */;
INSERT INTO `estudiante_acudiente` VALUES (1,1,1,1),(2,3,1,1),(3,11,1,1),(4,13,1,1),(5,15,1,1),(6,16,1,1),(7,17,1,1),(8,90,1,1),(9,91,1,1),(10,92,1,1),(17,104,2,1),(18,116,4,1),(19,93,5,1),(20,105,10,1),(21,94,13,1),(22,106,14,1),(23,95,40,1),(24,107,41,1),(25,96,43,1),(26,108,44,1),(27,97,46,1),(28,109,47,1),(29,98,49,1),(30,110,50,1),(31,99,52,1),(32,111,53,1),(33,100,55,1),(34,112,56,1),(35,101,58,1),(36,113,59,1),(37,102,61,1),(38,114,62,1),(39,103,64,1),(40,115,65,1),(48,1,1,1),(49,3,1,1),(50,11,1,1),(51,13,1,1),(52,15,1,1),(53,16,1,1),(54,17,1,1),(55,90,1,1),(57,92,1,1),(58,104,2,1),(59,116,4,1),(60,93,5,1),(61,105,10,1),(62,94,13,1),(63,106,14,1),(64,95,40,1),(65,107,41,1),(66,96,43,1),(67,108,44,1),(68,97,46,1),(69,109,47,1),(70,98,49,1),(71,110,50,1),(72,99,52,1),(73,111,53,1),(74,100,55,1),(75,112,56,1),(76,101,58,1),(77,113,59,1),(78,102,61,1),(79,114,62,1),(80,103,64,1),(81,115,65,1),(82,117,66,1),(83,118,64,4),(84,119,67,2);
/*!40000 ALTER TABLE `estudiante_acudiente` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-11 22:10:11
