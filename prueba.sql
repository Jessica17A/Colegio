-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-08-2025 a las 00:22:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prueba`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `IDAREA` int(11) NOT NULL,
  `CODIGO_AREA` varchar(20) NOT NULL,
  `NOMBRE_AREA` varchar(100) NOT NULL,
  `ESTADO` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`IDAREA`, `CODIGO_AREA`, `NOMBRE_AREA`, `ESTADO`) VALUES
(1, 'CONFIG3', 'Configuración4', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrera`
--

CREATE TABLE `carrera` (
  `IDCARRERA` int(11) NOT NULL,
  `NOMBRE` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `IDCURSO` int(11) NOT NULL,
  `NOMBRE` varchar(100) NOT NULL,
  `FKGRADO` int(11) DEFAULT NULL,
  `FKCARRERA` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado`
--

CREATE TABLE `grado` (
  `IDGRADO` int(11) NOT NULL,
  `NOMBRE` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `IDMODULO` int(11) NOT NULL,
  `FKAREA` int(11) NOT NULL,
  `CODIGO_MODULO` varchar(20) NOT NULL,
  `NOMBRE_MODULO` varchar(100) NOT NULL,
  `ICONO_MODULO` varchar(50) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`IDMODULO`, `FKAREA`, `CODIGO_MODULO`, `NOMBRE_MODULO`, `ICONO_MODULO`, `ESTADO`) VALUES
(1, 1, 'SEGURIDAD', 'Seguridad', 'fas fa-user-shield', 1),
(2, 1, 'ADMINISTRACION', 'Configuración', 'fa fa-sitemap', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `submodulos`
--

CREATE TABLE `submodulos` (
  `IDSUBMODULO` int(11) NOT NULL,
  `FKMODULO` int(11) NOT NULL,
  `CODIGO_SUBMODULO` varchar(20) NOT NULL,
  `NOMBRE_SUBMODULO` varchar(100) NOT NULL,
  `VISTA_SUBMODULO` varchar(150) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `submodulos`
--

INSERT INTO `submodulos` (`IDSUBMODULO`, `FKMODULO`, `CODIGO_SUBMODULO`, `NOMBRE_SUBMODULO`, `VISTA_SUBMODULO`, `ESTADO`) VALUES
(1, 1, 'GEST_USUARIOS', 'Gestión de Usuarios', 'gestion_usuarios', 1),
(2, 2, 'Areas', 'Areas', 'Config_Areas', 1),
(3, 2, 'riTv7yNzoF', 'Jessica', 'CONFIGURACIóN_JESSICA', 1),
(4, 1, 'ZAXEJ7P2He', 'NAYELI1', NULL, 1),
(5, 2, 'nKYDEkSB7r', 'DTI', 'hola', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subsubmodulos`
--

CREATE TABLE `subsubmodulos` (
  `IDSUBSUBMODULO` int(11) NOT NULL,
  `FK_SUBMODULO` int(11) DEFAULT NULL,
  `CODIGO_SUBSUBMODULO` varchar(100) DEFAULT NULL,
  `NOMBRE_SUBSUBMODULO` varchar(100) DEFAULT NULL,
  `VISTA_SUBSUBMODULO` varchar(100) DEFAULT NULL,
  `ESTADO` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subsubmodulos`
--

INSERT INTO `subsubmodulos` (`IDSUBSUBMODULO`, `FK_SUBMODULO`, `CODIGO_SUBSUBMODULO`, `NOMBRE_SUBSUBMODULO`, `VISTA_SUBSUBMODULO`, `ESTADO`) VALUES
(2, 1, 'REP_USUARIOS', 'Reporte de Usuarios', 'reporte_usuarios', 1),
(3, 1, 'IZH2k0QKBs', 'PRUEBAS', 'IZH2k0QKBs', 1),
(4, 1, 'ri2JyOxPZL', 'TESTING', 'MODULO_TESTING', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(11) NOT NULL,
  `USER` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `ROLE` enum('ADMIN','USER') DEFAULT 'USER',
  `FECHA_CREACION` timestamp NOT NULL DEFAULT current_timestamp(),
  `ESTADO` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`IDAREA`),
  ADD UNIQUE KEY `CODIGO_AREA` (`CODIGO_AREA`);

--
-- Indices de la tabla `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`IDCARRERA`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`IDCURSO`),
  ADD KEY `FKGRADO` (`FKGRADO`),
  ADD KEY `FKCARRERA` (`FKCARRERA`);

--
-- Indices de la tabla `grado`
--
ALTER TABLE `grado`
  ADD PRIMARY KEY (`IDGRADO`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`IDMODULO`),
  ADD UNIQUE KEY `CODIGO_MODULO` (`CODIGO_MODULO`),
  ADD KEY `FK_MODULOS_AREA` (`FKAREA`);

--
-- Indices de la tabla `submodulos`
--
ALTER TABLE `submodulos`
  ADD PRIMARY KEY (`IDSUBMODULO`),
  ADD UNIQUE KEY `CODIGO_SUBMODULO` (`CODIGO_SUBMODULO`),
  ADD KEY `FK_SUBMODULOS_MODULO` (`FKMODULO`);

--
-- Indices de la tabla `subsubmodulos`
--
ALTER TABLE `subsubmodulos`
  ADD PRIMARY KEY (`IDSUBSUBMODULO`),
  ADD KEY `FK_SUBMODULO` (`FK_SUBMODULO`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EMAIL` (`USER`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `IDAREA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `carrera`
--
ALTER TABLE `carrera`
  MODIFY `IDCARRERA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `IDCURSO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `grado`
--
ALTER TABLE `grado`
  MODIFY `IDGRADO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `IDMODULO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `submodulos`
--
ALTER TABLE `submodulos`
  MODIFY `IDSUBMODULO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `subsubmodulos`
--
ALTER TABLE `subsubmodulos`
  MODIFY `IDSUBSUBMODULO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`FKGRADO`) REFERENCES `grado` (`IDGRADO`),
  ADD CONSTRAINT `curso_ibfk_2` FOREIGN KEY (`FKCARRERA`) REFERENCES `carrera` (`IDCARRERA`);

--
-- Filtros para la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD CONSTRAINT `FK_MODULOS_AREA` FOREIGN KEY (`FKAREA`) REFERENCES `areas` (`IDAREA`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `submodulos`
--
ALTER TABLE `submodulos`
  ADD CONSTRAINT `FK_SUBMODULOS_MODULO` FOREIGN KEY (`FKMODULO`) REFERENCES `modulos` (`IDMODULO`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `subsubmodulos`
--
ALTER TABLE `subsubmodulos`
  ADD CONSTRAINT `subsubmodulos_ibfk_1` FOREIGN KEY (`FK_SUBMODULO`) REFERENCES `submodulos` (`IDSUBMODULO`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
