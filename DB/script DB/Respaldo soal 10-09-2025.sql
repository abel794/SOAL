-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
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
INSERT INTO `asistencia` VALUES (2,1,3,'2025-06-29',1,NULL,1),(4,1,2,'2025-06-28',1,NULL,1),(5,1,1,'2025-06-28',1,NULL,1),(10,1,1,'2025-07-24',1,'LlegÃÂ³ tarde',1),(11,1,13,'2025-07-24',1,'LlegÃÂ³ tarde',1),(12,90,1,'2025-07-25',1,'Presente',1),(13,91,1,'2025-07-25',1,'Presente',1),(14,90,1,'2025-07-25',1,'',1),(15,91,1,'2025-07-25',4,'',1),(16,90,1,'2025-07-25',1,'',1),(17,91,1,'2025-07-25',4,'',1),(33,13,1,'2025-07-25',1,'P',2),(34,112,1,'2025-07-25',1,'P',2),(35,113,1,'2025-07-25',4,'J',2),(36,110,1,'2025-07-25',1,'P',3),(37,111,1,'2025-07-25',2,'A',3);
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
INSERT INTO `cita` VALUES (1,1,2,3,'2025-07-01 15:00:00','ReuniÃÂ³n por bajo rendimiento','Pendiente'),(2,1,2,2,'2025-07-01 15:00:00','incumplimiento en traer el uniforme ','Pendiente'),(3,1,1,2,'2025-07-03 13:00:00','falta de pagos','Pendiente'),(4,1,2,2,'2025-07-01 15:00:00','incumplimiento en traer el uniforme ','Pendiente'),(5,3,2,1,'2025-07-07 15:25:00','uoaoubcuabudacs','Pendiente'),(6,91,1,1,'2025-07-30 19:02:11','el estudiante no trae cuadernos','Pendiente'),(7,119,67,1,'2025-08-11 16:00:00','reunion de padres de familia','Pendiente'),(8,119,67,1,'2025-08-05 15:20:00','puerba de citas','Pendiente');
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
  `horario_envio` enum('maÃÂ±ana','tarde','noche') DEFAULT 'maÃÂ±ana',
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
INSERT INTO `estado_notificacion` VALUES (2,'LeÃÂ­da'),(1,'LeÃÂ­do');
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
INSERT INTO `funcionario` VALUES (1,NULL,2,'Profesor',3,'Arl Sura',NULL),(2,NULL,5,'Profesor',2,'Arl Sura',NULL),(3,NULL,6,'Profesor',1,'Arl Sura',NULL),(6,'1001',14,'Profesor',1,'ARL Sura',NULL),(8,'1151472244',7,'Administrador',1,'ARL Sura',NULL),(9,'1151472245',8,'Profesor',2,'ARL Sura',NULL),(10,'1151472246',9,'Coordinador',1,'ARL Sura',NULL),(11,'1151472247',5,'Secretaria',2,'ARL Sura',NULL),(12,'1151472248',6,'Orientador',1,'ARL Sura',NULL),(13,'2001',2,'Coordinador General',1,'ARL Positiva',NULL),(18,'987654321',40,'Profesor de MatemÃÂ¡ticas',NULL,'SURA',NULL),(19,'1234567890',41,'Profesora de Ciencias',NULL,'SURA',NULL),(20,'6798746148',44,'Profesor',NULL,'sura',NULL),(21,'531684946151',45,'profesor',NULL,'sura',NULL),(22,'79867453',46,'Secretaria',NULL,'No aplica',NULL),(23,'6874153',47,'Secretaria',NULL,'No aplica',NULL),(24,'54684864',48,'Secretaria',NULL,'No aplica',NULL),(26,'4000021',154,'Secretaria',NULL,'No aplica',NULL),(27,'1030672573',158,'profesor',NULL,'sura',NULL),(28,'1129844703',159,'Secretaria',NULL,'No aplica',NULL);
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
-- Table structure for table `grado_notificaciones`
--

