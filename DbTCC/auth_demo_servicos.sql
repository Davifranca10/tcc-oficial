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
-- Table structure for table `servicos`
--

DROP TABLE IF EXISTS `servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `preco` decimal(10,2) NOT NULL,
  `duracao` int DEFAULT NULL,
  `id_funcionario` int DEFAULT NULL,
  `imagem_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_funcionario` (`id_funcionario`),
  CONSTRAINT `servicos_ibfk_1` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicos`
--

LOCK TABLES `servicos` WRITE;
/*!40000 ALTER TABLE `servicos` DISABLE KEYS */;
INSERT INTO `servicos` VALUES (37,'Corte Feminino com Camadas','Corte moderno em camadas para dar movimento e volume aos cabelos.',70.00,50,1,'/uploads/1756346529743.jpg'),(38,'Escova Progressiva','Alisamento temporário com efeito liso e brilho intenso por até 4 semanas.',90.00,90,1,'/uploads/1756349235808.jpg'),(40,'Pintura de Cabelo (Tonalizante)','Tonalização sem amônia para realçar cor e brilho dos fios.',85.00,70,1,'/uploads/1756349321691.jpg'),(41,'Mechas Californianas','Iluminação natural nas pontas, ideal para morenas e castanhas.',180.00,180,2,'/uploads/1756349369729.png'),(43,'Escova Modeladora com Chapinha','Finalização perfeita para cabelos lisos ou ondulados.',60.00,70,4,'1749820894479.jpg'),(44,'Cachos','Cachos com produtos Naturais',220.00,150,1,'/uploads/1756349549068.jpg'),(45,'Luzes Finas em Meia Cabeça','Iluminação sutil com luzes finas para efeito natural.',130.00,120,1,'/uploads/1756349599899.jpg'),(47,'Matização Capilar','Correção de tons indesejados (amarelados, alaranjados) com tonalizante.',65.00,45,1,'/uploads/1756349706283.png'),(49,'Corte com Navalha','Técnica avançada com navalha para fios mais leves e textura moderna.',72.00,55,4,'/uploads/1756349820844.jpg'),(50,'Tratamento com Botox Capilar','Reconstrução profunda sem alisamento, ideal para cabelos danificados.',140.00,100,4,'/uploads/1756349857612.jpg'),(51,'Finalização com Babyliss','Ondulação natural com babyliss e fixação com spray.',55.00,60,4,'/uploads/1756349878636.jpg');
/*!40000 ALTER TABLE `servicos` ENABLE KEYS */;
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
