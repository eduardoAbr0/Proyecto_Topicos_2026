-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: teatro_pleasantville
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `teatro_pleasantville`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `teatro_pleasantville` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `teatro_pleasantville`;

--
-- Table structure for table `Asientos`
--

DROP TABLE IF EXISTS `Asientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Asientos` (
  `id_asiento` int NOT NULL AUTO_INCREMENT,
  `fila` char(1) NOT NULL,
  `numero` int NOT NULL,
  PRIMARY KEY (`id_asiento`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Asientos`
--

LOCK TABLES `Asientos` WRITE;
/*!40000 ALTER TABLE `Asientos` DISABLE KEYS */;
INSERT INTO `Asientos` VALUES (1,'A',1),(2,'A',2),(3,'A',3),(4,'A',4),(5,'A',5),(6,'A',6),(7,'A',7),(8,'A',8),(9,'A',9),(10,'A',10),(11,'B',1),(12,'B',2),(13,'B',3),(14,'B',4),(15,'B',5),(16,'B',6),(17,'B',7),(18,'B',8),(19,'B',9),(20,'B',10),(21,'C',1),(22,'C',2),(23,'C',3),(24,'C',4),(25,'C',5),(26,'C',6),(27,'C',7),(28,'C',8),(29,'C',9),(30,'C',10),(31,'D',1),(32,'D',2),(33,'D',3),(34,'D',4),(35,'D',5),(36,'D',6),(37,'D',7),(38,'D',8),(39,'D',9),(40,'D',10);
/*!40000 ALTER TABLE `Asientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Boletos`
--

DROP TABLE IF EXISTS `Boletos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Boletos` (
  `id_boleto` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_asiento` int NOT NULL,
  `id_obra` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `fecha_compra` date NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_boleto`),
  UNIQUE KEY `id_obra` (`id_obra`,`id_asiento`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_asiento` (`id_asiento`),
  CONSTRAINT `boletos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `boletos_ibfk_2` FOREIGN KEY (`id_asiento`) REFERENCES `Asientos` (`id_asiento`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `boletos_ibfk_3` FOREIGN KEY (`id_obra`) REFERENCES `Obras` (`id_obra`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Boletos`
--

LOCK TABLES `Boletos` WRITE;
/*!40000 ALTER TABLE `Boletos` DISABLE KEYS */;
INSERT INTO `Boletos` VALUES (3,3,3,1,150.00,'2025-01-10','Pagado'),(5,5,4,1,150.00,'2025-01-10','Pagado'),(6,6,6,1,150.00,'2025-01-11','Pagado'),(7,7,3,4,150.00,'2025-01-11','Pagado'),(8,8,8,1,150.00,'2025-01-11','Pagado'),(9,9,9,1,150.00,'2025-01-11','Pagado'),(10,10,10,1,150.00,'2025-01-11','Pagado'),(11,1,11,1,150.00,'2025-01-12','Pagado'),(12,2,12,1,150.00,'2025-01-12','Pagado'),(13,3,13,1,150.00,'2025-01-12','Pagado'),(14,4,14,1,150.00,'2025-01-12','Pagado'),(15,5,15,1,150.00,'2025-01-12','Pagado'),(16,6,16,1,150.00,'2025-01-12','Pagado'),(17,7,17,1,150.00,'2025-01-13','Pagado'),(18,8,18,1,150.00,'2025-01-13','Pagado'),(19,9,19,1,150.00,'2025-01-13','Pagado'),(20,10,20,1,150.00,'2025-01-13','Pagado'),(21,1,21,1,150.00,'2025-01-14','Pagado'),(22,2,22,1,150.00,'2025-01-14','Pagado'),(23,3,23,1,150.00,'2025-01-14','Pagado'),(24,4,24,1,150.00,'2025-01-14','Pagado'),(25,5,25,1,150.00,'2025-01-14','Pagado'),(26,6,26,1,150.00,'2025-01-15','Pagado'),(27,7,27,1,150.00,'2025-01-15','Pagado'),(28,8,28,1,150.00,'2025-01-15','Pagado'),(29,9,29,1,150.00,'2025-01-15','Pagado'),(30,10,30,1,150.00,'2025-01-15','Pagado'),(31,1,31,1,150.00,'2025-01-16','Pagado'),(32,2,32,1,150.00,'2025-01-16','Pagado'),(33,3,33,1,150.00,'2025-01-16','Pagado'),(34,4,34,1,150.00,'2025-01-16','Pagado'),(35,5,35,1,150.00,'2025-01-16','Pagado'),(36,6,36,1,150.00,'2025-01-17','Pagado'),(37,7,37,1,150.00,'2025-01-17','Cancelado'),(42,1,4,4,2312.00,'2025-12-07','Pagado'),(43,4,2,2,1232.23,'2025-12-07','Pagado'),(45,4,5,4,1232.23,'2025-12-07','Pagado'),(46,5,1,3,1232.23,'2025-12-07','Pagado'),(47,9,6,2,7777.00,'2025-12-07','Pagado'),(51,3,5,2,300.00,'2025-12-08','Pagado'),(65,1,1,1,300.00,'2025-12-08','Pagado'),(66,4,5,3,300.00,'2025-12-08','Pagado'),(67,1,15,5,300.00,'2025-12-08','Pagado'),(84,6,3,2,300.00,'2025-12-08','Pagado'),(97,1,9,2,300.00,'2025-12-08','Pagado'),(99,3,3,3,300.00,'2025-12-08','Pagado'),(103,3,1,2,300.00,'2025-12-08','Pagado');
/*!40000 ALTER TABLE `Boletos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Finanzas`
--

DROP TABLE IF EXISTS `Finanzas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Finanzas` (
  `id_finanza` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `concepto` varchar(100) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `id_obra` int DEFAULT NULL,
  PRIMARY KEY (`id_finanza`),
  KEY `id_obra` (`id_obra`),
  CONSTRAINT `finanzas_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `Obras` (`id_obra`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Finanzas`
--

LOCK TABLES `Finanzas` WRITE;
/*!40000 ALTER TABLE `Finanzas` DISABLE KEYS */;
INSERT INTO `Finanzas` VALUES (1,'2025-01-05','Gasto','Pago de cliente por obra pendiente',12500.00,3),(2,'2025-01-07','Ingreso','Compra de materiales eléctricos',3200.50,1),(3,'2025-01-10','Gasto','Pago de transporte de materiales',12250.00,1),(5,'2025-01-15','Gasto','Herramientas menores',650.75,15),(6,'2025-01-19','Gasto','Pago de cliente por obra pendiente',2100.00,3),(7,'2025-01-23','Gasto','Pago de suplementos',7200.00,NULL),(8,'2025-01-25','Gasto','Renta del local/almacén',4500.00,4),(9,'2025-01-28','Ingreso','Pago final por instalación',9000.00,4),(18,'2025-11-12','Gasto','Pago a miembros obra',23012.23,5),(19,'2025-11-20','Gasto','El dia triste',23012.23,NULL),(20,'2025-11-13','Ingreso','Pagos mes pasado',12.21,2),(21,'2025-11-11','Gasto','Sas',23012.23,NULL),(22,'2025-11-05','Ingreso','Pago a miembros obra',23012.23,4),(23,'2025-11-20','Ingreso','Pagos ayer',23012.23,2),(24,'2025-11-05','Ingreso','El dia triste',12.21,2),(25,'2025-12-18','Ingreso','Pagos mes pasado',255012.23,4);
/*!40000 ALTER TABLE `Finanzas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Miembros`
--

DROP TABLE IF EXISTS `Miembros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Miembros` (
  `id_miembro` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `numero_casa` varchar(10) DEFAULT NULL,
  `calle` varchar(25) DEFAULT NULL,
  `colonia` varchar(25) DEFAULT NULL,
  `cp` varchar(10) DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `estado_membresia` varchar(20) DEFAULT NULL,
  `fecha_pago_cuota` date DEFAULT NULL,
  PRIMARY KEY (`id_miembro`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Miembros`
--

LOCK TABLES `Miembros` WRITE;
/*!40000 ALTER TABLE `Miembros` DISABLE KEYS */;
INSERT INTO `Miembros` VALUES (1,'Laura','García','Mendoza','5551234876','laura.gm@gmail.com','24','Hidalgog','Centro','06010','2023-01-15','Pagada',NULL),(3,'Ana','López','Santos','5559012234','ana.lopez@hotmail.com','55','Reforma','Roma Nore','06700','2024-04-10','Pagada',NULL),(5,'Danielaaa','Torres','Ríos','5556678234','daniela.tr@gmail.com','302','Amsterdam','Condesa','61404','2023-06-18','Sin pagar',NULL),(7,'Sofía','Cruz','Delgado','5552219087','sofia.cd@outlook.com','1','Nuevo León','Hipódromo','06100','2024-02-14','Pagada',NULL),(8,'Ricardo','Vega','Luna','5559982341','ricardo.vl@gmail.com','210','Patriotismo','San Pedro','03800','2022-05-30','Pagada',NULL),(9,'Marianaa','Flores','Campos','5553412209','mariana.fc@gmail.com','9','Toluca','Portales','3303','2023-09-12','Financiada',NULL),(14,'Sam','Casas','Juan','1','sam@g','2','1','JOs','1',NULL,'Sin pagar',NULL),(22,'Juan','Pérez','López','5512345678','juan.prueba@email.com','123','Av. Siempre Viva','Centro','98000',NULL,'Pagada','2025-01-15'),(23,'Juan','Pérezzzz','López','5512345678','juan.prueba@email.com','123','Av. Siempre Viva','Centro','98000',NULL,'Pagada',NULL),(24,'Juan','Pérez','López','5512345678','juan.prueba@email.com','123','Av. Siempre Viva','Centro','98000',NULL,'Pagada','2025-01-15'),(25,'Juan','Pérez','López','5512345678','juan.prueba@email.com','123','Av. Siempre Viva','Centro','0',NULL,'Pagada','2025-01-15'),(26,'Juan','Pérez','López','551234567811','juan.prueba@email.com','123','Av. Siempre Viva','Centro','0',NULL,'Pagada','2025-01-15'),(28,'Juan','Pérez','López','5512345678','juan.prueba@email.com','123','Av. Siempre Viva','Centro','98000',NULL,'Pagada','2025-01-15'),(32,'Sam','Pérez','Juan','5512345678','juan.prueba@email.com','123','Av. Siempre Viva','Centro','12345',NULL,'Pagada',NULL),(34,'Juan','21','12','1234567890','ed@gmail.com','0','','sa','0',NULL,'Sin pagar',NULL),(35,'Maria','Gomez','Ruiz','1111111111','maria.gomez@ej.com','1111','ndependencia','Lomas','90000',NULL,'Sin pagar',NULL),(38,'2','3','4','1111111111','123@gm.com','1','ho','sa','12',NULL,'Pagada','2025-12-17'),(43,'sam','c','c','1234567890','huanb@g.com','1','san','per','12',NULL,'Sin pagar',NULL),(45,'1','1','1','1','a@gm.com','1','s1','1','1',NULL,'Sin pagar',NULL),(46,'1','1','1','11','1@gm.com','1','1','1','1',NULL,'Sin pagar',NULL),(47,'5','5','5','5','5@gm.com','1','1','1','1',NULL,'Financiada',NULL),(48,'4','4','4','4','4@g.com','1','1','11','1',NULL,'Sin pagar',NULL),(49,'5','5','5','5','2@gm.com','1','1','1','1',NULL,'Financiada',NULL),(50,'1','1','1','1','1@d.com','1','1','1','1',NULL,'Sin pagar',NULL),(51,'1','1','1','1','1@d.com','1','1','1','1',NULL,'Sin pagar',NULL),(52,'1','1','1','1','1@d.com','1','1','1','1',NULL,'Sin pagar',NULL),(53,'1','1','1','1','1@d.com','1','1','1','1',NULL,'Pagada',NULL),(54,'1','1','1','1','1@g.com','1','1','1','1',NULL,'Sin pagar',NULL),(55,'1','1','11','1','1@gail.com','1','1','1','1',NULL,'Sin pagar',NULL),(56,'1','1','1','1','1@gail.com','1','1','1','1',NULL,'Sin pagar',NULL),(57,'1','1','1','1','1@gail.com','1','1','1','1',NULL,'Sin pagar',NULL),(58,'2','2','2','2','1@g.com','1','1','1','1',NULL,'Sin pagar',NULL),(59,'1','1','1','1','1@g.com','1','1','1','1',NULL,'Pagada',NULL),(60,'11','1sdad','1','1','1@g.com','1','1','1','1',NULL,'Pagada',NULL),(63,'1','1','1','1','1@g.com','1','1','1','1',NULL,'Sin pagar',NULL);
/*!40000 ALTER TABLE `Miembros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Obras`
--

DROP TABLE IF EXISTS `Obras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Obras` (
  `id_obra` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `autor` varchar(100) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `num_actos` int DEFAULT NULL,
  `anio_presentacion` year DEFAULT NULL,
  `temporada` varchar(20) DEFAULT NULL,
  `productor` int DEFAULT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_obra`),
  KEY `productor` (`productor`),
  CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`productor`) REFERENCES `Miembros` (`id_miembro`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Obras`
--

LOCK TABLES `Obras` WRITE;
/*!40000 ALTER TABLE `Obras` DISABLE KEYS */;
INSERT INTO `Obras` VALUES (1,'La Casa de Bernarda Alba','Federico Perez','Drama',3,2023,'Otoño',NULL,'Cerro'),(2,'Yo y ella','William Shakespeare','Comedia',5,2024,'Primavera',NULL,'Una comedia fantástica llena de enredos amorosos y magia.'),(3,'El Fantasma de la Ópera 2','Gaston Leroux','Musical',2,2022,'Verano',43,'Cerro y fiesta'),(4,'Romeo y Julieta','William Shakespeare','Drama',5,2023,'Verano',NULL,'La clásica tragedia de dos amantes enfrentados por sus familias.'),(5,'La Cantante Calva','Eugène Ionesco','Teatro del absurdo',1,2021,'Primavera',NULL,'Una obra emblemática del absurdo que desafía la lógica y el lenguaje.'),(7,'El Lago de los Cisnes','Tchaikovsky','Ballet',4,2020,'Invierno',NULL,'Un ballet clásico lleno de simbolismo, belleza y tragedia.'),(8,'Hamilton','Lin-Manuel Miranda','Musical',2,2023,'Verano',NULL,'Un musical innovador que mezcla historia y rap.'),(15,'El perro y el gato','El torres','Comedia',0,2025,'Primavera',NULL,'1'),(22,'El perro y el gato','Samuel Diaz','Drama',2,2025,'Primavera',NULL,'El fuher'),(23,'OB','SS','Drama',1,2025,'Primavera',NULL,'sa'),(24,'La toalla del mojado','Sam','Suspenso',2,2025,'Invierno',5,'Frankie Rivers'),(25,'1','1','Drama',1,2000,'Primavera',NULL,'sa'),(26,'La toalla de mojado 2','Shakespeare','Suspenso',3,2015,'Otoño',3,'La toalla de frankie rivers');
/*!40000 ALTER TABLE `Obras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `passw` varchar(255) NOT NULL,
  `rol` varchar(20) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuarios`
--

LOCK TABLES `Usuarios` WRITE;
/*!40000 ALTER TABLE `Usuarios` DISABLE KEYS */;
INSERT INTO `Usuarios` VALUES (1,'usuario1','pass1','cliente','Juan Pérez','juan@example.com'),(2,'usuario2','pass2','cliente','María López','maria@example.com'),(3,'usuario3','pass3','cliente','Carlos Ruiz','carlos@example.com'),(4,'usuario4','pass4','cliente','Ana Torres','ana@example.com'),(5,'usuario5','pass5','cliente','Luis Gómez','luis@example.com'),(6,'usuario6','pass6','cliente','Diana Silva','diana@example.com'),(7,'usuario7','pass7','cliente','Pedro Ríos','pedro@example.com'),(8,'usuario8','pass8','cliente','Elena Cruz','elena@example.com'),(9,'usuario9','pass9','cliente','Sofía Aguilar','sofia@example.com'),(10,'usuario10','pass10','cliente','Miguel Navarro','miguel@example.com'),(11,'probando123','0a4f8b93faad504007df78c9acb6f93ea6cc8c53',NULL,'Juan Prueba','juan@test.com'),(12,'sam','f16bed56189e249fe4ca8ed10a1ecae60e8ceac0',NULL,'sam','sam@gmail.com'),(13,'sam2','f16bed56189e249fe4ca8ed10a1ecae60e8ceac0',NULL,'sam2','sam@gm.com'),(14,'usa','e94fecc43f5fca586d99bd8458354ec99d3bbe2e',NULL,'sam','sa2@gm.com'),(15,'ed','7c4a8d09ca3762af61e59520943dc26494f8941b',NULL,'sam','ed308lejo@gmail.com'),(16,'1','356a192b7913b04c54574d18c28d46e6395428ab',NULL,'1','ed@gmail.com'),(17,'12','$2b$10$iNs8.zlFXJ.wHl1BFrdp0eoFqE6uOLKzX6bbHm2ZR01JF44/LWiHa',NULL,'san','e@gm.com'),(18,'alej','da4b9237bacccdf19c0760cab7aec4a8359010b0',NULL,'2','2@g.com'),(19,'2','$2b$10$8yhkx/Bzjibg3rPQ5yVUEO8FxTSh0ihEss3zOwcO8VKwFXrqAvD2m',NULL,'Ed','ed@g.com'),(20,'22','da4b9237bacccdf19c0760cab7aec4a8359010b0',NULL,'222','2@f.com'),(21,'root','dc76e9f0c0006e8f919e0c515c66dbba3982f785',NULL,'22','ed@gmail.com'),(22,'Admin','$2b$10$BkOegI5caiZrMWfZkY1CBO534DBKcDijcFrVbnvpsNIsHDU5.WkZa','Admin','admin','ed@gmail.com');
/*!40000 ALTER TABLE `Usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vista_boletos_detalle`
--

DROP TABLE IF EXISTS `vista_boletos_detalle`;
/*!50001 DROP VIEW IF EXISTS `vista_boletos_detalle`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_boletos_detalle` AS SELECT 
 1 AS `id_boleto`,
 1 AS `id_usuario`,
 1 AS `email`,
 1 AS `id_asiento`,
 1 AS `fila`,
 1 AS `numero_asiento`,
 1 AS `id_obra`,
 1 AS `nombre_obra`,
 1 AS `autor`,
 1 AS `precio`,
 1 AS `fecha_compra`,
 1 AS `estado`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_ganancias_obras`
--

DROP TABLE IF EXISTS `vista_ganancias_obras`;
/*!50001 DROP VIEW IF EXISTS `vista_ganancias_obras`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_ganancias_obras` AS SELECT 
 1 AS `id_obra`,
 1 AS `total_ganancia`*/;
SET character_set_client = @saved_cs_client;

--
-- Current Database: `teatro_pleasantville`
--

USE `teatro_pleasantville`;

--
-- Final view structure for view `vista_boletos_detalle`
--

/*!50001 DROP VIEW IF EXISTS `vista_boletos_detalle`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_boletos_detalle` AS select `b`.`id_boleto` AS `id_boleto`,`u`.`id_usuario` AS `id_usuario`,`u`.`email` AS `email`,`a`.`id_asiento` AS `id_asiento`,`a`.`fila` AS `fila`,`a`.`numero` AS `numero_asiento`,`o`.`id_obra` AS `id_obra`,`o`.`titulo` AS `nombre_obra`,`o`.`autor` AS `autor`,`b`.`precio` AS `precio`,`b`.`fecha_compra` AS `fecha_compra`,`b`.`estado` AS `estado` from (((`Boletos` `b` join `Usuarios` `u` on((`b`.`id_usuario` = `u`.`id_usuario`))) join `Asientos` `a` on((`b`.`id_asiento` = `a`.`id_asiento`))) join `Obras` `o` on((`b`.`id_obra` = `o`.`id_obra`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_ganancias_obras`
--

/*!50001 DROP VIEW IF EXISTS `vista_ganancias_obras`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`alej`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_ganancias_obras` AS select `Boletos`.`id_obra` AS `id_obra`,ifnull(sum(`Boletos`.`precio`),0.00) AS `total_ganancia` from `Boletos` where (`Boletos`.`estado` <> 'Cancelado') group by `Boletos`.`id_obra` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-09 17:21:43