DROP TABLE IF EXISTS `grado_notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grado_notificaciones` (
  `id_grado_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_grado` int(11) DEFAULT NULL,
  `id_notificacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_grado_notificacion`),
  KEY `id_grado` (`id_grado`),
  KEY `id_notificacion` (`id_notificacion`),
  CONSTRAINT `grado_notificaciones_ibfk_1` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`) ON DELETE CASCADE,
  CONSTRAINT `grado_notificaciones_ibfk_2` FOREIGN KEY (`id_notificacion`) REFERENCES `notificacion` (`id_notificacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grado_notificaciones`
--

LOCK TABLES `grado_notificaciones` WRITE;
/*!40000 ALTER TABLE `grado_notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `grado_notificaciones` ENABLE KEYS */;
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
INSERT INTO `historial_observacion` VALUES (1,8,'2025-06-30 16:02:47','ActualizaciÃÂ³n de observaciÃÂ³n'),(2,8,'2025-07-01 21:54:10','la joven no quiso hacer una tarea'),(3,8,'2025-07-01 22:02:55','la joben si iso la tarea y termino de ultima'),(4,8,'2025-07-01 22:02:55','la joben si iso la tarea y termino de ultima'),(5,4,'2025-07-29 12:23:34','La observaciÃÂ³n fue actualizada'),(6,4,'2025-07-29 12:26:19','La observaciÃÂ³n fue actualizada nuevamente'),(7,22,'2025-07-29 13:11:36','flojo'),(8,43,'2025-08-20 00:01:34','Se actualizÃ³: el estudiante si gtrajo la tarea');
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
INSERT INTO `justificacion` VALUES (1,1,'2025-06-30','Inasistencia por enfermedad',_binary 'nombre_archivo.pdf'),(2,1,'2025-08-11','tuvo una cita medica',_binary 'ÿØÿà\0JFIF\0\0x\0x\0\0ÿÛ\0C\0\n\n\n\r\rÿÛ\0C		\r\rÿÀ\0$\0Þ\"\0ÿÄ\0\0\0\0\0\0\0\0\0\0\0	\nÿÄ\0µ\0\0\0}\0!1AQa\"q2¡#B±ÁRÑð$3br	\n\Z%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz¢£¤¥¦§¨©ª²³´µ¶·¸¹ºÂÃÄÅÆÇÈÉÊÒÓÔÕÖ×ØÙÚáâãäåæçèéêñòóôõö÷øùúÿÄ\0\0\0\0\0\0\0\0	\nÿÄ\0µ\0\0w\0!1AQaq\"2B¡±Á	#3RðbrÑ\n$4á%ñ\Z&\'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz¢£¤¥¦§¨©ª²³´µ¶·¸¹ºÂÃÄÅÆÇÈÉÊÒÓÔÕÖ×ØÙÚâãäåæçèéêòóôõö÷øùúÿÚ\0\0\0?\0ýS¢(\0¢(\0¢(\0¢(\0¢(\0¢(\0¢ò¿´Ï~éæ_ë)ý¤Ëº\rÌ¬{ÈÚ:üÎTpyÏÒmÙêå¿¿i¯ÿ\0í¼Uâ[k{Ð»L¶>}ÜrF}[Þ¿?~0ÁEüSñ»]ïþ­0£yp[Æd\\ÓF¨é×ø3öuñ×í)â)æð~#P¿ñ1×5gò-!\0ÈùÛnßF2b-*_\'ùì\r>[£éß¿ðU]O[¼ºµð>máÍ&/.­­bâì¦@ÌpTßÎ6þ½«Ë#ý¾~3éòÁ®Åâ»Ñæ;¯`´VºÍ±Ú¦v¯^ÇùÛâÁ_üøÿ\0¢J¿0­Àh%ó¢¹\nÑåÈ¨µæh4m·\ZºÂ±mMÔ;>\\ªLJýÜp0=HZêi·Ë$å»?`¿cÿ\0ÚûEý©|7~«i^*ÒHû~*ñ±!\'<8Á<\nô5~_Á&¾j<añYôÿ\0®t«q/y¤9Qxé½kõ¹çdhõ\n(¢ aEPEPEPEPEPEPEPEPX¾0ñðÿ\0Ã·÷5[]G´]ó^^HÐsÔÀQI\0Mx¿íûcø[àdèv1øáãÝfãm¾~ë\\ÉÒ1ßo,xà¸~g|sñ×~2ê¿Ûÿ\0¼Vñ¾4ï\rÚcùç\0>ï·\'¹íYN¬ ì÷íÔ¸ÁÈú£ã·üNèW1ü7[-:IMµ½úÅë÷ÎÕXSÁr0~Rp>øá¿6½{©x×KÕô]bvóo¬¯áÛx[±Ä­Êmlà÷8û?ö$øàß\rø!h/ß}ÃÚ2Ï&kÄVQÄíÝºfu`3·b¸ùãÏÆûßÚ+â¶«¬Kia-â¥¼î\"µUV©cíÃ6ÓIÆAç£nRÿ\0ò3©ÙWìû+i¿¼M¨ëºýäºgÃOmNòõÅ¹m¡¸rp rÌùá\nt.1ôÿ\0Å¿Û»ÃÞÓàðÀÍ?O0ÙÚùPkiö¯|on·mÛ²>Dðþ³âÏ¾Ò¾øKÔµkEãPµÐt«p±F2âF\00\"û£\0côÇÀïø%M¬qYß|NÔ¦2d\ZVà·8ù^\\`\06¨íÖ¤ª&ïéýu¹m¡ðºWÅ?ÚOâµÝÜ1ê~5ñdåîmÑ¥\nàp#ã8\0WÙßÿ\0à7·³E«üQ×;	KÓXI!çòüµúà/¾ø_¢¦áM\nËB°P3AKã8.ßyÏ\'$×KMÔì%sÞððÏÂ¶>ðíXivi¶8×©=Ùv=Ít4QYQE\0QE\0QE\0QE\0QE\0QE\0QE\0QX^7ñÎðßÂ÷Þ!ñ&¥£Ù&ù®n\0v\n;\'$\n\0×»¼O´êêxí­¡C$³Lá5%\0ÎM|ûLÿ\0ÁBVòâïÂ¿õK{XÀ1Ïâ0ÁäÔZ¯O_=0;ý­¿nmGãÀÃº[\\ø{Á·<*?}t ü­0Oº:Ä<><\'âO\\Ëªj72?ö[Y$Q ?óÓýæ	Æ:3pÓqìõD×-ºG#P=^ùËK¨M)¹¹FûÌÍü\'è2=kÓ4õÒ|ckå¹Ã9ûeæeo-Üà!c`6a0pHºé¾\ZÓ4­I&w´³pÄ8\n×,:*m\'\'§Bqè+Ú~~Ëþ?ý¬`Ò¼½6øÆFaª_À¦; FÑòÔæiÆ\Z¡9sh`üký¡uÚVð×Â:Ö²-Âz\Zýª[\Z¯Ï$1ÆÖ2Ì@\'5î³ÿ\0ü_Äþ+6×ÄÇðvTðö.û¶M¡BÉ!ÈO(ÇÌ@À95ö§À?ÙWÀ³ÕíM[­vXÄw:åâºcSÿ\0,Óýã×8¯b¦ä­d$ºÃ/~ø9áôÑ|¡Zh@\rþBfIèÒHrÎy<±8è0+°¢ÌaE®øIð½Û5NÏJ´Îß>öu3é gÚ4h¯ñGíà}ìÒãÔ|G!;CÙ[ùqg=7ÊW?U+Ô¼ãÍ\'â?íõ­V{yxxådÇTqØlÔ(¢¢(\0¢(\0¢(\0¢(\0¢(\0¢(\0¢ä~&|NÑ¾x|êZ´ÀÉ!)mh÷ýÕ¹ì=ðJú #ø¯ñgÃ¿|sâ?ÝýÒ/8c¥¸G\Zÿ\0~$ð+ñÃö¦ý¨¼YûGx¥ÕôïÚJÇNÑ }ÐD:	ñ¾LucÓ$ôÚ_WñïÆ¾·â\rMK²Ó-d)\r¥¾FBìp	bI$z\0é^ÓÞâ$Õ¬]øV»61õäúïù×Tiòîdå};Ã\Z<C¡O¡k7SéÔGv\"/î6d½»y¤Ò¼=k­ë6þÒ¥ÔïõYgòeL³%sòwp:ç ®×Ã³¯¾6üE¶ð÷4ûK#ßjÐ86v¥ýÑ=¯ÕßÙËöNð§ìýk6£Qk>4¿µK£»¼°¨3Ô[«Æ2QÐ»¹jÏ¿eoø&u¶Ö\'ø¶¿m¸L=¯ÖMÐÄ01ö¿<ìÙåkôÒÎ\r>Ò[X#¶¶qC\nHÔU\05mîVÁEp>*[ü5ÒU£oµY¿ÔÚÀÎ]ÏP¼zÐó>?øQÒÞâÿ\0ÄCB±ÈÜ¶N-ñ&|À~Hv>¬ñ_ü9àxö³g¦RéÒ6@:ìeþ\ry\'?km\"ÙäÃú%ö­*çÝbÖ=FrçèT\ZøoÆÿ\0´¼;uxÖSÉ«ÞJIsiw1îº§=kÄ|Yû_xQyWBÓ¡Óe_=Ç¿÷GãWÐï|wñ¶¶²^ß@².ºdb<)æscï.ÊùÇÿ\0´t\rFKCÄ\'_ÕpÈò[È×³¿¦e$çé_øÇâ|dåµÿ\0Üß¢g%û¨¿(ü\0®3ûf+kåLÌèÁeùI¹¢ãØú[Äµ½ËÀðè\Z\"A\n>Ræôï ÿ\0º8ýkÛ¿à´þ»7í	ÿ\0Î¹¨5Îâ{w·XÜ¤@tÀê]s\nøSñmÞ®C2ZÀO\räÀª[2qÁ8qÚøE­j:_Å?	_XLë{kªÛKNÎ%R0)¥¨é&+Í¾)þÑ?þ[NÞ$ñ\r´7FeþÍ¶>uÛ(Ç>Rò#À÷ I_DzM6I$.ìVc+ó7âÇüV¹½k_øvÛL±\r·êgÏ¸uÏQÂ/àîú×øûöñwÇÏ6Îÿ\0Ä²[\\BUbÊZ`¬\Z;¥lñ<Î¶7#9KýKøûZü(øcÓjÞ/³¹¸¶Ì´Ò^Ì¤?ïón¹ÿ\0TÒ5ãmà¯\0êZ´ å¯uK· òÆ8Ã0	å|Ûð«ö>øéñ+Á¶ö^´Ð¼9l<KâyÞÁoäfKå,m184 À9ñøôMáµOkVmy¦³[ÞZ	Äf2àã`p;8HÂ\rÚ÷3sW±÷Fÿ\0={o¤ð3E2ÝÄY@%À³\rËøÚ~ð¯°þübðßÆß	G¯ønèËï.{y0%·ØàØ8 ×äÇüPÚµæ©¬éf×Lg¶û[ºöA´$dUÆÞF\0á³£¿àú>*ñÞû2+H^I`ÄÓyßil{zQRJè!6Ýú#EW)¸QEcx¿Åºg¼;y­êóýÆÕ71,ç²¨îÄð\0a|^ø¹ |ðe×µûÆ\nÁly2ãÐzç ×åÇÆ_ºÇo¯&×É¦û¾ÿ\0³ªíSÝºúkþÑ?u/>9V¿/bòGo¦ÆC¤Qÿ\0Æpû¾R[óÐÈüWªYFté`û>p%-+eTyg¨½\\×k©C-õ1ræ~G+ãÛ­I»ÇWÕñ0Ýµe*zÏó®çöWý|MûLjë9Eð$2bãWy¸#HWø¿Ýý+Üÿ\0gOØ×Rý£|Kiã_$~µ?èv¸)&¦È +9Ìº/v¯Ó-+IÓ¼3£Ûéú}¬\Zng(!Qq\"\0ªÜ÷ê_-ì`ü0øYá¾³ð×ô¨t­*ÙxHÇÏ+cI«¹Ç$ÿ\0*ë+ñ/Ç/xa_ÎÕã¼@>]ïsÿ\0/á×øÛöÔûx¼=¡£à·ÎH#Ü\\`çÜô÷ãXú¼»âgí)ðÿ\0áeÔ§-n/`RE¥,:)Ûýâ+óKâïíñâÝõý+]/Mi­b³6¬Æ$Þí.ÔáI$ã=+ägñÖã-®Iy¨ÜÄ¯31ñ51fÜSÕnSMõ>¥øÍûik-Õµ¥¿²ÒÓe¼¬O(^ \00:gµó7þ+I¯Ü´·7WÚ¬ÜþòyrGÓs0ÌosÏ(WXW\ZySx4äõ	ù!f?æ®ÝY¸ñ}àW[tHWkÅ¸ü¬{«û«ãûùä18úzWªxöYø©ñUMÁz¤û¹Üð\0zóÍ}#ð÷þ	ñKÄÍ!Ô4ßÛ8ÜLæÉM«È?ZVð{)%½¬·R¬pÄóHÜKø\nýøsÿ\0øaáÆjÚ§§0 ß$}kÑ|[ìíû&Ú+?\ni3xD-*ÊêC!lÏH<Ò¯°´?üû0|Oø,)£x7T%I 1:dg¯CùW¨ø[à}×ìßñÃ$ñ¥Í´·ZEô:hÖáÆár8Àü¤c9öÅ}EñöñWÄë¤Ùk	à\"hÎí6Ë|¯&C7Ëã¥|±âo\0Õo\'ÑßËi¬äÚ#Ý9AÇZÒ\n-Ù±7e¡õ\'Åÿ\0ÛËÄa{]T¼Ñ´«}É±¤ù2H»]ËSõOß±¬ÿ\0<!¬xÿ\0Å-\'Ãÿ\0*=ÝÚ§Únî @În$Ga¶<cï0Kpÿ\0³Â_x?W²øñBdÐ<nökè}aÁ\Z¿,\\[iR8É5Ö~Ú¿¶¥ßÅ¾áKÐ¼-s T¸ \\j®:|Ç$ð{»]¿ÈÝâ,­æ|ëà¿Xk^#Òæ·ðôÚ­ºjq,Ã/Ú3&B¡@ö99*Ý¾\0øoðö1Ó.<_ã¶Óµ3+^¦jË4¶Heñ´[_Cð¯Àn/Æàñ¥¨ÚÙ{}=,å®×ÌÜyj@tf$?ä÷¯rðüâÿ\0Åqi©ø¶ò\\N×w··{ù]ç,<ò@ÜÙ\0Á\'Rå²WÐã¼Üìô;ßø)?|kã¦iNàÍFÒ³ÞOö¦@3¸¼!@îëÁ¯µ¿\\xËâî¡¨øvÛS×nõPóÎÛ=ÌòLç;àçØ{×è§Ãø&\'Â,xßøÎö3¹ô¦(Y¹ù!É<ß}Aá\0xgáý²ðÖ¦è6»BôëT07mq÷95*¤b½Ô_?/þþÅ¿~&èvöÚçÂ6_Úmt«J±#*Ø+\0÷`@8Qc­~|ø¡|ðRh:;Is,ç]ßOþ²âOSèaÚ½&ÆSrÜÑEG`¢¸ßÿ\0ü5ðCmOÄ7Â\0Aòm£ù¦ú\"÷úô¯¾(~Û¾)êO¤ø6ØÊû!·Ó2÷³zfEùöL{æÁÈm¤~øÇðd{õÝ{NÒòé\"b=9?|\rûWþÑïãßB¹oéH±×(Í¦åÏW\"¼CÄß~ øb;øãH½³Ónæej4²»\r;ÀïÈ\0ôï\\Þ«¨3xWR]|iV¢ê;@ËÈ2ëÏ=zVyy¤ôØ&ÝÊxÄ©§¤<7nì²ËËÜÎWQØr\Z§ø^ú~¥ãÛë÷Ã6Z%Ü­åJG*d Ê\'¦ãí^¹ð³öøû@éÞ1ïMÐ´G;mHIÜD½\"Ç÷=Û«Û4ÿ\0ø&ÏáUó<a¢Ã\r±Ã3?%«Kè[V^öÓñ¦¥péÑiº-¼j#H¬­TP0\0Þ[ôÅaÝ|Gñ[WÖ®µÌ#f(>Ð~Þi_ðO-^ÕAâ¢7}º;IÎu®¿EýÅ·Ë©xòæxýtý1-äÇ~dyGþ;\\m\\Ý;¨ßFabX8çó®VY¿µnÍ¼·÷¯ÀÙ²gÓjäÿ\0*ûÃß²Ã­£ßZ_øeþ-bõäFúÂb?÷Åz¶á}ÂÖk£iVzU°YÀ±/ä RQ°Û?1àÿ\0|øóâÆ©.£ö[Z^|×-uäNa7Õ@8¯}øcÿ\0±øWáoËyãµëm­ÑX± ÷Üô¯³è«Øx?þ	SðC¾ë[Uñ+´ãi¼cÎÝ«ÔcM}\rà¿Ù¿áÃØz4{\00AÁÈÇ»f½&7ñZÄ±Ã\ZE\ZôHÔ(¬¯ø¿HðF.©­^¥ÄÀ³1ôU,}¯øñû\\ø_àó6m,z¶¿¼ÆÐÆÀÅnÃ¨rK²=HÅ|Aâß7ß~4i¶>$Ôî\"²»·û,~D¦=Å]@+ °Æ\\æµTäâåÐÍÍ\'cèï\Z~ÛV~\"ñ$ÚÓé\Z0ZÏªÆê$ÛÞAÊ_º{_øöSÃ:RÂ`Úµ]I%ðRó:¦ácÉüÉ\"ºOïü-$úþÆ8õKKØ®ø3\r¢pÙÀ\\à¶GzWßâmzïW	>ÉpeÄ¾rNr/ËèÃó.Mb»OcYr8§ú!oâ[LÔVò+éÒîB®Ìç~þ3)È=;Ã+³×¼]¡j^Y.^ÓMæ)bÖÜ]Â×ÚIB@AÉÎIë>~Æ¿¿h-Mn|5¥K øIðë:ÚùYýÕ±Ó*ó¯¾þÁ7>|\"ßT×`>7ñaÚfÖ6ãîÃÈlz¾G°­çÊÑLüÐø/û,üWøîÑ\\xwÃ×i§;Î«~|tAÔ+63Ôp=:Wßÿ\0ÿ\0àÊÉ¾$ërøÀC.Ày6Àû¹»O½}Ãoo¤Ái1¨D5\nª `\0@j¥Í±ÙÏ¾øSávºWü?a Xf;(>®ßyÏ»}ë¦¢Ì ¢(\0¢(á|ñ\'í?ñóZ;élü\'¥J°\\jïó¯\0e!\\á±Óî äÿ\0\n·ÖßþxCàþ^Ò\"´}¡e½o¹Ýä< Àô»H`Ú0Æ 9Ú\0üIW)9	+_ûD|ã§±VõtíBÚuº³¹uÜÂ²p9ÚCóþÁ7_HømâÚÎ¯iÖ&´Ò4ñ\', ä4ÅÀÈ£©¯º(¦ªJ1åBqMÝ$$$XãE\n¨@è\0ì)ôQYQE\0QE\0QY^%ñ6á-&mGS¸[{hÇsËgjçêx.ê\Z®e5åíÄv¶°©y&ªRM|KûG~Ü1¼^ð\\Íj²7&¦ÙßîàåÁ÷#Ó\'{ûC~Õ\Z÷Åë½SGðü?`Ñ´Â²,ù6\rär¬yô ckç¿¶³ákIï5m5%Òukw(×b2î>sòÈùO¡ÍuÂµÍ:½ÃxÆ]_RÕ.¯TO¨-¶%hâm±)çIÀëõæ¹ø¬ê\Z:)X5lÊTuúç\'5êÔï<àÄðo|=ªë>8ø&³²GhÙGÃB¬rã<õ¯®g/ø%Îáë_üXº_jQ°@@²Ä­>ª0½r\\\Z¹TQV§Îöý¢¬bÑ´;OíDÛYÖã+`pGÕøíÉ<×Ü³ïüëÀÿ\0	=_Ä¨1ñ)Íþ¤ØÚ¹;±,Nps|@µôþ¤Xè:t\Z~eo§X[¨HmmbX¢G@ª \0>r¸»¹Ô´\Z± UPª\0\0\nuóÇmM\"Åj]äv\nª dO@)%ùÙû`ÁCíÐÍáOZòZFÉ{âl»g uËã=6¹ø;ÅuÊí®øËZ×N0>Û}5ÇþÆ­DÝüYðGÓ[ñ¤ÈÌwº10Çû,À×øöèøávtºø§Ï2ÿ\0Ë+4rR¿­~j6·¸c±eqêØÏÝx»Wêiò¥ÔÙÿ\0ÁV¾imâ\reÆqåY¬JÇØ»å^Uâø,lè\r®îIû§PÔV/Ïb5~WK­Í!8éUÞõïßZZúâ?ø,ÅA$þÆðÇ4t\'\ngkñóãµîß±ü¶/§VÐ¾-ÞiúF©k»´Ö\"Éâ=Ê¦&^pà° £=1Ïä*\\=]áã«úSV`N4QEfEPEPEåÿ\0hß~Î^\ZÇ¯Hl­m¹»aÔ\"äp;±À¹ öÔ+^ñá`µ®iº@# ßÝÇï¢+òÇ¶¿ÇÚw]Gø{§êz6ÄÓ¼1½Á\\nnèyÛ±}«#Jÿ\0z~ÐÞ6µêzl\Zq÷]_V¹\'»*³°?QÓß±Ýúy¯þÓ¿ô-*îôx¿LÔAm§\\,òË0¡O<ñ¦¿;?iÚkÄ?5ËiåkÖ-:)YØÚÌGÞ$¯\'§1^ewðö_\Zm÷c»´Å·j÷²9´NWj\rÈ\0ÜkÆ~%×~ êö:úl:Î¯1Y[\r*\'¸è®@UAgåQ·ë]§<§Í¡¥_øæ¼ºÑd[C¤q3Ï³c\'åÈ<çW¯~Îß<UûJ]Å¨øÅÖðDCÊûL·0µÔè©Ëó0~|m¯ücàÏø}®íµ/øE²¨.ì¥ÌÛ»ò1Æz~y®)/®,³\Z¼ÁPJþ®´eFd~þ|,ðÏÁÿ\0ÙóÂé¢ø^ÿ\0Ãúf¸PÏ¸oïË+6XýN@\0«:ÿ\0íOðÃ*Í¨|DðüAsþªõeÎ=6g?>òj·>y¤obÄÕY/ZÃ»7¹ûâ_ø)OÀ«ìñ5Î­ è}»ñ Î¼§Äÿ\0ðXºytÐü!®êì¹ÃÜÉª7ã8úü{=ø§[ZÝj3­`æV ±>\n9RÏÒÁ^|yari?\r4ÝÝº´\\îdÊìA¯þ2ÿ\0ÁA¾2|jÐ®´=c_ÃCº#ÎÓôt·I÷YÀ2ÿ\0d±#ä#ðgÅ\Zx²Ò¾ê÷òO4RÜ\\Ùi×÷ùqªá{(\0ç& ñìñÀÚZÎ¹ðû[Óì$-ä·%	Q°e¹ÁíÆM{ÊÌ©$Oxì{\n¨óÈßÆ\nö?~È¼_°é\r¼E<mÒV±tAõb\0ë>ÿ\0V|~ñFnt\r?Cÿ\0å¦¡©EòýU0üªÄ|÷æ#­~øSþ±âë©øâ.¦ÆpXivÝ0öùü±^ÅáOø#\'Ã=9xÆ^$×1ü65\'ßåãñ¤ãÒNH ÊàFè£5ûÇá_ø&oìõát\\ø ë/ü¶Õ/¦¿ ÁJö~Îßü\"±áÿ\0,LxÚñé±nã¾â¹&?íÀ(ñªi>Õuÿ\0tAhìOä+Ý>~Â?>!ÜÌ&ðN¯¥Y$%Öâî,3e@Q¸ðIü+÷¢ÏM´Ó×m­¬6ËÓÆ~¬ÓNÀQE \n(¢\n(¢\nøëã_ü¾ßã×Ç[øÇúèSèÛ2$P9KáPOÜ\',zõ¯±h¦[	«ÏÃÿ\0¾øWáÛ}Â-¦¦B¡DVÑà¹º»z³MtÔQHgçÅ_ØWâ­×Æ=NëÂ\r¦Ï _ÜM4ZõÊ¢ÁÌÅEÉU`pr×\0?eß|	³ûlQ¦³âû^ë÷#r/>TyþI?ÄÌy¯f¢´IIYF.èdÐÇqIQdCÕ\\dÂ¹/üð\'#)¬ø7BÔÔç?jÓ¢|þ%k°¢³,ñïØàN¡3áwS?óÆÔGÿ\0 â¨Û~Á¿\0­eóáç®%Wqù5ïS¸E¦þÈtD¶¼-£26#ó»í#áÿ\04=7ÃU/ÝÖQÇÉk~@5c@¨¡T\0\0¥ ¢\0(¢³<Iâ}#ÁÚ=Æ«®jvF\0Ý-ÝìËh=ØPgëÞ Òü-¥Ï©k\Z®§À7Kuy2Å\Zvb|#ûBÁV<=áîtÚiñ¥Êmj(ÑÙEÇTë±{å~uüBøÅñ;öñDQk\Z¶³ã\rVå±o¦Û«:OÝÆÕ8Uj=Åsôïã_üWáÃÁseá{¯jñåU­ÏÙì{ÌÀî+ê+àïßðRÿ\0_uÓÄøBÃ?»±Ð`XBýdmÒ1ÿ\0cØW/ãØOã¾\\xã]ðwØ4;hüû¤{ØMÍ¼\\~ñâ\r¸F2;ð(5	m¢x×aGF7\\\nrî=¿¥R°iþÎÿ\0ðTo¾\0ñ§o<-#\\Æ{ËÅ*¸»_ ôsû\ráoiÞ3ðÞ¯iw¥êVéum2oÔqØàòCÅ6D·µæxm¡³ûL¹[©XãôQÉÅ~üþÆþÕ|û6x#IÖQâ¼Ñ¥K÷ãägXv;XqÛ¥LÏh¬¿xNð~w¬jÓm>ÑCM(F} \n	<ÐV¥y÷Çý2óYø?â[->Ò{ëÉ¡A½´m$|Ä8\n À=*Ýf¿~&øwÆzÚ~y)Ô!Ï{[«Y­¥çÂÈªHÉ#=EMáßñ]Þ³m¥êêmCâÝ|¶eer8¯Ò]Ðü[®øJÓ|[®¤Þ9üEbër·`1ÅRÊN|¼c9íRx+À¾0økâOI{aouc{¥Ë¤]¶Òº?Í2K>F2df]ÃûPd¦ô=CÃ<â­BÊÊÃTíÄ_´ÙÏN@ÉîIã¦i¶?<©Ee©4rËrlãk)ãæ\r·`&r1Ö¼À¿üK£i	¯oÿ\0µuX/JÏ¢]Z]0lÇjOy2>ozÂÒ¼-®k(´ßM©ÃâCx4»ËG1Þc9Eþ;=¨<¬{áøÙáOí«).of»·»k)D:eÌ+me.±à÷Î)ütð]®­s§\\jÛÍovÖ2Ë-ëN­´¡fÁÏ|â¼ÃÂö÷¼Joá?°ó¼Kuu\r¾¦³XOJ6»1ä69!Ûk;^ø{âiü5ãä:´ÖðËsÿ\0É´>V£Úb;ÆÕ2ÎTã	øÐò±ïçÄ\rÃ~\"Òt=Fü[ê©ÛiÍ¼äH.IÀÉ=*¾+xgÁØ5KéRíaûL±ÛÚË?Hó$òÕ¶/N+Çþ!x\'Æ¾<×|k®iÖöñÙ46ºgÛã.ÏÙ}°I)`	àöõ©üs%Ö¥©§môOxwÄD&+½&Í®b¹r¤kriVÈù±ÎqANoSè+Ø5+8.íeIí§eXÎUÑUô SÖSè§Z¶ÏU6ý¦Þ\n¾Ñ\0à}·h4ZQ@Â( ( \nZüæý¼¿kÛírïÀ>\rÖ\ZßH³\rVòÎLóóDs±>éÁÁbÀçmRWvÇ·~Ò·ï>Áw¥xm ñ_rÿ\0Ðíqû×|ü{Yx¯Íßþ:øÑûMhzÄ\rZÇY×|¦LÐËoÍ>É2©À\0n@Xy<ÕïÙ{àXý¨¾6Yø^õîbðÕM}¬MlÛ_È^0Üí.åW=q»ó^Ñÿ\0ý¡¼%à_i¿\0¾5¥§q«®&=§}Ãï>rÎryÆNìãOÙsáOxgVøâí/Ãz\r«ßjÚÂÛ[À%?\0:è\r~Û|Yøÿ\0Úðü#ú40xçâô°(ÔÚÍ?GÌ²Ï!N@rÝ22KWæÃø·Àþ2Pð=ÅÜ$),íÞÂ/2|L60HbG 9¯®¿gÏø%OÄOrÃ®|I»èÓ7ÖÒ7T¸ÉÄYçàz¥LÆøçûgüYý¤§Ã^×%EOÝø{GÃk×*¥FZLv.X×[ðGþ	¹ñã)·½¸ÑÁz¸oí2ú¤\0ãª½_¬ÿ\0?cÿ\0\0- >ð½±Õ#\0cPQqxç×Ìaò÷@ÇNí7ì3ãïÙçþ	ð×à¥e®j·7^7ñ±j¤VH\r$ÀÝëì\Z(©\0¢(\0¢(\0¢(\0¢(\0¢(\0¢(\0¢(\0¢­©jv6q}sº%g\n¨êI=\0Yªz¾³aáý6ãPÕ/­ôët2Muw*Åj:f õ¯ÏÚþ\n[©YëRé¿\rVÖÏN:®¡mæMp¼±Úè#é_üUý¢¼_ñ>à\\x£ÄWÚñSº8®åÄUpûíÍj©¾¢¹÷í[ÿ\0X´¾ð¯ÃKÙ Ó4W~%\\¤¡KNS¨3ü¿:<MâÖxB`a\\Ö¥â&fY»v\'¥zìÿ\0û1üEý©<@lü%¥ô¸XÍrû1ÙÛF|Í ·°!é«Ãÿ\0´¿>|:ÁÞþÕu^ÕjZöS78À8\'%&½öhÿ\0h|DøìÖú÷üïxNlH³^ÄMõÚs-ï|AÅ~~Ì_ðO/?³¿Ùuk<eë\Z@¤/ë\\ç£°õ¯©ë;xçÀÙ+áìëdÂ^5M»dÖ/?}y\'þðýÐ}½*@(¢\0(¨®n¡²æ¸8!@Y¤ªÔzW=á?ÞñíÝý¯¼S£øçO`·qiÑ\\4ôÞ:¾:jËñº<9¥Ö°¿Ô(|6ÜÏ7Ï\"¦í£øWvæ=Úµ+/Ä~&Ó<%¥GW»[+!,Py¬¬Ã|,q®\0\'u\0a|Qñ­áÍÂM3-õÖ£ohcI«¶hwEÎv¸­Cã³á}>q®ø~Æ;ËK[?´|àY%ÜÄ»ç\"ETyÞÙ°2}Æ¾\'ÃVzx´¶êûQ¾ÂÝgÇ»äîv\0«`;Wär~$øÌ¾Òµ$¸Ò÷êÖvW³[Ì³YàuÉrJ[;gËÀèHn)¡ÝÇÍSOÕõM7RÒ-nnbmJâ6]J8E·Ææ\"ä±aÜ±Úeîä,¶_´lwÆËaÜJVKÃãÉWÄ\ZiKMÜÈ ûãö§<Þv«l^a*ÅW¶E¸f¸¼á1i1ÃaÎÑòå:~ø·¦kúÆ¦\r3TÓîoCÛá4L mä;mîÂN¦ª~Ò+¡é{¨hpÛ»ÇÜPÿ\0hd¶´rÊÍÿ\0FÝùóÅS²ý£®­lãçGòî+8§i5í3íùÂ0ÿ\0TãrK¡Iæ½ÚMæ¨_[ÚßOölec@ÿ\0lo$[\rÎH l£zØÎ9_þÐVVë.³§ÜØ	.ÚÕF¾U±\0È_á\\w\rÐ¦øwYÄ^Ó5X@ßÚÅtgt>ð¡îö£^OÇ«mN÷DZF¡ogy*­ÔÐ*ä·7I×1v2rÆSKøß£jriiýªZÿ\0h\\GoÜÇ¢yÂÎâB£ÌYÓjä¹;Ü)XD¢¼ïÄß´\nËªCsm5ÆÌ·pÂï\ndSó:îß\Z¼$ª1À#SPøó¤X5ÄÆÊùí\"7QÆ¢8Kaé@+ü1Øp=Kôú+Ë_ãÅÞ Óílt}BþÂö²ÜF\"V½9íâÙiqgÜùwS5ÚWÁÑ5_VçLÓí,!Ô#é\râK\Z:,[sÞ*¡²3ò¸ñ·´_~\Z½×üA}¦Z.é%òO@ª:³ÀQÉ&¿&ÿ\0koÛwWøÍ¨Í¤iÒ7Â°Kº(Ï2Ñå?ÄÝp>èô$®ö³ý²õÿ\0¾$uóZÃÃÖ®ÂÇMò¯MÌB8/èH\0w|»{«4üÄ]»ÜÍ»ìmk:éºvf;þ*ÁãS¼ÒÎnîçqPBÝØ\0rI$\0\\×¥ü\"ý¾)üw¼²Â¾Ô®4ë<¿í\Z+ÆyfÜàdúx¯×/Ùöð_ìÍeo«^EüxW÷ÕÄY[bz­ºìôß÷Ï *%!¤|¡û&Á*/<@^*øËçi¶oað´-²âAÔ}¡Çú°{ ù½J+ô÷ÂÞÑ¼ ÙèÓ-t}&Ñ6Agg4Àw=IêNIæµ¨¬K\n*¾¡¨[éVrÝÝJ!!b	ö\0É$à\09$9¯þ,þÙþ1³Ö®4ÿ\0	øz;K=æ8o/¢>ceHqÏ¦Üg¥6å$ÞÇÚç¿h/ÿ\0	CâÏé\Z<ÑýëY.?÷å7H¯Éÿ\0¿´ÄïJöþ\'øyge\"dÚZ]})QùLqã$Ç=«ç½OÄ>±B±K-Ó1ÜìÝÙõäûTsö+Û§ßÿ\0à¬¿´7ßÂ>Õ¼Q:¢{,à>¹ä}Ukå_ðU/þ&y`ÑKð«çoØ­üÙñþüçè|m{ãw¬Sët¬)õkÃ!py×3ôßß¼cñ6!qâ¯jìwyW×è¤ÿ\0u	Ú¿Ëø?Ç\Z§næ¼Ñ5{ý\ZòT0´ö¼.cÈ%IR2	\nqÕÈÏÌÄÔªr¾õJ=Ø¹»ÓÅV¿Ô­4«o´^ÝCgåO6â@¹* Ü*ÍTÕ4nÓìº¾¡k½$ò.¢Yz0tm¬Ê²«ØGJd_õ-\n/ôEñ7×pÚ.\"ÆÉ#³eK	>\\çÐW/¡kß\rüAªiºö.i­Ü[Ï¦Ças¦§q½ÄRÛUhÂæ¡´6Ö\nårOGñ*oA¢Øÿ\0ÂO$ðÙ>£mÛM4.ábmñÊ[ xÍs¾O¶ {Í>æ\rOKºF-q{$>lñæIAWp\'`nÄ´iÏñ~øFîù@æsw*jKg¤þÿ\0Ìds(¡ÿ\0z7ÎHÍt:e÷ÃÝ6}FæÇOÓ¬.|5ó4³¶Æ_õcËC8\rÜKNyÍ7Ãÿ\0um>]J×PÓ^ßPµÏ+k2#$.L4 Æ\\¸.ÇB.¥Ã}×Ä%\n,ÚÐP´]Aä¸u7R(uA!15ÄrmÁn OâOxwG½ÒÝõGÕ§7÷6z¡»[G.$Sr¹LfªÚø¯áµ¼¾ßÃvxYhåâ³ÿ\0F[µÖ,Ùåóà¡Ú8­(üðÇQÕa½¶÷ò\\}$}rYZ[Ùòó)Ý ù2OOZVøyð¾Æ?´\'µ²·VÞ(æÖ¥%0¤pd)/«H[¾Uæðÿ\0¾ÜjúáÍÆd½%£ÓLò ¤kr ±(q²ÙêB1»Oþ°ÂÛÃM¸¶ÜÁåXÄ¾T§n]p¼7îÓÏÈ¾¸í#Bøiàh]ÙÝÛXI§´æZv·l$/æ+ÌWÍÚÈ¤°Ýô®¦ûâg´Íj].ë^ÓàºÝî®|Ë¨ÕmZ%i-ò3Ç´63@]Õ|áítÜÿ\0ihZf nYZµYÇ\'UJ)mÀîÂ³(Ï@Ät&yào\rê0,^ÒîaRåcÊ6P]Ë¾_âbXúI«¶Zþ©]Ëii¨Ú]]D,C:»¢0X¨9\0=Á ñá]ûXÕï\"ÓôËZ{©Û	\Z(É&Î\'â%Ã_ÞÖ¼QâmC³Ó\"EÜÏ§Ä^e\nG¹s¹#Ú¾ª¾ÆÚ»öã..¬tÛ]ByvV\"¨U22½ÊªO\0\0«{/ÛgöÅ¿ý¢<XÖ:\\Xø+MÂÍÖºåøtÂ¼u,OÉ>mÝÒC\n4ÈÁd±\'s]1*»3nú\rðv¿ñKÅÚ¼3§M«kWò ¶dÜÀIà\0I¯Ö¿Ù[þ	à¯VzïÄ;ko\Zø¸¨ÚÜ.ý>Í±÷V3Ä¤só8#Ñxº¿Øö;²ý¼¿­Û$¿5¸ÞLÃ&Æ[d=Bç»\0:(¯©õ=^ÃDµkFöÞÂÝA-5Ô«\ZuÉbc)6ZV,ÅAE,q¢TA t\0vúùÿ\0Çÿ\0·gÁÌñ\\xº\rZéAÌ\ZHûAê8ü¯<ÿ\0k³¤Áþ{Î§>Å>àÀPUÑ:ä¼{ñoÁìþÓâ¿éº}êp$n3ò ùà+òGVýº~.|i×.4kß?4é¬æsn±<ÛT²Äâìp£ç0IÁùwâô¤^/¹T×nõë¹\'âöc$ÊÎ2RL±Ã¯B3Á©S³¾»âÔyº ´ü-G¦ÓþÙZ_iöË¶SRVd.x.dã#,xÉÀç\'â/´×>!]¼Ú¿pDVj¶± kÈ\ZRZ½s.\ZQöuÆx9#ØVOas´´*Ý_O<¬ï!ËrH<Æ´´jºÓ/6é$ÿ\0(?Næµt+Q\rìQXYÛ¹\"eC»18\0¤ãyÇ5õß?àÿ\0\Z5Mâ¦ðõ¶ë	-*æcíÂH8cØ1S1ZJSËÅWÄFêð»óÿ\0>@ÀÍa*­Ô¦P{CÆ?1Í&¡á°Ã-s1ìC\'lAëë^©Ø}¢Fd]¼²¿¼{ýG5Ï\\@mæxbÖ	.Ðû¾uPgÔò\ZÓGÍÑÍêT½Õ¥ðkþ	¯ñã§ëÖÚ^ _Æ³[ßÞÞ£c=V=ÇóÅ}eàOø#7í¬·øÃÇ·÷·¸òô(Ðú|ß°¯¤¿à~Ö¼+û-xj\rh°72Ü^YÄýc¶BÑþ|¿ü¾¨{eJ~Ò[ ¬¿økNñntíR¸´2Å?²¼g|r,w!E8Î0r	©E#Cñ¿tÿ\0è¥j0´fÜÂ\nÍò²ã$0Ç§5ÉGðDm9ãÕµ[;Ø5Î­ÄÑL<ÇÉ&Ê2HÁ&Iy=6\0òÝ3öwðî4ou¸áûH®|¶6þYÏ+i\n0nãqÈsþÏº¤w«k.#¦Ý¦ÆÒ	?w	^kÔ(§p<ËDø¡èÙdÔu5m2á\'Aä,¬©å¤Xñ\n3\'åÄÞ,ø¢x¶ç]]CU±Yd7ÎhÂ!xYUY\0á÷09Ë\"7jôz(¸i©|Ðõ5·MKU³®Ùä¶ Òý¢v@ù\0Ð.rFkñWÃï|2°¶ÖµÏßxzÏNnçµÙÞXe4$ÈÌÐ©!·¶ùvò¶?í±£~ÌZiZ|1k~9½½½·î­Pô|sD- s_øCà/ÇÛÄOâjîqa;ý­¬¹Ö%\';!º;*/ýiúúãöéø+ðZÝkÞ$e²ÃÉ#KrÇk\'\n»ßlJ7;nê¼óí#ûtj_µ\"é\r²üá\'¹ßzÅüÉnprÀ8Âã!3Ø$ð+Ü5¿ø%¯<	ðÅºÖ¥â=kÄ¾#Óôk»ËHm-­ÚtÝ¦Øoø}+ò×í¥vä·lVÐQÜ7±µãí2øîÆÖùu+dcå\\ªí.¹ n\\§5OÁº¶¥áoXëöWö-Å³IÈÔå[k\"¾õýÿ\0àÿ\0t¡ã:}ÀÐnâÿ\0fex%ºþ[ÈÊCªtu?.7}[?ü+à$²Ãºº.-ZãiöåýjjNú!Å[V~iê¿¶×Ç=vÕ­®~%ë1@Ù?è;vç¶øÕ[õ®OD²øñÛÄ	¦éÄ4Õ>G[¦AêÌÄ_r@¯ÕEÿ\0c|^º&ªß]Zoñ¯}ø]ðÂ<9àíÛEÓÔîq-$­ýé$bYÏ»X\Z\\ü¸ðüÏâÿ\0ímVçCðèpytÒH¸Xgêk_[ÿ\0NüOÓ`2éþ!ðæªê2\"YeôùÌ×ë\rTÕµ{-M¹Ôu+¸ll-É5ÍÃ5IcÀXW?|?ÿ\0½øËâ}U­õ=3@7ØonoC/Ôô×ø·öø#û5éÂ÷âßïüI­üÄðö«®{eq}X.{g¾¿øû^iú©§®f±ÒíÔ|BÖÆhÀy)ÈÔàó+ã/>ºý§¼yá?\nè^!ÒµËÝVòIeÔ-c1íP$Ä«ç9ÇPàVÊ\r+Ètýú©m{ùXò¾ðW5OUÑ¾ÜØh6PIôszöî$MrìHWùIÜ\n2\0àòÿ\0>=bÒÞ_ìmSrÚM\'Wd8`Gb28=«öâ&©à?ØËàEt¥Øß±HÝ¤¸iÏ)½\\.xÝµGÊ§xwÁ^\Z¼ÐmuOé²®§_­í¶¬.m$\";nØä 0Ýw ôCUt´8&ù\'vîzçìÁðáìOð{Iø§ñ^{{_jÐHî£ónm£uÊÅ?{Í*FæÆWvÒTg<Çí1ûyøËÇ\n.u/ê<1áËÜÝÏmAähÀFH÷c¶Xg1^¨ü(øËûhü_Õ5ç]·&8WWÂiÖ\0#~h9;Pn$ç?l|ÿ\0kø;áÅ>6½ÆzâÈ³%9ÚßÔ ógî¦Ü÷:çM:qpû¯#ó»ágÂ®c´ð¯nïálq7ûNp¯ñ_nüÿ\0cCm¬iZçÄmBÞuµe´K¼NÃ&à\0ð¨9ÏÞ÷£Øh\Z|\Ze¾cÚÒ%8Ôt\nª\0éW+Ú÷Hòðù^\r.xG_2;{x­-âÖbP\Z*¨\0À\n)°QERÕu­?Aµ:õ¶l]b]Ì±!v8UË2I\0æijÊ\\,UÙv(¦HQE\0QEò.µÿ\0ëðß¾?jüYâkÏYÞ^}­t9í*à\r±C Àà(8ã ó_YÙXÛé¶pÚZA­¬((a@:\0\0{TôQ¸@ 2c_?é?°OÀ½Æïâ«oÚ@Ëç¥¼³K%¤rg;báÆÑ+è\Z)Ý T\"P@À\0`KE(¢¼ßâGÆ;?Ïý§ïõ¶êÌpWÇSþÏæGi6ìÚ».ü]øÏá¾\ZXñ\rÌ*æ++T2ÜN}oö\0õ¯ÍßÚöñ\'ÇiÖrOÿ\0¯í¡MCì·\0üÇ$7Êp&`0G®1úvòÎãYÕ\'Ôõ¨]ÎÛält\08¯þ1|RûÆØ\"¼µÓï|3¦x©_ßf_¼ëî§°ôµÕ$´Ü5¨¥8Ý.>øßOðÎ³âO±¾tc¤Ïs¨Ú+<m³vÖåwä`ÎxÏJ¿±WÄÂ^ÖôÙâÇIop-Rc³Ó ÀW~yí\0@6¶æ5ûH?éþ,Ó´\'Ú¯µ+XRtþRBëÇP]öã,ÍÇË^¡û%Á8¼Oª½§~!_]øOM25©Û:0çy#ý=_¯5jÚ\nQR¶/Ï_KÛäsþ\'´ñ§ÇÙõjjµÝAPaj±¥nÝæLçj Vfæ^	=+éÙçþ	õcàÏÚÃñ\'U>\'Û\'ÚíKL©ýïG¹9PpØ¯îÏZúÀþ\0ðïÃmÃ:E®¦ÅÒdÆãÝ.Ç»1$÷5ÐV2¨ÞDsF	o©[NÓm4l¬m¡³³E¼a5\0ª8¬ÑEdhQE\0QE\0óíáBº~µâok~8øia:v;²»ó7Kü\0çÛ?NWüYð$×SÅ?|Q=¨aK9ô[üMa4eÆeTv9dä}í qO.ô­kúYþCßÈñ\rRrQºjíµ¿÷£¬_itë¥ÎoÂþÐ~\'üÑ­ôoøÄ>°K ó¶_^ªdýW\0N\0È?w\0køW¨jV^øï¤èöÍØÁí4ú{gÀ;Y¬ØÛ×O§X~Í·~ðmüo©i>#¶ÕfÖeÖb»¸bËl+FB¨1×ü»µÆ:§|[{ªx§ÄÖÑÚM«é±gHã\\ QRIç¹áö\\ ù,Ò³Û³]ïòÛ­Ï£þÑÁÂxû~hJIÅ4ïuR.í(¨»Å;ËIý$ìx×ÁJøwâïpø»À\Zïµ½VÇ[¼×d¹âðCómwâÛÁ#Pý¤/.µ¯|3ð¼¹±Ò<O©Ì5\'´Å$ÐAsñÈ[x«~ø\râ|QáSÆ¾<ÅÖÞfKµ\ZrZ±®Ñ,òc#ôädõ ·Sýµ]cÂZuµïïnüY£êï«i>\"Û{Û#´lí¾<pFá>BXÑ5\røSÒ×NÚkª_ëæ:ØúxºÓM?â8¦ùùetä/5ßáG§o>ëßü3áût]#@[Ò-îæ{°LéµYÉ%w0l~ï¹&ðÑø=¦üñÎªjw\ZïuK\ryîoeu¼»Fb ©n\0íkÙüð;<euâía¼Y®ø¶k©Þým£â2Qv\0	ç<jÁðìÙªéº¿×Ä~7Äðn¥£u¦12×xNA_W«§»é·»ï_¿n×ìl³\\\ns½]l¹ôïuÊÖßÏ¯½kßty¼¾ÿ\0Ç¥|iñÎ­ªjvú×u;û\r­¯dtå³:2¢°RXp=ñÍ}ð_ÅW~7øOá=wPæþûN[¤Ú6;d\ZóÏ~Íz®¥«ø±<;ãy¼9á¿HfÖô¥°IÙÝ%he,~`ÈnS× öh6^ÐtíNÈ°Óíãµ?î¢(U®¬5)Â£»ù»ï÷w<lãÄá¡\nSæÕ8«5ÉuIk-tºÒû³B(¯Høð¢ø«öÇý±¾ð%é:GMGV·n`\0ÇâØtè9Î\ZW2«V4£Í\"oÛCöã·øcÏ<	t^+ï5þdÓÆ9T=\Z^zô\\zôùà_ÇAy¾=RèÝjLå¤l³Î}ëçïè\n®¿o~·1ÜX±eØ¥ÎOP[?JáäÖ·\"Ki^9*ÈØ#ß=«ÒTU qÔn¦§é>8èV÷7©jG@ÇJù·@ð7jO|<ÑRâ(Þ16«,ìW$ùÄ}îá@,ØÀäzì³û\nø¯ãÁ±ñGÄI¯´_Y!bR÷S^£Ë¢#þZ36êý>ðG<?ðßÃºt]H¶»µ´\"ç»V=Éä×,§Ë¢:áJ1Wní£Èÿ\0gÿ\0ØûÂ_Y5«Çoxê@ZãÄZèÇ[täB\'¦Xç5ïTQ\\íßVj²\n(¨®.a´É<©c«ÈÁ@üM!Ñ^Sã¯Ú«áÃexâi4_~Ú+¡<ãþÙG¹ÿ\0JùÓâüËàÿ\0<è¼;§kþ/¸Qû¹ ¶[Kf>ï)?ïÙ§`>á¢¿\"¼}ÿ\0ø¬\"ð´?\r@ÀöY/ç_pß»OÍ\r|áã¿Û»ã·Ä\"ê_µ[h\\a ÒÙl£#Ð¬AsEýí×¼_¡xZ#.³¬ØiQe¯nR!ÿ\0ZJ$±:É¨et9Bq_Ì­âSÄF}SR¼ÔîäËy;Jß_®ðIÚJûâ/u_¾ »k­WÂñ¤úlÒ¾é$°c´¡õòhÉ?vT¢À}ÿ\0ER\0¢(\0¢(\0¢(\0¢(\0¢ù§ö¶ý¦#øa¦Má­u>!ºùÓ£üÖ¨zßyéÉ4ØÎ¥HÒ{öºý¨á\ZøVñýÁP¾LAêÕCê{tëóÇÄ÷°Ãiq0æR¾cO\\Ô~\"ñ,Ú£=ÝÃ¦¤EÞK¸÷ª¾ð/þ5xâÇÃ>ÓßPÔ.	Ú¬ØHÓøåñAåî\0ÅTí\Z}Ï*âë)ÍéÛô9¡¤ßøµô]DMJúåþÍùÒJül\nË1Éºd5ú5û$ÿ\0Á;´¿±Øø¯âU­¶­âq¶k}p×O=G~ìÒQò)û»¾ñö/ÙöBð·ìã¦¸Ò-cÅ÷1í»Ö^-»äÅùqçÜ³`n\'=òµ­_Ú:#è©Rä^öáE#2¢Ä(ÉÅp;ý ~\Zü1FñGt-Ó¬Ñùß@?®3¤ô\nkºÆÌÁUFK|]ñþ\nÉð[ÂtZÖ|arq¬­>Ïw«Á\r|yûHÁS¼eñÂ×^\Zð¶4»¦ÅÍÄwF{¹cÇú½ûT*ø\\c8Î]÷¯Û\'öýÕàñø[ªýÊÍ^ë*³ÜH:¤$µûÃ=8üñã\'üi<â/ê³7%ooÞ@à%±^G{¬Þß¹7SJOPÎp\n§»ð­9Ù×½Õ!bBn Àýk&{òIÂcêj22)sRÛc¸ûÓ	$õ&¯iz&£­]Gm§i÷W÷©´-#1ô\0^óð÷þ	ûñïâO%ÃÝCKµq»í:á[Ú{)GÐ\Z>{N\r}ÿ\0ÃÒu}WãOæ¬Éáù´jç\nnmøùyíúW«|?ÿ\00øªóËÆ^>Ó4´#-o£Û½Ëý7¾À¸¾àýbþÉï«Ýx~ûPÕu=Và¹¼¿eÎÄ%U\n2sùg¥4ìÐ´QEHQ@Q@WñsâîðgÂskzìÇrÞÒ2<Û?º£ùÃß\0´¯¢·®\'Ç<ðÙdÿ\0ÅºV*cu´·*Óóÿ\0L.*üôñïíEñoöñ3øoÁ°j$Ù)£ø}O#éºixÂò2ÌU~gÃßðMßþ(s¯jº7üÑ¹Yêu\'ûÁ@\\ýÖ¾Í/ÌÞÈú{Äß·wÃûí\'WÁwö«#É,dv8^d\0Ôço¦M~øú}F_êW ûLz¼Ìg;ä)9,sÞ·uoAðöûÃß§Ó.d»-âPÄnÁÉp;b¹«xãÄtKsÅZëspÿ\0$1KÏ3òÆ¥²XI!W,qT­ìx5«J½GNÏÊÝ{Üòÿ\0xÂÃ@¶\0Û¥Åë©¾çÐ^½|}û>~ß\rÿ\0fÿ\0ýGøyªë\"½&««Ü^EÜÈÝP¶D¤©Û99$cWÿ\0J|P¹ºäx·Ãw³Hyi\Zhøì\0Øp=«»ÿ\0Müf>V¡á[Ø.¡0?¬47­sÓÃáý¿Vz^¿ÿ\0»xhß\r!¶³_êfaø?xçÿ\0à«¿¼GicEðÊ7{C#ìd-Q\\ÿ\0Á,~:+í[AýåÔ×ªWl?à_\Z¯¿Ø©ëæê1ÄGëSh6øïöø§ñ$È<Aã½nþ)Zµ´qÿ\0ß@¯1yZY;gæcý!ð¿ü£^¸1¿¾\"iökÆø´Ûûá~îÿ\0I|ðáMvó[ñLÊyYî¼MõXÆñê\\Éü ñ¼3©è\ro¥é2[ÞµÄO²ªX\"¯ æRîwn8ÆÑ×5È¿õuÑN°tËÑ¤ù¢·}ü0ByÛ¸HÏ¿¡þÉß~ÿ\0°¾xzÞXÎä¸¸²[ú%ÜÃð5èç4OéðØk\Z=­c,v×Ö©4hë÷YU\0Ò±Tr|Îçóào^<ø?á?ë\"láN°T_÷\r£ñ5ô?à¿|b±MªXi^¶q»:­ê¼ ×8·}?\nýµ¶¶Îà· 0#Bª@\0TµDÿ\00èÖÞ\\¾1ñýÝûõx4U>ëÍ}à/ø&ÏÀ_yOÿ\0k×1àõ§ç×j_À_PÑH/\nøÃ^¶6þðþ À@4Û8à®À3øÖíPEPM*éï´»;&$`½*	ÇçVè¢\n(¢\n(¢\nøËöºð·Ä?>Ðõ-KPÃQBËjñ© ÷!Á8þ,ÑEkOâ%ì}3ð£àÿ\0~\nøZ-ÂºjY[4÷ó\\]ÉÞI¤êìyö\0»J(¬ÙGÁµ?Àý÷·ÑÏ}ßÁ&¥,k\"lüÜ³ã¦\ZúKöoý¼\'ðOÃu¡EssªkIÍî§¨:Éq Û2ªrp w$äóE´þqÒU$Òþ®{\rQXEPEPEPEPEPEPEPÿÙ');
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
INSERT INTO `nivel_escolaridad` VALUES (6,'Doctorado'),(4,'EspecializaciÃÂ³n'),(3,'Licenciatura'),(5,'MaestrÃÂ­a'),(1,'TÃÂ©cnico'),(2,'TecnÃÂ³logo');
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (2,1,'Se ha registrado una notificacion para estudiante','2025-06-29 22:21:39',1,1),(3,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-06-30 15:57:13',1,1),(4,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-01 21:08:30',1,1),(5,2,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-01 21:21:03',1,1),(6,2,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-01 21:37:24',1,1),(7,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-01 21:40:18',1,1),(8,2,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-01 23:28:54',1,1),(9,2,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-01 23:29:36',1,1),(10,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-01 23:51:31',1,1),(11,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-03 00:29:22',1,1),(12,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-03 00:51:50',1,1),(13,14,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-29 11:53:20',1,1),(14,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-07-30 18:37:08',1,1),(15,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-08-01 02:12:16',1,1),(16,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-08-01 02:13:49',1,1),(17,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-08-01 02:21:52',1,1),(18,4,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-08-01 02:29:44',1,1),(19,64,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-08-01 02:36:30',1,1),(20,1,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-08-01 02:39:33',1,1),(21,67,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-08-11 12:23:35',1,1),(22,67,'Se ha registrado una observaciÃÂ³n para su acudido. Por favor, revÃÂ­sela.','2025-08-12 00:13:40',1,1),(23,67,'Se ha registrado una observaciÃ³n para su acudido. Por favor, revÃ­sela.','2025-08-13 00:00:34',1,1),(24,67,'Se ha registrado una observaciÃ³n para su acudido. Por favor, revÃ­sela.','2025-08-20 00:45:49',1,1),(25,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(26,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(27,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(28,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(29,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(30,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(31,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(32,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(33,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(34,1,'Observacion para todos sobre la entrega de boletines el 20 de septiembre','2025-09-10 23:41:08',1,1),(35,1,'...... prueba','2025-09-10 23:43:35',1,1);
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
INSERT INTO `observacion` VALUES (4,1,1,'2025-06-29','La observaciÃÂ³n fue actualizada nuevamente',1,1),(7,1,2,'2025-06-29','El estudiante llegÃÂ³ tarde a clase.',1,1),(8,1,2,'2025-06-30','la joben si iso la tarea y termino de ultima',2,1),(9,1,9,'2025-07-01','el estudiante lleva 3 meses en mora por falta de pagos por favor dirijase a la institucion para hacer acuerdo de pago',3,4),(10,3,9,'2025-07-01','el estudiante no quiso hacer la tarea en clase por favor ablar con el ',1,1),(11,3,9,'2025-07-01','asdasdDBIULBUEWQFDBUQBWCFAC _',3,1),(12,1,9,'2025-07-01','ÃÂLASDNASLKNDAKSNDIWNHIDA',1,1),(13,3,9,'2025-07-01','pasfsahuifnhiuafen',2,1),(14,3,9,'2025-07-01','lasdniasndinas',2,4),(15,1,9,'2025-07-01','auhsdigdwgqaidsub',2,3),(20,1,9,'2025-07-03','no entro a clase',1,2),(21,1,9,'2025-07-03','lkshdfnouhwbGFBIEU<',3,2),(22,16,9,'2025-07-29','flojo',3,2),(36,91,9,'2025-07-30','el estudiante no trajo el uniforme correcto',2,1),(37,1,9,'2025-07-31','El estudiante tuvo una conducta inadecuada en clase.',2,2),(38,1,9,'2025-08-01','Prueba de notificaciÃÂ³n por correo automÃÂ¡tico',2,2),(39,1,9,'2025-08-01','Prueba de notificaciÃÂ³n por correo automÃÂ¡tico',2,2),(40,116,9,'2025-08-01','Prueba de notificaciÃÂ³n por correo automÃÂ¡tico',2,2),(41,103,9,'2025-08-01','Prueba de notificaciÃÂ³n por correo automÃÂ¡tico',2,2),(42,15,9,'2025-08-01','el estudiante no hace las tareas',2,1),(43,119,9,'2025-08-11','el estudiante si gtrajo la tarea',2,1),(44,119,9,'2025-08-12','el estudiante no trajo el uniforme completo',1,2),(45,119,9,'2025-08-13','el estudiante no respeto a un profesor y le dijo groserias',3,3),(46,119,9,'2025-08-20','prueba 19 08 25',2,1);
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
  `discapacidad` enum('SÃÂ­','No') DEFAULT NULL,
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
INSERT INTO `persona` VALUES ('1001','Juan','PÃÂ©rez','juan.perez@email.com','3001234567',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('1001001','Valentina','MuÃÂ±oz GarcÃÂ­a','valentina1@email.com','3101234561','Calle 12 #45-67','BogotÃÂ¡','O+','No','Estudiante','2018-03-12',NULL,2,1),('1001002','Santiago','Lopez Rojas','santiago1@email.com','3129876542','Cra 9 #80-12','MedellÃÂ­n','A-','No','Estudiante','2018-05-22',NULL,1,1),('10010025','marlo','gomez','marlongomez@gmail.com','300000001','modelia','bogota','o+','No','estudiante','2016-01-25',NULL,1,1),('10010026','lorena','lopez','lorena@gmail.com','3815488854','calle 4 sur 20-30','bogota','o+','No','estudiante','2015-01-22',NULL,2,2),('10010027','pablo','moreno','pabloL@gmail.com','34846318486','cll 4#14-22','bogota','o+','No','estudiante','2018-01-15',NULL,1,2),('1001003','Isabela','RamÃÂ­rez DÃÂ­az','isabela2@email.com','3014567890','Av 30 #33-21','Cali','B+','No','Estudiante','2017-01-30',NULL,2,1),('1001004','Mateo','Torres Pardo','mateo2@email.com','3057891234','Mz 6 Lt 8','Barranquilla','AB+','No','Estudiante','2017-06-19',NULL,1,1),('1001005','Mariana','GÃÂ³mez SuÃÂ¡rez','mariana3@email.com','3104445566','Cl 10 #5-70','Cartagena','O-','No','Estudiante','2016-12-12',NULL,2,1),('1001006','Samuel','Mendoza Arias','samuel3@email.com','3148889900','Cra 2 #30-50','Pereira','A+','SÃÂ­','Estudiante','2016-07-07',NULL,1,1),('1001007','Luciana','PÃÂ©rez BeltrÃÂ¡n','luciana4@email.com','3209991122','Cl 15 #44-11','Manizales','B-','No','Estudiante','2015-10-15',NULL,2,1),('1001008','Emiliano','CastaÃÂ±o Vargas','emiliano4@email.com','3135556677','Barrio San Jorge','Bucaramanga','O+','No','Estudiante','2015-03-25',NULL,1,1),('1001009','Gabriela','Morales NiÃÂ±o','gabriela5@email.com','3171112233','Cl 7 #8-90','Neiva','AB-','No','Estudiante','2014-09-10',NULL,2,1),('1001010','David','Salazar PeÃÂ±a','david5@email.com','3003334455','Cra 5 #17-30','Armenia','O+','No','Estudiante','2014-01-18',NULL,1,1),('1001011','Antonia','LÃÂ³pez Romero','antonia6@email.com','3016667788','Cll 32 #12-65','Villavicencio','B+','No','Estudiante','2013-02-05',NULL,2,1),('1001012','TomÃÂ¡s','RÃÂ­os Camargo','tomas6@email.com','3194445566','Cl 40 #9-10','CÃÂºcuta','A-','No','Estudiante','2013-08-08',NULL,1,1),('1001013','Julieta','Navarro Rico','julieta7@email.com','3042223344','Av 50 #20-30','IbaguÃÂ©','O+','No','Estudiante','2012-04-14',NULL,2,1),('1001014','BenjamÃÂ­n','Quiroz Serrano','benjamin7@email.com','3180001112','Cra 7 #22-40','Sincelejo','AB+','SÃÂ­','Estudiante','2012-12-01',NULL,1,1),('1001015','Amanda','VelÃÂ¡squez Hoyos','amanda8@email.com','3113332221','Mz A Lt 4','PopayÃÂ¡n','B-','No','Estudiante','2011-06-30',NULL,2,1),('1001016','MartÃÂ­n','Valencia Cruz','martin8@email.com','3157778899','Cl 3 #1-60','Riohacha','A+','No','Estudiante','2011-10-23',NULL,1,1),('1001017','Sara','Ocampo Silva','sara9@email.com','3161234567','Cra 8 #4-25','MonterÃÂ­a','O-','No','Estudiante','2010-11-11',NULL,2,1),('1001018','Alejandro','Correa Baquero','alejandro9@email.com','3103216549','CallejÃÂ³n 5','Santa Marta','B+','No','Estudiante','2010-03-09',NULL,1,1),('1001019','Renata','Fajardo Ortega','renata10@email.com','3023334455','Barrio Libertador','Florencia','A-','No','Estudiante','2009-12-15',NULL,2,1),('1001020','Juan JosÃÂ©','GonzÃÂ¡lez Torres','juanjose10@email.com','3189876540','Cra 3 #22-99','Tunja','O+','SÃÂ­','Estudiante','2009-04-17',NULL,1,1),('1001021','Laura','Vallejo MÃÂ©ndez','laura11@email.com','3059996655','Cl 9 #15-20','Yopal','AB-','No','Estudiante','2008-05-19',NULL,2,1),('1001022','Dylan','Osorio RincÃÂ³n','dylan11@email.com','3077778888','Cra 10 #10-10','Pasto','B+','No','Estudiante','2008-11-02',NULL,1,1),('1001023','SalomÃÂ©','Cuellar Bernal','salome12@email.com','3090001112','Cll 6 #2-30','QuibdÃÂ³','A+','No','Estudiante','2007-07-27',NULL,2,1),('1001024','JerÃÂ³nimo','Barrios LondoÃÂ±o','jeronimo12@email.com','3012223344','Av Las Palmas','San AndrÃÂ©s','O-','No','Estudiante','2007-01-01',NULL,1,1),('1030672573','sebastia','lizcano','juanslizcano@yahoo.es','184156849','engativa','bogota','o+','No',NULL,'1997-06-10',NULL,1,1),('1129844703','brajar','medina','16.medinasilvabrajhan.805@gmail.com','3121848651581','bosa','bogota','o+','No',NULL,'2000-06-22',NULL,1,1),('1151472244','abel','moreno','juan.perez@example.com',NULL,'Cra 10 #20-30','BogotÃÂ¡','O+','No','Profesor','1990-01-15',NULL,1,1),('1151472245','MarÃÂ­a','GÃÂ³mez','maria.gomez@example.com',NULL,'Calle 45 #12-34','MedellÃÂ­n','A+','No','PsicÃÂ³loga','1988-05-23',NULL,2,1),('1151472246','Carlos','RodrÃÂ­guez','carlos.rod@example.com',NULL,'Av 68 #33-21','Cali','B+','No','Coordinador','1992-11-10',NULL,1,1),('1151472247','Ana','MartÃÂ­nez','ana.martinez@example.com',NULL,'Carrera 7 #14-10','Barranquilla','AB+','No','Secretaria','1995-03-30',NULL,2,1),('1151472248','Luis','FernÃÂ¡ndez','luis.fernandez@example.com',NULL,'Calle 100 #25-60','Cartagena','O-','No','Orientador','1987-08-19',NULL,1,1),('1151472265','maria','moreno','mariaMoreno','3126636996','soacha la capilla','soacha','o+','No','estudiante','2009-07-10',NULL,2,1),('1151472465','marlo','moreno','marlon123456789@gmail.com','3172481710','soacha la capilla','soacha','o+','No','albaÃÂ±il','1990-09-21',NULL,1,1),('115147523685','Maria Camila','Gutierres','mariacamila806@gmail.com','3224859201','calle 6 sur #86a-24','bogota','o+','No','ama de casa','2000-06-29',NULL,2,1),('1151478522','juan','gomez','juan@gmail.com','3214567899','kenedy',NULL,NULL,NULL,'albaÃÂ±il',NULL,NULL,1,1),('1151478839','maria','GÃÂ³mez','Maria@email.com','3255158412','Calle 15 # 24 - 14',NULL,'A+',NULL,NULL,'1998-04-21',NULL,2,1),('12345678','Juan','PÃÂ©rez','juan@example.com','123456789','Calle 123','BogotÃÂ¡','O+','No','Estudiante','2005-01-01',_binary 'foto-1751810899570-156893553.jpg',1,1),('1234567890','Mariana','Torres','mariana.torres@colegio.edu.co','3024567890','Calle 25 #45-67','Cali','B+','No',NULL,NULL,NULL,2,1),('1265418646','pedro','jose','pedro@gmail.com','3172481710','soacha la capilla','soacha','o-','','estudiante','2014-12-12',_binary 'foto-1751812737327-731220745.jpg',1,3),('2001','Carlos','Coordinador','renatodescartes26@gmail.com','3001111111',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('26906042','carla','ollarvez','carla@gmail.com','3172481710','soacha la capilla','soacha','o+','','ama de casa','2000-10-15',NULL,2,3),('3001','Laura','Estudiante','laura.estu@email.com','3002222222','Calle 123 #45-67','BogotÃÂ¡','O+','No','Estudiante','2005-04-12',NULL,2,1),('3010','Pedro','GÃÂ³mez','pedro.gomez@email.com','3001234567','Calle 100 #10-10','MedellÃÂ­n','A+','No','Estudiante','2007-03-10',NULL,1,1),('32165498','Yormary','GÃÂ³mez','yormary.gomez@email.com','3126547890','Avenida 15 #45-67',NULL,NULL,NULL,'Administradora',NULL,NULL,2,1),('400001','MarÃÂ­a','LÃÂ³pez','maria.lopez1@example.com','3100000001','Av 1 #20-21','BogotÃÂ¡','O-','No','Docente','1985-03-12',NULL,2,1),('400002','Jorge','Castro','jorge.castro1@example.com','3100000002','Av 2 #20-21','BogotÃÂ¡','A-','No','Ingeniero','1983-08-19',NULL,1,1),('4000021','martina','godoi','martinaG@gmail.com','3156481523','suba','bogota','o+','No',NULL,'1996-06-19',NULL,2,1),('4000025','jormary','rocha','leonmurcialiliana@gmail.com','30000000002','modelia','bogota','o+','No','ama de cassa','2000-01-27',NULL,2,1),('400003','Carmen','MartÃÂ­nez','leonmurcialilianasofia@gmail.com','3100000003','Av 3 #20-21','MedellÃÂ­n','B-','No','Abogada','1980-06-25',NULL,2,1),('400004','AndrÃÂ©s','SuÃÂ¡rez','andres.suarez2@example.com','3100000004','Av 4 #20-21','MedellÃÂ­n','AB-','No','Contador','1979-09-11',NULL,1,1),('400005','LucÃÂ­a','RamÃÂ­rez','lucia.ramirez3@example.com','3100000005','Cra 5 #10-30','Cali','O+','No','Comerciante','1984-01-03',NULL,2,1),('400006','Carlos','GÃÂ³mez','carlos.gomez3@example.com','3100000006','Cra 6 #11-31','Cali','A+','No','MÃÂ©dico','1982-07-07',NULL,1,1),('400007','Patricia','Ortega','patricia.ortega4@example.com','3100000007','Cra 7 #12-32','Barranquilla','B+','No','Arquitecta','1987-10-05',NULL,2,1),('400008','Luis','Mendoza','luis.mendoza4@example.com','3100000008','Cra 8 #13-33','Barranquilla','AB+','No','Veterinario','1981-04-16',NULL,1,1),('400009','Sandra','Vargas','sandra.vargas5@example.com','3100000009','Cra 9 #14-34','Bucaramanga','O-','No','OdontÃÂ³loga','1986-11-21',NULL,2,1),('400010','Fernando','RÃÂ­os','fernando.rios5@example.com','3100000010','Cra 10 #15-35','Bucaramanga','A-','No','Administrador','1980-12-30',NULL,1,1),('400011','MÃÂ³nica','Reyes','monica.reyes6@example.com','3100000011','Cra 11 #16-36','Cartagena','B-','No','PsicÃÂ³loga','1985-06-14',NULL,2,1),('400012','Pedro','Silva','pedro.silva6@example.com','3100000012','Cra 12 #17-37','Cartagena','AB-','No','Abogado','1978-02-02',NULL,1,1),('400013','Adriana','CortÃÂ©s','adriana.cortes7@example.com','3100000013','Cra 13 #18-38','Manizales','O+','No','Ingeniera','1983-05-08',NULL,2,1),('400014','Ricardo','PeÃÂ±a','ricardo.pena7@example.com','3100000014','Cra 14 #19-39','Manizales','A+','No','Contador','1977-09-18',NULL,1,1),('400015','Natalia','Moreno','natalia.moreno8@example.com','3100000015','Cra 15 #20-40','IbaguÃÂ©','B+','No','Chef','1984-03-27',NULL,2,1),('400016','Diego','Quintero','diego.quintero8@example.com','3100000016','Cra 16 #21-41','IbaguÃÂ©','AB+','No','DiseÃÂ±ador','1981-10-29',NULL,1,1),('400017','VerÃÂ³nica','JimÃÂ©nez','veronica.jimenez9@example.com','3100000017','Cra 17 #22-42','Pereira','O-','No','Enfermera','1986-08-12',NULL,2,1),('400018','Sergio','LeÃÂ³n','sergio.leon9@example.com','3100000018','Cra 18 #23-43','Pereira','A-','No','Administrador','1979-01-24',NULL,1,1),('400019','Paola','Guerrero','paola.guerrero10@example.com','3100000019','Cra 19 #24-44','Villavicencio','B-','No','Docente','1982-05-15',NULL,2,1),('400020','ÃÂlvaro','Nieto','alvaro.nieto10@example.com','3100000020','Cra 20 #25-45','Villavicencio','AB-','No','Ingeniero','1980-07-07',NULL,1,1),('400021','Tatiana','MejÃÂ­a','tatiana.mejia11@example.com','3100000021','Cra 21 #26-46','CÃÂºcuta','O+','No','PsicÃÂ³loga','1985-04-11',NULL,2,1),('400022','Oscar','Salazar','oscar.salazar11@example.com','3100000022','Cra 22 #27-47','CÃÂºcuta','A+','No','Veterinario','1983-11-03',NULL,1,1),('400023','Diana','Torres','diana.torres12@example.com','3100000023','Cra 23 #28-48','Neiva','B+','No','Contadora','1987-02-19',NULL,2,1),('400024','HÃÂ©ctor','Valencia','hector.valencia12@example.com','3100000024','Cra 24 #29-49','Neiva','AB+','No','Administrador','1981-09-09',NULL,1,1),('4001','Marta','Acudiente','morenoabel806@gmail.com','3003333333',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1),('40010026','marcos','lopez','marcosL@GMAIL.COM','3487416488','calle 4 sur 10-40','bogota','o+','No','independiente','2000-02-07',NULL,1,1),('4002','MarÃÂ­a','GÃÂ³mez','maria.gomez@email.com','3003334444','Calle 50 #20-30','MedellÃÂ­n','O-','No','Madre','1985-02-02',NULL,2,1),('4422475111','joaquin','Moreno','joaquin@email.com','3126996336','soacha la capilla','Soacha','O+','No','Profesor','1998-04-21',_binary 'foto.jpg',1,1),('44544248745','marcos','medina','marcos@gmail.com','31264554441','Calle 8sur # 21 - 64','BogotÃÂ¡','A+','No','pintor','2000-04-21',NULL,1,1),('4457893254','sebastia','gomez','sebastian_g@email.com','3126636996','Calle 10 # 22 - 14','BogotÃÂ¡','A+','No','domiciliario','1998-04-21',NULL,1,1),('5001','Sandra','Secretaria','sandra.sec@email.com','3004444444',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1),('531684946151','paola','contreras','paola@gmail.com','3158614494651','kenedy','bogota','o-','No',NULL,'1992-01-22',NULL,2,1),('54684864','maria','moreno','maria@gmail.com','3468515486','soacha compartir','soacha','o+','No',NULL,'1997-06-17',NULL,2,1),('548465498','marlo','gomez','marlon@gmail.com','31846486153','suba','bogota','o+','No','estudinate','2017-02-10',NULL,1,6),('554615449846','maria','pulido','mariap@gmail.com','31264564851','kenedy','bogota','o-','No','estudiante','2025-01-30',NULL,2,6),('6001','Luis','Rector','luis.rector@email.com','3005555555',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('6798746148','jesus','ropero','jesus@gmail.com','36484165','salitre','bogota','o-','No',NULL,'1980-10-20',NULL,1,1),('6874153','camila','vermez','camila@gmail.com','5348679846','madrid','cundinamarca','o+','No',NULL,'2000-10-20',NULL,2,1),('687846518','joni','guzma','joni@gmail.com','348641348','suba','bogota','o+','No','albaÃÂ±il','1996-10-20',NULL,1,1),('79867453','manuel','martinez','manuelM@gmail.com','38461335486','salitre','bogota','o+','No',NULL,'1992-10-20',NULL,1,1),('87654321','MarÃÂ­a','LÃÂ³pez','maria@example.com','987654321','Carrera 7','BogotÃÂ¡','A+','No','Independiente','1980-05-10',NULL,2,1),('98765432','Carla','MartÃÂ­nez','carla.martinez@email.com','3019876543','Carrera 10 #20-30','MedellÃÂ­n','A+','No','Estudiante','2011-03-15',NULL,2,1),('987654321','Laura','GonzÃÂ¡lez','laura.gonzalez@colegio.edu.co','3101234567','Calle 10 #20-30','BogotÃÂ¡','A+','No',NULL,NULL,NULL,2,1),('999999999','Funcionario','Prueba','funcionario@prueba.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('benavides','uf26906042','marlo','marlon2647@gmail.com','','bosa','bogota','o+','No','estudiante','2017-06-23',NULL,1,2),('f2548624','marcos','godoi','marcosGodoy@gmail.com','3484651351','bosa','boogta','o-','No','estudiante','2016-07-21',NULL,1,2);
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
INSERT INTO `relacion_acudiente` VALUES (6,'Abuela'),(5,'Abuelo'),(8,'Hermana'),(7,'Hermano'),(2,'Madre'),(9,'Otro'),(1,'Padre'),(4,'TÃÂ­a'),(3,'TÃÂ­o');
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
INSERT INTO `tipo_documento` VALUES (1,'CÃÂ©dula de ciudadanÃÂ­a'),(3,'CÃÂ©dula de extranjerÃÂ­a'),(5,'NIT'),(4,'Pasaporte'),(6,'Registro civil'),(2,'Tarjeta de identidad');
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
INSERT INTO `usuario` VALUES (2,'ccoordinador','$2b$10$.6RWLP6iPfAa8tqkmACHBeu25PMR91s.fMUKsA0N1TyB8JgwDmIeS','2001',4,1,'2025-06-29 08:05:59'),(3,'lestudiante','123456','3001',1,1,'2025-06-29 08:06:10'),(4,'macudiente','$2b$10$afN8oxfKUkUmW21OikFqh.LgIe95nhFPxixktwEjfkcCvZr/mkr7O','4001',2,1,'2025-06-29 08:06:23'),(5,'ssecretaria','123456','5001',5,1,'2025-06-29 08:07:27'),(6,'lrector','123456','6001',7,1,'2025-06-29 08:07:35'),(7,'admin1','clave123','1151472244',1,1,'2025-06-29 16:10:55'),(8,'profe1','clave456','1151472245',2,1,'2025-06-29 16:10:55'),(9,'estu1','clave789','1151472246',3,1,'2025-06-29 16:10:55'),(10,'pedroest','123456','3010',1,1,'2025-06-29 22:10:30'),(12,'brajan_medina@gmail.com','clave1234','44544248745',2,1,'2025-06-29 22:40:19'),(13,'sebastian_g@email.com','clave1234','4457893254',2,1,'2025-06-29 22:41:33'),(14,'juanperez','contrasena_segura','1001',2,1,'2025-06-30 08:25:14'),(15,'Joaquin@gmail.com','clave123','4422475111',1,1,'2025-07-01 13:57:29'),(27,'carla98765432','$2b$10$chQHHEJ2SPZVex99TtG.4uQ8stgh/8foc/a8HySKzqbx/WZ11diZC','98765432',5,1,'2025-07-02 04:50:29'),(28,'yormary32165498','$2b$10$chQHHEJ2SPZVex99TtG.4uQ8stgh/8foc/a8HySKzqbx/WZ11diZC','32165498',4,1,'2025-07-02 04:50:29'),(30,'maria554615449846','$2b$10$MJsgEla3P64XeMKTq7mQ6.DzZsPuKWsz.75x.bImy.Cj6SrF1zFtK','554615449846',5,1,'2025-07-02 12:51:23'),(31,'juan1151478522','$2b$10$MJsgEla3P64XeMKTq7mQ6.DzZsPuKWsz.75x.bImy.Cj6SrF1zFtK','1151478522',4,1,'2025-07-02 12:51:23'),(34,'funcionario.prueba','123456',NULL,3,1,'2025-07-02 19:18:12'),(35,'orientador.prueba','123456',NULL,8,1,'2025-07-02 19:19:49'),(36,'est12345678','12345678','12345678',1,1,'2025-07-06 14:08:19'),(37,'acu87654321','87654321','87654321',2,1,'2025-07-06 14:08:19'),(38,'est1265418646','1265418646','1265418646',1,1,'2025-07-06 14:38:57'),(39,'acu26906042','26906042','26906042',2,1,'2025-07-06 14:38:57'),(40,'laura.gonzalez','profesor2025','987654321',3,1,'2025-07-07 03:17:26'),(41,'mariana.torres','profesora2025','1234567890',3,1,'2025-07-07 03:18:59'),(42,'est548465498','548465498','548465498',1,1,'2025-07-07 04:20:01'),(43,'acu687846518','687846518','687846518',2,1,'2025-07-07 04:20:01'),(44,'jesus@gmail.com','1151472244','6798746148',3,1,'2025-07-07 04:35:25'),(45,'paola@gmail.com','123456','531684946151',3,1,'2025-07-09 12:31:25'),(46,'79867453','79867453','79867453',5,1,'2025-07-09 13:05:31'),(47,'6874153','6874153','6874153',5,1,'2025-07-09 13:08:53'),(48,'54684864','54684864','54684864',5,1,'2025-07-09 13:29:35'),(97,'estu1001001','123456','1001001',7,1,'2025-07-25 00:00:00'),(98,'estu1001002','123456','1001002',7,1,'2025-07-25 00:00:00'),(99,'estu1001003','123456','1001003',7,1,'2025-07-25 00:00:00'),(100,'estu1001004','123456','1001004',7,1,'2025-07-25 00:00:00'),(101,'estu1001005','123456','1001005',7,1,'2025-07-25 00:00:00'),(102,'estu1001006','123456','1001006',7,1,'2025-07-25 00:00:00'),(103,'estu1001007','123456','1001007',7,1,'2025-07-25 00:00:00'),(104,'estu1001008','123456','1001008',7,1,'2025-07-25 00:00:00'),(105,'estu1001009','123456','1001009',7,1,'2025-07-25 00:00:00'),(106,'estu1001010','123456','1001010',7,1,'2025-07-25 00:00:00'),(107,'estu1001011','123456','1001011',7,1,'2025-07-25 00:00:00'),(108,'estu1001012','123456','1001012',7,1,'2025-07-25 00:00:00'),(109,'estu1001013','123456','1001013',7,1,'2025-07-25 00:00:00'),(110,'estu1001014','123456','1001014',7,1,'2025-07-25 00:00:00'),(111,'estu1001015','123456','1001015',7,1,'2025-07-25 00:00:00'),(112,'estu1001016','123456','1001016',7,1,'2025-07-25 00:00:00'),(113,'estu1001017','123456','1001017',7,1,'2025-07-25 00:00:00'),(114,'estu1001018','123456','1001018',7,1,'2025-07-25 00:00:00'),(115,'estu1001019','123456','1001019',7,1,'2025-07-25 00:00:00'),(116,'estu1001020','123456','1001020',7,1,'2025-07-25 00:00:00'),(117,'estu1001021','123456','1001021',7,1,'2025-07-25 00:00:00'),(118,'estu1001022','123456','1001022',7,1,'2025-07-25 00:00:00'),(119,'estu1001023','123456','1001023',7,1,'2025-07-25 00:00:00'),(120,'estu1001024','123456','1001024',7,1,'2025-07-25 00:00:00'),(121,'acud400001','123456','400001',6,1,'2025-07-25 00:00:00'),(122,'acud400002','123456','400002',6,1,'2025-07-25 00:00:00'),(123,'acud400003','123456','400003',6,1,'2025-07-25 00:00:00'),(124,'acud400004','123456','400004',6,1,'2025-07-25 00:00:00'),(125,'acud400005','123456','400005',6,1,'2025-07-25 00:00:00'),(126,'acud400006','123456','400006',6,1,'2025-07-25 00:00:00'),(127,'acud400007','123456','400007',6,1,'2025-07-25 00:00:00'),(128,'acud400008','123456','400008',6,1,'2025-07-25 00:00:00'),(129,'acud400009','123456','400009',6,1,'2025-07-25 00:00:00'),(130,'acud400010','123456','400010',6,1,'2025-07-25 00:00:00'),(131,'acud400011','123456','400011',6,1,'2025-07-25 00:00:00'),(132,'acud400012','123456','400012',6,1,'2025-07-25 00:00:00'),(133,'acud400013','123456','400013',6,1,'2025-07-25 00:00:00'),(134,'acud400014','123456','400014',6,1,'2025-07-25 00:00:00'),(135,'acud400015','123456','400015',6,1,'2025-07-25 00:00:00'),(136,'acud400016','123456','400016',6,1,'2025-07-25 00:00:00'),(137,'acud400017','123456','400017',6,1,'2025-07-25 00:00:00'),(138,'acud400018','123456','400018',6,1,'2025-07-25 00:00:00'),(139,'acud400019','123456','400019',6,1,'2025-07-25 00:00:00'),(140,'acud400020','123456','400020',6,1,'2025-07-25 00:00:00'),(141,'acud400021','123456','400021',6,1,'2025-07-25 00:00:00'),(142,'acud400022','123456','400022',6,1,'2025-07-25 00:00:00'),(143,'acud400023','123456','400023',6,1,'2025-07-25 00:00:00'),(144,'acud400024','123456','400024',6,1,'2025-07-25 00:00:00'),(145,'est10010025','10010025','10010025',1,1,'2025-07-25 18:52:30'),(146,'acu4000025','4000025','4000025',2,1,'2025-07-25 18:52:30'),(147,'est10010026','10010026','10010026',1,1,'2025-07-30 13:34:24'),(148,'acu40010026','40010026','40010026',2,1,'2025-07-30 13:34:24'),(149,'est10010027','10010027','10010027',1,1,'2025-07-30 13:51:19'),(151,'est1151472265','1151472265','1151472265',1,1,'2025-08-05 00:08:06'),(152,'acu1151472465','1151472465','1151472465',2,1,'2025-08-05 00:08:06'),(154,'martinaG@gmail.com','$2b$10$QLXVq8wfP/18QULueubAruSsAmGHtodzjTvl7R4DKs/NK6zXweUCS','4000021',5,1,'2025-08-09 19:43:10'),(155,'estbenavides','$2b$10$N7PoFBCFx3pbVxsxtj2cS..RCTr6fGxxIaSgW3VkpQ6Rz9NWfqQzC','benavides',1,1,'2025-08-09 19:51:46'),(156,'estf2548624','$2b$10$5k1LLaZBwBtg1YAQrRSVzee5fLHP5g9.C7MFUCMFzHP5W61qCwqD.','f2548624',1,1,'2025-08-09 20:01:32'),(157,'acu115147523685','$2b$10$xTAkli1g4ITNJQ.gxkCqheaq87rbyLXmf2DeTqobT/9SQXhezjIKa','115147523685',2,1,'2025-08-09 20:01:32'),(158,'sebastianlizcano@yahoo.con','$2b$10$Cg/fypUO3V4maFuKHDD9vuLGeXetX9GMjWEOKJ7OisTSCvffGN9Cy','1030672573',3,1,'2025-08-11 23:56:44'),(159,'16.medinasilvabrajhan.805@gmail.com','$2b$10$4PTkoWs/liOXQW7t8KwbgeG7acI8nTC/8aR3ZSIoH4s3krh1xK62C','1129844703',5,1,'2025-08-12 00:10:31');
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

-- Dump completed on 2025-09-10 21:05:53
