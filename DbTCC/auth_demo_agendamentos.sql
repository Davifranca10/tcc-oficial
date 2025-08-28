-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: auth_demo
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `agendamentos`
--

DROP TABLE IF EXISTS `agendamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `id_servico` int DEFAULT NULL,
  `id_funcionario` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `horario` time DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_servico` (`id_servico`),
  KEY `id_funcionario` (`id_funcionario`),
  CONSTRAINT `agendamentos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `users` (`id`),
  CONSTRAINT `agendamentos_ibfk_2` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id`),
  CONSTRAINT `agendamentos_ibfk_3` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=355 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agendamentos`
--

LOCK TABLES `agendamentos` WRITE;
/*!40000 ALTER TABLE `agendamentos` DISABLE KEYS */;
INSERT INTO `agendamentos` VALUES (115,3,37,1,'2025-01-05','08:30:00','aceito'),(116,12,41,2,'2025-01-06','10:00:00','pendente'),(117,7,44,4,'2025-01-08','14:00:00','aceito'),(118,18,50,1,'2025-01-10','09:00:00','pendente'),(119,5,38,2,'2025-01-12','11:30:00','aceito'),(120,21,45,4,'2025-01-14','13:00:00','pendente'),(121,9,40,1,'2025-01-16','15:30:00','aceito'),(122,14,47,2,'2025-01-18','16:00:00','pendente'),(143,6,49,4,'2025-02-02','08:00:00','aceito'),(144,19,51,1,'2025-02-05','10:30:00','pendente'),(145,4,37,2,'2025-02-07','12:00:00','aceito'),(146,11,41,4,'2025-02-09','14:30:00','pendente'),(147,8,44,1,'2025-02-12','09:30:00','aceito'),(148,17,50,2,'2025-02-15','11:00:00','pendente'),(149,2,40,4,'2025-02-18','13:30:00','aceito'),(150,15,45,1,'2025-02-20','15:00:00','pendente'),(151,10,47,2,'2025-02-23','16:30:00','aceito'),(152,22,49,4,'2025-02-26','08:30:00','pendente'),(153,18,41,2,'2025-04-01','09:30:00','aceito'),(154,3,44,4,'2025-04-04','11:00:00','pendente'),(155,14,50,1,'2025-04-07','13:30:00','aceito'),(156,8,38,2,'2025-04-10','15:00:00','pendente'),(157,21,40,4,'2025-04-13','16:30:00','aceito'),(158,6,45,1,'2025-04-16','08:30:00','pendente'),(159,17,47,2,'2025-04-19','10:00:00','aceito'),(160,10,49,4,'2025-04-22','11:30:00','pendente'),(161,2,51,1,'2025-04-25','14:00:00','aceito'),(162,15,37,2,'2025-04-28','15:30:00','pendente'),(183,10,50,2,'2025-07-02','09:00:00','aceito'),(184,4,40,4,'2025-07-05','10:30:00','pendente'),(185,13,45,1,'2025-07-08','12:00:00','aceito'),(186,7,47,2,'2025-07-11','14:30:00','pendente'),(187,21,49,4,'2025-07-14','16:00:00','aceito'),(188,2,51,1,'2025-07-17','08:30:00','pendente'),(189,15,38,2,'2025-07-20','10:00:00','aceito'),(190,8,41,4,'2025-07-23','11:30:00','pendente'),(191,19,44,1,'2025-07-26','13:00:00','aceito'),(192,6,50,2,'2025-07-29','15:30:00','pendente'),(213,1,45,1,'2025-09-01','09:00:00','aceito'),(214,10,47,2,'2025-09-04','10:30:00','pendente'),(215,6,49,4,'2025-09-07','12:00:00','aceito'),(216,17,51,1,'2025-09-10','14:30:00','pendente'),(217,3,38,2,'2025-09-13','16:00:00','aceito'),(218,15,41,4,'2025-09-16','08:30:00','pendente'),(219,8,44,1,'2025-09-19','10:00:00','aceito'),(220,22,50,2,'2025-09-22','11:30:00','pendente'),(221,11,40,4,'2025-09-25','13:00:00','aceito'),(222,4,45,1,'2025-09-28','15:30:00','pendente'),(254,1,37,1,'2025-08-01','08:00:00','aceito'),(285,5,37,2,'2025-08-01','08:00:00','aceito'),(286,12,37,1,'2025-08-01','08:30:00','aceito'),(287,8,38,1,'2025-08-01','09:00:00','aceito'),(288,18,38,1,'2025-08-01','09:30:00','aceito'),(301,3,40,1,'2025-08-01','10:00:00','aceito'),(302,14,40,1,'2025-08-01','10:30:00','aceito'),(303,9,37,2,'2025-08-01','11:00:00','aceito'),(307,21,40,1,'2025-08-01','11:30:00','pendente'),(308,6,37,1,'2025-08-01','12:00:00','aceito'),(309,7,41,1,'2025-08-02','08:00:00','aceito'),(310,19,44,4,'2025-08-02','08:30:00','aceito'),(311,4,50,2,'2025-08-02','09:00:00','aceito'),(312,11,40,1,'2025-08-02','09:30:00','aceito'),(313,13,45,4,'2025-08-02','10:00:00','aceito'),(314,2,47,2,'2025-08-02','10:30:00','pendente'),(315,17,49,1,'2025-08-02','11:00:00','aceito'),(316,10,51,4,'2025-08-02','11:30:00','aceito'),(317,22,37,2,'2025-08-02','12:00:00','aceito'),(318,1,41,1,'2025-08-02','12:30:00','aceito'),(337,8,44,4,'2025-08-15','08:00:00','aceito'),(338,14,50,2,'2025-08-15','08:30:00','aceito'),(339,6,40,1,'2025-08-15','09:00:00','aceito'),(340,19,45,4,'2025-08-15','09:30:00','aceito'),(341,3,47,2,'2025-08-15','10:00:00','aceito');
/*!40000 ALTER TABLE `agendamentos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-28  0:31:19
