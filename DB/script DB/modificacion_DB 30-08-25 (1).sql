-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: soal_correct
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
-- Table structure for table `acudiente`
--

DROP TABLE IF EXISTS `acudiente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acudiente` (
  `id_acudiente` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_relacion` int(11) DEFAULT NULL,
  `id_persona` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_acudiente`),
  KEY `idx_acu_usuario` (`id_usuario`),
  KEY `idx_acu_relacion` (`id_relacion`),
  KEY `idx_acu_persona` (`id_persona`),
  CONSTRAINT `fk_acudiente_persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`),
  CONSTRAINT `fk_acudiente_relacion` FOREIGN KEY (`id_relacion`) REFERENCES `relacion_acudiente` (`id_relacion`),
  CONSTRAINT `fk_acudiente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acudiente`
--

LOCK TABLES `acudiente` WRITE;
/*!40000 ALTER TABLE `acudiente` DISABLE KEYS */;
INSERT INTO `acudiente` VALUES (1,4,NULL,75),(2,4,NULL,75),(4,12,NULL,79),(5,13,NULL,80),(10,28,NULL,48),(11,31,NULL,39),(13,37,NULL,91),(14,39,NULL,45),(15,43,NULL,89),(40,121,1,49),(41,122,1,50),(42,123,1,53),(43,124,1,54),(44,125,1,55),(45,126,1,56),(46,127,1,57),(47,128,1,58),(48,129,1,59),(49,130,1,60),(50,131,1,61),(51,132,1,62),(52,133,1,63),(53,134,1,64),(54,135,1,65),(55,136,1,66),(56,137,1,67),(57,138,1,68),(58,139,1,69),(59,140,1,70),(60,141,1,71),(61,142,1,72),(62,143,1,73),(63,144,1,74),(64,146,NULL,52),(65,148,NULL,76),(66,152,NULL,37),(67,157,NULL,38);
/*!40000 ALTER TABLE `acudiente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archivo`
--

DROP TABLE IF EXISTS `archivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archivo` (
  `id_archivo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_original` varchar(255) NOT NULL,
  `nombre_sistema` varchar(255) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `contenido` longblob DEFAULT NULL,
  `ruta` text NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `tipo_documento` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_archivo`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `archivo_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archivo`
--

LOCK TABLES `archivo` WRITE;
/*!40000 ALTER TABLE `archivo` DISABLE KEYS */;
/*!40000 ALTER TABLE `archivo` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `asistencia` VALUES (2,1,3,'2025-06-29',1,NULL,1),(4,1,2,'2025-06-28',1,NULL,1),(5,1,1,'2025-06-28',1,NULL,1),(10,1,1,'2025-07-24',1,'LlegÃ³ tarde',1),(11,1,13,'2025-07-24',1,'LlegÃ³ tarde',1),(12,90,1,'2025-07-25',1,'Presente',1),(13,91,1,'2025-07-25',1,'Presente',1),(14,90,1,'2025-07-25',1,'',1),(15,91,1,'2025-07-25',4,'',1),(16,90,1,'2025-07-25',1,'',1),(17,91,1,'2025-07-25',4,'',1),(33,13,1,'2025-07-25',1,'P',2),(34,112,1,'2025-07-25',1,'P',2),(35,113,1,'2025-07-25',4,'J',2),(36,110,1,'2025-07-25',1,'P',3),(37,111,1,'2025-07-25',2,'A',3);
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canal_notificacion`
--

DROP TABLE IF EXISTS `canal_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canal_notificacion` (
  `id_canal` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_canal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canal_notificacion`
--

LOCK TABLES `canal_notificacion` WRITE;
/*!40000 ALTER TABLE `canal_notificacion` DISABLE KEYS */;
INSERT INTO `canal_notificacion` VALUES (1,'correo'),(2,'WhatsApp'),(3,'SMS');
/*!40000 ALTER TABLE `canal_notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_observacion`
--

DROP TABLE IF EXISTS `categoria_observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_observacion` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_observacion`
--

LOCK TABLES `categoria_observacion` WRITE;
/*!40000 ALTER TABLE `categoria_observacion` DISABLE KEYS */;
INSERT INTO `categoria_observacion` VALUES (1,'Actitud'),(2,'Disciplinaria'),(3,'Psicologica'),(4,'Situcion financiera');
/*!40000 ALTER TABLE `categoria_observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eps`
--

DROP TABLE IF EXISTS `eps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eps` (
  `id_eps` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_eps`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eps`
--

LOCK TABLES `eps` WRITE;
/*!40000 ALTER TABLE `eps` DISABLE KEYS */;
INSERT INTO `eps` VALUES (5,'Compensar'),(6,'Coomeva'),(2,'Nueva EPS'),(4,'Salud Total'),(3,'Sanitas'),(1,'Sura');
/*!40000 ALTER TABLE `eps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_academico`
--

DROP TABLE IF EXISTS `estado_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_academico` (
  `id_estado_academico` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id_estado_academico`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_academico`
--

LOCK TABLES `estado_academico` WRITE;
/*!40000 ALTER TABLE `estado_academico` DISABLE KEYS */;
INSERT INTO `estado_academico` VALUES (4,'Aprobado'),(3,'Graduado'),(1,'Pendiente'),(2,'Retirado');
/*!40000 ALTER TABLE `estado_academico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_asistencia`
--

DROP TABLE IF EXISTS `estado_asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_asistencia` (
  `id_estado_asistencia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id_estado_asistencia`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_asistencia`
--

LOCK TABLES `estado_asistencia` WRITE;
/*!40000 ALTER TABLE `estado_asistencia` DISABLE KEYS */;
INSERT INTO `estado_asistencia` VALUES (2,'Ausente'),(4,'Justificada'),(1,'Presente'),(3,'Tarde');
/*!40000 ALTER TABLE `estado_asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_notificacion`
--

DROP TABLE IF EXISTS `estado_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_notificacion` (
  `id_estado_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id_estado_notificacion`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_notificacion`
--

LOCK TABLES `estado_notificacion` WRITE;
/*!40000 ALTER TABLE `estado_notificacion` DISABLE KEYS */;
INSERT INTO `estado_notificacion` VALUES (2,'LeÃ­da'),(1,'LeÃ­do');
/*!40000 ALTER TABLE `estado_notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_pqr`
--

DROP TABLE IF EXISTS `estado_pqr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_pqr` (
  `id_estado_pqr` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id_estado_pqr`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_pqr`
--

LOCK TABLES `estado_pqr` WRITE;
/*!40000 ALTER TABLE `estado_pqr` DISABLE KEYS */;
INSERT INTO `estado_pqr` VALUES (4,'con retraso'),(2,'En proceso'),(1,'Pendiente'),(3,'Resuelta');
/*!40000 ALTER TABLE `estado_pqr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_usuario`
--

DROP TABLE IF EXISTS `estado_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_usuario` (
  `id_estado_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id_estado_usuario`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_usuario`
--

LOCK TABLES `estado_usuario` WRITE;
/*!40000 ALTER TABLE `estado_usuario` DISABLE KEYS */;
INSERT INTO `estado_usuario` VALUES (3,'Activado'),(1,'Activo'),(2,'Inactivo');
/*!40000 ALTER TABLE `estado_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiante`
--

DROP TABLE IF EXISTS `estudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante` (
  `id_estudiante` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_eps` int(11) DEFAULT NULL,
  `id_estado_academico` int(11) DEFAULT NULL,
  `id_persona` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_estudiante`),
  KEY `idx_est_usuario` (`id_usuario`),
  KEY `idx_est_eps_estado` (`id_eps`,`id_estado_academico`),
  KEY `idx_est_persona` (`id_persona`),
  KEY `fk_estudiante_estado` (`id_estado_academico`),
  CONSTRAINT `fk_estudiante_eps` FOREIGN KEY (`id_eps`) REFERENCES `eps` (`id_eps`),
  CONSTRAINT `fk_estudiante_estado` FOREIGN KEY (`id_estado_academico`) REFERENCES `estado_academico` (`id_estado_academico`),
  CONSTRAINT `fk_estudiante_persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`),
  CONSTRAINT `fk_estudiante_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante`
--

LOCK TABLES `estudiante` WRITE;
/*!40000 ALTER TABLE `estudiante` DISABLE KEYS */;
INSERT INTO `estudiante` VALUES (1,3,1,1,46),(3,15,1,1,78),(11,27,3,1,92),(13,30,6,1,85),(15,36,1,1,41),(16,38,1,1,43),(17,42,5,1,84),(90,121,1,1,2),(91,122,1,1,3),(92,123,1,1,7),(93,124,1,1,8),(94,125,1,1,9),(95,126,1,1,10),(96,127,1,1,11),(97,128,1,1,12),(98,129,1,1,13),(99,130,1,1,14),(100,131,1,1,15),(101,132,1,1,16),(102,133,1,1,17),(103,134,1,1,18),(104,135,1,1,19),(105,136,1,1,20),(106,137,1,1,21),(107,138,1,1,22),(108,139,1,1,23),(109,140,1,1,24),(110,141,1,1,25),(111,142,1,1,26),(112,143,1,1,27),(113,144,1,1,28),(114,145,5,1,4),(115,147,5,1,5),(116,149,5,1,6),(117,151,3,1,36),(118,155,2,1,95),(119,156,5,1,96);
/*!40000 ALTER TABLE `estudiante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiante_acudiente`
--

DROP TABLE IF EXISTS `estudiante_acudiente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante_acudiente` (
  `id_estudiante_acudiente` int(11) NOT NULL,
  `id_estudiante` int(11) NOT NULL,
  `id_acudiente` int(11) NOT NULL,
  `id_relacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_estudiante_acudiente`),
  KEY `idx_ea_est` (`id_estudiante`),
  KEY `idx_ea_acu` (`id_acudiente`),
  CONSTRAINT `fk_ea_acu` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`) ON DELETE CASCADE,
  CONSTRAINT `fk_ea_est` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante_acudiente`
--

LOCK TABLES `estudiante_acudiente` WRITE;
/*!40000 ALTER TABLE `estudiante_acudiente` DISABLE KEYS */;
INSERT INTO `estudiante_acudiente` VALUES (1,1,1,1),(2,3,1,1),(3,11,1,1),(4,13,1,1),(5,15,1,1),(6,16,1,1),(7,17,1,1),(8,90,1,1),(9,91,1,1),(10,92,1,1),(17,104,2,1),(18,116,4,1),(19,93,5,1),(20,105,10,1),(21,94,13,1),(22,106,14,1),(23,95,40,1),(24,107,41,1),(25,96,43,1),(26,108,44,1),(27,97,46,1),(28,109,47,1),(29,98,49,1),(30,110,50,1),(31,99,52,1),(32,111,53,1),(33,100,55,1),(34,112,56,1),(35,101,58,1),(36,113,59,1),(37,102,61,1),(38,114,62,1),(39,103,64,1),(40,115,65,1),(48,1,1,1),(49,3,1,1),(50,11,1,1),(51,13,1,1),(52,15,1,1),(53,16,1,1),(54,17,1,1),(55,90,1,1),(57,92,1,1),(58,104,2,1),(59,116,4,1),(60,93,5,1),(61,105,10,1),(62,94,13,1),(63,106,14,1),(64,95,40,1),(65,107,41,1),(66,96,43,1),(67,108,44,1),(68,97,46,1),(69,109,47,1),(70,98,49,1),(71,110,50,1),(72,99,52,1),(73,111,53,1),(74,100,55,1),(75,112,56,1),(76,101,58,1),(77,113,59,1),(78,102,61,1),(79,114,62,1),(80,103,64,1),(81,115,65,1),(82,117,66,1),(83,118,64,4),(84,119,67,2);
/*!40000 ALTER TABLE `estudiante_acudiente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiante_grado`
--

DROP TABLE IF EXISTS `estudiante_grado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante_grado` (
  `id_estudiante_grado` int(11) NOT NULL,
  `id_estudiante` int(11) DEFAULT NULL,
  `id_grado` int(11) DEFAULT NULL,
  `anio_academico` year(4) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_estudiante_grado`),
  KEY `estudiante_grado_ibfk_1` (`id_estudiante`),
  KEY `estudiante_grado_ibfk_2` (`id_grado`),
  CONSTRAINT `estudiante_grado_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE,
  CONSTRAINT `estudiante_grado_ibfk_2` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante_grado`
--

LOCK TABLES `estudiante_grado` WRITE;
/*!40000 ALTER TABLE `estudiante_grado` DISABLE KEYS */;
INSERT INTO `estudiante_grado` VALUES (1,1,2,2025,1),(9,11,2,2025,1),(11,13,12,2025,1),(13,90,1,NULL,1),(14,91,1,NULL,1),(15,92,2,NULL,1),(16,93,2,NULL,1),(17,94,3,NULL,1),(18,95,3,NULL,1),(19,96,4,NULL,1),(20,97,4,NULL,1),(21,98,5,NULL,1),(22,99,5,NULL,1),(23,100,6,NULL,1),(24,101,6,NULL,1),(25,102,7,NULL,1),(26,103,7,NULL,1),(27,104,8,NULL,1),(28,105,8,NULL,1),(29,106,9,NULL,1),(30,107,9,NULL,1),(31,108,10,NULL,1),(32,109,10,NULL,1),(33,110,11,NULL,1),(34,111,11,NULL,1),(35,112,12,NULL,1),(36,113,12,NULL,1),(37,116,4,2025,1),(38,117,1,2025,1),(39,118,8,2025,1),(40,119,10,2025,1);
/*!40000 ALTER TABLE `estudiante_grado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionario`
--

DROP TABLE IF EXISTS `funcionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario` (
  `id_funcionario` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `cargo` varchar(50) DEFAULT NULL,
  `id_escolaridad` int(11) DEFAULT NULL,
  `arl` varchar(50) DEFAULT NULL,
  `foto` text DEFAULT NULL,
  `id_persona` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_funcionario`),
  KEY `idx_func_usuario` (`id_usuario`),
  KEY `idx_func_escolaridad` (`id_escolaridad`),
  KEY `idx_func_persona` (`id_persona`),
  CONSTRAINT `fk_funcionario_escolaridad` FOREIGN KEY (`id_escolaridad`) REFERENCES `nivel_escolaridad` (`id_escolaridad`),
  CONSTRAINT `fk_funcionario_persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`),
  CONSTRAINT `fk_funcionario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario`
--

LOCK TABLES `funcionario` WRITE;
/*!40000 ALTER TABLE `funcionario` DISABLE KEYS */;
INSERT INTO `funcionario` VALUES (1,2,'Profesor',3,'Arl Sura',NULL,128),(2,5,'Profesor',2,'Arl Sura',NULL,129),(3,6,'Profesor',1,'Arl Sura',NULL,130),(6,14,'Profesor',1,'ARL Sura',NULL,1),(8,7,'Administrador',1,'ARL Sura',NULL,31),(9,8,'Profesor',2,'ARL Sura',NULL,32),(10,9,'Coordinador',1,'ARL Sura',NULL,33),(11,5,'Secretaria',2,'ARL Sura',NULL,34),(12,6,'Orientador',1,'ARL Sura',NULL,35),(13,2,'Coordinador General',1,'ARL Positiva',NULL,44),(18,40,'Profesor de MatemÃ¡ticas',NULL,'SURA',NULL,93),(19,41,'Profesora de Ciencias',NULL,'SURA',NULL,42),(20,44,'Profesor',NULL,'sura',NULL,87),(21,45,'profesor',NULL,'sura',NULL,82),(22,46,'Secretaria',NULL,'No aplica',NULL,90),(23,47,'Secretaria',NULL,'No aplica',NULL,88),(24,48,'Secretaria',NULL,'No aplica',NULL,83),(26,154,'Secretaria',NULL,'No aplica',NULL,51),(27,158,'profesor',NULL,'sura',NULL,29),(28,159,'Secretaria',NULL,'No aplica',NULL,30);
/*!40000 ALTER TABLE `funcionario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionario_grado`
--

DROP TABLE IF EXISTS `funcionario_grado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario_grado` (
  `id_funcionario_grado` int(11) NOT NULL,
  `id_funcionario` int(11) DEFAULT NULL,
  `id_grado` int(11) DEFAULT NULL,
  `rol` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_funcionario_grado`),
  KEY `id_grado` (`id_grado`),
  KEY `funcionario_grado_ibfk_1` (`id_funcionario`),
  CONSTRAINT `funcionario_grado_ibfk_1` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE CASCADE,
  CONSTRAINT `funcionario_grado_ibfk_2` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario_grado`
--

LOCK TABLES `funcionario_grado` WRITE;
/*!40000 ALTER TABLE `funcionario_grado` DISABLE KEYS */;
INSERT INTO `funcionario_grado` VALUES (1,1,2,'Director'),(2,1,3,NULL),(3,18,6,NULL),(4,19,12,NULL),(5,20,1,NULL),(6,20,1,NULL),(7,20,1,NULL),(8,21,2,NULL),(9,21,2,NULL),(10,6,7,NULL),(11,6,7,NULL),(12,6,7,NULL),(13,6,7,NULL),(14,6,7,NULL),(15,6,7,NULL),(16,6,7,NULL),(17,6,7,NULL),(18,20,9,NULL),(19,20,12,NULL),(20,20,1,NULL);
/*!40000 ALTER TABLE `funcionario_grado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grado`
--

DROP TABLE IF EXISTS `grado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grado` (
  `id_grado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_grado` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_grado`),
  UNIQUE KEY `nombre_grado` (`nombre_grado`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grado`
--

LOCK TABLES `grado` WRITE;
/*!40000 ALTER TABLE `grado` DISABLE KEYS */;
INSERT INTO `grado` VALUES (1,'Preescolar',NULL),(2,'Primero B',NULL),(3,'Segundo',NULL),(4,'Tercero',NULL),(5,'Cuarto',NULL),(6,'Quinto',NULL),(7,'Sexto',NULL),(8,'Septimo',NULL),(9,'Obtabo',NULL),(10,'Noveno',NULL),(11,'Decimo',NULL),(12,'Decimo Primero',NULL);
/*!40000 ALTER TABLE `grado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grado_asistencia`
--

DROP TABLE IF EXISTS `grado_asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grado_asistencia` (
  `id_grado_asistencia` int(11) NOT NULL AUTO_INCREMENT,
  `id_grado` int(11) NOT NULL,
  `id_funcionario` int(11) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id_grado_asistencia`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grado_asistencia`
--

LOCK TABLES `grado_asistencia` WRITE;
/*!40000 ALTER TABLE `grado_asistencia` DISABLE KEYS */;
INSERT INTO `grado_asistencia` VALUES (1,1,1,'2025-01-01'),(2,12,1,'2025-07-25'),(3,11,1,'2025-07-25');
/*!40000 ALTER TABLE `grado_asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gravedad_observacion`
--

DROP TABLE IF EXISTS `gravedad_observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gravedad_observacion` (
  `id_gravedad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id_gravedad`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gravedad_observacion`
--

LOCK TABLES `gravedad_observacion` WRITE;
/*!40000 ALTER TABLE `gravedad_observacion` DISABLE KEYS */;
INSERT INTO `gravedad_observacion` VALUES (3,'Grave'),(1,'Leve'),(2,'Moderada');
/*!40000 ALTER TABLE `gravedad_observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_observacion`
--

DROP TABLE IF EXISTS `historial_observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_observacion` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_observacion` int(11) NOT NULL,
  `fecha_modificacion` datetime NOT NULL,
  `descripcion_modificacion` varchar(255) NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_observacion` (`id_observacion`),
  CONSTRAINT `historial_observacion_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observacion` (`id_observacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_observacion`
--

LOCK TABLES `historial_observacion` WRITE;
/*!40000 ALTER TABLE `historial_observacion` DISABLE KEYS */;
INSERT INTO `historial_observacion` VALUES (1,8,'2025-06-30 16:02:47','ActualizaciÃ³n de observaciÃ³n'),(2,8,'2025-07-01 21:54:10','la joven no quiso hacer una tarea'),(3,8,'2025-07-01 22:02:55','la joben si iso la tarea y termino de ultima'),(4,8,'2025-07-01 22:02:55','la joben si iso la tarea y termino de ultima'),(5,4,'2025-07-29 12:23:34','La observaciÃ³n fue actualizada'),(6,4,'2025-07-29 12:26:19','La observaciÃ³n fue actualizada nuevamente'),(7,22,'2025-07-29 13:11:36','flojo'),(8,43,'2025-08-20 00:01:34','Se actualizó: el estudiante si gtrajo la tarea');
/*!40000 ALTER TABLE `historial_observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_pqr`
--

DROP TABLE IF EXISTS `historial_pqr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_pqr` (
  `id_historial_pqr` int(11) NOT NULL AUTO_INCREMENT,
  `id_pqr` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `id_estado_pqr` int(11) NOT NULL,
  PRIMARY KEY (`id_historial_pqr`),
  KEY `fk_historial_pqr_pqr` (`id_pqr`),
  KEY `fk_historial_pqr_usuario` (`id_usuario`),
  KEY `fk_historial_pqr_estado` (`id_estado_pqr`),
  CONSTRAINT `fk_historial_pqr_estado` FOREIGN KEY (`id_estado_pqr`) REFERENCES `estado_pqr` (`id_estado_pqr`) ON UPDATE CASCADE,
  CONSTRAINT `fk_historial_pqr_pqr` FOREIGN KEY (`id_pqr`) REFERENCES `pqr` (`id_pqr`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_historial_pqr_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_pqr`
--

LOCK TABLES `historial_pqr` WRITE;
/*!40000 ALTER TABLE `historial_pqr` DISABLE KEYS */;
INSERT INTO `historial_pqr` VALUES (1,4,2,'si claro dejame revisar y te doy una respuesta','2025-08-27 05:02:41',2);
/*!40000 ALTER TABLE `historial_pqr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nivel_escolaridad`
--

DROP TABLE IF EXISTS `nivel_escolaridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivel_escolaridad` (
  `id_escolaridad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_escolaridad`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivel_escolaridad`
--

LOCK TABLES `nivel_escolaridad` WRITE;
/*!40000 ALTER TABLE `nivel_escolaridad` DISABLE KEYS */;
INSERT INTO `nivel_escolaridad` VALUES (6,'Doctorado'),(4,'EspecializaciÃ³n'),(3,'Licenciatura'),(5,'MaestrÃ­a'),(1,'TÃ©cnico'),(2,'TecnÃ³logo');
/*!40000 ALTER TABLE `nivel_escolaridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_observacion` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `id_estado_notificacion` int(11) NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_observacion` (`id_observacion`),
  KEY `id_estado_notificacion` (`id_estado_notificacion`),
  CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observacion` (`id_observacion`),
  CONSTRAINT `notificacion_ibfk_2` FOREIGN KEY (`id_estado_notificacion`) REFERENCES `estado_notificacion` (`id_estado_notificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion_canal`
--

DROP TABLE IF EXISTS `notificacion_canal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion_canal` (
  `id_notificacion` int(11) NOT NULL,
  `id_canal` int(11) NOT NULL,
  `fecha_envio` datetime NOT NULL,
  PRIMARY KEY (`id_notificacion`,`id_canal`),
  KEY `id_canal` (`id_canal`),
  CONSTRAINT `notificacion_canal_ibfk_1` FOREIGN KEY (`id_notificacion`) REFERENCES `notificacion` (`id_notificacion`),
  CONSTRAINT `notificacion_canal_ibfk_2` FOREIGN KEY (`id_canal`) REFERENCES `canal_notificacion` (`id_canal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion_canal`
--

LOCK TABLES `notificacion_canal` WRITE;
/*!40000 ALTER TABLE `notificacion_canal` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacion_canal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observacion`
--

DROP TABLE IF EXISTS `observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observacion` (
  `id_observacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_estudiante` int(11) NOT NULL,
  `id_funcionario` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` text NOT NULL,
  `id_gravedad` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  PRIMARY KEY (`id_observacion`),
  KEY `id_gravedad` (`id_gravedad`),
  KEY `id_categoria` (`id_categoria`),
  KEY `idx_observacion_funcionario_fecha` (`id_funcionario`,`fecha`),
  KEY `idx_observacion_estudiante_fecha` (`id_estudiante`,`fecha`),
  CONSTRAINT `observacion_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE,
  CONSTRAINT `observacion_ibfk_2` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE CASCADE,
  CONSTRAINT `observacion_ibfk_3` FOREIGN KEY (`id_gravedad`) REFERENCES `gravedad_observacion` (`id_gravedad`),
  CONSTRAINT `observacion_ibfk_4` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_observacion` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observacion`
--

LOCK TABLES `observacion` WRITE;
/*!40000 ALTER TABLE `observacion` DISABLE KEYS */;
INSERT INTO `observacion` VALUES (4,1,1,'2025-06-29','La observaciÃ³n fue actualizada nuevamente',1,1),(7,1,2,'2025-06-29','El estudiante llegÃ³ tarde a clase.',1,1),(8,1,2,'2025-06-30','la joben si iso la tarea y termino de ultima',2,1),(9,1,9,'2025-07-01','el estudiante lleva 3 meses en mora por falta de pagos por favor dirijase a la institucion para hacer acuerdo de pago',3,4),(10,3,9,'2025-07-01','el estudiante no quiso hacer la tarea en clase por favor ablar con el ',1,1),(11,3,9,'2025-07-01','asdasdDBIULBUEWQFDBUQBWCFAC _',3,1),(12,1,9,'2025-07-01','ÃLASDNASLKNDAKSNDIWNHIDA',1,1),(13,3,9,'2025-07-01','pasfsahuifnhiuafen',2,1),(14,3,9,'2025-07-01','lasdniasndinas',2,4),(15,1,9,'2025-07-01','auhsdigdwgqaidsub',2,3),(20,1,9,'2025-07-03','no entro a clase',1,2),(21,1,9,'2025-07-03','lkshdfnouhwbGFBIEU<',3,2),(22,16,9,'2025-07-29','flojo',3,2),(36,91,9,'2025-07-30','el estudiante no trajo el uniforme correcto',2,1),(37,1,9,'2025-07-31','El estudiante tuvo una conducta inadecuada en clase.',2,2),(38,1,9,'2025-08-01','Prueba de notificaciÃ³n por correo automÃ¡tico',2,2),(39,1,9,'2025-08-01','Prueba de notificaciÃ³n por correo automÃ¡tico',2,2),(40,116,9,'2025-08-01','Prueba de notificaciÃ³n por correo automÃ¡tico',2,2),(41,103,9,'2025-08-01','Prueba de notificaciÃ³n por correo automÃ¡tico',2,2),(42,15,9,'2025-08-01','el estudiante no hace las tareas',2,1),(43,119,9,'2025-08-11','el estudiante si gtrajo la tarea',2,1),(44,119,9,'2025-08-12','el estudiante no trajo el uniforme completo',1,2),(45,119,9,'2025-08-13','el estudiante no respeto a un profesor y le dijo groserias',3,3),(46,119,9,'2025-08-20','prueba 19 08 25',2,1);
/*!40000 ALTER TABLE `observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `id_persona` int(11) NOT NULL AUTO_INCREMENT,
  `numero_documento` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `ciudad_residencia` varchar(100) DEFAULT NULL,
  `tipo_sangre` varchar(5) DEFAULT NULL,
  `discapacidad` enum('Sí','No') DEFAULT NULL,
  `ocupacion` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `foto` longblob DEFAULT NULL,
  `id_sexo` int(11) NOT NULL,
  `id_tipo_documento` int(11) NOT NULL,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `uq_persona_numdoc` (`numero_documento`),
  KEY `idx_persona_sexo` (`id_sexo`),
  KEY `idx_persona_tipo_doc` (`id_tipo_documento`),
  CONSTRAINT `fk_persona_sexo` FOREIGN KEY (`id_sexo`) REFERENCES `sexo` (`id_sexo`),
  CONSTRAINT `fk_persona_tipo_doc` FOREIGN KEY (`id_tipo_documento`) REFERENCES `tipo_documento` (`id_tipo_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,'1001','Juan','PÃ©rez','juan.perez@email.com','3001234567',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),(2,'1001001','Valentina','MuÃ±oz GarcÃ­a','valentina1@email.com','3101234561','Calle 12 #45-67','BogotÃ¡','O+','No','Estudiante','2018-03-12',NULL,2,1),(3,'1001002','Santiago','Lopez Rojas','santiago1@email.com','3129876542','Cra 9 #80-12','MedellÃ­n','A-','No','Estudiante','2018-05-22',NULL,1,1),(4,'10010025','marlo','gomez','marlongomez@gmail.com','300000001','modelia','bogota','o+','No','estudiante','2016-01-25',NULL,1,1),(5,'10010026','lorena','lopez','lorena@gmail.com','3815488854','calle 4 sur 20-30','bogota','o+','No','estudiante','2015-01-22',NULL,2,2),(6,'10010027','pablo','moreno','pabloL@gmail.com','34846318486','cll 4#14-22','bogota','o+','No','estudiante','2018-01-15',NULL,1,2),(7,'1001003','Isabela','RamÃ­rez DÃ­az','isabela2@email.com','3014567890','Av 30 #33-21','Cali','B+','No','Estudiante','2017-01-30',NULL,2,1),(8,'1001004','Mateo','Torres Pardo','mateo2@email.com','3057891234','Mz 6 Lt 8','Barranquilla','AB+','No','Estudiante','2017-06-19',NULL,1,1),(9,'1001005','Mariana','GÃ³mez SuÃ¡rez','mariana3@email.com','3104445566','Cl 10 #5-70','Cartagena','O-','No','Estudiante','2016-12-12',NULL,2,1),(10,'1001006','Samuel','Mendoza Arias','samuel3@email.com','3148889900','Cra 2 #30-50','Pereira','A+','','Estudiante','2016-07-07',NULL,1,1),(11,'1001007','Luciana','PÃ©rez BeltrÃ¡n','luciana4@email.com','3209991122','Cl 15 #44-11','Manizales','B-','No','Estudiante','2015-10-15',NULL,2,1),(12,'1001008','Emiliano','CastaÃ±o Vargas','emiliano4@email.com','3135556677','Barrio San Jorge','Bucaramanga','O+','No','Estudiante','2015-03-25',NULL,1,1),(13,'1001009','Gabriela','Morales NiÃ±o','gabriela5@email.com','3171112233','Cl 7 #8-90','Neiva','AB-','No','Estudiante','2014-09-10',NULL,2,1),(14,'1001010','David','Salazar PeÃ±a','david5@email.com','3003334455','Cra 5 #17-30','Armenia','O+','No','Estudiante','2014-01-18',NULL,1,1),(15,'1001011','Antonia','LÃ³pez Romero','antonia6@email.com','3016667788','Cll 32 #12-65','Villavicencio','B+','No','Estudiante','2013-02-05',NULL,2,1),(16,'1001012','TomÃ¡s','RÃ­os Camargo','tomas6@email.com','3194445566','Cl 40 #9-10','CÃºcuta','A-','No','Estudiante','2013-08-08',NULL,1,1),(17,'1001013','Julieta','Navarro Rico','julieta7@email.com','3042223344','Av 50 #20-30','IbaguÃ©','O+','No','Estudiante','2012-04-14',NULL,2,1),(18,'1001014','BenjamÃ­n','Quiroz Serrano','benjamin7@email.com','3180001112','Cra 7 #22-40','Sincelejo','AB+','','Estudiante','2012-12-01',NULL,1,1),(19,'1001015','Amanda','VelÃ¡squez Hoyos','amanda8@email.com','3113332221','Mz A Lt 4','PopayÃ¡n','B-','No','Estudiante','2011-06-30',NULL,2,1),(20,'1001016','MartÃ­n','Valencia Cruz','martin8@email.com','3157778899','Cl 3 #1-60','Riohacha','A+','No','Estudiante','2011-10-23',NULL,1,1),(21,'1001017','Sara','Ocampo Silva','sara9@email.com','3161234567','Cra 8 #4-25','MonterÃ­a','O-','No','Estudiante','2010-11-11',NULL,2,1),(22,'1001018','Alejandro','Correa Baquero','alejandro9@email.com','3103216549','CallejÃ³n 5','Santa Marta','B+','No','Estudiante','2010-03-09',NULL,1,1),(23,'1001019','Renata','Fajardo Ortega','renata10@email.com','3023334455','Barrio Libertador','Florencia','A-','No','Estudiante','2009-12-15',NULL,2,1),(24,'1001020','Juan JosÃ©','GonzÃ¡lez Torres','juanjose10@email.com','3189876540','Cra 3 #22-99','Tunja','O+','','Estudiante','2009-04-17',NULL,1,1),(25,'1001021','Laura','Vallejo MÃ©ndez','laura11@email.com','3059996655','Cl 9 #15-20','Yopal','AB-','No','Estudiante','2008-05-19',NULL,2,1),(26,'1001022','Dylan','Osorio RincÃ³n','dylan11@email.com','3077778888','Cra 10 #10-10','Pasto','B+','No','Estudiante','2008-11-02',NULL,1,1),(27,'1001023','SalomÃ©','Cuellar Bernal','salome12@email.com','3090001112','Cll 6 #2-30','QuibdÃ³','A+','No','Estudiante','2007-07-27',NULL,2,1),(28,'1001024','JerÃ³nimo','Barrios LondoÃ±o','jeronimo12@email.com','3012223344','Av Las Palmas','San AndrÃ©s','O-','No','Estudiante','2007-01-01',NULL,1,1),(29,'1030672573','sebastia','lizcano','juanslizcano@yahoo.es','184156849','engativa','bogota','o+','No',NULL,'1997-06-10',NULL,1,1),(30,'1129844703','brajar','medina','16.medinasilvabrajhan.805@gmail.com','3121848651581','bosa','bogota','o+','No',NULL,'2000-06-22',NULL,1,1),(31,'1151472244','abel','moreno','juan.perez@example.com',NULL,'Cra 10 #20-30','BogotÃ¡','O+','No','Profesor','1990-01-15',NULL,1,1),(32,'1151472245','MarÃ­a','GÃ³mez','maria.gomez@example.com',NULL,'Calle 45 #12-34','MedellÃ­n','A+','No','PsicÃ³loga','1988-05-23',NULL,2,1),(33,'1151472246','Carlos','RodrÃ­guez','carlos.rod@example.com',NULL,'Av 68 #33-21','Cali','B+','No','Coordinador','1992-11-10',NULL,1,1),(34,'1151472247','Ana','MartÃ­nez','ana.martinez@example.com',NULL,'Carrera 7 #14-10','Barranquilla','AB+','No','Secretaria','1995-03-30',NULL,2,1),(35,'1151472248','Luis','FernÃ¡ndez','luis.fernandez@example.com',NULL,'Calle 100 #25-60','Cartagena','O-','No','Orientador','1987-08-19',NULL,1,1),(36,'1151472265','maria','moreno','mariaMoreno','3126636996','soacha la capilla','soacha','o+','No','estudiante','2009-07-10',NULL,2,1),(37,'1151472465','marlo','moreno','marlon123456789@gmail.com','3172481710','soacha la capilla','soacha','o+','No','albaÃ±il','1990-09-21',NULL,1,1),(38,'115147523685','Maria Camila','Gutierres','mariacamila806@gmail.com','3224859201','calle 6 sur #86a-24','bogota','o+','No','ama de casa','2000-06-29',NULL,2,1),(39,'1151478522','juan','gomez','juan@gmail.com','3214567899','kenedy',NULL,NULL,NULL,'albaÃ±il',NULL,NULL,1,1),(40,'1151478839','maria','GÃ³mez','Maria@email.com','3255158412','Calle 15 # 24 - 14',NULL,'A+',NULL,NULL,'1998-04-21',NULL,2,1),(41,'12345678','Juan','PÃ©rez','juan@example.com','123456789','Calle 123','BogotÃ¡','O+','No','Estudiante','2005-01-01',_binary 'foto-1751810899570-156893553.jpg',1,1),(42,'1234567890','Mariana','Torres','mariana.torres@colegio.edu.co','3024567890','Calle 25 #45-67','Cali','B+','No',NULL,NULL,NULL,2,1),(43,'1265418646','pedro','jose','pedro@gmail.com','3172481710','soacha la capilla','soacha','o-','','estudiante','2014-12-12',_binary 'foto-1751812737327-731220745.jpg',1,3),(44,'2001','Carlos','Coordinador','renatodescartes26@gmail.com','3001111111',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),(45,'26906042','carla','ollarvez','carla@gmail.com','3172481710','soacha la capilla','soacha','o+','','ama de casa','2000-10-15',NULL,2,3),(46,'3001','Laura','Estudiante','laura.estu@email.com','3002222222','Calle 123 #45-67','BogotÃ¡','O+','No','Estudiante','2005-04-12',NULL,2,1),(47,'3010','Pedro','GÃ³mez','pedro.gomez@email.com','3001234567','Calle 100 #10-10','MedellÃ­n','A+','No','Estudiante','2007-03-10',NULL,1,1),(48,'32165498','Yormary','GÃ³mez','yormary.gomez@email.com','3126547890','Avenida 15 #45-67',NULL,NULL,NULL,'Administradora',NULL,NULL,2,1),(49,'400001','MarÃ­a','LÃ³pez','maria.lopez1@example.com','3100000001','Av 1 #20-21','BogotÃ¡','O-','No','Docente','1985-03-12',NULL,2,1),(50,'400002','Jorge','Castro','jorge.castro1@example.com','3100000002','Av 2 #20-21','BogotÃ¡','A-','No','Ingeniero','1983-08-19',NULL,1,1),(51,'4000021','martina','godoi','martinaG@gmail.com','3156481523','suba','bogota','o+','No',NULL,'1996-06-19',NULL,2,1),(52,'4000025','jormary','rocha','leonmurcialiliana@gmail.com','30000000002','modelia','bogota','o+','No','ama de cassa','2000-01-27',NULL,2,1),(53,'400003','Carmen','MartÃ­nez','leonmurcialilianasofia@gmail.com','3100000003','Av 3 #20-21','MedellÃ­n','B-','No','Abogada','1980-06-25',NULL,2,1),(54,'400004','AndrÃ©s','SuÃ¡rez','andres.suarez2@example.com','3100000004','Av 4 #20-21','MedellÃ­n','AB-','No','Contador','1979-09-11',NULL,1,1),(55,'400005','LucÃ­a','RamÃ­rez','lucia.ramirez3@example.com','3100000005','Cra 5 #10-30','Cali','O+','No','Comerciante','1984-01-03',NULL,2,1),(56,'400006','Carlos','GÃ³mez','carlos.gomez3@example.com','3100000006','Cra 6 #11-31','Cali','A+','No','MÃ©dico','1982-07-07',NULL,1,1),(57,'400007','Patricia','Ortega','patricia.ortega4@example.com','3100000007','Cra 7 #12-32','Barranquilla','B+','No','Arquitecta','1987-10-05',NULL,2,1),(58,'400008','Luis','Mendoza','luis.mendoza4@example.com','3100000008','Cra 8 #13-33','Barranquilla','AB+','No','Veterinario','1981-04-16',NULL,1,1),(59,'400009','Sandra','Vargas','sandra.vargas5@example.com','3100000009','Cra 9 #14-34','Bucaramanga','O-','No','OdontÃ³loga','1986-11-21',NULL,2,1),(60,'400010','Fernando','RÃ­os','fernando.rios5@example.com','3100000010','Cra 10 #15-35','Bucaramanga','A-','No','Administrador','1980-12-30',NULL,1,1),(61,'400011','MÃ³nica','Reyes','monica.reyes6@example.com','3100000011','Cra 11 #16-36','Cartagena','B-','No','PsicÃ³loga','1985-06-14',NULL,2,1),(62,'400012','Pedro','Silva','pedro.silva6@example.com','3100000012','Cra 12 #17-37','Cartagena','AB-','No','Abogado','1978-02-02',NULL,1,1),(63,'400013','Adriana','CortÃ©s','adriana.cortes7@example.com','3100000013','Cra 13 #18-38','Manizales','O+','No','Ingeniera','1983-05-08',NULL,2,1),(64,'400014','Ricardo','PeÃ±a','ricardo.pena7@example.com','3100000014','Cra 14 #19-39','Manizales','A+','No','Contador','1977-09-18',NULL,1,1),(65,'400015','Natalia','Moreno','natalia.moreno8@example.com','3100000015','Cra 15 #20-40','IbaguÃ©','B+','No','Chef','1984-03-27',NULL,2,1),(66,'400016','Diego','Quintero','diego.quintero8@example.com','3100000016','Cra 16 #21-41','IbaguÃ©','AB+','No','DiseÃ±ador','1981-10-29',NULL,1,1),(67,'400017','VerÃ³nica','JimÃ©nez','veronica.jimenez9@example.com','3100000017','Cra 17 #22-42','Pereira','O-','No','Enfermera','1986-08-12',NULL,2,1),(68,'400018','Sergio','LeÃ³n','sergio.leon9@example.com','3100000018','Cra 18 #23-43','Pereira','A-','No','Administrador','1979-01-24',NULL,1,1),(69,'400019','Paola','Guerrero','paola.guerrero10@example.com','3100000019','Cra 19 #24-44','Villavicencio','B-','No','Docente','1982-05-15',NULL,2,1),(70,'400020','Ãlvaro','Nieto','alvaro.nieto10@example.com','3100000020','Cra 20 #25-45','Villavicencio','AB-','No','Ingeniero','1980-07-07',NULL,1,1),(71,'400021','Tatiana','MejÃ­a','tatiana.mejia11@example.com','3100000021','Cra 21 #26-46','CÃºcuta','O+','No','PsicÃ³loga','1985-04-11',NULL,2,1),(72,'400022','Oscar','Salazar','oscar.salazar11@example.com','3100000022','Cra 22 #27-47','CÃºcuta','A+','No','Veterinario','1983-11-03',NULL,1,1),(73,'400023','Diana','Torres','diana.torres12@example.com','3100000023','Cra 23 #28-48','Neiva','B+','No','Contadora','1987-02-19',NULL,2,1),(74,'400024','HÃ©ctor','Valencia','hector.valencia12@example.com','3100000024','Cra 24 #29-49','Neiva','AB+','No','Administrador','1981-09-09',NULL,1,1),(75,'4001','Marta','Acudiente','morenoabel806@gmail.com','3003333333',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1),(76,'40010026','marcos','lopez','marcosL@GMAIL.COM','3487416488','calle 4 sur 10-40','bogota','o+','No','independiente','2000-02-07',NULL,1,1),(77,'4002','MarÃ­a','GÃ³mez','maria.gomez@email.com','3003334444','Calle 50 #20-30','MedellÃ­n','O-','No','Madre','1985-02-02',NULL,2,1),(78,'4422475111','joaquin','Moreno','joaquin@email.com','3126996336','soacha la capilla','Soacha','O+','No','Profesor','1998-04-21',_binary 'foto.jpg',1,1),(79,'44544248745','marcos','medina','marcos@gmail.com','31264554441','Calle 8sur # 21 - 64','BogotÃ¡','A+','No','pintor','2000-04-21',NULL,1,1),(80,'4457893254','sebastia','gomez','sebastian_g@email.com','3126636996','Calle 10 # 22 - 14','BogotÃ¡','A+','No','domiciliario','1998-04-21',NULL,1,1),(81,'5001','Sandra','Secretaria','sandra.sec@email.com','3004444444',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1),(82,'531684946151','paola','contreras','paola@gmail.com','3158614494651','kenedy','bogota','o-','No',NULL,'1992-01-22',NULL,2,1),(83,'54684864','maria','moreno','maria@gmail.com','3468515486','soacha compartir','soacha','o+','No',NULL,'1997-06-17',NULL,2,1),(84,'548465498','marlo','gomez','marlon@gmail.com','31846486153','suba','bogota','o+','No','estudinate','2017-02-10',NULL,1,6),(85,'554615449846','maria','pulido','mariap@gmail.com','31264564851','kenedy','bogota','o-','No','estudiante','2025-01-30',NULL,2,6),(86,'6001','Luis','Rector','luis.rector@email.com','3005555555',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),(87,'6798746148','jesus','ropero','jesus@gmail.com','36484165','salitre','bogota','o-','No',NULL,'1980-10-20',NULL,1,1),(88,'6874153','camila','vermez','camila@gmail.com','5348679846','madrid','cundinamarca','o+','No',NULL,'2000-10-20',NULL,2,1),(89,'687846518','joni','guzma','joni@gmail.com','348641348','suba','bogota','o+','No','albaÃ±il','1996-10-20',NULL,1,1),(90,'79867453','manuel','martinez','manuelM@gmail.com','38461335486','salitre','bogota','o+','No',NULL,'1992-10-20',NULL,1,1),(91,'87654321','MarÃ­a','LÃ³pez','maria@example.com','987654321','Carrera 7','BogotÃ¡','A+','No','Independiente','1980-05-10',NULL,2,1),(92,'98765432','Carla','MartÃ­nez','carla.martinez@email.com','3019876543','Carrera 10 #20-30','MedellÃ­n','A+','No','Estudiante','2011-03-15',NULL,2,1),(93,'987654321','Laura','GonzÃ¡lez','laura.gonzalez@colegio.edu.co','3101234567','Calle 10 #20-30','BogotÃ¡','A+','No',NULL,NULL,NULL,2,1),(94,'999999999','Funcionario','Prueba','funcionario@prueba.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),(95,'benavides','uf26906042','marlo','marlon2647@gmail.com','','bosa','bogota','o+','No','estudiante','2017-06-23',NULL,1,2),(96,'f2548624','marcos','godoi','marcosGodoy@gmail.com','3484651351','bosa','boogta','o-','No','estudiante','2016-07-21',NULL,1,2),(97,'GENUSR_34','funcionario','prueba','funcionario.prueba@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,1),(98,'GENUSR_35','orientador','prueba','orientador.prueba@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,1),(128,'GENFUNC_1','funcionario','placeholder','func_1@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,1),(129,'GENFUNC_2','funcionario','placeholder','func_2@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,1),(130,'GENFUNC_3','funcionario','placeholder','func_3@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,1);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona_map`
--

DROP TABLE IF EXISTS `persona_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona_map` (
  `numero_documento` varchar(20) NOT NULL,
  `id_persona` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`numero_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona_map`
--

LOCK TABLES `persona_map` WRITE;
/*!40000 ALTER TABLE `persona_map` DISABLE KEYS */;
INSERT INTO `persona_map` VALUES ('1001',1),('1001001',2),('1001002',3),('10010025',4),('10010026',5),('10010027',6),('1001003',7),('1001004',8),('1001005',9),('1001006',10),('1001007',11),('1001008',12),('1001009',13),('1001010',14),('1001011',15),('1001012',16),('1001013',17),('1001014',18),('1001015',19),('1001016',20),('1001017',21),('1001018',22),('1001019',23),('1001020',24),('1001021',25),('1001022',26),('1001023',27),('1001024',28),('1030672573',29),('1129844703',30),('1151472244',31),('1151472245',32),('1151472246',33),('1151472247',34),('1151472248',35),('1151472265',36),('1151472465',37),('115147523685',38),('1151478522',39),('1151478839',40),('12345678',41),('1234567890',42),('1265418646',43),('2001',44),('26906042',45),('3001',46),('3010',47),('32165498',48),('400001',49),('400002',50),('4000021',51),('4000025',52),('400003',53),('400004',54),('400005',55),('400006',56),('400007',57),('400008',58),('400009',59),('400010',60),('400011',61),('400012',62),('400013',63),('400014',64),('400015',65),('400016',66),('400017',67),('400018',68),('400019',69),('400020',70),('400021',71),('400022',72),('400023',73),('400024',74),('4001',75),('40010026',76),('4002',77),('4422475111',78),('44544248745',79),('4457893254',80),('5001',81),('531684946151',82),('54684864',83),('548465498',84),('554615449846',85),('6001',86),('6798746148',87),('6874153',88),('687846518',89),('79867453',90),('87654321',91),('98765432',92),('987654321',93),('999999999',94),('benavides',95),('f2548624',96),('GENFUNC_1',128),('GENFUNC_2',129),('GENFUNC_3',130),('GENUSR_34',97),('GENUSR_35',98);
/*!40000 ALTER TABLE `persona_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pqr`
--

DROP TABLE IF EXISTS `pqr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pqr` (
  `id_pqr` int(11) NOT NULL AUTO_INCREMENT,
  `id_acudiente` int(11) NOT NULL,
  `id_estudiante` int(11) DEFAULT NULL,
  `id_tipo_pqr` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  `id_estado_pqr` int(11) NOT NULL,
  PRIMARY KEY (`id_pqr`),
  KEY `id_tipo_pqr` (`id_tipo_pqr`),
  KEY `pqr_ibfk_1` (`id_acudiente`),
  KEY `pqr_ibfk_2` (`id_estudiante`),
  KEY `idx_estado_pqr` (`id_estado_pqr`),
  CONSTRAINT `pqr_ibfk_1` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`) ON DELETE CASCADE,
  CONSTRAINT `pqr_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE,
  CONSTRAINT `pqr_ibfk_3` FOREIGN KEY (`id_tipo_pqr`) REFERENCES `tipo_pqr` (`id_tipo_pqr`),
  CONSTRAINT `pqr_ibfk_4` FOREIGN KEY (`id_estado_pqr`) REFERENCES `estado_pqr` (`id_estado_pqr`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pqr`
--

LOCK TABLES `pqr` WRITE;
/*!40000 ALTER TABLE `pqr` DISABLE KEYS */;
INSERT INTO `pqr` VALUES (2,1,1,1,'nesecito informacion de la instutucion','2025-06-30',1),(3,67,1,1,'por favor pueden revisar las asistencias de mi hijo','2025-08-11',1),(4,67,119,1,'me podrian ayudar a revisar las asistencias de mi hijo por favor del dia ','2025-08-15',2);
/*!40000 ALTER TABLE `pqr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relacion_acudiente`
--

DROP TABLE IF EXISTS `relacion_acudiente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relacion_acudiente` (
  `id_relacion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id_relacion`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relacion_acudiente`
--

LOCK TABLES `relacion_acudiente` WRITE;
/*!40000 ALTER TABLE `relacion_acudiente` DISABLE KEYS */;
INSERT INTO `relacion_acudiente` VALUES (6,'Abuela'),(5,'Abuelo'),(8,'Hermana'),(7,'Hermano'),(2,'Madre'),(9,'Otro'),(1,'Padre'),(4,'TÃ­a'),(3,'TÃ­o');
/*!40000 ALTER TABLE `relacion_acudiente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sexo`
--

DROP TABLE IF EXISTS `sexo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sexo` (
  `id_sexo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_sexo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sexo`
--

LOCK TABLES `sexo` WRITE;
/*!40000 ALTER TABLE `sexo` DISABLE KEYS */;
INSERT INTO `sexo` VALUES (2,'F'),(1,'M'),(3,'Otro');
/*!40000 ALTER TABLE `sexo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_documento`
--

DROP TABLE IF EXISTS `tipo_documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_documento` (
  `id_tipo_documento` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_documento`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_documento`
--

LOCK TABLES `tipo_documento` WRITE;
/*!40000 ALTER TABLE `tipo_documento` DISABLE KEYS */;
INSERT INTO `tipo_documento` VALUES (1,'CÃ©dula de ciudadanÃ­a'),(3,'CÃ©dula de extranjerÃ­a'),(5,'NIT'),(4,'Pasaporte'),(6,'Registro civil'),(2,'Tarjeta de identidad');
/*!40000 ALTER TABLE `tipo_documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_pqr`
--

DROP TABLE IF EXISTS `tipo_pqr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_pqr` (
  `id_tipo_pqr` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id_tipo_pqr`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_pqr`
--

LOCK TABLES `tipo_pqr` WRITE;
/*!40000 ALTER TABLE `tipo_pqr` DISABLE KEYS */;
INSERT INTO `tipo_pqr` VALUES (1,'Peticion'),(2,'Queja'),(3,'Reclamo'),(4,'Sugerencia');
/*!40000 ALTER TABLE `tipo_pqr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_usuario`
--

DROP TABLE IF EXISTS `tipo_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_usuario` (
  `id_tipo_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id_tipo_usuario`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_usuario`
--

LOCK TABLES `tipo_usuario` WRITE;
/*!40000 ALTER TABLE `tipo_usuario` DISABLE KEYS */;
INSERT INTO `tipo_usuario` VALUES (2,'Acudiente'),(6,'Administrativo'),(4,'Coordinador'),(1,'Estudiante'),(8,'Orientador'),(3,'Profesor'),(7,'Rector'),(5,'Secretaria');
/*!40000 ALTER TABLE `tipo_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `id_tipo_usuario` int(11) DEFAULT NULL,
  `id_estado_usuario` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `id_persona` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  KEY `id_tipo_usuario` (`id_tipo_usuario`),
  KEY `id_estado_usuario` (`id_estado_usuario`),
  KEY `idx_usuario_persona` (`id_persona`),
  CONSTRAINT `fk_usuario_estado` FOREIGN KEY (`id_estado_usuario`) REFERENCES `estado_usuario` (`id_estado_usuario`),
  CONSTRAINT `fk_usuario_persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`),
  CONSTRAINT `fk_usuario_tipo` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'ccoordinador','$2b$10$.6RWLP6iPfAa8tqkmACHBeu25PMR91s.fMUKsA0N1TyB8JgwDmIeS',4,1,'2025-06-29 08:05:59',44),(3,'lestudiante','123456',1,1,'2025-06-29 08:06:10',46),(4,'macudiente','$2b$10$6xZyuFvlO6aYhcg/w72ee.ElIGVCOjhqkus7Cj.zr5gRed0.DWYFa',2,1,'2025-06-29 08:06:23',75),(5,'ssecretaria','123456',5,1,'2025-06-29 08:07:27',81),(6,'lrector','123456',7,1,'2025-06-29 08:07:35',86),(7,'admin1','clave123',1,1,'2025-06-29 16:10:55',31),(8,'profe1','clave456',2,1,'2025-06-29 16:10:55',32),(9,'estu1','clave789',3,1,'2025-06-29 16:10:55',33),(10,'pedroest','123456',1,1,'2025-06-29 22:10:30',47),(12,'brajan_medina@gmail.com','clave1234',2,1,'2025-06-29 22:40:19',79),(13,'sebastian_g@email.com','clave1234',2,1,'2025-06-29 22:41:33',80),(14,'juanperez','contrasena_segura',2,1,'2025-06-30 08:25:14',1),(15,'Joaquin@gmail.com','clave123',1,1,'2025-07-01 13:57:29',78),(27,'carla98765432','$2b$10$chQHHEJ2SPZVex99TtG.4uQ8stgh/8foc/a8HySKzqbx/WZ11diZC',5,1,'2025-07-02 04:50:29',92),(28,'yormary32165498','$2b$10$chQHHEJ2SPZVex99TtG.4uQ8stgh/8foc/a8HySKzqbx/WZ11diZC',4,1,'2025-07-02 04:50:29',48),(30,'maria554615449846','$2b$10$MJsgEla3P64XeMKTq7mQ6.DzZsPuKWsz.75x.bImy.Cj6SrF1zFtK',5,1,'2025-07-02 12:51:23',85),(31,'juan1151478522','$2b$10$MJsgEla3P64XeMKTq7mQ6.DzZsPuKWsz.75x.bImy.Cj6SrF1zFtK',4,1,'2025-07-02 12:51:23',39),(34,'funcionario.prueba','123456',3,1,'2025-07-02 19:18:12',97),(35,'orientador.prueba','123456',8,1,'2025-07-02 19:19:49',98),(36,'est12345678','12345678',1,1,'2025-07-06 14:08:19',41),(37,'acu87654321','87654321',2,1,'2025-07-06 14:08:19',91),(38,'est1265418646','1265418646',1,1,'2025-07-06 14:38:57',43),(39,'acu26906042','26906042',2,1,'2025-07-06 14:38:57',45),(40,'laura.gonzalez','profesor2025',3,1,'2025-07-07 03:17:26',93),(41,'mariana.torres','profesora2025',3,1,'2025-07-07 03:18:59',42),(42,'est548465498','548465498',1,1,'2025-07-07 04:20:01',84),(43,'acu687846518','687846518',2,1,'2025-07-07 04:20:01',89),(44,'jesus@gmail.com','1151472244',3,1,'2025-07-07 04:35:25',87),(45,'paola@gmail.com','123456',3,1,'2025-07-09 12:31:25',82),(46,'79867453','79867453',5,1,'2025-07-09 13:05:31',90),(47,'6874153','6874153',5,1,'2025-07-09 13:08:53',88),(48,'54684864','54684864',5,1,'2025-07-09 13:29:35',83),(97,'estu1001001','123456',7,1,'2025-07-25 00:00:00',2),(98,'estu1001002','123456',7,1,'2025-07-25 00:00:00',3),(99,'estu1001003','123456',7,1,'2025-07-25 00:00:00',7),(100,'estu1001004','123456',7,1,'2025-07-25 00:00:00',8),(101,'estu1001005','123456',7,1,'2025-07-25 00:00:00',9),(102,'estu1001006','123456',7,1,'2025-07-25 00:00:00',10),(103,'estu1001007','123456',7,1,'2025-07-25 00:00:00',11),(104,'estu1001008','123456',7,1,'2025-07-25 00:00:00',12),(105,'estu1001009','123456',7,1,'2025-07-25 00:00:00',13),(106,'estu1001010','123456',7,1,'2025-07-25 00:00:00',14),(107,'estu1001011','123456',7,1,'2025-07-25 00:00:00',15),(108,'estu1001012','123456',7,1,'2025-07-25 00:00:00',16),(109,'estu1001013','123456',7,1,'2025-07-25 00:00:00',17),(110,'estu1001014','123456',7,1,'2025-07-25 00:00:00',18),(111,'estu1001015','123456',7,1,'2025-07-25 00:00:00',19),(112,'estu1001016','123456',7,1,'2025-07-25 00:00:00',20),(113,'estu1001017','123456',7,1,'2025-07-25 00:00:00',21),(114,'estu1001018','123456',7,1,'2025-07-25 00:00:00',22),(115,'estu1001019','123456',7,1,'2025-07-25 00:00:00',23),(116,'estu1001020','123456',7,1,'2025-07-25 00:00:00',24),(117,'estu1001021','123456',7,1,'2025-07-25 00:00:00',25),(118,'estu1001022','123456',7,1,'2025-07-25 00:00:00',26),(119,'estu1001023','123456',7,1,'2025-07-25 00:00:00',27),(120,'estu1001024','123456',7,1,'2025-07-25 00:00:00',28),(121,'acud400001','123456',6,1,'2025-07-25 00:00:00',49),(122,'acud400002','123456',6,1,'2025-07-25 00:00:00',50),(123,'acud400003','123456',6,1,'2025-07-25 00:00:00',53),(124,'acud400004','123456',6,1,'2025-07-25 00:00:00',54),(125,'acud400005','123456',6,1,'2025-07-25 00:00:00',55),(126,'acud400006','123456',6,1,'2025-07-25 00:00:00',56),(127,'acud400007','123456',6,1,'2025-07-25 00:00:00',57),(128,'acud400008','123456',6,1,'2025-07-25 00:00:00',58),(129,'acud400009','123456',6,1,'2025-07-25 00:00:00',59),(130,'acud400010','123456',6,1,'2025-07-25 00:00:00',60),(131,'acud400011','123456',6,1,'2025-07-25 00:00:00',61),(132,'acud400012','123456',6,1,'2025-07-25 00:00:00',62),(133,'acud400013','123456',6,1,'2025-07-25 00:00:00',63),(134,'acud400014','123456',6,1,'2025-07-25 00:00:00',64),(135,'acud400015','123456',6,1,'2025-07-25 00:00:00',65),(136,'acud400016','123456',6,1,'2025-07-25 00:00:00',66),(137,'acud400017','123456',6,1,'2025-07-25 00:00:00',67),(138,'acud400018','123456',6,1,'2025-07-25 00:00:00',68),(139,'acud400019','123456',6,1,'2025-07-25 00:00:00',69),(140,'acud400020','123456',6,1,'2025-07-25 00:00:00',70),(141,'acud400021','123456',6,1,'2025-07-25 00:00:00',71),(142,'acud400022','123456',6,1,'2025-07-25 00:00:00',72),(143,'acud400023','123456',6,1,'2025-07-25 00:00:00',73),(144,'acud400024','123456',6,1,'2025-07-25 00:00:00',74),(145,'est10010025','10010025',1,1,'2025-07-25 18:52:30',4),(146,'acu4000025','4000025',2,1,'2025-07-25 18:52:30',52),(147,'est10010026','10010026',1,1,'2025-07-30 13:34:24',5),(148,'acu40010026','40010026',2,1,'2025-07-30 13:34:24',76),(149,'est10010027','10010027',1,1,'2025-07-30 13:51:19',6),(151,'est1151472265','1151472265',1,1,'2025-08-05 00:08:06',36),(152,'acu1151472465','1151472465',2,1,'2025-08-05 00:08:06',37),(154,'martinaG@gmail.com','$2b$10$QLXVq8wfP/18QULueubAruSsAmGHtodzjTvl7R4DKs/NK6zXweUCS',5,1,'2025-08-09 19:43:10',51),(155,'estbenavides','$2b$10$N7PoFBCFx3pbVxsxtj2cS..RCTr6fGxxIaSgW3VkpQ6Rz9NWfqQzC',1,1,'2025-08-09 19:51:46',95),(156,'estf2548624','$2b$10$5k1LLaZBwBtg1YAQrRSVzee5fLHP5g9.C7MFUCMFzHP5W61qCwqD.',1,1,'2025-08-09 20:01:32',96),(157,'acu115147523685','$2b$10$xTAkli1g4ITNJQ.gxkCqheaq87rbyLXmf2DeTqobT/9SQXhezjIKa',2,1,'2025-08-09 20:01:32',38),(158,'sebastianlizcano@yahoo.con','$2b$10$Cg/fypUO3V4maFuKHDD9vuLGeXetX9GMjWEOKJ7OisTSCvffGN9Cy',3,1,'2025-08-11 23:56:44',29),(159,'16.medinasilvabrajhan.805@gmail.com','$2b$10$4PTkoWs/liOXQW7t8KwbgeG7acI8nTC/8aR3ZSIoH4s3krh1xK62C',5,1,'2025-08-12 00:10:31',30);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-30 19:03:38
