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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observacion`
--

LOCK TABLES `observacion` WRITE;
/*!40000 ALTER TABLE `observacion` DISABLE KEYS */;
INSERT INTO `observacion` VALUES (4,1,1,'2025-06-29','La observación fue actualizada nuevamente',1,1),(7,1,2,'2025-06-29','El estudiante llegó tarde a clase.',1,1),(8,1,2,'2025-06-30','la joben si iso la tarea y termino de ultima',2,1),(9,1,9,'2025-07-01','el estudiante lleva 3 meses en mora por falta de pagos por favor dirijase a la institucion para hacer acuerdo de pago',3,4),(10,3,9,'2025-07-01','el estudiante no quiso hacer la tarea en clase por favor ablar con el ',1,1),(11,3,9,'2025-07-01','asdasdDBIULBUEWQFDBUQBWCFAC _',3,1),(12,1,9,'2025-07-01','ÑLASDNASLKNDAKSNDIWNHIDA',1,1),(13,3,9,'2025-07-01','pasfsahuifnhiuafen',2,1),(14,3,9,'2025-07-01','lasdniasndinas',2,4),(15,1,9,'2025-07-01','auhsdigdwgqaidsub',2,3),(20,1,9,'2025-07-03','no entro a clase',1,2),(21,1,9,'2025-07-03','lkshdfnouhwbGFBIEU<',3,2),(22,16,9,'2025-07-29','flojo',3,2),(36,91,9,'2025-07-30','el estudiante no trajo el uniforme correcto',2,1),(37,1,9,'2025-07-31','El estudiante tuvo una conducta inadecuada en clase.',2,2),(38,1,9,'2025-08-01','Prueba de notificación por correo automático',2,2),(39,1,9,'2025-08-01','Prueba de notificación por correo automático',2,2),(40,116,9,'2025-08-01','Prueba de notificación por correo automático',2,2),(41,103,9,'2025-08-01','Prueba de notificación por correo automático',2,2),(42,15,9,'2025-08-01','el estudiante no hace las tareas',2,1),(43,119,9,'2025-08-11','el estudiante no trajo la tarea solicitada',2,1),(44,119,9,'2025-08-12','el estudiante no trajo el uniforme completo',1,2);
/*!40000 ALTER TABLE `observacion` ENABLE KEYS */;
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
