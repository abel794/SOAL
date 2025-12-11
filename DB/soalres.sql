CREATE DATABASE  IF NOT EXISTS `soal1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `soal1`;
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
  KEY `fk_acudiente_persona` (`numero_documento`),
  KEY `fk_acudiente_usuario` (`id_usuario`),
  KEY `fk_acudiente_relacion` (`id_relacion`),
  CONSTRAINT `fk_acudiente_persona` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_acudiente_relacion` FOREIGN KEY (`id_relacion`) REFERENCES `relacion_acudiente` (`id_relacion`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_acudiente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acudiente`
--

LOCK TABLES `acudiente` WRITE;
/*!40000 ALTER TABLE `acudiente` DISABLE KEYS */;
INSERT INTO `acudiente` VALUES (1,'222222',3,NULL),(2,'3846531',6,NULL),(3,'888888',9,NULL),(4,'999999',11,NULL),(5,'1548943148',22,NULL),(14,'2001',41,4),(15,'2002',42,3),(16,'2003',43,4),(17,'2004',44,3),(18,'2005',45,4),(19,'2006',46,3),(20,'2007',47,4),(21,'2008',48,3),(22,'3636363636',52,NULL);
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
  `ruta` text DEFAULT NULL,
  `fecha_subida` datetime NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `tipo_documento` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_archivo`),
  KEY `fk_archivo_usuario` (`id_usuario`),
  CONSTRAINT `fk_archivo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
  `id_grado_asistencia` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_estado_asistencia` int(11) NOT NULL,
  `observacion` text DEFAULT NULL,
  PRIMARY KEY (`id_asistencia`),
  KEY `fk_asistencia_estudiante` (`id_estudiante`),
  KEY `fk_asistencia_funcionario` (`id_funcionario`),
  KEY `fk_asistencia_grado_asistencia` (`id_grado_asistencia`),
  KEY `fk_asistencia_estado_asistencia` (`id_estado_asistencia`),
  CONSTRAINT `fk_asistencia_estado_asistencia` FOREIGN KEY (`id_estado_asistencia`) REFERENCES `estado_asistencia` (`id_estado_asistencia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_asistencia_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_asistencia_funcionario` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_asistencia_grado_asistencia` FOREIGN KEY (`id_grado_asistencia`) REFERENCES `grado_asistencia` (`id_grado_asistencia`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
INSERT INTO `asistencia` VALUES (1,1,2,3,'2025-10-26',1,''),(2,2,2,4,'2025-10-29',1,''),(3,2,2,5,'2025-11-02',1,''),(4,3,2,5,'2025-11-02',2,''),(5,4,2,5,'2025-11-02',3,''),(6,2,2,6,'2025-11-02',1,''),(7,3,2,6,'2025-11-02',2,''),(8,4,2,6,'2025-11-02',1,''),(9,1,2,7,'2025-11-02',1,''),(10,2,5,8,'2025-11-02',1,''),(11,3,5,8,'2025-11-02',1,''),(12,4,5,8,'2025-11-02',1,''),(13,2,2,9,'2025-11-05',1,''),(14,3,2,9,'2025-11-05',1,''),(15,4,2,9,'2025-11-05',1,''),(16,2,2,10,'2025-11-05',2,''),(17,3,2,10,'2025-11-05',2,''),(18,4,2,10,'2025-11-05',2,''),(19,2,4,11,'2025-11-06',1,''),(20,3,4,11,'2025-11-06',1,''),(21,4,4,11,'2025-11-06',1,''),(22,2,2,12,'2025-11-09',3,''),(23,3,2,12,'2025-11-09',2,''),(24,4,2,12,'2025-11-09',1,''),(25,13,2,13,'2025-11-09',1,''),(26,14,2,13,'2025-11-09',2,'');
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canal_notificacion`
--

LOCK TABLES `canal_notificacion` WRITE;
/*!40000 ALTER TABLE `canal_notificacion` DISABLE KEYS */;
INSERT INTO `canal_notificacion` VALUES (1,'Email'),(4,'Llamada telefónica'),(5,'Notificación interna'),(7,'señal de humo'),(3,'SMS'),(6,'Telegram'),(2,'WhatsApp');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_observacion`
--

LOCK TABLES `categoria_observacion` WRITE;
/*!40000 ALTER TABLE `categoria_observacion` DISABLE KEYS */;
INSERT INTO `categoria_observacion` VALUES (2,'Académico'),(7,'Asistencia'),(1,'Comportamiento'),(3,'Convivencia'),(4,'Disciplina'),(11,'escapadas'),(10,'Otros'),(6,'Psicológica'),(5,'Salud'),(9,'Tecnología'),(8,'Uniforme');
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
  KEY `fk_cita_estudiante` (`id_estudiante`),
  KEY `fk_cita_acudiente` (`id_acudiente`),
  KEY `fk_cita_funcionario` (`id_funcionario`),
  CONSTRAINT `fk_cita_acudiente` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cita_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cita_funcionario` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (1,1,1,2,'2025-10-26 15:00:00','citacion academica','Pendiente'),(2,2,2,2,'2025-10-27 15:02:00','masivo','Pendiente'),(3,2,2,2,'2025-11-01 15:15:00','ouiknj','Pendiente'),(4,14,4,4,'2025-11-10 17:04:00','entrega de voletines','Pendiente'),(5,4,4,4,'2025-11-10 15:00:00','entrega de voletines','Pendiente'),(6,1,1,2,'2025-11-13 18:13:00','no llego a clase','Pendiente'),(7,13,5,2,'2025-11-28 15:06:00','ydrjdj','Pendiente');
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
  `horario_envio` enum('mañana','tarde','noche') DEFAULT 'mañana',
  `notificar_acudiente` tinyint(1) DEFAULT 1,
  `max_estudiantes_curso` int(11) DEFAULT 30,
  `mensaje_institucional` text DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_configuracion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion_sistema`
--

LOCK TABLES `configuracion_sistema` WRITE;
/*!40000 ALTER TABLE `configuracion_sistema` DISABLE KEYS */;
INSERT INTO `configuracion_sistema` VALUES (1,'jose peres gutierres','avenida los palos caidos','6011234567','noestuproblema@example.con','1762974467784.png',2025,'17:00:00',0,'Correo','mañana',1,30,'Ni los cielos son el límite cuando sueñas en grande.','2025-10-22 22:02:01');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eps`
--

LOCK TABLES `eps` WRITE;
/*!40000 ALTER TABLE `eps` DISABLE KEYS */;
INSERT INTO `eps` VALUES (4,'Compensar'),(5,'Coomeva'),(3,'Nueva EPS'),(6,'SALUD TOTAL'),(1,'Sanitas'),(2,'Sura');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_academico`
--

LOCK TABLES `estado_academico` WRITE;
/*!40000 ALTER TABLE `estado_academico` DISABLE KEYS */;
INSERT INTO `estado_academico` VALUES (1,'Activo'),(3,'Egresado'),(6,'Graduado'),(2,'Inactivo'),(4,'Retirado'),(5,'Suspendido');
/*!40000 ALTER TABLE `estado_academico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_anio`
--

DROP TABLE IF EXISTS `estado_anio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_anio` (
  `id_estado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_anio`
--

LOCK TABLES `estado_anio` WRITE;
/*!40000 ALTER TABLE `estado_anio` DISABLE KEYS */;
INSERT INTO `estado_anio` VALUES (1,'EN_CURSO'),(2,'APROBADO'),(3,'REPROBADO'),(4,'GRADUADO');
/*!40000 ALTER TABLE `estado_anio` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_asistencia`
--

LOCK TABLES `estado_asistencia` WRITE;
/*!40000 ALTER TABLE `estado_asistencia` DISABLE KEYS */;
INSERT INTO `estado_asistencia` VALUES (2,'Ausente'),(3,'Justificado'),(1,'Presente'),(5,'Retirado'),(6,'Suspendido'),(4,'Tarde');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_notificacion`
--

LOCK TABLES `estado_notificacion` WRITE;
/*!40000 ALTER TABLE `estado_notificacion` DISABLE KEYS */;
INSERT INTO `estado_notificacion` VALUES (6,'Cancelado'),(3,'Entregado'),(2,'Enviado'),(5,'Fallido'),(4,'Leído'),(1,'Pendiente');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_pqr`
--

LOCK TABLES `estado_pqr` WRITE;
/*!40000 ALTER TABLE `estado_pqr` DISABLE KEYS */;
INSERT INTO `estado_pqr` VALUES (6,'Archivado'),(3,'En proceso'),(2,'En revisión'),(1,'Pendiente'),(5,'Rechazado'),(4,'Resuelto');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_usuario`
--

LOCK TABLES `estado_usuario` WRITE;
/*!40000 ALTER TABLE `estado_usuario` DISABLE KEYS */;
INSERT INTO `estado_usuario` VALUES (1,'Activo'),(4,'Bloqueado'),(2,'Inactivo'),(5,'Pendiente'),(3,'Suspendido');
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
  KEY `fk_estudiante_persona` (`numero_documento`),
  KEY `fk_estudiante_usuario` (`id_usuario`),
  CONSTRAINT `fk_estudiante_persona` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_estudiante_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante`
--

LOCK TABLES `estudiante` WRITE;
/*!40000 ALTER TABLE `estudiante` DISABLE KEYS */;
INSERT INTO `estudiante` VALUES (1,'111111',2,4,1),(2,'v1861684',5,1,1),(3,'555555',8,2,1),(4,'v111111',10,3,1),(11,'78979',19,4,1),(12,'354846',21,5,1),(13,'3546854513',23,5,1),(14,'v6541685',27,6,1),(15,'1001',1,1,1),(16,'1002',2,1,1),(17,'1003',3,1,1),(18,'1004',4,1,1),(19,'1005',5,1,1),(20,'1006',6,1,1),(21,'1007',7,1,1),(22,'1008',8,1,1),(23,'1009',9,1,1),(24,'1010',10,1,1),(25,'1011',11,1,1),(26,'1012',12,1,1),(27,'1001',29,1,1),(28,'1002',30,2,1),(29,'1003',31,1,1),(30,'1004',32,3,1),(31,'1005',33,2,1),(32,'1006',34,1,1),(33,'1007',35,3,1),(34,'1008',36,2,1),(35,'1009',37,1,1),(36,'1010',38,2,1),(37,'1011',39,1,1),(38,'1012',40,3,1),(39,'12345',51,4,1);
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
  CONSTRAINT `estudiante_acudiente_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`),
  CONSTRAINT `estudiante_acudiente_ibfk_2` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`),
  CONSTRAINT `estudiante_acudiente_ibfk_3` FOREIGN KEY (`id_relacion`) REFERENCES `relacion_acudiente` (`id_relacion`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante_acudiente`
