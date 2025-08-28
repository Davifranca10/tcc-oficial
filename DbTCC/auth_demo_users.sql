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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'davi guilherme franca','davifranca629@gmail.com','$2b$10$FUL2DC4xCr3qnRrQV6Y7hutSqXNlKFbK1n4haspGtCDsns1QhnaCW',' (91) 98712-3456'),(2,'fernando','fernando@gmail.com','$2b$10$miVR3Ovm5YpoNCEcCQQnJ.Cvb2iv7mu6gUBSGLtntq/R17Qu7fsYS','(81) 95678-1234'),(3,'lucas','lucas@gmail.com','$2b$10$ijjKf54VahupS/.HZyagfupVPKyQOf2mF3Tz/NRrh/AIJVkHiKYtm','(85) 93421-8765'),(4,'mawan','mawan@gmail.com','$2b$10$8Uu9GyckyU001P1VV/eGrugmKJhI7Dpiu2q7PrXBf.M.fH1sSaWam','(71) 92345-6789'),(5,'marcelo','marcelo@gmail.com','$2b$10$6iBGOM/ZS4ZBLOyeSJhAC.B4Jpc0OGk/EBeKdVm2TRVBvjALC/hoa','(81) 95678-1234'),(6,'genio','genio@gmail.com','$2b$10$wS8RcamyD8aFgPih7M2GZ.ySZ9rt/3QCRLWtA/bvrZU6l9WJ9weQC',' (61) 97743-7149'),(7,'Lucas Almeida','lucas.almeida@emailteste.com','$2b$10$xRNoKJnxfG/JooDPIqsiiO7x5G5T5U3gv/ZVQUWgmIvggIxsWOw4O','(11) 91234-5678'),(8,'Mariana Rocha','mariana.rocha@emailteste.com','$2b$10$xdEf3KIHcSYc4PNa6uXl8ePGZMIWdi6O2xxiKEn449qIVNEG1be8q','(21) 99876-5432'),(9,'Pedro Henrique Souza','pedro.souza@emailteste.com','$2b$10$8e2vdNPLaWT3rH3avIk.Zucq3F4JwtbSvfUuhdLPxB8Rubef4QpAi','(31) 98765-4321'),(10,'Ana Beatriz Lima','ana.lima@emailteste.com','$2b$10$HCFp2oIDuJ55AmTHM9iyg.pAvfonpXOm/nkEehg2JCAY1L4jxjD9C','(41) 93456-7890'),(11,'Rafael Mendes','rafael.mendes@emailteste.com','$2b$10$wUtPnt85A1uw0SrRcGWuTulXoxBqLHMRh/7SuCtt0VTAZqCg16Ol2','(51) 97654-3210'),(12,'Júlia Ferreira','julia.ferreira@emailteste.com','$2b$10$lpRK/eRBFn1QchquJD2HTuP0y4viUgHmX4bBe8eIoxRPseWyiUhI.','(61) 96543-2109'),(13,'Kaique','kaique@gmail.com','$2b$10$wntE84dTJHzXaL3PHwH3oO5K3/.7moIlxWCr7a1Mi6TWd0397tK2.','(61) 95566-7788  '),(14,'yasmim','yasdopkesezario@gmail.com','$2b$10$y4Kxyd9sI7zTW7NVyhElluaZcO0emRNE3Wwv5a9Q.fC9DTSfW718G','(47) 99146-5955'),(15,'Marlete','marlete@gmail.com','$2b$10$2agfbvRMk1kGgxK6fKqIReN3IxLG9PI5Dty1nlAXQbJaL1/YnhLOS','(71) 94433-2211  '),(17,'Ana Clara Souza','ana.souza@exemplo.com','$2b$10$GN5zW6IhRRb6KY3b4OYSjOBWHtdAyIo7zOP/d5hkTuk9A8cKr.VHK','(11) 98123-4567'),(18,'Lucas Mendes','lucas.mendes@exemplo.com','$2b$10$qNtLz0vBer9zQO9yhrGCm.xMVRWM70W7pn2G2t6fO3yJRsYHmQHy.','(21) 99876-5432'),(19,'Carla Regina Alves','carla.alves@exemplo.com','$2b$10$TRLygx3/jxDfydBNtagwyOWZ2JbW1zZXCScE3Fw7BnS3yYgnmw1I.','(31) 97654-3210'),(20,'Felipe Augusto Silva','felipe.silva@exemplo.com','$2b$10$AAxqN3ZK51SBGOXNCy6dvOi9LyhcRexf92r6derat6uzLsskfPsDm','(41) 98888-7777'),(21,'Mariana Costa','mariana.costa@exemplo.com','$2b$10$yeoW8dRzbswrt2CbeGx0UOBGXxISJQr..ffy6yIxJzGjYE4XPnRvu','(51) 91122-3344'),(22,'Thiago Ribeiro','thiago.ribeiro@exemplo.com','$2b$10$oSP/YbbIL/glCMU7b97NheuDaWJ/5bTR0K8zpKNwhQE/WQjNlaPMG','(61) 95566-7788'),(29,'Bruno Almeida','bruno.almeida@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(11) 97123-4567'),(30,'Fernanda Nascimento','fernanda.nascimento@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(21) 98876-5432'),(31,'Ricardo Souza','ricardo.souza@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(31) 96654-3210'),(32,'Camila Ribeiro','camila.ribeiro@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(41) 99777-6666'),(33,'Diego Martins','diego.martins@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(51) 91133-4455'),(34,'Amanda Castro','amanda.castro@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(61) 95577-8899'),(35,'Eduardo Lima','eduardo.lima@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(71) 94422-1133'),(36,'Larissa Freitas','larissa.freitas@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(81) 93355-6677'),(37,'Gustavo Henrique','gustavo.henrique@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(91) 92266-7788'),(38,'Tatiane Duarte','tatiane.duarte@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(19) 97799-0011'),(39,'Marcelo Cunha','marcelo.cunha@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(27) 96688-9900'),(40,'Patrícia Azevedo','patricia.azevedo@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(85) 91234-5566'),(41,'Rodrigo Pires','rodrigo.pires@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(99) 95678-9900'),(42,'Simone Barbosa','simone.barbosa@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(47) 98765-1122'),(43,'Cintia Mendonça','cintia.mendonca@exemplo.com','$2b$10$E9zE5K1q0t8u7v6w5x4y3eXZa1Bc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9Kk0L','(34) 99876-2233');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
