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
  PRIMARY KEY (`id_acudiente`),
  KEY `numero_documento` (`numero_documento`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `acudiente_ibfk_1` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`),
  CONSTRAINT `acudiente_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acudiente`
--

LOCK TABLES `acudiente` WRITE;
/*!40000 ALTER TABLE `acudiente` DISABLE KEYS */;
INSERT INTO `acudiente` VALUES (1,'4001',4),(2,'4001',4),(4,'44544248745',12),(5,'4457893254',13),(10,'32165498',28),(11,'1151478522',31);
/*!40000 ALTER TABLE `acudiente` ENABLE KEYS */;
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
  PRIMARY KEY (`id_asistencia`),
  KEY `id_estudiante` (`id_estudiante`),
  KEY `id_funcionario` (`id_funcionario`),
  KEY `id_estado_asistencia` (`id_estado_asistencia`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`),
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`),
  CONSTRAINT `asistencia_ibfk_3` FOREIGN KEY (`id_estado_asistencia`) REFERENCES `estado_asistencia` (`id_estado_asistencia`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
INSERT INTO `asistencia` VALUES (2,1,3,'2025-06-29',1,NULL),(4,1,2,'2025-06-28',1,NULL),(5,1,1,'2025-06-28',1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_observacion`
--

LOCK TABLES `auditoria_observacion` WRITE;
/*!40000 ALTER TABLE `auditoria_observacion` DISABLE KEYS */;
INSERT INTO `auditoria_observacion` VALUES (1,4,'INSERT','2025-06-29 13:12:50'),(3,7,'INSERT','2025-06-29 22:21:39'),(4,8,'INSERT','2025-06-30 15:57:13'),(5,9,'INSERT','2025-07-01 21:08:30'),(6,10,'INSERT','2025-07-01 21:21:03'),(7,11,'INSERT','2025-07-01 21:37:24'),(8,12,'INSERT','2025-07-01 21:40:18'),(9,13,'INSERT','2025-07-01 23:28:54'),(10,14,'INSERT','2025-07-01 23:29:36'),(11,15,'INSERT','2025-07-01 23:51:31');
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
INSERT INTO `categoria_observacion` VALUES (1,'Actitud'),(2,'Disciplinaria'),(3,'Psicológica'),(4,'Situación financiera');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (1,1,2,3,'2025-07-01 15:00:00','Reunión por bajo rendimiento','Pendiente'),(2,1,2,2,'2025-07-01 15:00:00','incumplimiento en traer el uniforme ','Pendiente'),(3,1,1,2,'2025-07-03 13:00:00','falta de pagos','Pendiente');
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
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
INSERT INTO `estado_notificacion` VALUES (2,'Leída'),(1,'Leído');
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
  `id_acudiente` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_estudiante`),
  KEY `numero_documento` (`numero_documento`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_estado_academico` (`id_estado_academico`),
  KEY `id_acudiente` (`id_acudiente`),
  KEY `idx_estudiante_eps_estado` (`id_eps`,`id_estado_academico`),
  CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`numero_documento`) REFERENCES `persona` (`numero_documento`),
  CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `estudiante_ibfk_3` FOREIGN KEY (`id_eps`) REFERENCES `eps` (`id_eps`),
  CONSTRAINT `estudiante_ibfk_4` FOREIGN KEY (`id_estado_academico`) REFERENCES `estado_academico` (`id_estado_academico`),
  CONSTRAINT `estudiante_ibfk_5` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante`
--

LOCK TABLES `estudiante` WRITE;
/*!40000 ALTER TABLE `estudiante` DISABLE KEYS */;
INSERT INTO `estudiante` VALUES (1,'3001',3,1,1,1),(3,'4422475111',15,1,1,2),(11,'98765432',27,3,1,NULL),(13,'554615449846',30,6,1,NULL);
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
  `id_relacion` int(11) NOT NULL,
  PRIMARY KEY (`id_estudiante_acudiente`),
  KEY `id_estudiante` (`id_estudiante`),
  KEY `id_acudiente` (`id_acudiente`),
  KEY `id_relacion` (`id_relacion`),
  CONSTRAINT `estudiante_acudiente_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`),
  CONSTRAINT `estudiante_acudiente_ibfk_2` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`),
  CONSTRAINT `estudiante_acudiente_ibfk_3` FOREIGN KEY (`id_relacion`) REFERENCES `relacion_acudiente` (`id_relacion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante_acudiente`
--

LOCK TABLES `estudiante_acudiente` WRITE;
/*!40000 ALTER TABLE `estudiante_acudiente` DISABLE KEYS */;
INSERT INTO `estudiante_acudiente` VALUES (1,11,10,2),(2,13,11,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante_grado`
--

LOCK TABLES `estudiante_grado` WRITE;
/*!40000 ALTER TABLE `estudiante_grado` DISABLE KEYS */;
INSERT INTO `estudiante_grado` VALUES (1,1,2,2025,1),(9,11,2,NULL,1),(11,13,12,NULL,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario`
--

LOCK TABLES `funcionario` WRITE;
/*!40000 ALTER TABLE `funcionario` DISABLE KEYS */;
INSERT INTO `funcionario` VALUES (1,NULL,2,'Profesor',3,'Arl Sura',NULL),(2,NULL,5,'Profesor',2,'Arl Sura',NULL),(3,NULL,6,'Profesor',1,'Arl Sura',NULL),(6,'1001',14,'Profesor',1,'ARL Sura',NULL),(8,'1151472244',7,'Administrador',1,'ARL Sura',NULL),(9,'1151472245',8,'Profesor',2,'ARL Sura',NULL),(10,'1151472246',9,'Coordinador',1,'ARL Sura',NULL),(11,'1151472247',5,'Secretaria',2,'ARL Sura',NULL),(12,'1151472248',6,'Orientador',1,'ARL Sura',NULL),(13,'2001',2,'Coordinador General',1,'ARL Positiva',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario_grado`
--

LOCK TABLES `funcionario_grado` WRITE;
/*!40000 ALTER TABLE `funcionario_grado` DISABLE KEYS */;
INSERT INTO `funcionario_grado` VALUES (1,1,2,'Director'),(2,1,3,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_observacion`
--

LOCK TABLES `historial_observacion` WRITE;
/*!40000 ALTER TABLE `historial_observacion` DISABLE KEYS */;
INSERT INTO `historial_observacion` VALUES (1,8,'2025-06-30 16:02:47','Actualización de observación'),(2,8,'2025-07-01 21:54:10','la joven no quiso hacer una tarea'),(3,8,'2025-07-01 22:02:55','la joben si iso la tarea y termino de ultima'),(4,8,'2025-07-01 22:02:55','la joben si iso la tarea y termino de ultima');
/*!40000 ALTER TABLE `historial_observacion` ENABLE KEYS */;
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
  `archivo` text DEFAULT NULL,
  PRIMARY KEY (`id_justificacion`),
  KEY `justificacion_ibfk_1` (`id_estudiante`),
  KEY `idx_justificacion_fecha` (`fecha`),
  CONSTRAINT `justificacion_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificacion`
--

LOCK TABLES `justificacion` WRITE;
/*!40000 ALTER TABLE `justificacion` DISABLE KEYS */;
INSERT INTO `justificacion` VALUES (1,1,'2025-06-30','Inasistencia por enfermedad','nombre_archivo.pdf');
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
INSERT INTO `nivel_escolaridad` VALUES (6,'Doctorado'),(4,'Especialización'),(3,'Licenciatura'),(5,'Maestría'),(1,'Técnico'),(2,'Tecnólogo');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (2,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-06-29 22:21:39',1,1),(3,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-06-30 15:57:13',1,1),(4,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 21:08:30',1,1),(5,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 21:21:03',1,1),(6,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 21:37:24',1,1),(7,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 21:40:18',1,1),(8,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 23:28:54',1,1),(9,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 23:29:36',1,1),(10,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 23:51:31',1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observacion`
--

LOCK TABLES `observacion` WRITE;
/*!40000 ALTER TABLE `observacion` DISABLE KEYS */;
INSERT INTO `observacion` VALUES (4,1,1,'2025-06-29','Actualización de observación',1,1),(7,1,2,'2025-06-29','El estudiante llegó tarde a clase.',1,1),(8,1,2,'2025-06-30','la joben si iso la tarea y termino de ultima',2,1),(9,1,9,'2025-07-01','el estudiante lleva 3 meses en mora por falta de pagos por favor dirijase a la institucion para hacer acuerdo de pago',3,4),(10,3,9,'2025-07-01','el estudiante no quiso hacer la tarea en clase por favor ablar con el ',1,1),(11,3,9,'2025-07-01','asdasdDBIULBUEWQFDBUQBWCFAC _',3,1),(12,1,9,'2025-07-01','ÑLASDNASLKNDAKSNDIWNHIDA',1,1),(13,3,9,'2025-07-01','pasfsahuifnhiuafen',2,1),(14,3,9,'2025-07-01','lasdniasndinas',2,4),(15,1,9,'2025-07-01','auhsdigdwgqaidsub',2,3);
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
  `discapacidad` enum('Sí','No') DEFAULT NULL,
  `ocupacion` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `foto` text DEFAULT NULL,
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
INSERT INTO `persona` VALUES ('1001','Juan','Pérez','juan.perez@email.com','3001234567',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('1151472244','abel','moreno','juan.perez@example.com',NULL,'Cra 10 #20-30','Bogotá','O+','No','Profesor','1990-01-15',NULL,1,1),('1151472245','María','Gómez','maria.gomez@example.com',NULL,'Calle 45 #12-34','Medellín','A+','No','Psicóloga','1988-05-23',NULL,2,1),('1151472246','Carlos','Rodríguez','carlos.rod@example.com',NULL,'Av 68 #33-21','Cali','B+','No','Coordinador','1992-11-10',NULL,1,1),('1151472247','Ana','Martínez','ana.martinez@example.com',NULL,'Carrera 7 #14-10','Barranquilla','AB+','No','Secretaria','1995-03-30',NULL,2,1),('1151472248','Luis','Fernández','luis.fernandez@example.com',NULL,'Calle 100 #25-60','Cartagena','O-','No','Orientador','1987-08-19',NULL,1,1),('1151478522','juan','gomez','juan@gmail.com','3214567899','kenedy',NULL,NULL,NULL,'albañil',NULL,NULL,1,1),('1151478839','maria','Gómez','Maria@email.com','3255158412','Calle 15 # 24 - 14',NULL,'A+',NULL,NULL,'1998-04-21',NULL,2,1),('2001','Carlos','Coordinador','carlos.coord@email.com','3001111111',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('3001','Laura','Estudiante','laura.estu@email.com','3002222222','Calle 123 #45-67','Bogotá','O+','No','Estudiante','2005-04-12',NULL,2,1),('3010','Pedro','Gómez','pedro.gomez@email.com','3001234567','Calle 100 #10-10','Medellín','A+','No','Estudiante','2007-03-10',NULL,1,1),('32165498','Yormary','Gómez','yormary.gomez@email.com','3126547890','Avenida 15 #45-67',NULL,NULL,NULL,'Administradora',NULL,NULL,2,1),('4001','Marta','Acudiente','marta.acud@email.com','3003333333',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1),('4002','María','Gómez','maria.gomez@email.com','3003334444','Calle 50 #20-30','Medellín','O-','No','Madre','1985-02-02',NULL,2,1),('4422475111','joaquin','Moreno','joaquin@email.com','3126996336','soacha la capilla','Soacha','O+','No','Profesor','1998-04-21','foto.jpg',1,1),('44544248745','brajan','medina','medina_b@email.com','31264554441','Calle 8sur # 21 - 64','Bogotá','A+','No','pintor','2000-04-21',NULL,1,1),('4457893254','sebastia','gomez','sebastian_g@email.com','3126636996','Calle 10 # 22 - 14','Bogotá','A+','No','domiciliario','1998-04-21',NULL,1,1),('5001','Sandra','Secretaria','sandra.sec@email.com','3004444444',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1),('554615449846','maria','pulido','mariap@gmail.com','31264564851','kenedy','bogota','o-','No','estudiante','2025-01-30',NULL,2,6),('6001','Luis','Rector','luis.rector@email.com','3005555555',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1),('98765432','Carla','Martínez','carla.martinez@email.com','3019876543','Carrera 10 #20-30','Medellín','A+','No','Estudiante','2011-03-15',NULL,2,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pqr`
--

LOCK TABLES `pqr` WRITE;
/*!40000 ALTER TABLE `pqr` DISABLE KEYS */;
INSERT INTO `pqr` VALUES (2,1,1,1,'nesecito informacion de la instutucion','2025-06-30',1);
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
INSERT INTO `relacion_acudiente` VALUES (6,'Abuela'),(5,'Abuelo'),(8,'Hermana'),(7,'Hermano'),(2,'Madre'),(9,'Otro'),(1,'Padre'),(4,'Tía'),(3,'Tío');
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
INSERT INTO `tipo_documento` VALUES (1,'Cédula de ciudadanía'),(3,'Cédula de extranjería'),(5,'NIT'),(4,'Pasaporte'),(6,'Registro civil'),(2,'Tarjeta de identidad');
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'ccoordinador','$2b$10$hneuI0W.E871GNW13svDv.4ZVp7EN.dZCRGm4/gpgw7S4iKyRbJAa','2001',4,1,'2025-06-29 08:05:59'),(3,'lestudiante','123456','3001',1,1,'2025-06-29 08:06:10'),(4,'macudiente','123456','4001',2,1,'2025-06-29 08:06:23'),(5,'ssecretaria','123456','5001',5,1,'2025-06-29 08:07:27'),(6,'lrector','123456','6001',7,1,'2025-06-29 08:07:35'),(7,'admin1','clave123','1151472244',1,1,'2025-06-29 16:10:55'),(8,'profe1','clave456','1151472245',2,1,'2025-06-29 16:10:55'),(9,'estu1','clave789','1151472246',3,1,'2025-06-29 16:10:55'),(10,'pedroest','123456','3010',1,1,'2025-06-29 22:10:30'),(12,'brajan_medina@gmail.com','clave1234','44544248745',2,1,'2025-06-29 22:40:19'),(13,'sebastian_g@email.com','clave1234','4457893254',2,1,'2025-06-29 22:41:33'),(14,'juanperez','contrasena_segura','1001',2,1,'2025-06-30 08:25:14'),(15,'Joaquin@gmail.com','clave123','4422475111',1,1,'2025-07-01 13:57:29'),(27,'carla98765432','$2b$10$chQHHEJ2SPZVex99TtG.4uQ8stgh/8foc/a8HySKzqbx/WZ11diZC','98765432',5,1,'2025-07-02 04:50:29'),(28,'yormary32165498','$2b$10$chQHHEJ2SPZVex99TtG.4uQ8stgh/8foc/a8HySKzqbx/WZ11diZC','32165498',4,1,'2025-07-02 04:50:29'),(30,'maria554615449846','$2b$10$MJsgEla3P64XeMKTq7mQ6.DzZsPuKWsz.75x.bImy.Cj6SrF1zFtK','554615449846',5,1,'2025-07-02 12:51:23'),(31,'juan1151478522','$2b$10$MJsgEla3P64XeMKTq7mQ6.DzZsPuKWsz.75x.bImy.Cj6SrF1zFtK','1151478522',4,1,'2025-07-02 12:51:23');
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

-- Dump completed on 2025-07-02 11:17:39