--

LOCK TABLES `estudiante_acudiente` WRITE;
/*!40000 ALTER TABLE `estudiante_acudiente` DISABLE KEYS */;
INSERT INTO `estudiante_acudiente` VALUES (1,1,1,3),(2,2,2,4),(3,3,3,4),(4,4,4,4),(11,11,1,4),(12,12,5,6),(13,13,5,NULL),(14,14,4,4),(27,1,1,4),(28,2,2,3),(29,3,3,4),(30,4,4,3),(31,11,5,4),(32,27,14,4),(33,28,15,3),(34,29,16,4),(35,30,17,3),(36,31,18,4),(37,32,19,3),(38,33,20,4),(39,34,21,3),(40,35,14,4),(41,36,15,3),(42,37,16,4),(43,38,17,3),(44,39,22,3);
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
  `anio_academico` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `id_estado` int(11) DEFAULT NULL,
  `fecha_finalizacion` date DEFAULT NULL,
  `id_funcionario_titular` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_estudiante_grado`),
  KEY `fk_estudiante_grado_estudiante` (`id_estudiante`),
  KEY `fk_estudiante_grado_grado` (`id_grado`),
  KEY `fk_estado_anio` (`id_estado`),
  CONSTRAINT `fk_estado_anio` FOREIGN KEY (`id_estado`) REFERENCES `estado_anio` (`id_estado`),
  CONSTRAINT `fk_estudiante_grado_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_estudiante_grado_grado` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante_grado`
--

