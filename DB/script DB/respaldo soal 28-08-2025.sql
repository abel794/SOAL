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
-- Table structure for table `acudiente`
--

DROP TABLE IF EXISTS `acudiente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acudiente` (
  `id_acudiente` int(11) NOT NULL AUTO_INCREMENT,
  `numero_documento` varchar(20) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_relacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_acudiente`),
  KEY `numero_documento` (`numero_documento`),
  KEY `id_usuario` (`id_usuario`),
  KEY `fk_acudiente_relacion` (`id_relacion`),
  CONSTRAINT `acudiente_ibfk_1` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`),
  CONSTRAINT `acudiente_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_acudiente_relacion` FOREIGN KEY (`id_relacion`) REFERENCES `relacion_acudiente` (`id_relacion`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acudiente`
--

LOCK TABLES `acudiente` WRITE;
/*!40000 ALTER TABLE `acudiente` DISABLE KEYS */;
INSERT INTO `acudiente` VALUES (1,'4001',4,NULL),(2,'4001',4,NULL),(4,'44544248745',12,NULL),(5,'4457893254',13,NULL),(10,'32165498',28,NULL),(11,'1151478522',31,NULL),(13,'87654321',37,NULL),(14,'26906042',39,NULL),(15,'687846518',43,NULL),(40,'400001',121,1),(41,'400002',122,1),(42,'400003',123,1),(43,'400004',124,1),(44,'400005',125,1),(45,'400006',126,1),(46,'400007',127,1),(47,'400008',128,1),(48,'400009',129,1),(49,'400010',130,1),(50,'400011',131,1),(51,'400012',132,1),(52,'400013',133,1),(53,'400014',134,1),(54,'400015',135,1),(55,'400016',136,1),(56,'400017',137,1),(57,'400018',138,1),(58,'400019',139,1),(59,'400020',140,1),(60,'400021',141,1),(61,'400022',142,1),(62,'400023',143,1),(63,'400024',144,1),(64,'4000025',146,NULL),(65,'40010026',148,NULL),(66,'1151472465',152,NULL),(67,'115147523685',157,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
INSERT INTO `asistencia` VALUES (2,1,3,'2025-06-29',1,NULL,1),(4,1,2,'2025-06-28',1,NULL,1),(5,1,1,'2025-06-28',1,NULL,1),(10,1,1,'2025-07-24',1,'LlegÃƒÂ³ tarde',1),(11,1,13,'2025-07-24',1,'LlegÃƒÂ³ tarde',1),(12,90,1,'2025-07-25',1,'Presente',1),(13,91,1,'2025-07-25',1,'Presente',1),(14,90,1,'2025-07-25',1,'',1),(15,91,1,'2025-07-25',4,'',1),(16,90,1,'2025-07-25',1,'',1),(17,91,1,'2025-07-25',4,'',1),(33,13,1,'2025-07-25',1,'P',2),(34,112,1,'2025-07-25',1,'P',2),(35,113,1,'2025-07-25',4,'J',2),(36,110,1,'2025-07-25',1,'P',3),(37,111,1,'2025-07-25',2,'A',3);
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria_observacion`
--

DROP TABLE IF EXISTS `auditoria_observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_observacion` (
  `id_auditoria` int(11) NOT NULL AUTO_INCREMENT,
  `id_observacion` int(11) DEFAULT NULL,
  `accion` varchar(10) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_auditoria`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_observacion`
--

LOCK TABLES `auditoria_observacion` WRITE;
/*!40000 ALTER TABLE `auditoria_observacion` DISABLE KEYS */;
INSERT INTO `auditoria_observacion` VALUES (1,4,'INSERT','2025-06-29 13:12:50'),(3,7,'INSERT','2025-06-29 22:21:39'),(4,8,'INSERT','2025-06-30 15:57:13'),(5,9,'INSERT','2025-07-01 21:08:30'),(6,10,'INSERT','2025-07-01 21:21:03'),(7,11,'INSERT','2025-07-01 21:37:24'),(8,12,'INSERT','2025-07-01 21:40:18'),(9,13,'INSERT','2025-07-01 23:28:54'),(10,14,'INSERT','2025-07-01 23:29:36'),(11,15,'INSERT','2025-07-01 23:51:31'),(12,20,'INSERT','2025-07-03 00:29:22'),(13,21,'INSERT','2025-07-03 00:51:50'),(14,22,'INSERT','2025-07-29 11:53:20'),(28,36,'INSERT','2025-07-30 18:37:08'),(29,37,'INSERT','2025-08-01 02:12:16'),(30,38,'INSERT','2025-08-01 02:13:49'),(31,39,'INSERT','2025-08-01 02:21:52'),(32,40,'INSERT','2025-08-01 02:29:44'),(33,41,'INSERT','2025-08-01 02:36:30'),(34,42,'INSERT','2025-08-01 02:39:33'),(35,43,'INSERT','2025-08-11 12:23:35'),(36,44,'INSERT','2025-08-12 00:13:40');
/*!40000 ALTER TABLE `auditoria_observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canal_notificacion`
--

DROP TABLE IF EXISTS `canal_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canal_notificacion` (
  `id_canal` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id_canal`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canal_notificacion`
--

LOCK TABLES `canal_notificacion` WRITE;
/*!40000 ALTER TABLE `canal_notificacion` DISABLE KEYS */;
INSERT INTO `canal_notificacion` VALUES (1,'correo'),(3,'SMS'),(2,'WhatsApp');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
-- Table structure for table `cita`
--

DROP TABLE IF EXISTS `cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cita` (
  `id_cita` int(11) NOT NULL AUTO_INCREMENT,
  `id_estudiante` int(11) NOT NULL,
  `id_acudiente` int(11) NOT NULL,
  `id_funcionario` int(11) NOT NULL,
  `fecha_cita` datetime NOT NULL,
  `motivo` text NOT NULL,
  `estado` varchar(20) DEFAULT 'Pendiente',
  PRIMARY KEY (`id_cita`),
  KEY `cita_ibfk_1` (`id_estudiante`),
  KEY `cita_ibfk_2` (`id_acudiente`),
  KEY `cita_ibfk_3` (`id_funcionario`),
  KEY `idx_fecha_cita` (`fecha_cita`),
  CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE,
  CONSTRAINT `cita_ibfk_2` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`) ON DELETE CASCADE,
  CONSTRAINT `cita_ibfk_3` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (1,1,2,3,'2025-07-01 15:00:00','ReuniÃƒÂ³n por bajo rendimiento','Pendiente'),(2,1,2,2,'2025-07-01 15:00:00','incumplimiento en traer el uniforme ','Pendiente'),(3,1,1,2,'2025-07-03 13:00:00','falta de pagos','Pendiente'),(4,1,2,2,'2025-07-01 15:00:00','incumplimiento en traer el uniforme ','Pendiente'),(5,3,2,1,'2025-07-07 15:25:00','uoaoubcuabudacs','Pendiente'),(6,91,1,1,'2025-07-30 19:02:11','el estudiante no trae cuadernos','Pendiente'),(7,119,67,1,'2025-08-11 16:00:00','reunion de padres de familia','Pendiente'),(8,119,67,1,'2025-08-05 15:20:00','puerba de citas','Pendiente');
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion_sistema`
--

DROP TABLE IF EXISTS `configuracion_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion_sistema` (
  `id_configuracion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_colegio` varchar(150) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `anio_escolar` int(11) NOT NULL,
  `hora_cierre` time NOT NULL,
  `activar_anio` tinyint(1) DEFAULT 0,
  `medio_notificacion` enum('Correo','WhatsApp','Ambos') DEFAULT 'Correo',
  `horario_envio` enum('maÃƒÂ±ana','tarde','noche') DEFAULT 'maÃƒÂ±ana',
  `notificar_acudiente` tinyint(1) DEFAULT 1,
  `max_estudiantes_curso` int(11) DEFAULT 30,
  `mensaje_institucional` text DEFAULT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_configuracion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion_sistema`
--

LOCK TABLES `configuracion_sistema` WRITE;
/*!40000 ALTER TABLE `configuracion_sistema` DISABLE KEYS */;
INSERT INTO `configuracion_sistema` VALUES (1,'camilo descartes','soacha compartir','3126636996','abel_moreno@gmail.com','1751856374169.png',2025,'17:00:00',0,'Correo','',1,30,'','2025-08-27 23:24:21');
/*!40000 ALTER TABLE `configuracion_sistema` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_notificacion`
--

LOCK TABLES `estado_notificacion` WRITE;
/*!40000 ALTER TABLE `estado_notificacion` DISABLE KEYS */;
INSERT INTO `estado_notificacion` VALUES (2,'LeÃƒÂ­da'),(1,'LeÃƒÂ­do');
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
INSERT INTO `funcionario` VALUES (1,NULL,2,'Profesor',3,'Arl Sura',NULL),(2,NULL,5,'Profesor',2,'Arl Sura',NULL),(3,NULL,6,'Profesor',1,'Arl Sura',NULL),(6,'1001',14,'Profesor',1,'ARL Sura',NULL),(8,'1151472244',7,'Administrador',1,'ARL Sura',NULL),(9,'1151472245',8,'Profesor',2,'ARL Sura',NULL),(10,'1151472246',9,'Coordinador',1,'ARL Sura',NULL),(11,'1151472247',5,'Secretaria',2,'ARL Sura',NULL),(12,'1151472248',6,'Orientador',1,'ARL Sura',NULL),(13,'2001',2,'Coordinador General',1,'ARL Positiva',NULL),(18,'987654321',40,'Profesor de MatemÃƒÂ¡ticas',NULL,'SURA',NULL),(19,'1234567890',41,'Profesora de Ciencias',NULL,'SURA',NULL),(20,'6798746148',44,'Profesor',NULL,'sura',NULL),(21,'531684946151',45,'profesor',NULL,'sura',NULL),(22,'79867453',46,'Secretaria',NULL,'No aplica',NULL),(23,'6874153',47,'Secretaria',NULL,'No aplica',NULL),(24,'54684864',48,'Secretaria',NULL,'No aplica',NULL),(26,'4000021',154,'Secretaria',NULL,'No aplica',NULL),(27,'1030672573',158,'profesor',NULL,'sura',NULL),(28,'1129844703',159,'Secretaria',NULL,'No aplica',NULL);
/*!40000 ALTER TABLE `funcionario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionario_grado`
--

DROP TABLE IF EXISTS `funcionario_grado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario_grado` (
  `id_funcionario_grado` int(11) NOT NULL AUTO_INCREMENT,
  `id_funcionario` int(11) DEFAULT NULL,
  `id_grado` int(11) DEFAULT NULL,
  `rol` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_funcionario_grado`),
  KEY `id_grado` (`id_grado`),
  KEY `funcionario_grado_ibfk_1` (`id_funcionario`),
  CONSTRAINT `funcionario_grado_ibfk_1` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE CASCADE,
  CONSTRAINT `funcionario_grado_ibfk_2` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
INSERT INTO `historial_observacion` VALUES (1,8,'2025-06-30 16:02:47','ActualizaciÃƒÂ³n de observaciÃƒÂ³n'),(2,8,'2025-07-01 21:54:10','la joven no quiso hacer una tarea'),(3,8,'2025-07-01 22:02:55','la joben si iso la tarea y termino de ultima'),(4,8,'2025-07-01 22:02:55','la joben si iso la tarea y termino de ultima'),(5,4,'2025-07-29 12:23:34','La observaciÃƒÂ³n fue actualizada'),(6,4,'2025-07-29 12:26:19','La observaciÃƒÂ³n fue actualizada nuevamente'),(7,22,'2025-07-29 13:11:36','flojo'),(8,43,'2025-08-20 00:01:34','Se actualizÃ³: el estudiante si gtrajo la tarea');
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
-- Table structure for table `justificacion`
--

DROP TABLE IF EXISTS `justificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `justificacion` (
  `id_justificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_estudiante` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `motivo` text NOT NULL,
  `archivo` longblob DEFAULT NULL,
  PRIMARY KEY (`id_justificacion`),
  KEY `justificacion_ibfk_1` (`id_estudiante`),
  KEY `idx_justificacion_fecha` (`fecha`),
  CONSTRAINT `justificacion_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificacion`
--

LOCK TABLES `justificacion` WRITE;
/*!40000 ALTER TABLE `justificacion` DISABLE KEYS */;
INSERT INTO `justificacion` VALUES (1,1,'2025-06-30','Inasistencia por enfermedad',_binary 'nombre_archivo.pdf'),(2,1,'2025-08-11','tuvo una cita medica',_binary 'ÿ\Øÿ\à\0JFIF\0\0x\0x\0\0ÿ\Û\0C\0\n\n\n\r\rÿ\Û\0C		\r\rÿÀ\0$\0\Ş\"\0ÿ\Ä\0\0\0\0\0\0\0\0\0\0\0	\nÿ\Ä\0µ\0\0\0}\0!1AQa\"q2‘¡#B±ÁR\Ñğ$3br‚	\n\Z%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyzƒ„…†‡ˆ‰Š’“”•–—˜™š¢£¤¥¦§¨©ª²³´µ¶·¸¹º\Â\Ã\Ä\Å\Æ\Ç\È\É\Ê\Ò\Ó\Ô\Õ\Ö\×\Ø\Ù\Ú\á\â\ã\ä\å\æ\ç\è\é\êñòóôõö÷øùúÿ\Ä\0\0\0\0\0\0\0\0	\nÿ\Ä\0µ\0\0w\0!1AQaq\"2B‘¡±Á	#3Rğbr\Ñ\n$4\á%ñ\Z&\'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz‚ƒ„…†‡ˆ‰Š’“”•–—˜™š¢£¤¥¦§¨©ª²³´µ¶·¸¹º\Â\Ã\Ä\Å\Æ\Ç\È\É\Ê\Ò\Ó\Ô\Õ\Ö\×\Ø\Ù\Ú\â\ã\ä\å\æ\ç\è\é\êòóôõö÷øùúÿ\Ú\0\0\0?\0ıS¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Šò¿Ÿ´Ï€~\é\æ_\ë)ı¤Ëº\rÌ¬—“{„\È\Ú:ü\ÎTpy\Ï\Òm\Ù\ê•\å¿¿i¯†ÿ\0í¼U\â[k{Ğ»“L¶>}Ü˜rF}[Ş¿?~0ÁEüSñ»]\ïş­0£yp[\Ædš\\€ÓƒœF¨\éœ×‡ø3öuñ\×\í)\â)\æğ~#P¿ñ1\×5gò-!”\0\Èù\Ûnß‘™F2b-*œ•_\'ù\ì\r>[£\éßˆ¿ğU]O[¼ºµğ>‡m\á\Í&/.­­b\â\ì¦@\ÌpT\ß\Î6’ş½«\Ë#ı¾~3\éòÁ®\Å\â»\Ñ\æ“;¯`´VŸº\Í±\Ú¦v¯^\Çù\Û\âÁ_üø‰ÿ\0‡¢J¿0­Àh%ó¢¹‰‰\nÑ•å•Š‘\È‚¨µ\æh4m·\ZºÂ±’mM\Ô;>\\ªLJı\Üp0=HZ\ê”i·\Ë$\å»?`¿cÿ\0\ÚûEı©|7~«i^*\ÒHû~š*ñ±!\'‹<”8Á•<\n“ô5~_Á&¾j—Ÿ<añYôÿ\0®št«q/y¤–9ˆQx\é½kõ¹\çdhõ\n(¢ aEPEPEPEPEPEPEPEPX¾0ñ…ğÿ\0Ã·š÷‰5[]G´]ó^^H\ĞsÔ“ÀQ’I\0Mx¿\íûcø[\àd’\èv1Ÿø\á\ã\İ‹f\ãm¾~\ë\\\É\Ò1\ßo,x\à¸~g|sñ×Š~2\ê¿\Ûÿ\0¼VŒñ¾4\ï\r\ÚcˆŸù\ç\0>‡\ï·\'¹\íYN¬ \ì÷\íÔ¸Á\Èú£\ã·üN\èW1ü7[›-:IMµ½úÅ›\ë÷\Î\ÕXS››Ár0~Rp>ø™\á¿6½{©x\×K\Õô]bvóo¬¯\á\Ûx[±Ä­\Êml\à÷8šû?ö$ø\à\ß\rø!h/\ß}›\Ã\Ú2\Ï&ƒk\ÄVQ\Ä\íİºfu`Š3ƒ·b¸ùƒ\ã\Ï\Æû\ß\Ú+â¶«¬Ki™a-â¥¼›\î\"µUV„©cŒ\í\Ã6Ó‚I\ÆA\ç£šnRÿ\0†ò3©\ÙW\ì…û+i¿¼M¨\ëºı\äºg\ÃOmNòõÅ¹–m¡¸rp r\Ìù\á\nt.1ôÿ\0Å¿Û»\Ã\Ş\Ó\àğÀ\Í?O0\Ù\ÚùPkiöŒ¯—|on·mÛ²>Dğş³\âÏ‹¾Ò¾øKÔµkEš\ãPµ\Ğt«p±–F2\âF\00\"—û£\0cô\ÇÀ\ïø%M¬qY\ß|NÔ„¦2d\ZVš\à·8ù^\\`\06¨\íÖœ¤ª&\ï\éıu¹m¡ğœºW\Å?\ÚO\âµ\İ\Ü1\ê~5ñd“\å\îmÑ¥\n\àp#\ã8\0W\Ù\ßÿ\0\à“7·³E«üQ×„;	K\ÓXI!\çòüµú\à/†¾ø_¢¦“\áM\n\ËB°P3œAK\ã8.\ßy\Ï\'–$\×KM\Ô\ì%s\Şğ‡ğ\ÏÂ¶>ğ\íŠXivi¶8×©=Ùv=\Ít4QYQE\0QE\0QE\0QE\0QE\0QE\0QE\0QX^7ñÎ…ğ\ß\Â÷\Ş!ñ&¥“£\Ù&ù®n\0v\n;–\'€$œ\n\0×»¼ƒO´š\ê\êx\í­¡C$³L\á5%™\0\ÎM|ûLÿ\0ÁBVò\â\ïÂ¿õK{XÀ1\Ï\â0Á\ä“\ÔZ¯O_ˆ=0;Ÿı­¿nmG\ãÀ“Ãº[\\ø{Á·<*?}t ü­0œOº:\Ä<><\'\âO\\Ëªj72?“ö[Y$…Q ?ó\Óı\æ	\Æ:‚3Šp\Óq\ìõD×-ºG#P†=^ù\ËK¨M)¹¹’Fû\Ì\Íü\'\è2=k‹\Ó4õ\Ò|ckå¹Ÿ\Ã9ûe\æ—eo-\Ü\à†!c–`6a0Ÿ”pHº\é¾\Z\Ó4‹­I&w´³p\Ä8\n\×,:*m\'\'§Bq\è+\Ú~~\Ëş?ı¬`Ò¼½6ø\ÆFaª_À¦; ‘™F\Ñòƒ\Ô\æœi\Æ\Z¡9sh`ükı¡u\ÚV‰ğ\×\Â:Ö²‚-\Âz\Zıª[“\Z¯\Ï$€1\Æ\Ö2\Ì@\'5\î³ÿ\0ü_\Äş+6š\×Ä›\Çğv’Tğö›.û¶M¡B\É!\ÈO”(\Ç\Ì@À95ö§À?\ÙWÀ³Õ–\íM[­vX\Äw:\åâ‡º”c•Sÿ\0,\Óı…\ã\×8¯b¦\ä­d$ºœ\Ã/„~ø9\áô\Ñ|¡Zh–@\rşBfIˆ\è\ÒHr\Îy<±8\è0+°¢Š\ÌaE®ø“Iğ½—\Û5N\ÏJ´\Î\ß>öu…3\é– gÚ€4h¯ñG\í‡\à}\ì\Ò\ã\Ô|G!;C\Ù[ùqg=7\ÊW?U+Ô¼\ã\Í\'\â?†\íõ­V{yxx\åd…\ÇTqØlƒ\Ô(¢¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š\ä~&|NÑ¾x|\êZ´À\É!)mh‡÷—ı\Õƒ¹\ì=ğJú #ø¯ñgÃ¿|s\â?\İı\Ò/–8c¥¸“G\Zÿ\0~$ğ+ñ\Ãö¦ı¨¼YûGx‰¥\Õô\ï\ÚJ\ÇN\Ñ }\ĞD:	ñ¾Luc\Ó$Šô\Ú_Wñ\ïÆ¾·\â\rMKŒ•²\Ó-d)\r¥¾FB\ìp	bI$z\0—\é^Ó\Ş\â$Õ¬]øV»™61õ\äú\ïù\×Tiò\îd\å};\Ã\Z‡‡<C¡O¡k7SéšÔ€Gv\"/\î6d€½»y¤Ò¼=k­\ë6şÒ¥\Ô\ïõYgòeƒL³%‘sòw‘€p:ç ®\×ÃŸ³¯Œ¾6üE¶ğ÷4ûK‡€#\ßj\Ğ86v€¥ıÑ–=¯\Õ\ß\Ù\ËöNğ§\ìık6£Qk>4¿µK£»¼°¨‰3\Ô[«\Æ2’QĞ»¹jÏ™¿eoø&u¶˜Ö\'ø¶¿m¸L=¯…\ÖM\Ğ\Ä01ö‡¿<\ì\Ù\åkô\Ò\Î\r>\Ò[X#¶¶…qC\nH\ÔU\05“m\îVÁEp>*[ü5\ÒU£…oµY¿\ÔÚ–À\Î]\ÏP¼z‘Ğ‘ó>?øQ\Ò\Ş\âÿ\0\ÄCB±\ÈÜ¶N-ñ&|À~Hv>¬ñ_ü9\àxšö³g¦R\é\Ò6@:\ìŒeŸş\ry\'‰?km\"\Ù\ä‡\Ãú%ö­*\ç\İb\Ö=Fr\ç\èT\Zøo\Æÿ\0´¼;ux\ÖSÉ«\ŞJIsiw1î‘ºœ§=k\Ä|Yû_x‹QyWBÓ¡Ó”e_=Ç¿÷G\ãšW\Ğ\ï|wñ¶¶²‹^\ß@².ºdb<)\æ“sc\ï.\Êù“\Çÿ\0´€t\rFKC\Ä\'_\Õp\Èò[\È×³¿¦e$\çœ\é_ø\Ç\â‰|d\åµÿ\0\Ü\ß¢g%û¨¿(ü\0®3ûf+kˆ\åL\Ì\èÁ€eùI¹¢\ã\Øú[ÄŸµ½\ËÀğ\è\Z\"A\n>R\æô\ï ÿ\0º8ıkÛ¿\à›Ÿ´ş»7\í	ÿ\0Î¹¨5Î™\â{w·XÜ…ˆ•¤‰”@tÀ\ê]sœ\nøSñmŞ®C2ZÀO\r\äÀª[€2qÁ8qš\ÚøE­j:_\Å?	_XL\ë{kª\ÛKN\Î%R0)¥¨\é&Š+Í¾)ş\Ñ?ş[N\Ş$ñ\r´7‘FeşÍ¶>u\Û(\Ç>Rò#–À÷ I_DzM6I$.\ìVc€+ó7\â\Çü‹V¹½k_øv\ÛL±\r·\êgÏ¸u\ÏQ\Â/\à\îú×„øûö”ñw\Ç\Ï6\Îÿ\0Ä—²[\\BUb€ÊZ–`¬\Z;¥lñ<\Î¶7#9K”ıKø‰ûZü(øc\Ój\Ş/³¹¸¶Ì´Òƒ^Ì¤ƒ?\ï•ón¹ÿ\0T\Ò5\ãm\à¯\0\êZ´ \å¯uK”· ò\Æ8Ã0	\å…|\Ûğ«ö>ø\éñ+Á¶–ö^´Ğ¼9l’<K\ây\ŞÁo\äfK\å,m184Š ŒÀ9ñøôM\á‰µOkVmy¦³[\ŞZ	\Äf2\àŸ”\ã`p;8H\Â\r\Ú÷3s’W±÷F›ÿ\0=š{o¤ğœ3E2\İ\ÄY@%À³\rË˜ø\Ú~ğ¯°şübğ\ß\Æ\ß	G¯øn\è\Ë\ï.{y0%·“\Ø\àØ‚8 \×\äÇ‡üPÚµæ©¬\éf\×Lg¶û[…ºöA´ˆˆ$d…U\Æ\ŞF\0á³£¿\à——ú„>*ñŞ™û2+H^I`\Ä\ÓyŒ“\ßil{zQRšJ\è!6İ™ú#EW)¸QEcx¿Åºg¼;y­\êóı\Æ\Õ71,ç²¨\î\Äğ\0a|^ø¹ |ğe×ˆµû\Æ\nÁl„y—2\ãˆ\Ğz\ç \×\å\Ç\Æ_ŠºŸ\Ço¯‹&\×É…¦û¾ÿ\0³“ª\íSœƒİº“úkş\Ñ?u/Œ>9V¿/“bòGo¦\ÆC¤Qÿ\0\Æpû¾R[ó\Ğ\ÈüWªYFt\é`û>™p%-+eTyg¨½‰\\‘×k©C–-õ1r\æ~G+\ãÛ­I»\ÇW\Õñ0İµ‰e*z\Ïó®\çöWı‰|MûLj\ë9ŸEğ$2b\ãW•y¸#HWø¿\İı+\Üÿ\0gO\Ø\×Rı£|Ki\ã_$–~µ?\èv¸)&¦\È +9Ì˜º/v¯\Ó-+IÓ¼3£\Û\éú}¬\Zn™g(!Qq\"€\0šª\Ü÷\ê_-›\ì`ü0øYáƒ¾³ğ×„ô¨t­*\ÙxH\Ç\Ï+cI«¹\Ç$ÿ\0*\ë+ñ/\Ç/xa_\Î\Õã¼•@>]\ïsÿ\0/\áœ×‹ø\Ûö\Ôûx¼=¡£\à·\ÎH#\Ü\\`\ç\Üô÷\ãšXúš¼»\âg\í)ğÿ\0\áeÔš§ˆ-n/`RE…“‰¥,:)Û‡ı\â+óK\â\ï\íñ\â\İõıœ+]/Mi­b³‰6¬\Æ$\Ş\í.\Ô\áI$\ã=+\ägñ‰\Ö\ã-®Iy¨\ÜÄ¯31ñ51”f\ÜS\ÕnS‹ŠMõ>¥ø\Íûik-Õµ¥¿²Ò…\Óe¼¬O(^€ \00:gµó7Šş+I¯Ü´·7WÚ¬\Üşòy†rG\Ós‡0\Ìos\Ï(WƒXW\ZyŸSx4\äšõ	ù!f?€\æ®İ„Y¸ñ}\àW[tHWkÅ¸ü€¬{«û«\ãûù\ä—18úzWªxöYø©ñUMÁz¤û¹\Üğ\0zó\Í}#ğ÷ş	ñK\Ä\Í!\Ô4\ß\Û8\ÜL\æÉM«\È?ZVğ{)•%½¬·R¬p\ÄóH\ÜKø\nıøsÿ\0ˆøa\áÆŠjÚ§‰§–„0‚ ß‡$}k\Ñ|[\ì\íû&\Ú+?\ni3x€D-*\Ê\êCŒƒ!l„\ÏH<Ò„¯°´?üû0|Oø…,)£x7T•%’I 1‚:dg¯CùW¨ø[\à}\×\ì\ßñ\Ã$ñ¥Í´·ZEô:ƒh\Öá˜\Æ\áŒr8ÀŒü¤c9ö\Å}Eñ“öñW\Ä\ë¤\Ùk	\à\"h\Î\í6\Ë|œ¯&C7Ëœ\ã¥|±\âo\0‡\Õo\'\Ñ\ß\Ëi¬\ä\Ú#İ‘‰9A\ÇZ\Ò\n-Ù±7e¡õ\'\Åÿ\0\Û\Ë\Äa{]T¼Ñ´«›}\ÉŒ±¤ù2H»]\Ë…S…õŒŠO„ß±¬ÿ\0<!¬xÿ\0\Å-\'\Ãÿ\0*=İœÚ§\Ún\î @\În$Ga¶<c\ï0Kpÿ\0³\Â_x?W²ø•ñBd\Ğ<nök\è}aÁ\Z¿,\\‚[iR8\É5\Ö~Ú¿¶¥\ßÅ¾—\áK–Ğ¼-s T¸ \\j®€:|™\Ç$ğ{»]¿\È\İ\â,­—\æ|\ë\à¿Xk^#\Ò\æ·ğôÚ­ºjq,\Ã/Ú‹3&B‚¡@ö99*İ¾\0øoğ‡ö1\Ó.<_\ã¶Óµ‰3+^¦‘j\Ë4¶He˜ñ´™[_Cğ¯À‹n/Æ—\àñ¥¨\Ú\Ù{}=,å®\×\ÌÜ€yj@tf$?\ä÷¯rğü“\âÿ\0\Åqi©ø¶ò\\N\×w··{ù]\ç,<ò@\Ü\Ù\0Á\'R\å²W\Ğ\ã¼Üœ\ìô;\ßø)?Š|k\ã¦išN›\à\ÍFÒ³\ŞOö‹¦@3¸‘€¼!@\î\ëÁ¯’µ¿\\x\Ë\âî¡¨øv\ÛS\×nõPóÎ\Û=\ÌòL\ç;”\àŸŸ\çØ{\×\è§\Ãø&\'Â,x€\ßø\Îö3¹ô¦(Y¹ùŠ!\É<‘’ß…}A\á\0xg\áı€²ğÖ¦\è6»B˜ô\ëT„07mq÷95*¤b½\Ô_?/şşÅ¿~&\èvö\Úç‡Ÿ\Â6_\Úmt«J±#*\Ø+\0÷`@8QŒc­~‹|ø¡|ğRh:;Is,\ç]\ßOş²\âOS\èaÚ½&Š\ÆSr\Ü\ÑEG`¢¸ß‰ÿ\0ü5ğ‹CmO\Ä7\Â\0Aòm£ù¦œú\"÷úô¯‚¾(~\Û¾)\êO¤ø6\Ø\Êû!·\Ó2÷³zfEùöL{\æˆÁ\Èm¤~„ø—Çğd{õ\İ{N\Òò\é\"b=9?…|\rûWş\Ñ\ï\ã\ßB¹’o\éH±˜\×(Í¦\å—›‹\ÏW\"¼C\Ä\ß~ øb;ø\ãH½³\Ón\æeŒj’4²»\r;À\ï\È\0ô\ï\\Ş«¨3xWR‚]|iV¢\ê;†‰@\Ë\È2‰\ë\Ï=zVŠœyy¤ôØ‡&İ‘\Êx‡Ä©§¤‰<7n\ì²\Ë“\Ë\Ü\ÎWQ\Ør\Z§ø^ú~¥\ã\Û\ë‚÷Ã–6Z%Ü­\åJG*d \Ê\'¦\ã\í^¹ğ³öø…û@\é–\Ş1\ïMĞ´G;mHI\ÜD½\"\Ç÷=\Û«\Û4ÿ\0ø&Ï‹\áUó<a¢ÃŒ\r±\Ã3€?%«K\è…[V^—ö\Óñ¦¥p\é\Ñiº-¼j#H¬­TP0\0\Ş[ô\Åa\İ|GñŒ[WÖ®µ‡\Ì#–f(>‹\Ğ~•\Şi_ğO-^\ÕA—\â¢7}º;I\Îu®¿Eı…Å·Ë©xò\æxıtı1-\ä\Ç~dyGş;\\m\\\İ;¨\ßFabX‰8\çó®VY¿µnÍ¼·÷¯À‚\Ù²g\Ój\äÿ\0*û—\Ãß²Ã­£\ßZ_ø’eş-bõ\äFúÂ›b?÷\Åz¶ƒ\á}\ÂÖ‹k£iVzU°YÀ±/\ä RQ°\Û?1\àÿ\0‚|øó\âÆ©.£ö[Z^|\×-uä‰Naœ7\Õ@8¯}øcÿ\0±øW\áo\Ëy\ãµ\ëŒm­\ÑX± ÷\Üô¯³\è«Ø›Ÿx?ş	SğC¾š\ë[ŸUñ+´…\ã†i¼˜c\Îİ«\ÔcM}\r\à¿Ù¿\á‡\ÃØ„z‚4{\00AÁ\ÈÇ»f½&Š7ñZÄ±\Ã\ZE\ZôH\Ô(€¬¯ø¿HğF.©­^¥•œ\ÄÀ³1ôU,}€¯øñû\\ø_\àó6™m,z¶¿¼\Æ\Ğ\ÆÀ\ÅnÃ¨rK²=H\Å|A\âß7\ß~4i¶>$\Ô\î\"²»·û,~D¦=Œ\Å]@+ °\Æ\\\æµT\ä\â\å\Ğ\Í\Í\'c\è\ï\Z~\ÛV~\"ñ$\Ú”\Ó\é\Z0”ZÏª\Æ\ê$Û…\ŞAÊŒ‘–_º{‘_øöS\Ã:ŠR\Â`Úµ›]I%ğRó:¦˜“Ÿ\ác\Éü\É\"ºOŸ\ïü-$úş–\Æ8õKKØ®øˆ3\r¢p\ÙÀ\\\à¶GzW\ß\âmz\ïWŠ	>\ÉpeÄ¾rNŒr/Ë\è\Ã‘ó.Mb›»OcYr8§ú!o\â[L\ÔVò+\é\Ò\îB®\Ì\ç~ş„3)\È=;\Ã+³×¼]¡j^Y.^\ÓM’\æ)b–\Ö\Ü]Âœ\×\ÚIB@A\É\ÎI\ë>~Æ¿¿h-Mn|5¥K øIğ‘\ë:\ÚùYı‘Õ±\Ó*ó¯¾şÁ7>|\"’\ßT\×`>7ñaŒÚšf\Ö6\ã\î\Ã\Èlz¾G°­\ç\ÊÑšLü\Ğø/û,üWø\î\Ñ\\xw\Ã\×i§;ˆÎ«~|›tA\Ô+63\Ôp=:W\ßÿ\0ÿ\0\à˜Š\ÊÉ¾$\ërøŒÀC.Ày6Àû¹»O½}\Ãoo¤Ái1¨D5\nª `\0@j’¥Í±\ÙÏ€¾øS\ávŒºW„ü?a XŒf;(>®\ßyÏ»}ë¦¢ŠÌ ¢Š(\0¢Š(\á|ñ\'\í?ñóZŠ;\élü\'¥J°\\j\ïó¯\0e!\\á±\Ó\î \äÿ\0\n·\Ö\ßşxC\àş”–^\Ò\"´}¡e½o¹Ÿ\İ\ä<Ÿ Àô»H`Š\Ú0Æ‘ 9ÚŠ\0ü…IW)9	+_ûD|ã§€±Võt\íB\Úuº³¹uÜÂ²•p9\ÚCœ‚óŒ™şÁ7_Høƒm\âˆ\ÚÎŸ¯i\Ö&´\Ò4ñ\'—, \ä4\ÅÀ\È£©¯º(¦ªJ1\åBqMİŒŠ$‚$Š$X\ãE\n¨ƒ@\è\0\ì)ôQY”QE\0QE\0QY^%ñ6\á-&mGS¸[{h\ÇsËœgj\ç\êx€.\ê\Z…®“e5\å\í\Äv¶°©y&•‚ªRM|KûG~\Ü1¼^ğ\\\Íj²7“&¦\Ù\ß\î\à\åÁ÷#\Ó\'{ûC~\Õ\Z÷\Å\ë½SGğü?`Ñ´Â²,ù’6\r\är¬yô cƒ’k\ç¿¶³\ákI\ï5m5%\Òukw(\×b2\î>sòƒ\ÈùO¡\ÍuÂ•µ‘\Í:½\Ãx\Æ]_R\Õ.¯TO¨-¶%šh\âm±)\çIÀ\ëõ\æ¹ø¬\ê\ZŒ:„—)X5l\ÊTuú\ç\'5\ê\Ô\ï<\à\Äğoƒ|=ª\ë>8šø&³„²Gh\ÙGÃ…B¬r\ã<õ¯®g/ø%Î‹\á\ë›_üXº_jQ°’@@²‡\Ä­>ª0½r\\\Z¹TQV–§\ÎŸö€ı¢¬bÑ´;O\íD\ÛY\Ö\ã+`pG›\Õø\í\É<\×\Ü³\ïü\ëÀÿ\0	š=_Ä¨1ñ)\Íş”¤\ØÚ¹;±,Nps†|Ÿ@µôş“¤X\è:t\Z~™eo§X[¨HmmbX¢G@ª \0>•r¸›»¹Ô´\Zˆ± UPª\0\0\nuó\Çm“M\"\Åj]\äv\nª d’O@)%ù\Ùû`ÁC\í\Ğ\Í\áO†ZòZFŒ\É{\âl»g u\Ë\ã=6¹ø;\Åu\Ê\í®ø\ËZ\×N0>\Û}5\Çş„Æ­DİŸüYğG„\Ó[ñ†ƒ¤È™\Ìwº”10\Çû,À×˜ø“ö\èø\ávtºø§\Ï2ÿ\0\Ë+4’rR¿­~j6·¸c±eq\ê\Ø\Ï\İxŒ»W\êiò¥\ÔÙÿ\0ÁV¾i†Ÿm\â\re\Æq\åY¬J\ÇØ»\å^U\âø,—l„\è\r®\îIû§P\ÔV/\Ïb5~WK­\Í!8\éU\ŞõŸ\ï\ßZZú\â?ø,\ÅA$ş\ÆğÇ†4t\'\ngk™ñó\ãµ\îß±‡ü¶/ˆ§VĞ¾-\ŞiúF©k»´\Ö\"É‚\â=Ê¦&^p\à° £=1\Ï\ä*\\=]‚\á\ã«•úSV`N4QEfEPEPE\åÿ\0h\ß~\Î^\ZÇŠ¯Hšl­™m†¹»a\Ô\"\äp;±À¹ •ö\Ô+^ñ–\á`µ®iº@# \ß\İ\Ç\ï¢+òƒÇŸ¶¿ÇŸ\Úw]›Gø{§\êz6˜Ä„Ó¼1½Á\\œnn\èyÛ±}«#Jÿ\0‚z~\Ğ\Ş6µ\êzl\ZqŸ÷†]_VŒ¹\'»*³°?QšÓ’\ß±İ‘úy¯şÓ¿ô-*\îôx¿LÔššAm§\\,òË0¡O<ñ¦¿;?i\Úk\Ä?5\Ëi\å†k\Ö-:)Y’\Ø\Ú\ÌG\Ş$¯\'§€1^ewğö_‡\Zm÷„c»´›\Å·—j÷–²9´NWj\r\È“’\0\Ük\Æ~%\×~ \êö:úl:Î¯1Y[\r*\'¸–\è®@UAg\åQ‘·\ë]‚§<§Í¡‡¥_øæ¼º\Ñd[C¤q3Ï…³c\'\å\È<\çW¯~\Î\ß<UûJ]Å¨øƒ\Å\ÖğDC\ÊûL·0µ\Ô\è©\Ë“ó0’~|m¯˜üc\à\Ïø}®\íµ/øƒE²”¨•.ì¥\ÌÛ»ò1\Æz~y®)/®,³\Z¼ÁPJş”œ®´eFd~ş|,ğ\ÏÁÿ\0\Ùó\Â\é¢ø^ÿ\0\Ãúš€f¸›P‹Ï¸o\ï\Ë+6XıN@\0«:ÿ\0\íOğ‹\Ã*Í¨|DğüAsşªõe\Î=6g?…>òj·>y¤ob\Ä\ÕY/‡ZÃ—»7¹û…\â_ø)OÀ«\ìñ5Î­ \èš}”»ñ Î¼§\Äÿ\0ğX‡ºyt\Ğü!®\ê\ì¹\Ã\Ü\Éª7\ã–8úŠüŠ{†=ø§[Z\İj3­`š\æV …±>€\n9R\Ï\ÒÁ^|yari?\r4\İ…\İº´“\\\îd—\Ê\ìA¯˜ş2ÿ\0ÁA¾2|jĞ®´=c_Š\ÃCº#\Î\Óô›t·I÷YÀ2ÿ\0d±#Š\ä#ğg\Å‹\Zx²Ò¾\ê÷òO4R\Ü\\\Ùi\×÷‘ùq“œª\á{(\0\ç& ñ\ìñ‡À\ÚZÎ¹ğû[\Ó\ì$-•\ä·%ŒŒ	Q°e¹Á\íŠ\ÆM{\ÊÌ©$‡‘Ox\ì{\n¨ó\È\ß\Æ\nö?~ÈŸ¼_°\é\r¼E<m\ÒV±tAõb\0\ë>ÿ\0‚V|~ñFnt\r?C…ÿ\0å¦¡©EòıU0üª\Ä|€÷\æ‡—#­~øSş±\â\ë©ø“\â.¦\ÆpXiv’\İ0öùü±^\Å\áOø#\'\Ã=9ƒx‡\Æ^$\×1ü6‚5\'\ß\å\ãñ¤\ãÒŒNH \Ê\àF\è£5û\Ç\á_ø&o\ìõ\át\\ø \ë/ü¶\Õ/¦•¿ ÁJö~\Î\ßü\"±\áÿ\0‡,Lx\Úñ\é±n\ã¾\â¹&€?\íÀ(ñªi>\Õuÿ\0tAh\ìO\ä+\İ>~\Â?>!\Ü\Ì&ğN¯¥Y$%\Ö\â\î,3e@Q¸ŒğIü+÷¢\ÏM´\Ó\×m­¬6\Ë\Ó\Æ~‚¬\ÓNÀQE \n(¢€\n(¢€\nø\ë\ã_ü¾\ß\ã\×\Ç[Ÿø›\Çú‹\èS‚\è‘\Û2$PŠ9K\áPO\Ü\',zõ¯±h¦›[	«œ\Ï\Ãÿ\0†¾øW\á\Û}Âš-¦‰¦B¡DV\Ñ\à¹º»z³Mt\ÔQHg\ç\Å_\ØW\â­\×\Æ=N\ë\Â\r¦Ï _\ÜM4ZõÊ¢Á\ÌÅ’EÉ•U`pr\×\0?e\ß|	³ûlQ¦³\âûˆ‚^\ë÷#œr‘/>TyşI?\Ä\Ìy¯f¢´•IIY‘F.\èd\Ğ\ÇqIQdC\Õ\\dÂ¹/üğ\'‹#)¬ø7B\Ô\Ô\ç?jÓ¢|ş%k°¢³,ñ\ïØ—\àN¡Ÿ3\áw‡S?ó\Æ\ÔGÿ\0 \â¨\Û~Á¿\0­eóá–Œ\ç®%Wqù5\ï”S¸E¦şÈŸt‰D¶Ÿ¼-ƒ£26#ó»\í#\áÿ\0†4–=7ÃšU‚/\İ\ÖQÇ\Ék~Š@5c@¨¡T\0\0¥ ¢–Š\0(¢³<I\â}#Á\Ú=Æ«®jvšF›\0\İ-\İ\ì\Ëh=ØœPg\ë\Ş \Òü-¥Ï©k\Z…®—§À7Kuy2\Å\Zvb|#ûBÁV<=\áˆ\îtŸ…\Úiñ¥\Êmj(\Ñ\ÙE\ÇT‡ƒ\ë±{\å…~uüBø\Åñ;öñDQk\Z¶³\ã\rV\å±o¦Û«:‚OİŠ\Æ\Õ8Uj=\Åsô\ï\ã_üW\á‡\ÃÁse\á{¯jñ\åU­\Ï\Ù\ìƒ{\ÌÀ–\î+\ê+\à\ï‰\ßğRÿ\0_u’\ÓÄ‘øB\Ã?»±\Ğ`XBıdm\Ò1ÿ\0c\ØW/\ã\ØOã‚¾\\x\ã]ğw\Ø4;hüû¤{\ØMÍ¼\\~ñ\â\r¸F2;Šğ(5	m¢x\×a†GF’7\\‡\nr\î=¿¥R°iş\Îÿ\0ğTo‰¾\0ñ§o<-#„œ\\Æ‹{“\Ë\Å*¸»_ ôs‘û\r\áoi\Ş3ğŞ™¯iw¥\êV\éum2Œo\Ôq\Ø\àòC\Å6D·ˆµ\æxm¡³ûL¹[©X\ãôQ\É\Å~üş\Æş\Õ|û6x#I\ÖQâ¼Ñ¥K÷\ã\ägXv;XqÛ¥L\Ïh¬¿x—Nğ~…w¬jÓ›m>\ÑCM(F} \n	<‘\ĞV¥y÷\Çı2óYø?\â[->\Ò{\ëÉ¡A½´m$|\Ä8\n “À=*İ“f¿…~&øw\ÆzŒ\Ú~™y)\Ô!‹\Ï{[«Y­¥\ç\ÂÈªH\É#=EM\áßˆñ]Ş³m¥\ê\êmC\âˆ\İ|¶‡€eer8¯\Ò]\Ğü[®ø“J\Ó|[®¤’\Ş9üEb\ër·`1\ÅR\ÊN|¼c9\íRx+À¾0øk\âOI{aouc{¥Ë¤]¶“Òº?\Í2K>F2df]Ã˜ûPd¦ô=CÃŸ<\â­B\Ê\Ê\ÃT—\íÄ‹_´\Ù\ÏN@\É\îI\ã¦i¶?<©Ee©4r\Ërl\ã’k)\ã…\æ\r·`•&r1Ö¼À¿üK£iŸ	¯oÿ\0µuX/JÏ¢]Z]0•“l\Çj†Oy2>oz\ÂÒ¼-®›k(´\ßM©\Ã\âCx4»\ËG1‹‚\Şc9Eş›;=¨<¬{\áø\Ù\áO\í«).of»·»k)D:eÌˆ“+me.±•\à÷\Î)“ütğ]®­s§\\j’\Û\Íov\Ö2\Ë-”\ëN­´¡—fÁ\Ï|\â¼\Ã\Âö÷šŒ¼Jo\á?°ó¼Kuu\r¾“¦³XOJ6»1„\ä69!€Ûk;^ø{\âiü5\ã›\ä:´ÖŸğ–\Ësÿ\0É´>V£\Úb;\Æ\Õ2‘\ÎT\ã	ø\Ğò±\ïš\ç\Ä\r\Ã~\"\Òt=Fü[êš©\Ûi–Í¼\äH.IÀ\É=*ŸŠ¾+xgÁš—\Ø5K\éR\íaûL±\Û\Ú\Ë?“Hó$òÕ¶/N+\Çş!x\'Æ¾<\×|k®i\Ööñ\Ù46ºg\Û\ã™.\Ï\Ù›}°I)`	\àöõ©üs%Ö¥©§ˆmôOxw\ÄšD&+½&Í®b¹r¤›k›r‡iV\Èù±‘\ÎqANoS\è+\Ø5+8.\íeI\í§eŠX\ÎUÑ†Uô ƒS\Ö›S\è§Z¶Š\ÏU6‘ı¦\Ş\n‘¾Ñ\0\à}·h4Z…Q@ÂŠ( Š( œ\nZü\æı¼¿k‹\Û\ír\ïÀ>\r\Ö\Z\ßH³\rVò\ÎL™óóDs±>\éÁÁbÀ\çmRWvÇ·~ÒŸ·\ï„>Áw¥xm ñ_Š“rÿ\0\Ğ\íqû\×|ƒü{Yx¯\Íß‰ş:ø\ÑûMhzŸ\Ä\rZ\ÇY\×|¦L\Ğ\Ëo\Í>É†2©À\0n@Xy‰<\Õ\ï\Ù{\àXı¨¾6Yø^õ\îbğÕ”M}¬Ml\Û_\È^0\Ü\í.\åW=q»ó^\Ñÿ\0ı¡¼%\à_i¿\0¾5¥–§q«®™&=§‹}\Ã\ï>r\Îry\ÆN\ì\ãO…\Ùs\áOxgVø‹\â\í/\Ãz\r«\ßjÚ\Â\Û[Àƒ%?\0:“\è\r~”\Û|Yøÿ\0\Úğü#ú40x\ç\âô°(\Ô\ÚÍƒ?GÌ²Ï‚!‰N@r\İ22KW\æ\Ãø·Àş2ƒPğ=\Å\Ü$–),\í\Ş\Â/2|L†60Hb€G 9¯®¿g\Ïø%O\ÄOŠrÃ®|I»\è\Ó7š\ÖÒ7T¸“˜\É\ÄY\ç™\àz¥LÆø\çûgüYı¤§š\Ã^\×%‡EO\İø{GŒ\Ãk\×*¥FZLv.X\×[ğGş	¹ñ—\ã)·½¸Ñ“Áz¸o\í2ú¤\0ã‘ª½_¬ÿ\0?cÿ\0…\0- >ğ½±\Õ#\0cPQqx\ç\×\ÌaòŸ÷@\ÇN•\í7\ì3\ã\ï\Ù\çş	•ğ\×\à¥e®j·7^7ñ±“j¤V‘H\r$À\İ\ë\ì\Z(©\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Š­©jvš6Ÿq}sº%g\n‘¨\êI=\0Yªz¾³a\áı6\ãP\Õ/­ô\ët2Muw*\Åj:–f õ¯\Ï\Úş\n[©Y\ëR\é¿\rV\Ö\ÏN„•:®¡m\æMp¼‘±Ú‹\è#…\é_üUı¢¼_ñ>\à\\x£\ÄW\ÚñSº8®\å\ÄŸU…p€û\í\Íj©¾¢¹÷\í[ÿ\0ƒX´¾ğ¯\ÃK\Ù Óœ4W~%\\¤—¡KN…S¨3ü¿:<M\âÖ—xB`a\\Ö¥\â™&f’Y‹»v\'¥z\ìÿ\0û1üEı©<@lü%¥˜ô¸X\Írû1\Ù\ÛF|Íˆ ·°!\é…«\Ãÿ\0´¿ˆ>|:ŸÁ\Şş–\Õu^Õ‹jZ“öS78À8˜\'%‰&½‹öhÿ\0‚h|Dø\ì\Öú÷‹ü\ïxNlH³^\ÄMõÚs-‚\ï|A\Å~‚~\Ì_ğO/‡?³¿\Ùuk˜Œ<e\ë\Z”@¤/\ë\\„\ç£°õ¯©\ë;”x\çÀ\Ù+\á—\ì\ëdƒ\Â^…5M»d\Ö/?}y\'şğı\Ğ}½Š*@(¢Š\0(¨®n¡²æ¸š8!@Y¤•‚ªÔ’zW=\á?‰\Şñ\í\İı¯†¼S£ø‚\çO`·qi—\Ñ\\4ô\Ş:¾†€:j\Ëñº<9¥›Ö°¿Ô€–(|6\Ü\Ï7\Ï\"¦\í£øWv\æ=”Úµ+/\Ä~&\Ó<%¥GW»[+!,Py¬¬\Ã|’,q®\0\'—u\0a|Qñ­\á\Í\ÂM3-õÖ£ohcI«¶hwE\Îv¸­Cã–³\á}>q®ø~\Æ;\ËK[™?´|”–\àY%Ü‘Ä»\ç\"ETy\Ş\Ù°2}Æ¾\'Ÿ\ÃVzx´¶\êûQ¾Š\Â\İg”\Ç»\ä\îv\0«`–;WŒ\är~$øÌ¾Òµ$¸\Ò÷\ê\ÖvW³[Ì³Y˜\àu€É•rJ[;g\ËÀ\èHn)¡İ\Ç\ÍSO\ÕõM7R\Ò-nnbmJ\â6]J8E·‘Æ‹\æ\"\ä±aÜ±\Úe\î\ä,¶_´lw\Æ\Ëa‘\ÜJVK\Ã\ã\ÉW\Ä\ZiKM•Œ…\Ü\È ‚û\ãöƒ§<\Şv›«l^a*\ÅW¶E¸f¸¼\á1i1\Ãa\Î\Ñò\å—:~ø·¦kúÆ—¦\r3T\Ó\îo–C\Û\á4†L m\ä;m‰›\îÂN¦ª~\Ò+¡\é{¨hpÛ»\Ç\ÜPÿ\0hd¶´r\Ê\Íÿ\0Fİœ•ùó\ÅS²ı£®­l\ã†\çG‚ò\î+8§ši5\í3\íù\Â0ÿ\0T\ãr’K‚¡I\æ½Š\ÚMæ•¨_[\Ú\ßOö˜lec@ÿ\0l’o$[\r\ÎH l£z\Ø\Î9_ş\ĞVV\ë.³§\Ü\Ø	.\ÚÕœF¾U±\0\È_\á…\\’w\rŒ\Ğ¦øwY\Ä^\Ó5X@\ß\Ú\Åt€g…t>ğ¡\îö£^OÇ«mN÷DZF¡ogy*­Ô—\Ğ*˜ä·7I†\×1—v2r\ÆSKøß£jriiıªZÿ\0h\\Go\Ü\Ç¢y‰\Â\Î\âB£\ÌY\Ój\ä¹;†Ü‚)XD¢¼\ï\Ä\ß´\nËªCsm5Æ˜Ì·pÂ‘\ï‹\ndSó:\î\ß\Z¼Š$ª1À#SPøó¤X5\Ä\Æ\Êù\í\"7QÆ¢8–K–‚a\é@+ü1\Øp=Kôú+\Ë_\ãÅ”\Ş \Ó\ílt}Bş\Âö²\ÜF\"V½9\í\â\Ùi™Ÿq—g\ÜùwS5Ÿ\ÚWÁ\Ñ5_Vš\çL\Ó\í,!\Ô#–\é\r\âK\Z:,[sŸ\Ş*“¡²3òœ¸ñ·´_‡~\Z½\×üA}Ÿ¦Z.\é%òO@ª:³ÀQ\É&¿&ÿ\0ko\ÛwWøÍ¨Í¤iÒ7Â°Kº(\Ï2‘\Ñ\å?\Ä\İp>\èô$®ö³ı²õÿ\0¾$uóZ\Ã\ÃÖ®\Â\ÇM…ò‘¯M\ÌŠB8/\èH\0w|»{«4„üÄ“]Š‚»\ÜÍ»\ìmk:\éºvf;‰ş*Á\ãS¼†\Ò\În\î\çqPB…\İØœ\0rI$\0\\×¥ü\"ı˜¾)üw¼²Â¾Ô®4\ë™<¿í›˜\Z+\Æyf™†\Ü\àdúx¯\×/\Ùöğ_\ì\Íeo«^E‰üxW÷š\Õ\ÄY[bz­º\ìô\ß÷ˆ\Ï *%!¤|¡û&Á*/<@–^*ø\Ë\çi¶o‰ağ´-²\âA\Ô}¡\Çú°{ ù½J+ô÷\Â\ŞÑ¼ \Ù\è\Ó-t}&\Ñ6Agg4Àw=I\êNIæµ¨¬K\n*¾¡¨[\éVr\İ\İJ!‚!–b	ö\0\É$\à\09$€9¯ş,ş\Ùş1³Ö®4ÿ\0	øz;K=\æ8o/¢>cœeHqÏ¦\ÜgŒ¥6–\å$\Ş\Ç\Ú\ç¿h/†ÿ\0	’C\â\Ï\é\Z<\Ñı\ëY.—?÷\å7H¯\Éÿ\0Œ¿´\Ä\ïJöş\'ø‰yge\"d\ÚZ]}–)Q‰ùLq\ã$\Ç=«\ç½O\Ä>±B±K-\Ó1\Ü\ì\İ\Ùõ\äœûTsö+’ÛŸ§\ßÿ\0à¬¿´7–\ß\Â>Õ¼Q:’¢{’,\à>Œ¹\ä}UkåŸ‰_ğU/‹ş&y`\ÑKğ•«\çoØ­ü\Ùñşü™\ç\è|m{\ãw¬„S\ëŒt¬)õk™\Ã“!py\×3ˆôßˆ\ß¼cñ6!q\â¯jš\ìŒwyW×\è¤ÿ\0u	Ú¿€\Ëø?\Ç\Z§‚n\æ¼\Ñ5{ı\ZòT0´ö¼.c\È%IR2	\nq\ÕÈ™\Ï\Ì\ÄÔªr¾õJ=Ø¹»\Ó\ÅV¿Ô­4«o´^\İCg\åO6\â@‹¹˜*Œ“Œ– Ü*\ÍT\Õ4‹n\Óìº•¾¡k½$ò.¢Yz0tm¬Ê²«Ø€GJd˜_õ-\n/ôEñ7\×p\Ú.Ÿ\"\Æ\É#³eK	>\\\ç\ĞW/¡k\ß\rüAªiºö.Ÿi­\Ü[Ï¦\Ças¦§™q½\ÄR\ÛUh\Â\æ¡´6\Ö\n\årOGñ*oA¢\Øÿ\0\ÂO$ğ\Ù>£m\ÛM4.—\ábmñ\Ê[ ’x\Ís¾O†¶ {\Í>\æ\rOKº›F-q{$>lñ\æIAWp\'`n‹Ä´„“iˆ\Ïñ~øF\îù“@‚\æsw*jKg¤şÿ\0\Ìd“s”(¡ÿ\0z7Œ†\ÎH\Ít:e÷\Ã\İ6}F\æ\ÇOÓ¬.|5ó™4³¶ˆ\Æ_õc\ËC8\r™\ÜK’Ny\Í7\Ãÿ\0um>]J\×P\Ó^\ßPµ\Ï+k2#$.L4 \Æ\\¸.\ÇB.¥‡\Ã}\×\Ä%\n,\Ú\ĞP´]A\ä¸u7R(uA!15Ä‡rmÁn €O\âOxwG½\Ò\İõGÕ§7÷6z“¡»’[„G.$Sr’¹Lfª\Úø¯áµ¼¾\ß\Ãv–x’Yh\å\â³ÿ\0F[µ\Ö,\Ù\å‹ó\à¡\Ú8­(üğ\ÇQ\Õa½¶—÷ò\\}$}rYZ[„\Ùòó)\İ ù2OOZVøyğ¾\Æ?´\'µ²·…V\Ş(\æÖ¥Š%0¤pd)”/˜«H[¾U\æ˜ğÿ\0‰¾\Üjú\á\Í\Æd½%£’\ÓLò €¤kr ±Œ(q²Ù\êB1»O‡ş°\Â\ÛÃšM¸¶˜\ÜÁ\åXÄ¾T§n]p¼7\îÓ‘\ÏÈ¾‚¸\í#Bøi\àh]\Ù\İ\ÛXI§´…\æ—Zv·‚l$/\æ+\ÌW\Í\ÚÈ¤°İŒô®¦û\âg…´\Íj].\ë^\Óàº‚\İ\î®|Ë¨\Õm‘Z%i-ò3Ç´63“Š@]\Õ|\á\ít\Üÿ\0ihZf nYZµY\Ç\'šUJ)mÀ\îÂ³(\Ï@\Ät&›y\ào\r\ê0,^\Ò\îaR\åcš\Ê6P]Ë¾_\âbXú’I«¶Zş™©]\Ëii¨\Ú]]D‹,C:»¢0X¨9\0‚=Á ñ\á]ûX\Õ\ï\"\Óô\ËZ{‹©\Û	\Z(\É&\Î\'\â%Ÿ\Ã_†\ŞÖ¼Q\âmC³\Ó\"E\ÜÏ§\Ä^e\nG¹s¹#Ú¾ª¾€ÆŸÚ»ö›ŸãŸ..¬t\Û]B€yvV‘\"¨U22½Êª‚O\0\0«€{/\ÛgöÅ¿ı¢<X\Ö:\\“Xø+M‘–\ÂÍÖº\åø˜tÂ¼u,O\É>m\İ\ÒC\n4’\ÈÁd±\'€s]1*»3nú\rğv¿ñK\Å\Ú†¼3§M«kWòˆ ¶„d“ÜÀ’I\à\0I¯Ö¿\Ù[ş	à¯…Vz\ï\Ä;ko\Zø¸¨\Ú\Ü.ı>Í±÷V3Ä¤só8#\Ñxº¿\Øö;²ıœ¼¿­\Û$¿5¸\ŞL\Ã&\Æ†[d=B\ç»\0:(¯©õ=^\ÃDµkFö\Ş\Â\İA-5Ô«\Zu\Ébc)6ZV,\ÅAE,q¢…TA€ t\0vúùÿ\0\Çÿ\0·gÁ‡\Ìñ\\xº\rZ\éA\Ì\ZHûA\ê8ü‰¯›<ÿ\0k³¤‹Áş{œÎ§>\Å>\àŸÀPU\Ñ:\ä¼{ñoÁŸ\ìş\Ó\â¿\éº}–\êp$n3ò ù\à+òGVıº~.|i\×.4k\ß?…4\é¬\æsn±<\ÛT²Ä…\â\ìp£\ç0IÁùw\âôš¤^/¹T\×nõ\ë¹\'’\âöc$\Ê\Î2RL±Ã¯B3Á©S‹Ÿ³¾»”\â\Ôyº ´‡ü-G‰¦\Óş\ÙZ_iöË¶SRVd.x.‘d\ã#,x\ÉÀ\ç\'\â/ˆŸ´×>!]¼Ú¿pDVj¶± Œk\È\ZRZ½•s.\ZQöu\Æx9#\ØVœŠOas´´*\İ_O<¬\ï!\ËrH<ŸÆ´´Ÿjº\Ó/•Š6\é$ÿ\0(?N\æµt+Q\r\ìQXY›Û¹\"eC»18\0¤\ãy\Ç5õß?\àŸÿ\0\Z5M\â¦ğõ¶’\ë	-*\æc\íÂœH8c\Ø1S1ZJ‹S\Ë\ÅW\ÄF\êğ»óÿ\0‡>@“À\Ía*­Ô¦P{C\Æ?1\Í&¡\á°\Ã-™›s1\ìC\'lA\ë\ë^™©\Ø}¢Fd‰]¼²¿¼{ıG5\Ï\\@m\æx„b\Ö	.\Ğû¾uPg\Ôò\Z”\ÓG\Í\Ñ\Í\êTŠ“—½\Õ¥ğkş	¯ñ\ã‹§\ë–\Ö\Ú^‹ _Æ³[\ß\ŞŞ£‰c=V=\Çó\Å}e\àOø#7‡\í¬·ø\ÃÇ·÷·Œ¸òô˜(\Ğú†|“ß°¯¤¿\à~Ö¼+û-xj\rh°72\Ü^Y\Äıc¶’B\Ñş|¿ü¾’¨{ŸeJ~\Ò›[ ¬¿økNñn–t\íR¸´2\Å?–²¼g|r,ˆw!†E8\Î0r	©E#CŸñ¿‚tÿ\0è¥j0´f\Ü\Â\n\Íò²\ã$0Ç§5\ÉGğD†m9\ãÕµ…[;\Ø5Îˆ­\Ä\ÑL<€\Ç\É&\Ê2HÁ&Iy†=6Š\0ò\İ3öwğ\î›4ou¸\áûH®|†¶6şYÏ”+i\n0n\ãq\ÈsşÏºš¤w«k.#•¦İ¦ˆÆŒ\Ò	?w	€^k\Ô(§p<\ËDø¡\è\Ùd\Ôu5m2\á\'†A\ä,¬©\å…¤Xƒ˜ñ\n‚3–†\'\å\Ä\Ş,ø¢x¶\ç]]CU±“Yd7\ÎhÂ€!xYUY\0\á÷09\Ë\"7jôz(¸i©|\Ğõ5·MKU³®\Ùä¶– \Òı¢vš@ùŒ†›\0\Ğ.rFkñW\Ã\ï|2°¶Öµ\Ï\ßxz\ÏNn\çµ\Ù\ŞXe•4$\È\ÌĞ©!·€¶…ùvò¶?\í±£~ÌšZiZ|1k~9½ˆ½½ƒ·\î­Pô–|sD- s_øC\à/ÇÛ‹\ÄO\âj\îqa;“ı­¬¹\Ö%\';!Œº;*/ıiúˆú’\ãö\éø+ğ‡Z–\İk\Ş$e²†\ÃÉ…#Kr‘\Çk\'\n»\ßlJ7;n\ê¼ó\í#ûtj_µ\"\é\r²‰ü\á\'¹\ßz\Åü\Énpr›À8\Â\ã!3‚\Ø$ğ+\Ü5¿ø%¯„<	ğ—ÅºÖ¥\â=kÄ¾#\Óôk»\ËHm-­\Út\İ¦\Øoø†}+ò\×\í¥v\ä·lV\ĞQÜ™7±µ\ã\í2ø†\î\Æ\Öùu+dc\å\\ª\í.¹ n\\§™5OÁº¶¥\áoX\ëöWö-Å³I\È\Ô\å[k\"¾õı†ÿ\0\àÿ\0t¡ãŸ‹:}À\Ğn\âÿ\0‰fŠex%ºş[\È\ÊCªtu?.7}[?ü+\à$²ÃººŸ.-Z\ãiö\å‰ıjjNú!\Å[V~iê¿¶\×\Ç=vÕ­®~%\ë1@\Ù?\è†;v\ç¶ø\Õ[õ®OD²ø‹ñ\Û\Ä	¦\éƒ\Ä4\Õ>G–[¦A\ê\ÌÄ„_r@¯\ÕEÿ\0‚c|^º&ª\ß]Zoñ¯}ø]ğ‡\Â<9‡\à\í\ÛE\Ó\Ô\îq-$­ı\é$bYÏ»X\Z\\ü¸ğü\Ï\âÿ\0ˆ\í’mV\çCğ\èp•yt\ÒH¸‰Xg\êk_[ÿ\0‚NüO\Ó`2\éş!ğ\æª\ê2\"Ye‰‰ôù\Ì\×\ë\rTÕµ{-M¹\Ôu+¸ll-\É5\ÍÃ„5IcÀXW?|?ÿ\0½ø\Ë\â}U­õ=3@‚7\ØonoC/\Ô‘ô\×ø·öø#û5\é\Â÷\âß\ïüI­ü\Äğö‚«®{e›q}X.{g¾¿ø‡û^iú–™©§…®f±\Ò\íÔ‰|B\Ö\ÆhÀy)\È\Ô\àó+\ã/ˆ>ºı§¼y\á?\n\è^!Òµ\Ë\İVòIe\Ô-c1\íP€™$Ä’«\ç9\ÇP‡Œ\àV\Ê\r+\Ètıúœ©m{ùXò¾ğW‰5OUÑ¾\Ü\Øh6PIôƒszö‘\î$Mr\ìHWùI\Ü\n€2\0\àšòÿ\0Š>–‹=b\Ò\Ş_\ìmSr\ÚM\'Wd8`Gb28=«ö\â&©\à?\Ø\Ë\àE‡„t¥†\Ø\ß±Hİ¤¸i\Ï)Œ½•\\.xİµGÊ§xwÁ^\Z¼\ĞmuOé²®Ÿ§_­\í¶™¬™.m$‘\";n\Ø\ä 0İœw ôCUt´8&ù\'v\îz\ç\ìÁğ›\á\ìOğ{Iø§ñ^{{_j\Ğ‹H\î£ónm£u\Ê\Å?{\Í*F\æ\ÆWv\ÒTg<\Ç\í1ûyø\Ë\Ç\n.u/†\ê<1\áË…\Ü\İ\ÏmA‘\ähÀFH÷c¶Xg‚1^¨ü(ø\Ëûhü_\Õ5…†\ç]·&8WW™\ÂiÖŠ\0#~h9;Pn$œŒ\ç?l|ÿ\0‚kø;\áÅœ>6½“\Æzš\âÈ³%Œ9\Úß\Ô óg\î¦\Ü÷:\çM:qp–û¯#ó»\ágÂˆ®c´ğ¯…nï—…’\á—lq7ûNp¯ñ_nüÿ\0‚cCm¬iZ\ç\ÄmB\Şuµe•´K¼NÃ&”\à\0ğ¨9\Ï\Ş÷“£\Øh\Z|\Ze•¾c„Š\Ú\Ò%Š8\Ôt\nª\0\éW+\Ú÷Hòğù^\r.xG_2;{x­-\â‚\ÖbP‰\Z*¨\0À\n’Š)°QER\Õu­?Aµ:õ¶l]b]Ì±!v8U\Ë2I\0\æ“ijÊŒ\\Ÿ,U\ÙvŠ(¦HQE\0QEò.µÿ\0\ëğßŒ¾?jŸüY\âk\ÏY\Ş^}­t9\í‚*\à\r±™Cœ À\à(8\ã ó_Y\ÙX\Û\é¶p\ÚZA­¬((a@ˆŠ:\0\0{TôQ¸@ ‚2c_?\é?°OÀ½\Æ\ï\â«o\Ú@\Ëç¥¼³K%¤rg;–bƒŸ\á\ÆÑ€+\è\Z)İ T\"…P@À\0`KE€(¢¼\ß\âG\Æ;?\Ïı•§\ïõ¶\ê™\ÌpW\ÇSş\Ï\æGi6\ì„ÚŠ».ü]ø\ÏáŸ‚¾\Z›Xñ\rÌŸ*\æ++T2\ÜN}oö\0õ¯\Í\ß\Úöñ\'ÇŸi\ÖrOÿ\0¯ƒ\í¡MC\ì·\0ü\Ç$7\Êp&`0G®1šúvò\Î\ãY\Õ\'\Ôõ›ƒ¨]\ÎÛ\ält\08¯”ş1|Rû\Æ\Ø\"¼µ\Ó\ï|3¦x…©_\ßf_¼\ëî§°ôµ\Õ$´Üš5’¨¥8\İ.ƒ>ø\ßOğÎ³\âO±¾tc¤\Ïs¨Ú”+<m³v\Ö\åw\ä`\Îx\ÏJ¿±W\Ä\Â^\Öô\Ù\â\ÇIop-R…c³Ó •ÀW~yœ\í\0’@Œ6¶\æ5“ûH›?\éş,Ó´\'Ú¯Œµ+XRtşRBŒ\ë\ÇP]ö\ã,\Í\Ç\Ë^¡û%Á8¼Oª½§Š~!_]øOM•2š5©\Û:0\çy#ı=_¯œ5jÚ\nQš›R¶‰/\Ï_K\Û\äsş\'´ñ§\Ç\Ùõjjµ\İAP“aj±¥›n\İ\æL\çj Vf\æ^	=+\é\Ù\çş	õc\à\Ï\Ú\Ãñ\'U>\'\Û\'\Ú†\í“KL©ı\ïG¹9PpØ¯\î\ÏZúŸÀş\0ğ\ï\Ãm\Ã:E®¦\Å\Òd\Æ\ãİ.Ç»1$÷5\ĞV2¨Ş‹DsF	o©[N\Óm4‹l¬m¡³³E¼a5\0ª8¬\ÑEdhQE\0QE\0ó\í\áB‰º~µ\âok~8øi–a:v‡;‡²»ó7†…Kü˜\0\ç\Û?NW‘üYğ$\×S\Å?|Q=–¨aK9ô[üMa4e\ÆeTv9d\ä}\í q’O.ô­kúYşC\ß\Èñ\rŒRrQºj\íµ¿÷£¬_it\ë¥\Îo\Âş\Ğ~\'üÑ­ôoø—\Ä>°K‰ ó¶_^ªdı†W\0N\0\È?wœ\0k‚øW¨jV^ø\ï¤\èöšÍ‚ØÁ—\í4ú‰{gÀ;‰Y”€¬\Ø\Û×O§X~Í·~ğm…‡üo©i>#¶\Õf\Öe\Öb»¸—b\Ël+FB¨1×“ü»µ“\Æ:§ˆ|[{ªx§\Ä\Ö\Ñ\ÚM«\é±g›H\ã\\ Q‰RI\ç¹\áö\\ ù,Ò³Û³]\ïòÛ­Ï£ş\ÑÁÂxû~hJI\Å4\ïuR.\í(¨»\Å;\ËIı›$\ìx\×ÁJøw\â\ï‡pø»À\Zï‡µ½V\Ç[¼\×d¹\âğCó‰mw\âÛÁ#ƒPı¤/.µ¯|3ğ¼¹±\Ò<O©\Ì5\'´”\Å$\ĞAsñ\È[œx«~ø\r\â|Q\áSÆ¾<“\Å\Ö\Şf“Kµ\ZrZ±”®\Ñ,òc#ô\ädõ ·Sıµ]c\ÂZuµ\ï\ïnüY£\ê\ï«i>\"š\Û{\Û#´l\í¾<pF\á>…BXÑ•5\røS\Ò\×N\Úkª_ˆ\ë\æ:\Øúxº•Ó’M?\â8¦ùùet\ä”/5\ß\áGœ§‰o>\ë\ßü3\áû‹™t]#@[\Ò-\î\æ{°Léµ•Y\É%w0l~\ï¹&€ğ\Ñø=¦üñÎ•ªjw\Z\ï‰uK\ry\îoe™u¼Œ»–Fb ©n\0íœk\Ùüğ;<eu\â\ía¼Y®ø¶k©\Şı™m£\â2‹Q‚v\0	\ç<jÁğ—\ìÙªéº¿„\×\Ä~7›ÄğŒn‰¥›£u‰¦12\×xNA_W«§»é·»\ï_¿n\×\ìl³\\\ns½]l¹ô—\ïu\Ê\Ö\ßÏ¯½kß›ty¼¾ÿ\0…Ç¥|iñÎ­ªjvú×†u;û\r­¯d…tå³ˆ:2¢°RXŸ›p=ñƒ\Í}ğ_\ÅW~7øO\á=wP\æşûN†[†¤\Ú6;d‚\Zó\Ï~\Íz®¥«ø±<;\ãy¼9\á¿Hf\Öô¥°I\Ùİ†%he,~`\ÈnS× öh6^\Ğt\íN‹È°\Ó\íãµ‚?\î¢(U®¬5)Â£”•»ù»\ï÷w<l\ã†\Ä\á¡\nS\æ\Õ8«5\ÉœuIk-tº\Òû³BŠ(¯Høğ¢Šø«ö\Çı±€—¾ğ%\é:‘GMGV·n`\0\Ç\â\Øt\è9\Î\ZW2«V4£\Í\"o\ÛCö\ã·øcÏƒ<	t—^+\ï5şd\Ó\Æ9T=\Z^zô\\zôùƒ\à_\ÇAy¾=R\è\İjLå™¤l³\Î}\ë\ç\ï\è\nš®¿o~·1Ü”ŠXœ±‘eØ¥\ÎOP[?J\á\äÖ·\"Ki^9‡*\È\Ø#\ß=«\ÒT”U q\Ôn¦§\é‰>8\èšVˆ÷7—©jG@\ÇŸJù·@ğ7ŠjO—|<\ÑR\â(\Ş16«,\ìW$ù\Ä}\î\á@,\ØÀ\äz\ì³û\nø¯\ãÁ±ñG\ÄI¯´_Y!ŠbR÷S^£\Ë˜¢#şZ36€\êı>ğG<?ğ\ßÃ–º†t›]H¶»µ´Œ\"\ç»V=\É\ä\×,§Ë¢:\áJ1Wn\í£\Èÿ\0gÿ\0\Øû\Â_Y5«\Çox\ê@Z\ã\ÄZ’\èÇ–[t\äB™\'¦X\ç–5\ïTQ\\\í\ßVj’Š²\n(¨®.a´ˆ\É<©c«\ÈÁ@üM!’\Ñ^S\ã¯Ú«\á\Ãe˜xƒ\â…i4_~\Ú+¡<\ãş\ÙG¹ÿ\0Jù\Ó\âü\Ë\àÿ\0†<\è¼;§kş/¸Qû¹ ¶[Kf>\ï)?\ïÙ§`>á¢¿\"¼}ÿ\0ø…¬\"ğŸƒ´?\r@À…–öY/\ç_pß»O\Í\r|\á\ã¿Û»\ã·\Ä\"\ê_µ[h\\a \Ò\Ùl£#Ğ¬AsE€ı\í×¼_¡xZ#.³¬\ØiQŒe¯nR!ÿ\0Z‘J—$±:\É¨et9Bq_Ì†­\âS\ÄF}SR¼\Ô\î\ä\Ëy;Jß›_®ğI\ÚJû\â/€u_†¾ »k­W\Âñ¤úlÒ¾\é$°c´¡õòŸh\É?vT…¢À}ÿ\0ER\0¢Š(\0¢Š(\0¢Š(\0¢Š(\0¢Šù§ö¶ı¦#øa¦M\á­u>!º„ùÓ£üÖ¨z\ßy\é\É4›\ØÎ¥HÒ‹œ{öºı¨\á\ZŠøVñıÁP¾LA\êÕ‡C\ê{t\ëó\Ç\Ä÷°\Ãiq0™\æR¾cŒO\\\Ô~\"ñ,Ú–£=\İÃ‰¦‘™¤E\ŞK¸÷ª¾ğ/‰ş5x\â\Ç\Ã>\Ó\ßP\Ô.	Ú¬\ØH\Óø\å•ñ„A\åˆ\î\0\ÅT\í\Z}Ï˜œ*\â\ë)\Í\é\Ûô9¡¤\ßøµô]D‚MJú\åş\ÍŠù\ÒJül\n‹\Ë1\Éºd5ú5û$ÿ\0Á;´¿‡±\Øø¯\âU­¶­\âq¶k}pš\×O=G˜~\ìÒQò)û»¾ñö/Ù‡öBğ·\ì\ã¦¸\Ò-c\Å÷1\í»\Ö^-»\ä\Åœùq\çÜ³`n\'€=òµ­_\Ú:#\è©R\ä^ö\áE#2¢’\Ä(\É\Åp;ı ~\Zü1FñGt-Ó¬\Ñùß„@—?€®3¤ô\nkºÆŒ\ÌÁUFK€|]ñş\n\Éğ[ÂtZ\Ö|arŸq¬­>\Ïw˜«Á\r|yûHÁS¼eñ“\Â\×^\Zğ¶‹‚4»¦\Å\Í\ÄwF{¹c\Çú½ûT*ø\\œc8\Î]€÷¯\Û\'öı\Õ\àñø[ªı‚\ÊÍŠ^\ë*³\ÜH:¤$ƒµûÃ–=8üñ\ã\'Šüi<\â/êš³7%oo\Ş@\à%±^G{¬\Şß¹7SJOP\Îp\n§»ğ­9’\Ù×½\Õ!bBn Àık&{òI\Âc\êj22)Œ€sR\Ûc¸‘û\Ó	$õ&¯iz&£­]Gm§i÷W÷©´-#1ô\0^óğ÷ş	ûñ\ï\âO—%‡\Ã\İCKµq»\í:\á[\Ú{)G\Ğ\Z>{N\r}“ÿ\0\Ã\Òu}W\ãO‰‘\æ¬\É\áù´j\ç\nnmøùy\íúW«|?ÿ\0‚0øªóË—\Æ^>\Ó4´#-o£Û½\Ëı7¾À¸¾\àı•bŸş\É\ï«\İx~ûP\Õu=Và¹¼¿e\Î\Ä%€U\n2sùg¥4\ìĞ´QEHQ@Q@Wñs\â\îğg\Âskz\ì\Çr\Ş\Ò2<Û‰?º£ù\Ã\ß\0´¯¢·®\'\Ç<ğ\Ùdÿ\0„—ÅºV“*cu´·*\Óóÿ\0L—.*üôñ\ï\íEñoö‹ñ3øoÁ°j$\Ù)£ø}O˜#\éºix\Âò2\ÌU~•g\Ã\ßğMß‰ş(s¯jº7‡üÑ¹’Y\êu\'ûÁ@\\ıÖ¾\Í/‰‘\Ì\Ş\Èú{\Äß·w\Ãû\í\'WƒÁw—šö«#É™,dv8^d\0“Ô€\ço¦M~øú}F_\êW ûLz¼\Ìg;\ä)9,s–‘Ş·uoAğ†öûÃ\ß§\Ó.™d»-†\âP\ÄnÁ\Ép;b¹«xŸ\ãÄ˜tKs\ÅZ\ë—spÿ\0$1‚K\Ï3òÆ¥²X‚I!W,qT­\ìx5«J½GN\Ï\Ê\İ{\Üòÿ\0x\Â\Ã@¶\0Û¥\Å\ë©ˆ¾\ç\Ğ^½‡|}û>~\ß\rÿ\0fÿ\0ı‡Gøyª\ë\"½&««\Ü^E\Ü\È\İP¶D¤©\Û99$“cWÿ\0‚J|P¹º–\äx·\Ãw³Hyi\Zhø\ì\0\Øp=«»ÿ\0‚Müf‡>V¡\á[\Ø.¡0?¬47­s\Ó\Ã\áı‚¿Vz^¿ÿ\0‘»x˜h\ß\r!¶“³_\êfaø…?x\çÿ\0à«¿¼G‘icEğ\Ê7{C#\ìd-ƒQ\\ÿ\0Á,~:+\í[Aı\å\Ô\×ªƒWl?\à’_\Z¯Š›‹¿Ø©\ë\æ\ê1‚\ÄG\ëShšŸ6ø\ïöœø§ñ$\È<A\ã½nş)Zµ´qÿ\0\ß@¯1yZY‹;g\æc“šı!ğ¿ü£^¸1¿ˆ¾\"iök\Æø´\Û”ûá”~•\îÿ\0‚I|ğ\áMvó[ñL\ÊyY\î¼MõX\Æñ\ê\\\Éü ñ—ˆ¼3©\è\ro¥\é2[Şµ\ÄO²ªX\"¯ \æR\îwn8\Æ\Ñ\×5È¿†õu\ÑN°t\ËÑ¤ù¢·}ü0‚By˜Û¸€H\Ï¿¡ş\É\ß~ÿ\0°¾xz\ŞX\Îä¸¸²[™”ú‰%\Ü\Ãğ5\èš\ç…4O\éğ\Øk\Z=†­c‹,v\×Ö©4h\ë÷YU\0ŒœÒ±„T‘r|\Î\çó\àoƒ^<ø?•\á?\ë\"l\á›N°’T_÷˜\r£ñ5ôŸ€?\à”¿|b±MªXi^¶q»:­ê¼ \×8·}?\nıµ¶¶†\Îà·‰ †0#Bª@\0TµDŸšÿ\0‚0\è\Ö\Ş\\¾1ñı\İûõx4›U…>›œ“\ë\Í}\à/ø&\ÏÀ_yOÿ\0“k\×1\à‰õ‹§”\ç\×j•_Àƒ_P\ÑH/\nø\Ã^¶6şğş— À@4\Û8\à®À3ø\Ö\íPEPM*\éï´»;™‰&…$`½*	\Ç\çVè¢€\n(¢€\n(¢€\nø\Ëöºğ·\Ä?>\Ğõ-KP†\ÃQ€B\Ëjñ©„ ˜÷!Á8ş,\ÑEkO\â%\ì}3ğ£\àÿ\0…~\nøZ-ÂºjY[4÷ó\\]\É\ŞI¤\ê\ìyö\0»J(¬\ÙGÁŸµ?Àı‰÷·\Ñ\Ï}\ßÁ&¥,k\"lü\Ü³…\ã¦\ZúKöoıŸ¼\'ğO\Ãu¡EssªkI\Íî§¨:\Éq Û•Œ2ª…rp w$\äóE´şqÒŠU$\Òş®{\rQXEPEPEPEPEPEPEPÿ\Ù');
/*!40000 ALTER TABLE `justificacion` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivel_escolaridad`
--

LOCK TABLES `nivel_escolaridad` WRITE;
/*!40000 ALTER TABLE `nivel_escolaridad` DISABLE KEYS */;
INSERT INTO `nivel_escolaridad` VALUES (6,'Doctorado'),(4,'EspecializaciÃƒÂ³n'),(3,'Licenciatura'),(5,'MaestrÃƒÂ­a'),(1,'TÃƒÂ©cnico'),(2,'TecnÃƒÂ³logo');
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
  `id_acudiente` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` datetime DEFAULT current_timestamp(),
  `id_canal` int(11) NOT NULL,
  `id_estado_notificacion` int(11) NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_canal` (`id_canal`),
  KEY `notificacion_ibfk_1` (`id_acudiente`),
  KEY `idx_notificacion_estado_fecha` (`id_estado_notificacion`,`fecha_envio`),
  CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`) ON DELETE CASCADE,
  CONSTRAINT `notificacion_ibfk_2` FOREIGN KEY (`id_canal`) REFERENCES `canal_notificacion` (`id_canal`),
  CONSTRAINT `notificacion_ibfk_3` FOREIGN KEY (`id_estado_notificacion`) REFERENCES `estado_notificacion` (`id_estado_notificacion`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (2,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-06-29 22:21:39',1,1),(3,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-06-30 15:57:13',1,1),(4,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-01 21:08:30',1,1),(5,2,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-01 21:21:03',1,1),(6,2,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-01 21:37:24',1,1),(7,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-01 21:40:18',1,1),(8,2,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-01 23:28:54',1,1),(9,2,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-01 23:29:36',1,1),(10,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-01 23:51:31',1,1),(11,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-03 00:29:22',1,1),(12,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-03 00:51:50',1,1),(13,14,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-29 11:53:20',1,1),(14,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-07-30 18:37:08',1,1),(15,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-08-01 02:12:16',1,1),(16,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-08-01 02:13:49',1,1),(17,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-08-01 02:21:52',1,1),(18,4,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-08-01 02:29:44',1,1),(19,64,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-08-01 02:36:30',1,1),(20,1,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-08-01 02:39:33',1,1),(21,67,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-08-11 12:23:35',1,1),(22,67,'Se ha registrado una observaciÃƒÂ³n para su acudido. Por favor, revÃƒÂ­sela.','2025-08-12 00:13:40',1,1),(23,67,'Se ha registrado una observaciÃ³n para su acudido. Por favor, revÃ­sela.','2025-08-13 00:00:34',1,1),(24,67,'Se ha registrado una observaciÃ³n para su acudido. Por favor, revÃ­sela.','2025-08-20 00:45:49',1,1);
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
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
INSERT INTO `observacion` VALUES (4,1,1,'2025-06-29','La observaciÃƒÂ³n fue actualizada nuevamente',1,1),(7,1,2,'2025-06-29','El estudiante llegÃƒÂ³ tarde a clase.',1,1),(8,1,2,'2025-06-30','la joben si iso la tarea y termino de ultima',2,1),(9,1,9,'2025-07-01','el estudiante lleva 3 meses en mora por falta de pagos por favor dirijase a la institucion para hacer acuerdo de pago',3,4),(10,3,9,'2025-07-01','el estudiante no quiso hacer la tarea en clase por favor ablar con el ',1,1),(11,3,9,'2025-07-01','asdasdDBIULBUEWQFDBUQBWCFAC _',3,1),(12,1,9,'2025-07-01','ÃƒÂ‘LASDNASLKNDAKSNDIWNHIDA',1,1),(13,3,9,'2025-07-01','pasfsahuifnhiuafen',2,1),(14,3,9,'2025-07-01','lasdniasndinas',2,4),(15,1,9,'2025-07-01','auhsdigdwgqaidsub',2,3),(20,1,9,'2025-07-03','no entro a clase',1,2),(21,1,9,'2025-07-03','lkshdfnouhwbGFBIEU<',3,2),(22,16,9,'2025-07-29','flojo',3,2),(36,91,9,'2025-07-30','el estudiante no trajo el uniforme correcto',2,1),(37,1,9,'2025-07-31','El estudiante tuvo una conducta inadecuada en clase.',2,2),(38,1,9,'2025-08-01','Prueba de notificaciÃƒÂ³n por correo automÃƒÂ¡tico',2,2),(39,1,9,'2025-08-01','Prueba de notificaciÃƒÂ³n por correo automÃƒÂ¡tico',2,2),(40,116,9,'2025-08-01','Prueba de notificaciÃƒÂ³n por correo automÃƒÂ¡tico',2,2),(41,103,9,'2025-08-01','Prueba de notificaciÃƒÂ³n por correo automÃƒÂ¡tico',2,2),(42,15,9,'2025-08-01','el estudiante no hace las tareas',2,1),(43,119,9,'2025-08-11','el estudiante si gtrajo la tarea',2,1),(44,119,9,'2025-08-12','el estudiante no trajo el uniforme completo',1,2),(45,119,9,'2025-08-13','el estudiante no respeto a un profesor y le dijo groserias',3,3),(46,119,9,'2025-08-20','prueba 19 08 25',2,1);
/*!40000 ALTER TABLE `observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `numero_documento` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `ciudad_residencia` varchar(100) DEFAULT NULL,
  `tipo_sangre` varchar(5) DEFAULT NULL,
  `discapacidad` enum('SÃƒÂ­','No') DEFAULT NULL,
  `ocupacion` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `foto` longblob DEFAULT NULL,
  `id_sexo` int(11) NOT NULL,
  `id_tipo_documento` int(11) NOT NULL,
  PRIMARY KEY (`numero_documento`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_sexo` (`id_sexo`),
  KEY `id_tipo_documento` (`id_tipo_documento`),
  CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`id_sexo`) REFERENCES `sexo` (`id_sexo`),
  CONSTRAINT `persona_ibfk_2` FOREIGN KEY (`id_tipo_documento`) REFERENCES `tipo_documento` (`id_tipo_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES ('1001','Juan','PÃƒÂ©rez','juan.perez@email.com','3001234567',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('1001001','Valentina','MuÃƒÂ±oz GarcÃƒÂ­a','valentina1@email.com','3101234561','Calle 12 #45-67','BogotÃƒÂ¡','O+','No','Estudiante','2018-03-12',NULL,2,1),('1001002','Santiago','Lopez Rojas','santiago1@email.com','3129876542','Cra 9 #80-12','MedellÃƒÂ­n','A-','No','Estudiante','2018-05-22',NULL,1,1),('10010025','marlo','gomez','marlongomez@gmail.com','300000001','modelia','bogota','o+','No','estudiante','2016-01-25',NULL,1,1),('10010026','lorena','lopez','lorena@gmail.com','3815488854','calle 4 sur 20-30','bogota','o+','No','estudiante','2015-01-22',NULL,2,2),('10010027','pablo','moreno','pabloL@gmail.com','34846318486','cll 4#14-22','bogota','o+','No','estudiante','2018-01-15',NULL,1,2),('1001003','Isabela','RamÃƒÂ­rez DÃƒÂ­az','isabela2@email.com','3014567890','Av 30 #33-21','Cali','B+','No','Estudiante','2017-01-30',NULL,2,1),('1001004','Mateo','Torres Pardo','mateo2@email.com','3057891234','Mz 6 Lt 8','Barranquilla','AB+','No','Estudiante','2017-06-19',NULL,1,1),('1001005','Mariana','GÃƒÂ³mez SuÃƒÂ¡rez','mariana3@email.com','3104445566','Cl 10 #5-70','Cartagena','O-','No','Estudiante','2016-12-12',NULL,2,1),('1001006','Samuel','Mendoza Arias','samuel3@email.com','3148889900','Cra 2 #30-50','Pereira','A+','SÃƒÂ­','Estudiante','2016-07-07',NULL,1,1),('1001007','Luciana','PÃƒÂ©rez BeltrÃƒÂ¡n','luciana4@email.com','3209991122','Cl 15 #44-11','Manizales','B-','No','Estudiante','2015-10-15',NULL,2,1),('1001008','Emiliano','CastaÃƒÂ±o Vargas','emiliano4@email.com','3135556677','Barrio San Jorge','Bucaramanga','O+','No','Estudiante','2015-03-25',NULL,1,1),('1001009','Gabriela','Morales NiÃƒÂ±o','gabriela5@email.com','3171112233','Cl 7 #8-90','Neiva','AB-','No','Estudiante','2014-09-10',NULL,2,1),('1001010','David','Salazar PeÃƒÂ±a','david5@email.com','3003334455','Cra 5 #17-30','Armenia','O+','No','Estudiante','2014-01-18',NULL,1,1),('1001011','Antonia','LÃƒÂ³pez Romero','antonia6@email.com','3016667788','Cll 32 #12-65','Villavicencio','B+','No','Estudiante','2013-02-05',NULL,2,1),('1001012','TomÃƒÂ¡s','RÃƒÂ­os Camargo','tomas6@email.com','3194445566','Cl 40 #9-10','CÃƒÂºcuta','A-','No','Estudiante','2013-08-08',NULL,1,1),('1001013','Julieta','Navarro Rico','julieta7@email.com','3042223344','Av 50 #20-30','IbaguÃƒÂ©','O+','No','Estudiante','2012-04-14',NULL,2,1),('1001014','BenjamÃƒÂ­n','Quiroz Serrano','benjamin7@email.com','3180001112','Cra 7 #22-40','Sincelejo','AB+','SÃƒÂ­','Estudiante','2012-12-01',NULL,1,1),('1001015','Amanda','VelÃƒÂ¡squez Hoyos','amanda8@email.com','3113332221','Mz A Lt 4','PopayÃƒÂ¡n','B-','No','Estudiante','2011-06-30',NULL,2,1),('1001016','MartÃƒÂ­n','Valencia Cruz','martin8@email.com','3157778899','Cl 3 #1-60','Riohacha','A+','No','Estudiante','2011-10-23',NULL,1,1),('1001017','Sara','Ocampo Silva','sara9@email.com','3161234567','Cra 8 #4-25','MonterÃƒÂ­a','O-','No','Estudiante','2010-11-11',NULL,2,1),('1001018','Alejandro','Correa Baquero','alejandro9@email.com','3103216549','CallejÃƒÂ³n 5','Santa Marta','B+','No','Estudiante','2010-03-09',NULL,1,1),('1001019','Renata','Fajardo Ortega','renata10@email.com','3023334455','Barrio Libertador','Florencia','A-','No','Estudiante','2009-12-15',NULL,2,1),('1001020','Juan JosÃƒÂ©','GonzÃƒÂ¡lez Torres','juanjose10@email.com','3189876540','Cra 3 #22-99','Tunja','O+','SÃƒÂ­','Estudiante','2009-04-17',NULL,1,1),('1001021','Laura','Vallejo MÃƒÂ©ndez','laura11@email.com','3059996655','Cl 9 #15-20','Yopal','AB-','No','Estudiante','2008-05-19',NULL,2,1),('1001022','Dylan','Osorio RincÃƒÂ³n','dylan11@email.com','3077778888','Cra 10 #10-10','Pasto','B+','No','Estudiante','2008-11-02',NULL,1,1),('1001023','SalomÃƒÂ©','Cuellar Bernal','salome12@email.com','3090001112','Cll 6 #2-30','QuibdÃƒÂ³','A+','No','Estudiante','2007-07-27',NULL,2,1),('1001024','JerÃƒÂ³nimo','Barrios LondoÃƒÂ±o','jeronimo12@email.com','3012223344','Av Las Palmas','San AndrÃƒÂ©s','O-','No','Estudiante','2007-01-01',NULL,1,1),('1030672573','sebastia','lizcano','juanslizcano@yahoo.es','184156849','engativa','bogota','o+','No',NULL,'1997-06-10',NULL,1,1),('1129844703','brajar','medina','16.medinasilvabrajhan.805@gmail.com','3121848651581','bosa','bogota','o+','No',NULL,'2000-06-22',NULL,1,1),('1151472244','abel','moreno','juan.perez@example.com',NULL,'Cra 10 #20-30','BogotÃƒÂ¡','O+','No','Profesor','1990-01-15',NULL,1,1),('1151472245','MarÃƒÂ­a','GÃƒÂ³mez','maria.gomez@example.com',NULL,'Calle 45 #12-34','MedellÃƒÂ­n','A+','No','PsicÃƒÂ³loga','1988-05-23',NULL,2,1),('1151472246','Carlos','RodrÃƒÂ­guez','carlos.rod@example.com',NULL,'Av 68 #33-21','Cali','B+','No','Coordinador','1992-11-10',NULL,1,1),('1151472247','Ana','MartÃƒÂ­nez','ana.martinez@example.com',NULL,'Carrera 7 #14-10','Barranquilla','AB+','No','Secretaria','1995-03-30',NULL,2,1),('1151472248','Luis','FernÃƒÂ¡ndez','luis.fernandez@example.com',NULL,'Calle 100 #25-60','Cartagena','O-','No','Orientador','1987-08-19',NULL,1,1),('1151472265','maria','moreno','mariaMoreno','3126636996','soacha la capilla','soacha','o+','No','estudiante','2009-07-10',NULL,2,1),('1151472465','marlo','moreno','marlon123456789@gmail.com','3172481710','soacha la capilla','soacha','o+','No','albaÃƒÂ±il','1990-09-21',NULL,1,1),('115147523685','Maria Camila','Gutierres','mariacamila806@gmail.com','3224859201','calle 6 sur #86a-24','bogota','o+','No','ama de casa','2000-06-29',NULL,2,1),('1151478522','juan','gomez','juan@gmail.com','3214567899','kenedy',NULL,NULL,NULL,'albaÃƒÂ±il',NULL,NULL,1,1),('1151478839','maria','GÃƒÂ³mez','Maria@email.com','3255158412','Calle 15 # 24 - 14',NULL,'A+',NULL,NULL,'1998-04-21',NULL,2,1),('12345678','Juan','PÃƒÂ©rez','juan@example.com','123456789','Calle 123','BogotÃƒÂ¡','O+','No','Estudiante','2005-01-01',_binary 'foto-1751810899570-156893553.jpg',1,1),('1234567890','Mariana','Torres','mariana.torres@colegio.edu.co','3024567890','Calle 25 #45-67','Cali','B+','No',NULL,NULL,NULL,2,1),('1265418646','pedro','jose','pedro@gmail.com','3172481710','soacha la capilla','soacha','o-','','estudiante','2014-12-12',_binary 'foto-1751812737327-731220745.jpg',1,3),('2001','Carlos','Coordinador','renatodescartes26@gmail.com','3001111111',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('26906042','carla','ollarvez','carla@gmail.com','3172481710','soacha la capilla','soacha','o+','','ama de casa','2000-10-15',NULL,2,3),('3001','Laura','Estudiante','laura.estu@email.com','3002222222','Calle 123 #45-67','BogotÃƒÂ¡','O+','No','Estudiante','2005-04-12',NULL,2,1),('3010','Pedro','GÃƒÂ³mez','pedro.gomez@email.com','3001234567','Calle 100 #10-10','MedellÃƒÂ­n','A+','No','Estudiante','2007-03-10',NULL,1,1),('32165498','Yormary','GÃƒÂ³mez','yormary.gomez@email.com','3126547890','Avenida 15 #45-67',NULL,NULL,NULL,'Administradora',NULL,NULL,2,1),('400001','MarÃƒÂ­a','LÃƒÂ³pez','maria.lopez1@example.com','3100000001','Av 1 #20-21','BogotÃƒÂ¡','O-','No','Docente','1985-03-12',NULL,2,1),('400002','Jorge','Castro','jorge.castro1@example.com','3100000002','Av 2 #20-21','BogotÃƒÂ¡','A-','No','Ingeniero','1983-08-19',NULL,1,1),('4000021','martina','godoi','martinaG@gmail.com','3156481523','suba','bogota','o+','No',NULL,'1996-06-19',NULL,2,1),('4000025','jormary','rocha','leonmurcialiliana@gmail.com','30000000002','modelia','bogota','o+','No','ama de cassa','2000-01-27',NULL,2,1),('400003','Carmen','MartÃƒÂ­nez','leonmurcialilianasofia@gmail.com','3100000003','Av 3 #20-21','MedellÃƒÂ­n','B-','No','Abogada','1980-06-25',NULL,2,1),('400004','AndrÃƒÂ©s','SuÃƒÂ¡rez','andres.suarez2@example.com','3100000004','Av 4 #20-21','MedellÃƒÂ­n','AB-','No','Contador','1979-09-11',NULL,1,1),('400005','LucÃƒÂ­a','RamÃƒÂ­rez','lucia.ramirez3@example.com','3100000005','Cra 5 #10-30','Cali','O+','No','Comerciante','1984-01-03',NULL,2,1),('400006','Carlos','GÃƒÂ³mez','carlos.gomez3@example.com','3100000006','Cra 6 #11-31','Cali','A+','No','MÃƒÂ©dico','1982-07-07',NULL,1,1),('400007','Patricia','Ortega','patricia.ortega4@example.com','3100000007','Cra 7 #12-32','Barranquilla','B+','No','Arquitecta','1987-10-05',NULL,2,1),('400008','Luis','Mendoza','luis.mendoza4@example.com','3100000008','Cra 8 #13-33','Barranquilla','AB+','No','Veterinario','1981-04-16',NULL,1,1),('400009','Sandra','Vargas','sandra.vargas5@example.com','3100000009','Cra 9 #14-34','Bucaramanga','O-','No','OdontÃƒÂ³loga','1986-11-21',NULL,2,1),('400010','Fernando','RÃƒÂ­os','fernando.rios5@example.com','3100000010','Cra 10 #15-35','Bucaramanga','A-','No','Administrador','1980-12-30',NULL,1,1),('400011','MÃƒÂ³nica','Reyes','monica.reyes6@example.com','3100000011','Cra 11 #16-36','Cartagena','B-','No','PsicÃƒÂ³loga','1985-06-14',NULL,2,1),('400012','Pedro','Silva','pedro.silva6@example.com','3100000012','Cra 12 #17-37','Cartagena','AB-','No','Abogado','1978-02-02',NULL,1,1),('400013','Adriana','CortÃƒÂ©s','adriana.cortes7@example.com','3100000013','Cra 13 #18-38','Manizales','O+','No','Ingeniera','1983-05-08',NULL,2,1),('400014','Ricardo','PeÃƒÂ±a','ricardo.pena7@example.com','3100000014','Cra 14 #19-39','Manizales','A+','No','Contador','1977-09-18',NULL,1,1),('400015','Natalia','Moreno','natalia.moreno8@example.com','3100000015','Cra 15 #20-40','IbaguÃƒÂ©','B+','No','Chef','1984-03-27',NULL,2,1),('400016','Diego','Quintero','diego.quintero8@example.com','3100000016','Cra 16 #21-41','IbaguÃƒÂ©','AB+','No','DiseÃƒÂ±ador','1981-10-29',NULL,1,1),('400017','VerÃƒÂ³nica','JimÃƒÂ©nez','veronica.jimenez9@example.com','3100000017','Cra 17 #22-42','Pereira','O-','No','Enfermera','1986-08-12',NULL,2,1),('400018','Sergio','LeÃƒÂ³n','sergio.leon9@example.com','3100000018','Cra 18 #23-43','Pereira','A-','No','Administrador','1979-01-24',NULL,1,1),('400019','Paola','Guerrero','paola.guerrero10@example.com','3100000019','Cra 19 #24-44','Villavicencio','B-','No','Docente','1982-05-15',NULL,2,1),('400020','ÃƒÂlvaro','Nieto','alvaro.nieto10@example.com','3100000020','Cra 20 #25-45','Villavicencio','AB-','No','Ingeniero','1980-07-07',NULL,1,1),('400021','Tatiana','MejÃƒÂ­a','tatiana.mejia11@example.com','3100000021','Cra 21 #26-46','CÃƒÂºcuta','O+','No','PsicÃƒÂ³loga','1985-04-11',NULL,2,1),('400022','Oscar','Salazar','oscar.salazar11@example.com','3100000022','Cra 22 #27-47','CÃƒÂºcuta','A+','No','Veterinario','1983-11-03',NULL,1,1),('400023','Diana','Torres','diana.torres12@example.com','3100000023','Cra 23 #28-48','Neiva','B+','No','Contadora','1987-02-19',NULL,2,1),('400024','HÃƒÂ©ctor','Valencia','hector.valencia12@example.com','3100000024','Cra 24 #29-49','Neiva','AB+','No','Administrador','1981-09-09',NULL,1,1),('4001','Marta','Acudiente','morenoabel806@gmail.com','3003333333',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1),('40010026','marcos','lopez','marcosL@GMAIL.COM','3487416488','calle 4 sur 10-40','bogota','o+','No','independiente','2000-02-07',NULL,1,1),('4002','MarÃƒÂ­a','GÃƒÂ³mez','maria.gomez@email.com','3003334444','Calle 50 #20-30','MedellÃƒÂ­n','O-','No','Madre','1985-02-02',NULL,2,1),('4422475111','joaquin','Moreno','joaquin@email.com','3126996336','soacha la capilla','Soacha','O+','No','Profesor','1998-04-21',_binary 'foto.jpg',1,1),('44544248745','marcos','medina','marcos@gmail.com','31264554441','Calle 8sur # 21 - 64','BogotÃƒÂ¡','A+','No','pintor','2000-04-21',NULL,1,1),('4457893254','sebastia','gomez','sebastian_g@email.com','3126636996','Calle 10 # 22 - 14','BogotÃƒÂ¡','A+','No','domiciliario','1998-04-21',NULL,1,1),('5001','Sandra','Secretaria','sandra.sec@email.com','3004444444',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1),('531684946151','paola','contreras','paola@gmail.com','3158614494651','kenedy','bogota','o-','No',NULL,'1992-01-22',NULL,2,1),('54684864','maria','moreno','maria@gmail.com','3468515486','soacha compartir','soacha','o+','No',NULL,'1997-06-17',NULL,2,1),('548465498','marlo','gomez','marlon@gmail.com','31846486153','suba','bogota','o+','No','estudinate','2017-02-10',NULL,1,6),('554615449846','maria','pulido','mariap@gmail.com','31264564851','kenedy','bogota','o-','No','estudiante','2025-01-30',NULL,2,6),('6001','Luis','Rector','luis.rector@email.com','3005555555',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('6798746148','jesus','ropero','jesus@gmail.com','36484165','salitre','bogota','o-','No',NULL,'1980-10-20',NULL,1,1),('6874153','camila','vermez','camila@gmail.com','5348679846','madrid','cundinamarca','o+','No',NULL,'2000-10-20',NULL,2,1),('687846518','joni','guzma','joni@gmail.com','348641348','suba','bogota','o+','No','albaÃƒÂ±il','1996-10-20',NULL,1,1),('79867453','manuel','martinez','manuelM@gmail.com','38461335486','salitre','bogota','o+','No',NULL,'1992-10-20',NULL,1,1),('87654321','MarÃƒÂ­a','LÃƒÂ³pez','maria@example.com','987654321','Carrera 7','BogotÃƒÂ¡','A+','No','Independiente','1980-05-10',NULL,2,1),('98765432','Carla','MartÃƒÂ­nez','carla.martinez@email.com','3019876543','Carrera 10 #20-30','MedellÃƒÂ­n','A+','No','Estudiante','2011-03-15',NULL,2,1),('987654321','Laura','GonzÃƒÂ¡lez','laura.gonzalez@colegio.edu.co','3101234567','Calle 10 #20-30','BogotÃƒÂ¡','A+','No',NULL,NULL,NULL,2,1),('999999999','Funcionario','Prueba','funcionario@prueba.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('benavides','uf26906042','marlo','marlon2647@gmail.com','','bosa','bogota','o+','No','estudiante','2017-06-23',NULL,1,2),('f2548624','marcos','godoi','marcosGodoy@gmail.com','3484651351','bosa','boogta','o-','No','estudiante','2016-07-21',NULL,1,2);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
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
INSERT INTO `relacion_acudiente` VALUES (6,'Abuela'),(5,'Abuelo'),(8,'Hermana'),(7,'Hermano'),(2,'Madre'),(9,'Otro'),(1,'Padre'),(4,'TÃƒÂ­a'),(3,'TÃƒÂ­o');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_documento`
--

LOCK TABLES `tipo_documento` WRITE;
/*!40000 ALTER TABLE `tipo_documento` DISABLE KEYS */;
INSERT INTO `tipo_documento` VALUES (1,'CÃƒÂ©dula de ciudadanÃƒÂ­a'),(3,'CÃƒÂ©dula de extranjerÃƒÂ­a'),(5,'NIT'),(4,'Pasaporte'),(6,'Registro civil'),(2,'Tarjeta de identidad');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `numero_documento` varchar(20) DEFAULT NULL,
  `id_tipo_usuario` int(11) DEFAULT NULL,
  `id_estado_usuario` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  KEY `numero_documento` (`numero_documento`),
  KEY `id_tipo_usuario` (`id_tipo_usuario`),
  KEY `id_estado_usuario` (`id_estado_usuario`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`),
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`),
  CONSTRAINT `usuario_ibfk_3` FOREIGN KEY (`id_estado_usuario`) REFERENCES `estado_usuario` (`id_estado_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'ccoordinador','$2b$10$.6RWLP6iPfAa8tqkmACHBeu25PMR91s.fMUKsA0N1TyB8JgwDmIeS','2001',4,1,'2025-06-29 08:05:59'),(3,'lestudiante','123456','3001',1,1,'2025-06-29 08:06:10'),(4,'macudiente','$2b$10$6xZyuFvlO6aYhcg/w72ee.ElIGVCOjhqkus7Cj.zr5gRed0.DWYFa','4001',2,1,'2025-06-29 08:06:23'),(5,'ssecretaria','123456','5001',5,1,'2025-06-29 08:07:27'),(6,'lrector','123456','6001',7,1,'2025-06-29 08:07:35'),(7,'admin1','clave123','1151472244',1,1,'2025-06-29 16:10:55'),(8,'profe1','clave456','1151472245',2,1,'2025-06-29 16:10:55'),(9,'estu1','clave789','1151472246',3,1,'2025-06-29 16:10:55'),(10,'pedroest','123456','3010',1,1,'2025-06-29 22:10:30'),(12,'brajan_medina@gmail.com','clave1234','44544248745',2,1,'2025-06-29 22:40:19'),(13,'sebastian_g@email.com','clave1234','4457893254',2,1,'2025-06-29 22:41:33'),(14,'juanperez','contrasena_segura','1001',2,1,'2025-06-30 08:25:14'),(15,'Joaquin@gmail.com','clave123','4422475111',1,1,'2025-07-01 13:57:29'),(27,'carla98765432','$2b$10$chQHHEJ2SPZVex99TtG.4uQ8stgh/8foc/a8HySKzqbx/WZ11diZC','98765432',5,1,'2025-07-02 04:50:29'),(28,'yormary32165498','$2b$10$chQHHEJ2SPZVex99TtG.4uQ8stgh/8foc/a8HySKzqbx/WZ11diZC','32165498',4,1,'2025-07-02 04:50:29'),(30,'maria554615449846','$2b$10$MJsgEla3P64XeMKTq7mQ6.DzZsPuKWsz.75x.bImy.Cj6SrF1zFtK','554615449846',5,1,'2025-07-02 12:51:23'),(31,'juan1151478522','$2b$10$MJsgEla3P64XeMKTq7mQ6.DzZsPuKWsz.75x.bImy.Cj6SrF1zFtK','1151478522',4,1,'2025-07-02 12:51:23'),(34,'funcionario.prueba','123456',NULL,3,1,'2025-07-02 19:18:12'),(35,'orientador.prueba','123456',NULL,8,1,'2025-07-02 19:19:49'),(36,'est12345678','12345678','12345678',1,1,'2025-07-06 14:08:19'),(37,'acu87654321','87654321','87654321',2,1,'2025-07-06 14:08:19'),(38,'est1265418646','1265418646','1265418646',1,1,'2025-07-06 14:38:57'),(39,'acu26906042','26906042','26906042',2,1,'2025-07-06 14:38:57'),(40,'laura.gonzalez','profesor2025','987654321',3,1,'2025-07-07 03:17:26'),(41,'mariana.torres','profesora2025','1234567890',3,1,'2025-07-07 03:18:59'),(42,'est548465498','548465498','548465498',1,1,'2025-07-07 04:20:01'),(43,'acu687846518','687846518','687846518',2,1,'2025-07-07 04:20:01'),(44,'jesus@gmail.com','1151472244','6798746148',3,1,'2025-07-07 04:35:25'),(45,'paola@gmail.com','123456','531684946151',3,1,'2025-07-09 12:31:25'),(46,'79867453','79867453','79867453',5,1,'2025-07-09 13:05:31'),(47,'6874153','6874153','6874153',5,1,'2025-07-09 13:08:53'),(48,'54684864','54684864','54684864',5,1,'2025-07-09 13:29:35'),(97,'estu1001001','123456','1001001',7,1,'2025-07-25 00:00:00'),(98,'estu1001002','123456','1001002',7,1,'2025-07-25 00:00:00'),(99,'estu1001003','123456','1001003',7,1,'2025-07-25 00:00:00'),(100,'estu1001004','123456','1001004',7,1,'2025-07-25 00:00:00'),(101,'estu1001005','123456','1001005',7,1,'2025-07-25 00:00:00'),(102,'estu1001006','123456','1001006',7,1,'2025-07-25 00:00:00'),(103,'estu1001007','123456','1001007',7,1,'2025-07-25 00:00:00'),(104,'estu1001008','123456','1001008',7,1,'2025-07-25 00:00:00'),(105,'estu1001009','123456','1001009',7,1,'2025-07-25 00:00:00'),(106,'estu1001010','123456','1001010',7,1,'2025-07-25 00:00:00'),(107,'estu1001011','123456','1001011',7,1,'2025-07-25 00:00:00'),(108,'estu1001012','123456','1001012',7,1,'2025-07-25 00:00:00'),(109,'estu1001013','123456','1001013',7,1,'2025-07-25 00:00:00'),(110,'estu1001014','123456','1001014',7,1,'2025-07-25 00:00:00'),(111,'estu1001015','123456','1001015',7,1,'2025-07-25 00:00:00'),(112,'estu1001016','123456','1001016',7,1,'2025-07-25 00:00:00'),(113,'estu1001017','123456','1001017',7,1,'2025-07-25 00:00:00'),(114,'estu1001018','123456','1001018',7,1,'2025-07-25 00:00:00'),(115,'estu1001019','123456','1001019',7,1,'2025-07-25 00:00:00'),(116,'estu1001020','123456','1001020',7,1,'2025-07-25 00:00:00'),(117,'estu1001021','123456','1001021',7,1,'2025-07-25 00:00:00'),(118,'estu1001022','123456','1001022',7,1,'2025-07-25 00:00:00'),(119,'estu1001023','123456','1001023',7,1,'2025-07-25 00:00:00'),(120,'estu1001024','123456','1001024',7,1,'2025-07-25 00:00:00'),(121,'acud400001','123456','400001',6,1,'2025-07-25 00:00:00'),(122,'acud400002','123456','400002',6,1,'2025-07-25 00:00:00'),(123,'acud400003','123456','400003',6,1,'2025-07-25 00:00:00'),(124,'acud400004','123456','400004',6,1,'2025-07-25 00:00:00'),(125,'acud400005','123456','400005',6,1,'2025-07-25 00:00:00'),(126,'acud400006','123456','400006',6,1,'2025-07-25 00:00:00'),(127,'acud400007','123456','400007',6,1,'2025-07-25 00:00:00'),(128,'acud400008','123456','400008',6,1,'2025-07-25 00:00:00'),(129,'acud400009','123456','400009',6,1,'2025-07-25 00:00:00'),(130,'acud400010','123456','400010',6,1,'2025-07-25 00:00:00'),(131,'acud400011','123456','400011',6,1,'2025-07-25 00:00:00'),(132,'acud400012','123456','400012',6,1,'2025-07-25 00:00:00'),(133,'acud400013','123456','400013',6,1,'2025-07-25 00:00:00'),(134,'acud400014','123456','400014',6,1,'2025-07-25 00:00:00'),(135,'acud400015','123456','400015',6,1,'2025-07-25 00:00:00'),(136,'acud400016','123456','400016',6,1,'2025-07-25 00:00:00'),(137,'acud400017','123456','400017',6,1,'2025-07-25 00:00:00'),(138,'acud400018','123456','400018',6,1,'2025-07-25 00:00:00'),(139,'acud400019','123456','400019',6,1,'2025-07-25 00:00:00'),(140,'acud400020','123456','400020',6,1,'2025-07-25 00:00:00'),(141,'acud400021','123456','400021',6,1,'2025-07-25 00:00:00'),(142,'acud400022','123456','400022',6,1,'2025-07-25 00:00:00'),(143,'acud400023','123456','400023',6,1,'2025-07-25 00:00:00'),(144,'acud400024','123456','400024',6,1,'2025-07-25 00:00:00'),(145,'est10010025','10010025','10010025',1,1,'2025-07-25 18:52:30'),(146,'acu4000025','4000025','4000025',2,1,'2025-07-25 18:52:30'),(147,'est10010026','10010026','10010026',1,1,'2025-07-30 13:34:24'),(148,'acu40010026','40010026','40010026',2,1,'2025-07-30 13:34:24'),(149,'est10010027','10010027','10010027',1,1,'2025-07-30 13:51:19'),(151,'est1151472265','1151472265','1151472265',1,1,'2025-08-05 00:08:06'),(152,'acu1151472465','1151472465','1151472465',2,1,'2025-08-05 00:08:06'),(154,'martinaG@gmail.com','$2b$10$QLXVq8wfP/18QULueubAruSsAmGHtodzjTvl7R4DKs/NK6zXweUCS','4000021',5,1,'2025-08-09 19:43:10'),(155,'estbenavides','$2b$10$N7PoFBCFx3pbVxsxtj2cS..RCTr6fGxxIaSgW3VkpQ6Rz9NWfqQzC','benavides',1,1,'2025-08-09 19:51:46'),(156,'estf2548624','$2b$10$5k1LLaZBwBtg1YAQrRSVzee5fLHP5g9.C7MFUCMFzHP5W61qCwqD.','f2548624',1,1,'2025-08-09 20:01:32'),(157,'acu115147523685','$2b$10$xTAkli1g4ITNJQ.gxkCqheaq87rbyLXmf2DeTqobT/9SQXhezjIKa','115147523685',2,1,'2025-08-09 20:01:32'),(158,'sebastianlizcano@yahoo.con','$2b$10$Cg/fypUO3V4maFuKHDD9vuLGeXetX9GMjWEOKJ7OisTSCvffGN9Cy','1030672573',3,1,'2025-08-11 23:56:44'),(159,'16.medinasilvabrajhan.805@gmail.com','$2b$10$4PTkoWs/liOXQW7t8KwbgeG7acI8nTC/8aR3ZSIoH4s3krh1xK62C','1129844703',5,1,'2025-08-12 00:10:31');
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

-- Dump completed on 2025-08-28 19:23:00
