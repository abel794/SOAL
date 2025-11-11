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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (2,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-06-29 22:21:39',1,1),(3,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-06-30 15:57:13',1,1),(4,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 21:08:30',1,1),(5,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 21:21:03',1,1),(6,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 21:37:24',1,1),(7,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 21:40:18',1,1),(8,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 23:28:54',1,1),(9,2,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 23:29:36',1,1),(10,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-01 23:51:31',1,1),(11,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-03 00:29:22',1,1),(12,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-03 00:51:50',1,1),(13,14,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-29 11:53:20',1,1),(14,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-07-30 18:37:08',1,1),(15,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-08-01 02:12:16',1,1),(16,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-08-01 02:13:49',1,1),(17,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-08-01 02:21:52',1,1),(18,4,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-08-01 02:29:44',1,1),(19,64,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-08-01 02:36:30',1,1),(20,1,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-08-01 02:39:33',1,1),(21,67,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-08-11 12:23:35',1,1),(22,67,'Se ha registrado una observación para su acudido. Por favor, revísela.','2025-08-12 00:13:40',1,1);
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-11 22:10:09
