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
-- Table structure for table `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL AUTO_INCREMENT,
  `id_estudiante` int(11) NOT NULL,
  `id_funcionario` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_estado_asistencia` int(11) NOT NULL,
  `observacion` text DEFAULT NULL,
  `id_grado_asistencia` int(11) NOT NULL,
  PRIMARY KEY (`id_asistencia`),
  KEY `id_estudiante` (`id_estudiante`),
  KEY `id_funcionario` (`id_funcionario`),
  KEY `id_estado_asistencia` (`id_estado_asistencia`),
  KEY `fk_grado_asistencia` (`id_grado_asistencia`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`),
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`),
  CONSTRAINT `asistencia_ibfk_3` FOREIGN KEY (`id_estado_asistencia`) REFERENCES `estado_asistencia` (`id_estado_asistencia`),
  CONSTRAINT `fk_grado_asistencia` FOREIGN KEY (`id_grado_asistencia`) REFERENCES `grado_asistencia` (`id_grado_asistencia`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
INSERT INTO `asistencia` VALUES (2,1,3,'2025-06-29',1,NULL,1),(4,1,2,'2025-06-28',1,NULL,1),(5,1,1,'2025-06-28',1,NULL,1),(10,1,1,'2025-07-24',1,'Llegó tarde',1),(11,1,13,'2025-07-24',1,'Llegó tarde',1),(12,90,1,'2025-07-25',1,'Presente',1),(13,91,1,'2025-07-25',1,'Presente',1),(14,90,1,'2025-07-25',1,'',1),(15,91,1,'2025-07-25',4,'',1),(16,90,1,'2025-07-25',1,'',1),(17,91,1,'2025-07-25',4,'',1),(33,13,1,'2025-07-25',1,'P',2),(34,112,1,'2025-07-25',1,'P',2),(35,113,1,'2025-07-25',4,'J',2),(36,110,1,'2025-07-25',1,'P',3),(37,111,1,'2025-07-25',2,'A',3);
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
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