LOCK TABLES `estudiante_grado` WRITE;
/*!40000 ALTER TABLE `estudiante_grado` DISABLE KEYS */;
INSERT INTO `estudiante_grado` VALUES (1,1,10,2025,1,1,NULL,4),(2,2,1,2025,1,1,NULL,5),(3,3,1,2025,1,1,NULL,5),(4,4,1,2025,1,1,NULL,5),(11,11,2,2025,1,1,NULL,5),(12,12,2,2025,1,1,NULL,5),(13,13,3,2025,1,1,NULL,4),(14,14,3,2025,1,1,NULL,4),(15,27,1,2025,1,1,NULL,5),(16,28,1,2025,1,1,NULL,5),(17,29,2,2025,1,1,NULL,5),(18,30,2,2025,1,1,NULL,5),(19,31,3,2025,1,1,NULL,4),(20,32,3,2025,1,1,NULL,4),(21,33,4,2025,1,1,NULL,4),(22,34,4,2025,1,1,NULL,4),(23,35,5,2025,1,1,NULL,7),(24,36,5,2025,1,1,NULL,7),(25,37,6,2025,1,1,NULL,8),(26,38,6,2025,1,1,NULL,8),(27,39,3,2025,1,1,NULL,4),(28,1,10,2025,1,1,NULL,4),(29,1,10,2025,1,1,NULL,4),(30,2,1,2025,1,1,NULL,5),(31,3,1,2025,1,1,NULL,5),(32,4,1,2025,1,1,NULL,5),(33,11,2,2025,1,1,NULL,5),(34,12,2,2025,1,1,NULL,5),(35,13,3,2025,1,1,NULL,4),(36,14,3,2025,1,1,NULL,4),(37,15,1,2025,1,1,NULL,5),(38,16,1,2025,1,1,NULL,5),(39,17,2,2025,1,1,NULL,5),(40,18,2,2025,1,1,NULL,5),(41,19,3,2025,1,1,NULL,4),(42,20,3,2025,1,1,NULL,4),(43,21,4,2025,1,1,NULL,4),(44,22,4,2025,1,1,NULL,4),(45,23,5,2025,1,1,NULL,7),(46,24,5,2025,1,1,NULL,7),(47,25,6,2025,1,1,NULL,8),(48,26,6,2025,1,1,NULL,8),(49,27,3,2025,1,1,NULL,5);
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
  KEY `fk_funcionario_persona` (`numero_documento`),
  KEY `fk_funcionario_usuario` (`id_usuario`),
  KEY `fk_funcionario_escolaridad` (`id_escolaridad`),
  CONSTRAINT `fk_funcionario_escolaridad` FOREIGN KEY (`id_escolaridad`) REFERENCES `nivel_escolaridad` (`id_escolaridad`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_funcionario_persona` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_funcionario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario`
--

LOCK TABLES `funcionario` WRITE;
/*!40000 ALTER TABLE `funcionario` DISABLE KEYS */;
INSERT INTO `funcionario` VALUES (2,'1234567890',1,'Administrador',1,'SURA',NULL),(3,'333333',4,'Secretaria',NULL,'No aplica',NULL),(4,'33333333',7,'profesor fisica',NULL,'n/a',NULL),(5,'4444444',12,'profesora de ingles',NULL,'n/a',NULL),(6,'777777',28,'orientador',NULL,'sura',NULL),(7,'14141414',49,'profesor',NULL,'sura',NULL),(8,'1515515',53,'profesora',NULL,'sura',NULL);
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
  KEY `fk_funcionario_grado_funcionario` (`id_funcionario`),
  KEY `fk_funcionario_grado_grado` (`id_grado`),
  CONSTRAINT `fk_funcionario_grado_funcionario` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_funcionario_grado_grado` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario_grado`
--

LOCK TABLES `funcionario_grado` WRITE;
/*!40000 ALTER TABLE `funcionario_grado` DISABLE KEYS */;
INSERT INTO `funcionario_grado` VALUES (1,4,12,NULL),(2,4,1,NULL),(3,5,1,NULL),(4,5,12,NULL),(5,5,12,NULL),(6,5,10,NULL),(7,4,1,NULL),(8,7,5,NULL),(9,7,1,NULL),(10,6,4,NULL),(11,8,16,NULL);
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
  `orden` int(11) NOT NULL,
  PRIMARY KEY (`id_grado`),
  UNIQUE KEY `nombre_grado` (`nombre_grado`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grado`
--

LOCK TABLES `grado` WRITE;
/*!40000 ALTER TABLE `grado` DISABLE KEYS */;
INSERT INTO `grado` VALUES (1,'Primero A - Mañana','Grado Primero, jornada Mañana, salón 101',0),(2,'Primero B - Mañana','Grado Primero, jornada Mañana, salón 102',0),(3,'Segundo A - Mañana','Grado Segundo, jornada Mañana, salón 201',0),(4,'Segundo B - Mañana','Grado Segundo, jornada Mañana, salón 202',0),(5,'Tercero A - Mañana','Grado Tercero, jornada Mañana, salón 301',0),(6,'Tercero B - Mañana','Grado Tercero, jornada Mañana, salón 302',0),(7,'Primero A - Tarde','Grado Primero, jornada Tarde, salón 103',0),(8,'Primero B - Tarde','Grado Primero, jornada Tarde, salón 104',0),(9,'Segundo A - Tarde','Grado Segundo, jornada Tarde, salón 203',0),(10,'Segundo B - Tarde','Grado Segundo, jornada Tarde, salón 204',0),(11,'Tercero A - Tarde','Grado Tercero, jornada Tarde, salón 303',0),(12,'Tercero B - Tarde','Grado Tercero, jornada Tarde, salón 304',0),(13,'Tercero C - Tarde','Grado Tercero, jornada Tarde, salón 404',0),(14,'decimo 10',NULL,0),(15,'Cuanto A - Manana','Grado Primero, jornada Mañana, salón 402',0),(16,'Cuarto B - manana','Grado Primero, jornada Mañana, salón 406',0);
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
  PRIMARY KEY (`id_grado_asistencia`),
  KEY `fk_grado_asistencia_grado` (`id_grado`),
  KEY `fk_grado_asistencia_funcionario` (`id_funcionario`),
  CONSTRAINT `fk_grado_asistencia_funcionario` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_grado_asistencia_grado` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grado_asistencia`
--

LOCK TABLES `grado_asistencia` WRITE;
/*!40000 ALTER TABLE `grado_asistencia` DISABLE KEYS */;
INSERT INTO `grado_asistencia` VALUES (3,10,2,'2025-10-26'),(4,1,2,'2025-10-29'),(5,1,2,'2025-11-02'),(6,1,2,'2025-11-02'),(7,10,2,'2025-11-02'),(8,1,5,'2025-11-02'),(9,1,2,'2025-11-05'),(10,1,2,'2025-11-05'),(11,1,4,'2025-11-06'),(12,1,2,'2025-11-09'),(13,3,2,'2025-11-09');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gravedad_observacion`
--

LOCK TABLES `gravedad_observacion` WRITE;
/*!40000 ALTER TABLE `gravedad_observacion` DISABLE KEYS */;
INSERT INTO `gravedad_observacion` VALUES (4,'Crítica'),(3,'Grave'),(6,'Jodida'),(1,'Leve'),(2,'Moderada'),(5,'Urgente');
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
  `fecha_modificacion` datetime NOT NULL DEFAULT current_timestamp(),
  `descripcion_modificacion` varchar(255) NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `fk_historial_observacion` (`id_observacion`),
  CONSTRAINT `fk_historial_observacion` FOREIGN KEY (`id_observacion`) REFERENCES `observacion` (`id_observacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_observacion`
--

LOCK TABLES `historial_observacion` WRITE;
/*!40000 ALTER TABLE `historial_observacion` DISABLE KEYS */;
INSERT INTO `historial_observacion` VALUES (1,11,'2025-10-31 13:36:47','Se actualizó: cacas'),(2,13,'2025-11-02 01:29:18','Se actualizó: axcvv'),(3,21,'2025-11-27 02:30:39','Se actualizó: el estudiante ya no esta botando sangre por la naris');
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
  `fecha` datetime DEFAULT current_timestamp(),
  `id_estado_pqr` int(11) NOT NULL,
  PRIMARY KEY (`id_historial_pqr`),
  KEY `fk_historial_pqr_pqr` (`id_pqr`),
  KEY `fk_historial_pqr_usuario` (`id_usuario`),
  KEY `fk_historial_pqr_estado` (`id_estado_pqr`),
  CONSTRAINT `fk_historial_pqr_estado` FOREIGN KEY (`id_estado_pqr`) REFERENCES `estado_pqr` (`id_estado_pqr`) ON UPDATE CASCADE,
  CONSTRAINT `fk_historial_pqr_pqr` FOREIGN KEY (`id_pqr`) REFERENCES `pqr` (`id_pqr`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_historial_pqr_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_pqr`
--

LOCK TABLES `historial_pqr` WRITE;
/*!40000 ALTER TABLE `historial_pqr` DISABLE KEYS */;
INSERT INTO `historial_pqr` VALUES (1,1,1,'dejame revisar vale','2025-10-29 01:22:49',2),(2,1,1,'asd','2025-11-02 03:46:39',1),(3,1,1,'adadk','2025-11-02 23:36:50',2),(4,4,1,'hola si claro estoy revisando','2025-11-11 13:42:38',2),(5,5,1,'suhewiashdsiudefi','2025-11-12 02:27:11',3);
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
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `justificacion_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificacion`
--

LOCK TABLES `justificacion` WRITE;
/*!40000 ALTER TABLE `justificacion` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivel_escolaridad`
--

LOCK TABLES `nivel_escolaridad` WRITE;
/*!40000 ALTER TABLE `nivel_escolaridad` DISABLE KEYS */;
INSERT INTO `nivel_escolaridad` VALUES (1,'Bachiller'),(5,'Doctorado'),(4,'Maestría'),(6,'No graduado'),(3,'Profesional'),(2,'Técnico');
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
  `id_observacion` int(11) DEFAULT NULL,
  `id_acudiente` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` datetime DEFAULT current_timestamp(),
  `id_canal` int(11) NOT NULL,
  `id_estado_notificacion` int(11) NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_notificacion_observacion` (`id_observacion`),
  KEY `fk_notificacion_acudiente` (`id_acudiente`),
  KEY `fk_notificacion_canal` (`id_canal`),
  KEY `fk_notificacion_estado` (`id_estado_notificacion`),
  CONSTRAINT `fk_notificacion_acudiente` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notificacion_canal` FOREIGN KEY (`id_canal`) REFERENCES `canal_notificacion` (`id_canal`) ON UPDATE CASCADE,
  CONSTRAINT `fk_notificacion_estado` FOREIGN KEY (`id_estado_notificacion`) REFERENCES `estado_notificacion` (`id_estado_notificacion`) ON UPDATE CASCADE,
  CONSTRAINT `fk_notificacion_observacion` FOREIGN KEY (`id_observacion`) REFERENCES `observacion` (`id_observacion`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (1,5,1,'no hay clase','2025-10-24 23:10:17',1,2),(2,6,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-10-26 01:37:24',1,2),(3,6,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-10-26 02:02:54',1,2),(4,7,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-10-26 13:32:02',1,2),(5,8,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-10-26 13:36:07',1,2),(6,9,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-10-27 02:00:19',1,2),(7,10,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-10-29 01:21:01',1,2),(8,11,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-10-29 19:05:07',1,2),(9,12,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-02 01:26:08',1,2),(10,13,3,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-02 01:29:04',1,1),(11,14,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-03 01:33:30',1,2),(12,NULL,5,'Queridos estudiantes, recuerden la reunión del lunes a las 8:00 am.','2025-11-08 16:46:27',2,1),(13,NULL,4,'Queridos estudiantes, recuerden la reunión del lunes a las 8:00 am.','2025-11-08 16:46:27',2,2),(14,21,4,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-09 13:57:16',1,2),(15,NULL,5,'Queridos estudiantes, recuerden la reunión del lunes a las 8:00 am.','2025-11-09 14:18:21',2,1),(16,NULL,4,'Queridos estudiantes, recuerden la reunión del lunes a las 8:00 am.','2025-11-09 14:18:21',2,2),(17,NULL,2,'para realisar una pequeña manualidad deven traer los materiales','2025-11-09 14:36:37',2,1),(18,NULL,3,'para realisar una pequeña manualidad deven traer los materiales','2025-11-09 14:36:37',2,1),(19,NULL,4,'para realisar una pequeña manualidad deven traer los materiales','2025-11-09 14:36:37',2,2),(20,NULL,2,'recuerden que hoy no hay clase','2025-11-10 23:03:27',2,1),(21,NULL,3,'recuerden que hoy no hay clase','2025-11-10 23:03:27',2,1),(22,NULL,4,'recuerden que hoy no hay clase','2025-11-10 23:03:27',2,2),(23,NULL,1,'ustedes son gays','2025-11-11 22:38:53',1,2),(24,NULL,1,'no hay clase ','2025-11-11 22:44:26',1,2),(25,NULL,1,'reunion el lunes ','2025-11-11 22:45:09',1,2),(26,NULL,1,'reunion el lunes','2025-11-11 22:45:34',1,2),(27,NULL,1,'hay clase el lunes','2025-11-11 22:46:08',1,2),(28,NULL,1,'reunion de estudiantes el miercoles','2025-11-11 22:47:44',1,2),(29,NULL,1,'no hay clase el miercoles','2025-11-11 22:49:29',1,2),(30,NULL,1,'hoy no hay clase','2025-11-11 22:51:33',1,2),(31,NULL,1,'manana dia de la independecia','2025-11-11 22:54:20',1,2),(32,22,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-12 02:09:11',1,2),(33,23,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-12 04:43:56',1,1),(34,24,4,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-12 04:45:48',1,1),(35,25,4,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-12 04:46:43',1,1),(36,26,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-12 20:47:02',1,2),(37,26,5,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-12 20:47:02',1,1),(38,27,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-12 20:49:19',1,2),(39,27,5,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-11-12 20:49:19',1,1);
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
  `id_funcionario` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `descripcion` text NOT NULL,
  `id_gravedad` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  PRIMARY KEY (`id_observacion`),
  KEY `fk_observacion_estudiante` (`id_estudiante`),
  KEY `fk_observacion_funcionario` (`id_funcionario`),
  KEY `fk_observacion_gravedad` (`id_gravedad`),
  KEY `fk_observacion_categoria` (`id_categoria`),
  CONSTRAINT `fk_observacion_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_observacion` (`id_categoria`) ON UPDATE CASCADE,
  CONSTRAINT `fk_observacion_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_observacion_funcionario` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_observacion_gravedad` FOREIGN KEY (`id_gravedad`) REFERENCES `gravedad_observacion` (`id_gravedad`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observacion`
--

LOCK TABLES `observacion` WRITE;
/*!40000 ALTER TABLE `observacion` DISABLE KEYS */;
INSERT INTO `observacion` VALUES (5,1,2,'2025-10-26','asd',2,2),(6,1,2,'2025-10-26','hfyj',3,2),(7,1,2,'2025-10-26','adwdas',2,4),(8,1,2,'2025-10-26','adwdc',1,5),(9,2,2,'2025-10-27','aikplñma',1,2),(10,1,2,'2025-10-29','asdasc',1,6),(11,1,2,'2025-10-29','cacas',5,5),(12,2,2,'2025-11-02','sadc',5,2),(13,3,2,'2025-11-02','axcvv',2,8),(14,1,2,'2025-11-03','muchos dias sin faltar',4,7),(15,2,5,'2025-11-03','asdbaiwd',3,2),(16,2,5,'2025-11-03','asdbaiwd',3,2),(17,2,5,'2025-11-03','asdbaiwd',3,2),(18,12,4,'2025-11-06','el estudiante no hace caso y se la pasa molestando a los estudiantes',2,2),(19,12,4,'2025-11-06','los estudiantes se pelearon',3,7),(20,12,4,'2025-11-06','los estudiantes se pelearon',3,7),(21,4,2,'2025-11-09','el estudiante ya no esta botando sangre por la naris',5,2),(22,1,2,'2025-11-12','POEMA DESIDERATA\nPor: Max Ehrmann\nCamina plácido entre el ruido y la prisa,\ny piensa en la paz que se puede encontrar en el silencio.\nEn cuanto sea posible y sin rendirte,\nmantén buenas relaciones con todas las personas.\nEnuncia tu verdad de una manera serena y clara,\ny escucha a los demás,\nincluso al torpe e ignorante,\ntambién ellos tienen su propia historia.\nEsquiva a las personas ruidosas y agresivas,\npues son un fastidio para el espíritu.\nSi te comparas con los demás,\nte volverás vano y amargado\npues siempre habrá personas más grandes y más pequeñas que tú.\nDisfruta de tus éxitos, lo mismo que de tus planes.\nMantén el interés en tu propia carrera,\npor humilde que sea,\nella es un verdadero tesoro en el fortuito cambiar de los tiempos.\nSé cauto en tus negocios,\npues el mundo está lleno de engaños.\nMás no dejes que esto te vuelva ciego para la virtud que existe,\nhay muchas personas que se esfuerzan por alcanzar nobles ideales, la vida está llena de heroísmo.\nSé sincero contigo mismo,\nen especial no finjas el afecto,\ny no seas cínico en el amor,\npues en medio de todas las arideces y desengaños,\nes perenne como la hierba.\nAcata dócilmente el consejo de los años,\nabandonando con donaire las cosas de la juventud.\nCultiva la firmeza del espíritu\npara que te proteja de las adversidades repentinas,\nmás no te agotes con pensamientos oscuros,\nmuchos temores nacen de la fatiga y la soledad.\nSobre una sana disciplina,\nsé benigno contigo mismo.\nTú eres una criatura del universo,\nno menos que las plantas y las estrellas, tienes derecho a existir,\ny sea que te resulte claro o no,\nindudablemente el universo marcha como debiera.\nPor eso debes estar en paz con Dios,\ncualquiera que sea tu idea de Él,\ny sean cualesquiera tus trabajos y aspiraciones,\nconserva la paz con tu alma\nen la bulliciosa confusión de la vida.\nAún con todas sus farsas, penalidades y sueños fallidos,\nel mundo es todavía hermoso.\nSé cauto.\nEsfuérzate por ser feliz.',4,2),(23,2,2,'2025-11-12','sucio ',2,3),(24,14,2,'2025-11-12','nananananana',6,10),(25,14,2,'2025-11-12','asdadwad',6,3),(26,11,2,'2025-11-12','POEMA DESIDERATA\nPor: Max Ehrmann\nCamina plácido entre el ruido y la prisa,\ny piensa en la paz que se puede encontrar en el silencio.\nEn cuanto sea posible y sin rendirte,\nmantén buenas relaciones con',4,11),(27,11,2,'2025-11-12','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',3,2);
/*!40000 ALTER TABLE `observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observacion_notificacion`
--

DROP TABLE IF EXISTS `observacion_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observacion_notificacion` (
  `id_observacion_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_notificacion` int(11) NOT NULL,
  `id_observacion` int(11) NOT NULL,
  PRIMARY KEY (`id_observacion_notificacion`),
  KEY `fk_observacion_notificacion_notificacion` (`id_notificacion`),
  KEY `fk_observacion_notificacion_observacion` (`id_observacion`),
  CONSTRAINT `fk_observacion_notificacion_notificacion` FOREIGN KEY (`id_notificacion`) REFERENCES `notificacion` (`id_notificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_observacion_notificacion_observacion` FOREIGN KEY (`id_observacion`) REFERENCES `observacion` (`id_observacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observacion_notificacion`
--

LOCK TABLES `observacion_notificacion` WRITE;
/*!40000 ALTER TABLE `observacion_notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `observacion_notificacion` ENABLE KEYS */;
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
  `discapacidad` enum('Sí','No') DEFAULT NULL,
  `ocupacion` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `foto` longblob DEFAULT NULL,
  `id_sexo` int(11) NOT NULL,
  `id_tipo_documento` int(11) NOT NULL,
  PRIMARY KEY (`numero_documento`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_persona_sexo` (`id_sexo`),
  KEY `fk_persona_tipo_documento` (`id_tipo_documento`),
  CONSTRAINT `fk_persona_sexo` FOREIGN KEY (`id_sexo`) REFERENCES `sexo` (`id_sexo`) ON UPDATE CASCADE,
  CONSTRAINT `fk_persona_tipo_documento` FOREIGN KEY (`id_tipo_documento`) REFERENCES `tipo_documento` (`id_tipo_documento`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES ('1001','Laura','Martínez','laura.martinez@example.com','3001234567','Calle 10 #12-34','Bogotá','O+','No','Estudiante','2008-05-12',NULL,2,1),('1002','Andrés','Gómez','andres.gomez@example.com','3012345678','Cra 5 #45-21','Medellín','A+','No','Estudiante','2007-09-20',NULL,1,1),('1003','Valentina','Rojas','valentina.rojas@example.com','3029876543','Av 30 #15-09','Cali','B+','No','Estudiante','2009-03-18',NULL,2,1),('1004','Juan','Pérez','juan.perez@example.com','3105672345','Cl 8 #9-22','Bogotá','O-','No','Estudiante','2006-07-25',NULL,1,1),('1005','Sara','López','sara.lopez@example.com','3127659876','Cra 22 #18-56','Bucaramanga','AB+','No','Estudiante','2008-10-03',NULL,2,1),('1006','Camilo','Jiménez','camilo.jimenez@example.com','3119998877','Cl 33 #22-18','Cartagena','A-','No','Estudiante','2007-12-09',NULL,1,1),('1007','Isabella','Torres','isabella.torres@example.com','3004567890','Cl 40 #9-30','Cali','O+','Sí','Estudiante','2009-06-11',NULL,2,1),('1008','Mateo','Moreno','mateo.moreno@example.com','3012233445','Cra 60 #14-22','Bogotá','B-','No','Estudiante','2008-11-29',NULL,1,1),('1009','Daniela','Castro','daniela.castro@example.com','3027788990','Cl 80 #45-12','Medellín','A+','No','Estudiante','2007-02-16',NULL,2,1),('1010','Samuel','Vargas','samuel.vargas@example.com','3112345555','Cl 70 #19-44','Cali','O+','No','Estudiante','2009-08-05',NULL,1,1),('1011','Mariana','Sánchez','mariana.sanchez@example.com','3101122334','Cra 12 #22-10','Bogotá','AB-','No','Estudiante','2008-09-13',NULL,2,1),('1012','Sebastián','Navarro','sebastian.navarro@example.com','3007788991','Cl 5 #33-21','Bucaramanga','B+','No','Estudiante','2007-04-22',NULL,1,1),('111111','jose','joaquin','jaquin@gmai.com','3237656847','kr 15a este # 56a-10 01 00001 - altos de cazuca','Bogotá D.C.','o+','No','estudiante','2015-02-10',_binary 'data:image/webp;base64,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',1,1),('12345','camilo','Perez','carlos.lopez@gmail.com','123456','kenedy','bogota','O-','','estudiante','2025-11-06',NULL,1,2),('1234567890','Abel','Moreno','morenoabel806@gmail.com','3001234567','Calle 123 #45-67','Fusagasugá','O+','No','Desarrollador Backend','1995-08-15',NULL,1,1),('14141414','abel','leon','profepaolaballen@gmail.com','323765684','kr 15a este # 56a-10 01 00001 - altos de cazuca','Bogotá D.C.','O-','No','profesor','2025-11-20',NULL,2,1),('1515515','carla ollarves','gomez','carlaollarves31@gmail.com','3172481710','soacha','soachca','o+','No','profesora educacion fisica','2000-10-15',NULL,2,3),('1548943148','margaret','rojas','margaret101010@gmail.com','3548653','kenedy','bogota','o+','No','ama de casa','1999-02-10',NULL,2,1),('2001','Martha','Jiménez','martha.jimenez@example.com','3201112233','Cl 12 #45-66','Bogotá','O+','No','Contadora','1980-05-23',NULL,2,1),('2002','Carlos','Gómez','carlos.gomez@example.com','3213334445','Cra 20 #33-90','Medellín','A+','No','Ingeniero Civil','1978-11-10',NULL,1,1),('2003','Patricia','Rojas','patricia.rojas@example.com','3205556677','Av 5 #60-80','Cali','B+','No','Administradora','1982-04-17',NULL,2,1),('2004','Fernando','Pérez','fernando.perez@example.com','3109998877','Cl 8 #20-30','Bogotá','O-','No','Técnico Electricista','1975-12-05',NULL,1,1),('2005','Diana','López','diana.lopez@example.com','3124445566','Cra 22 #10-55','Bucaramanga','AB+','No','Docente','1984-03-09',NULL,2,1),('2006','Ricardo','Jiménez','ricardo.jimenez@example.com','3001112223','Cl 33 #12-90','Cartagena','A-','No','Comerciante','1976-09-30',NULL,1,1),('2007','Gloria','Torres','gloria.torres@example.com','3107778889','Cl 40 #11-45','Cali','O+','Sí','Enfermera','1981-07-15',NULL,2,1),('2008','Jorge','Moreno','jorge.moreno@example.com','3012233446','Cra 60 #14-23','Bogotá','B-','No','Abogado','1979-10-02',NULL,1,1),('222222','joaquin','moreno','joaquincervante0@gmail.com','3126636996','la capilla','soacha','o+','No','domiciliario','1998-10-10',_binary 'data:image/jpeg;base64,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',1,1),('333333','carla','morales','morales@gmail.com','33548643','kr 15a este # 56a-10 01 00001 - altos de cazuca','Bogotá D.C.','o+','No','secretaria','1995-02-10',NULL,2,1),('33333333','asnedo','ordoñes','asnedo@gmail.com','384986531','soacha','bogota','o+','No','profesor fisica','1994-12-10',NULL,1,1),('3546854513','andrea','moreno','andrea@gmail.com','3468453','soacha','soacha','o+','No','estu','2015-12-10',NULL,2,1),('354846','maria','gomes','maria55555@gmail.com','1865315','kenedy','bogota','o-','No','estu','2015-12-10',NULL,2,1),('3636363636','federico','murcia','federico.murcia@gmail.com','7894','kr 15a este # 56a-10 01 00001 - altos de cazuca','Bogotá D.C.',NULL,NULL,NULL,NULL,NULL,1,1),('3846531','carla','agustina','carla@gmail.com','61314648','soacha','soacha','o+','No','ama de casa','2000-10-15',NULL,2,1),('4444444','marta','moncada','marta@gmail.com','36848613','kenedy','bogota','o+','No','profesora de ingles','1992-01-22',NULL,2,1),('555555','pedro jose','gonzales','pedro@gmail.com','3549898465','soacha','la capilla','o-','No','estudiante','2014-12-12',NULL,1,1),('777777','marcos','simancas','marsos@gmail.com','316435846','soacha','soacha','o+','No','orientador','1994-12-10',NULL,1,1),('78979','maria','gomes','maria56841@gmail.com','3168415','kenedy','bogota','o+','No','estu','2018-12-10',NULL,2,1),('888888','margaret','gomez','margaret@gmail.com','346896864','soacha','soacha','o-','No','ama de casa','2000-10-15',NULL,2,1),('999999','maria','moreno','maria@gmail.com','63546849','soacha','soacha','o+','No','cocinera','1997-07-17',NULL,2,1),('v111111','dila','aparicio','dila@gmail.com','313589468','soacha','soacha','o+','No','estudiante','2020-12-10',NULL,1,1),('v1861684','pedro','garcia','pedrojose@gmail.com','33486153','soachca','soacha','o+','No','estudiante','2014-12-20',NULL,1,1),('v6541685','damaris','aparcio','damaris@gmaicom','3648953','soacha','soacha','o-','No','estudiante','2016-02-10',NULL,2,3);
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
  PRIMARY KEY (`id_pqr`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pqr`
--

LOCK TABLES `pqr` WRITE;
/*!40000 ALTER TABLE `pqr` DISABLE KEYS */;
INSERT INTO `pqr` VALUES (1,1,1,1,'revisar la asistencia de mi hijo de hace 2 dias','2025-10-23',2),(2,1,1,1,'asdw','2025-10-22',1),(3,1,1,2,'casdmalikw','2025-10-21',1),(4,1,1,1,'sadcdw','2025-11-04',2),(5,1,1,2,'POEMA DESIDERATA\nPor: Max Ehrmann\nCamina plácido entre el ruido y la prisa,\ny piensa en la paz que se puede encontrar en el silencio.\nEn cuanto sea posible y sin rendirte,\nmantén buenas relaciones con todas las personas.\nEnuncia tu verdad de una manera serena y clara,\ny escucha a los demás,\nincluso al torpe e ignorante,\ntambién ellos tienen su propia historia.\nEsquiva a las personas ruidosas y agresivas,\npues son un fastidio para el espíritu.\nSi te comparas con los demás,\nte volverás vano y amargado\npues siempre habrá personas más grandes y más pequeñas que tú.\nDisfruta de tus éxitos, lo mismo que de tus planes.\nMantén el interés en tu propia carrera,\npor humilde que sea,\nella es un verdadero tesoro en el fortuito cambiar de los tiempos.\nSé cauto en tus negocios,\npues el mundo está lleno de engaños.\nMás no dejes que esto te vuelva ciego para la virtud que existe,\nhay muchas personas que se esfuerzan por alcanzar nobles ideales, la vida está llena de heroísmo.\nSé sincero contigo mismo,\nen especial no finjas el afecto,\ny no seas cínico en el amor,\npues en medio de todas las arideces y desengaños,\nes perenne como la hierba.\nAcata dócilmente el consejo de los años,\nabandonando con donaire las cosas de la juventud.\nCultiva la firmeza del espíritu\npara que te proteja de las adversidades repentinas,\nmás no te agotes con pensamientos oscuros,\nmuchos temores nacen de la fatiga y la soledad.\nSobre una sana disciplina,\nsé benigno contigo mismo.\nTú eres una criatura del universo,\nno menos que las plantas y las estrellas, tienes derecho a existir,\ny sea que te resulte claro o no,\nindudablemente el universo marcha como debiera.\nPor eso debes estar en paz con Dios,\ncualquiera que sea tu idea de Él,\ny sean cualesquiera tus trabajos y aspiraciones,\nconserva la paz con tu alma\nen la bulliciosa confusión de la vida.\nAún con todas sus farsas, penalidades y sueños fallidos,\nel mundo es todavía hermoso.\nSé cauto.\nEsfuérzate por ser feliz.','2025-11-08',3),(6,1,1,3,'lasldnlanwdqnl','2025-11-25',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relacion_acudiente`
--

LOCK TABLES `relacion_acudiente` WRITE;
/*!40000 ALTER TABLE `relacion_acudiente` DISABLE KEYS */;
INSERT INTO `relacion_acudiente` VALUES (6,'Abuela'),(2,'Cuidador'),(7,'Hermano'),(4,'Madre'),(3,'Padre'),(5,'Tío'),(1,'Tutor Legal');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sexo`
--

LOCK TABLES `sexo` WRITE;
/*!40000 ALTER TABLE `sexo` DISABLE KEYS */;
INSERT INTO `sexo` VALUES (2,'Femenino'),(1,'Masculino'),(4,'No especif'),(3,'Otro');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_documento`
--

LOCK TABLES `tipo_documento` WRITE;
/*!40000 ALTER TABLE `tipo_documento` DISABLE KEYS */;
INSERT INTO `tipo_documento` VALUES (1,'CC'),(3,'CE'),(4,'PA'),(5,'RC'),(2,'TI');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_pqr`
--

LOCK TABLES `tipo_pqr` WRITE;
/*!40000 ALTER TABLE `tipo_pqr` DISABLE KEYS */;
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
INSERT INTO `tipo_usuario` VALUES (2,'Acudiente'),(8,'Administrador'),(4,'Coordinador'),(1,'Estudiante'),(6,'Orientador'),(3,'Profesor'),(7,'Rector'),(5,'Secretaria'),(9,'Super administrador');
/*!40000 ALTER TABLE `tipo_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist`
--

DROP TABLE IF EXISTS `token_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` text NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_invalido` datetime DEFAULT current_timestamp(),
  `expira_en` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_token_blacklist_usuario` (`id_usuario`),
  CONSTRAINT `fk_token_blacklist_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist`
--

LOCK TABLES `token_blacklist` WRITE;
/*!40000 ALTER TABLE `token_blacklist` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist` ENABLE KEYS */;
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
  KEY `fk_usuario_persona` (`numero_documento`),
  KEY `fk_usuario_tipo_usuario` (`id_tipo_usuario`),
  KEY `fk_usuario_estado_usuario` (`id_estado_usuario`),
  CONSTRAINT `fk_usuario_estado_usuario` FOREIGN KEY (`id_estado_usuario`) REFERENCES `estado_usuario` (`id_estado_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_persona` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_tipo_usuario` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'abelmoreno','$2b$10$Hi6/2THgFjxciBTVfqzFGeO.gIsvZeZQoUSwqScd/tqclhe4G7fwC','1234567890',4,1,'2025-10-22 21:54:24'),(2,'est111111','$2b$10$03vOqRO6Kih3hzpP9TY1feHvs9QTg.kmd/T057ooj17AkGojijAdC','111111',1,1,'2025-10-24 22:27:23'),(3,'acu222222','$2b$10$BJN87bj2gx5uPmUTMxPGK.utvxWAMmoOomAOckz1iA75EB.PEGLWy','222222',2,1,'2025-10-24 22:27:23'),(4,'brajan','$2b$10$MqmaCWnfn4ohLCMrYHlo9.l9kDllgtRDdIBe.jQZgqyKEZngWUhim','333333',5,1,'2025-10-24 23:09:21'),(5,'estv1861684','$2b$10$3WSc/uOD/XuZ1BO9dzdIm.IIEUjlVztCpaggL0B776W1szn.oFhxu','v1861684',1,1,'2025-10-27 01:59:49'),(6,'acu3846531','$2b$10$I3TqNHFe6oiYKmVkaWYdUO326DHGKOzHB9PX3AVC.BoRamZZUJGpW','3846531',2,1,'2025-10-27 01:59:49'),(7,'asnedo123','$2b$10$A0Cr8Yt4YlZA.pe/gFnzTuQJsUVERLWwPBm0.K2MFXilHCZOzV2zG','33333333',3,1,'2025-10-29 13:40:15'),(8,'est555555','$2b$10$076za6gLo3c4E/x/GwUKe.qoWIJ7aZR6JDWKc47kovYlHodfJDUoW','555555',1,1,'2025-10-30 23:46:37'),(9,'acu888888','$2b$10$nEy0LWHyyaEAXtUBNc1oFu/DX.gFhgK0yXhvBOD8G4I4nZTQ3j7lm','888888',2,1,'2025-10-30 23:46:37'),(10,'estv111111','$2b$10$rJ6x0bDmPkyHNn/yxxOQAeY68XREVx8DlxE8y44HjZ.y1x2/U4fZK','v111111',1,1,'2025-10-31 13:02:11'),(11,'acu999999','$2b$10$n272PmzbWeouWT0.Rqfd.e.mJYkoODMBrRJO8F.azdFs7hFUxCfSm','999999',2,1,'2025-10-31 13:02:11'),(12,'marta8888','$2b$10$JWcA76eXKHobgdGMTzT87OfcJayZ6xeNXU4qm2JpdGHjbmXtyMHKe','4444444',3,1,'2025-11-02 01:40:28'),(19,'est78979','$2b$10$TGXm/./nUH5nkcTDN9.sYemDnZdeROXtiTlTtuBwL7iTeQ1UpXETK','78979',1,1,'2025-11-06 04:13:22'),(21,'est354846','$2b$10$p2LpOUEsv2nVbBhMnGnIf.1P9GOmhaSx9ZbPM8I3Pu21WxERHaCBO','354846',1,1,'2025-11-06 04:18:21'),(22,'acu1548943148','$2b$10$tqxRru2qAxekaL6x5c0lpOnPhB8QVtlzPNJj5mO5kz7kkcZkeZmQW','1548943148',2,1,'2025-11-06 04:18:21'),(23,'est3546854513','$2b$10$0EKpHssRkQAP6Xl/EPGfpexd/zAMo2SNczIf8wF2PRZYL5nXvysdW','3546854513',1,1,'2025-11-06 04:57:30'),(27,'estv6541685','$2b$10$brsCuvssS0UkMSDZw1TZm.rBoPuaBBcsbrS50Xj6ie.TTL8uGikDC','v6541685',1,1,'2025-11-08 04:48:58'),(28,'marcos777777','$2b$10$OgwyYL5pR3fSeYSSQU7l/OBdqmhyx.0PHx6ycTg8ZWsXGqMbg8gKa','777777',6,1,'2025-11-11 04:16:15'),(29,'laura.martinez','12345','1001',1,1,'2025-11-11 17:19:31'),(30,'andres.gomez','12345','1002',1,1,'2025-11-11 17:19:31'),(31,'valentina.rojas','12345','1003',1,1,'2025-11-11 17:19:31'),(32,'juan.perez','12345','1004',1,1,'2025-11-11 17:19:31'),(33,'sara.lopez','12345','1005',1,1,'2025-11-11 17:19:31'),(34,'camilo.jimenez','12345','1006',1,1,'2025-11-11 17:19:31'),(35,'isabella.torres','12345','1007',1,1,'2025-11-11 17:19:31'),(36,'mateo.moreno','12345','1008',1,1,'2025-11-11 17:19:31'),(37,'daniela.castro','12345','1009',1,1,'2025-11-11 17:19:31'),(38,'samuel.vargas','12345','1010',1,1,'2025-11-11 17:19:31'),(39,'mariana.sanchez','12345','1011',1,1,'2025-11-11 17:19:31'),(40,'sebastian.navarro','12345','1012',1,1,'2025-11-11 17:19:31'),(41,'martha.jimenez','12345','2001',2,1,'2025-11-11 17:19:31'),(42,'carlos.gomez','12345','2002',2,1,'2025-11-11 17:19:31'),(43,'patricia.rojas','12345','2003',2,1,'2025-11-11 17:19:31'),(44,'fernando.perez','12345','2004',2,1,'2025-11-11 17:19:31'),(45,'diana.lopez','12345','2005',2,1,'2025-11-11 17:19:31'),(46,'ricardo.jimenez','12345','2006',2,1,'2025-11-11 17:19:31'),(47,'gloria.torres','12345','2007',2,1,'2025-11-11 17:19:31'),(48,'jorge.moreno','12345','2008',2,1,'2025-11-11 17:19:31'),(49,'paolaballen','$2b$10$ybU8CxwSASbkBNhmgaV3aON84ZsWA2uT0Jrx4fZtB1DBmKEDLuko6','14141414',3,1,'2025-11-12 01:41:21'),(51,'est12345','$2b$10$iO86lV8FG4bjudiZm6UEW.yFLU4UVRrOx9hre3vwcnioIo9uW4t5K','12345',1,1,'2025-11-12 02:02:58'),(52,'acu3636363636','$2b$10$v4yiR9EgtW.oQrzW45mmfu8EZTIxGG7xEn2R.pXiKLnloSbE0MNpC','3636363636',2,1,'2025-11-12 02:02:58'),(53,'carlaollarves31@gmail.com','$2b$10$D4uNrWdhE.67FXB5O1PnlO54rdtgKNK9g7rSdA5sYu2kkz4hHVRfm','1515515',3,1,'2025-11-12 04:39:19');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'soal1'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 17:49:01
