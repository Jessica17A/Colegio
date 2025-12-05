-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2025 a las 19:34:14
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
CREATE DATABASE IF NOT EXISTS `prueba` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `prueba`;

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
(1, 'CONFIG3', 'Configuración', 1),
(2, 'i9ZmcFparQ', 'Administrativo', 1);

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
  `VISTA_MODULO` varchar(100) NOT NULL,
  `ESTADO` tinyint(1) DEFAULT 1,
  `INDICADOR` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`IDMODULO`, `FKAREA`, `CODIGO_MODULO`, `NOMBRE_MODULO`, `ICONO_MODULO`, `VISTA_MODULO`, `ESTADO`, `INDICADOR`) VALUES
(1, 1, 'conf', 'Administración', 'fa fa-sitemap', '', 1, 1),
(2, 2, 'f8OiyhKAwk', 'Gestiones de Pago', 'fa fa-credit-card', 'ADMINISTRATIVO_GESTIONES_DE_PAGO', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE `personal` (
  `IDPERSONAL` int(11) NOT NULL,
  `NOMBRES` varchar(100) NOT NULL,
  `APELLIDOS` varchar(100) NOT NULL,
  `DPI` varchar(20) DEFAULT NULL,
  `TELEFONO` varchar(15) DEFAULT NULL,
  `DIRECCION` text DEFAULT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_dates_person`
--

CREATE TABLE `seg_dates_person` (
  `ID_SEG_DATES_PERSON` int(11) NOT NULL,
  `NOMBRE` varchar(100) NOT NULL,
  `APELLIDO` varchar(100) NOT NULL,
  `DPI` varchar(20) DEFAULT NULL,
  `CARGO` varchar(100) DEFAULT NULL,
  `FECHA_REGISTRO` timestamp NOT NULL DEFAULT current_timestamp(),
  `ESTADO` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seg_dates_person`
--

INSERT INTO `seg_dates_person` (`ID_SEG_DATES_PERSON`, `NOMBRE`, `APELLIDO`, `DPI`, `CARGO`, `FECHA_REGISTRO`, `ESTADO`) VALUES
(1, 'Ana María', 'González López', '1234567890101', 'Analista de Datos', '2025-08-28 20:49:55', 1),
(2, 'Luis Fernando', 'Pérez Mejía', '2345678901212', 'Coordinador de Sistemas', '2025-08-28 20:49:55', 1),
(3, 'Carlos Eduardo', 'Ramírez Soto', '3456789012323', 'Técnico en Redes', '2025-08-28 20:49:55', 1),
(4, 'María Fernanda', 'Díaz Hernández', '4567890123434', 'Administrativa', '2025-08-28 20:49:55', 0),
(5, 'Jorge Alejandro', 'Castro Ruiz', '5678901234545', 'Desarrollador Backend', '2025-08-28 20:49:55', 0),
(6, 'Daniela Sofía', 'Martínez Velásquez', '6789012345656', 'Diseñadora UX/UI', '2025-08-28 20:49:55', 0),
(7, 'Kevin Andrés', 'López Cabrera', '7890123456767', 'Asistente de Proyectos', '2025-08-28 20:49:55', 0),
(8, 'Valeria Isabel', 'Morales Guzmán', '8901234567878', 'Soporte Técnico', '2025-08-28 20:49:55', 0),
(9, 'Pedro José', 'Navarro Díaz', '9012345678989', 'DevOps Junior', '2025-08-28 20:49:55', 0),
(10, 'Andrea Paola', 'Reyes Fuentes', '0123456789090', 'Tester QA', '2025-08-28 20:49:55', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_usuarios`
--

CREATE TABLE `seg_usuarios` (
  `ID_USUARIO` int(11) NOT NULL,
  `ID_PERSONA` int(11) NOT NULL,
  `USUARIO` varchar(50) NOT NULL,
  `CONTRASENA` varchar(255) NOT NULL,
  `ESTADO` varchar(4) DEFAULT '1',
  `FECHA_REGISTRO` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seg_usuarios`
--

INSERT INTO `seg_usuarios` (`ID_USUARIO`, `ID_PERSONA`, `USUARIO`, `CONTRASENA`, `ESTADO`, `FECHA_REGISTRO`) VALUES
(1, 1, 'agonzálezlópez', '$2y$10$7LNin4oTxaZqzrSaYgQwquv743cv.aOHwyL/V3q8JGGIJE1Gp6TJy', '1', '2025-08-28 20:57:53'),
(2, 3, 'cramirez', '$2y$10$B.Xh2pxXy6PydzO0V9XLc.K9fP51jRX.9uXXo5qbVC3dqS5yn2Olm', '0', '2025-08-28 21:13:53'),
(3, 10, 'areyes', '$2y$10$mEhLXNcfVeF.ejVmA6tE7eB6pYLs0HLBd/b6dLAX3AKKE/cxaHQ6a', '1', '2025-12-02 14:31:59'),
(4, 2, 'lperez', '$2y$10$IHg/AXJGojVnqSic994.nOq2nEYj2zKkYLgCS0Cg2v0Dnsx.C48FK', '1', '2025-12-02 14:41:16'),
(5, 8, 'vmorales', '$2y$10$xr.DDgGWdGH6AAHK11.xLe2RT3o1GfX3Nmqhe33WVvf0IZhcSvEIC', '1', '2025-12-02 16:19:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_usuario_modulo`
--

CREATE TABLE `seg_usuario_modulo` (
  `ID_USUARIO_MODULO` int(11) NOT NULL,
  `FK_USUARIO` int(11) NOT NULL,
  `FK_MODULO` int(11) NOT NULL,
  `ESTADO` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seg_usuario_modulo`
--

INSERT INTO `seg_usuario_modulo` (`ID_USUARIO_MODULO`, `FK_USUARIO`, `FK_MODULO`, `ESTADO`) VALUES
(2, 2, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_usuario_submodulo`
--

CREATE TABLE `seg_usuario_submodulo` (
  `ID_USUARIO_SUBMODULO` int(11) NOT NULL,
  `FK_USUARIO` int(11) NOT NULL,
  `FK_SUBMODULO` int(11) NOT NULL,
  `ESTADO` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seg_usuario_submodulo`
--

INSERT INTO `seg_usuario_submodulo` (`ID_USUARIO_SUBMODULO`, `FK_USUARIO`, `FK_SUBMODULO`, `ESTADO`) VALUES
(1, 4, 3, 1);

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
  `ICONO` varchar(100) NOT NULL,
  `ESTADO` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `submodulos`
--

INSERT INTO `submodulos` (`IDSUBMODULO`, `FKMODULO`, `CODIGO_SUBMODULO`, `NOMBRE_SUBMODULO`, `VISTA_SUBMODULO`, `ICONO`, `ESTADO`) VALUES
(1, 1, 'Areas', 'Areas', 'Config_Areas', 'fa fa-sitemap', 1),
(2, 1, 'OoGlN96gSc', 'Usuarios', 'CONFIGURACIN_USUARIOS', 'fa fa-user', 1),
(3, 1, 'x8t0CVlDAX', 'Accesos', 'CONFIGURACIN_ACCESOS', 'fa fa-universal-access', 1);

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
-- Indices de la tabla `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`IDPERSONAL`);

--
-- Indices de la tabla `seg_dates_person`
--
ALTER TABLE `seg_dates_person`
  ADD PRIMARY KEY (`ID_SEG_DATES_PERSON`);

--
-- Indices de la tabla `seg_usuarios`
--
ALTER TABLE `seg_usuarios`
  ADD PRIMARY KEY (`ID_USUARIO`),
  ADD UNIQUE KEY `USUARIO` (`USUARIO`),
  ADD KEY `ID_PERSONA` (`ID_PERSONA`);

--
-- Indices de la tabla `seg_usuario_modulo`
--
ALTER TABLE `seg_usuario_modulo`
  ADD PRIMARY KEY (`ID_USUARIO_MODULO`),
  ADD KEY `FK_UM_Usuario` (`FK_USUARIO`),
  ADD KEY `FK_UM_Modulo` (`FK_MODULO`);

--
-- Indices de la tabla `seg_usuario_submodulo`
--
ALTER TABLE `seg_usuario_submodulo`
  ADD PRIMARY KEY (`ID_USUARIO_SUBMODULO`),
  ADD KEY `FK_USM_Usuario` (`FK_USUARIO`),
  ADD KEY `FK_USM_Submodulo` (`FK_SUBMODULO`);

--
-- Indices de la tabla `submodulos`
--
ALTER TABLE `submodulos`
  ADD PRIMARY KEY (`IDSUBMODULO`),
  ADD UNIQUE KEY `CODIGO_SUBMODULO` (`CODIGO_SUBMODULO`),
  ADD KEY `FK_SUBMODULOS_MODULO` (`FKMODULO`);

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
  MODIFY `IDAREA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT de la tabla `personal`
--
ALTER TABLE `personal`
  MODIFY `IDPERSONAL` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `seg_dates_person`
--
ALTER TABLE `seg_dates_person`
  MODIFY `ID_SEG_DATES_PERSON` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `seg_usuarios`
--
ALTER TABLE `seg_usuarios`
  MODIFY `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `seg_usuario_modulo`
--
ALTER TABLE `seg_usuario_modulo`
  MODIFY `ID_USUARIO_MODULO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `seg_usuario_submodulo`
--
ALTER TABLE `seg_usuario_submodulo`
  MODIFY `ID_USUARIO_SUBMODULO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `submodulos`
--
ALTER TABLE `submodulos`
  MODIFY `IDSUBMODULO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD CONSTRAINT `FK_MODULOS_AREA` FOREIGN KEY (`FKAREA`) REFERENCES `areas` (`IDAREA`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `seg_usuarios`
--
ALTER TABLE `seg_usuarios`
  ADD CONSTRAINT `seg_usuarios_ibfk_1` FOREIGN KEY (`ID_PERSONA`) REFERENCES `seg_dates_person` (`ID_SEG_DATES_PERSON`);

--
-- Filtros para la tabla `seg_usuario_modulo`
--
ALTER TABLE `seg_usuario_modulo`
  ADD CONSTRAINT `FK_UM_Modulo` FOREIGN KEY (`FK_MODULO`) REFERENCES `modulos` (`IDMODULO`),
  ADD CONSTRAINT `FK_UM_Usuario` FOREIGN KEY (`FK_USUARIO`) REFERENCES `seg_usuarios` (`ID_USUARIO`);

--
-- Filtros para la tabla `seg_usuario_submodulo`
--
ALTER TABLE `seg_usuario_submodulo`
  ADD CONSTRAINT `FK_USM_Submodulo` FOREIGN KEY (`FK_SUBMODULO`) REFERENCES `submodulos` (`IDSUBMODULO`),
  ADD CONSTRAINT `FK_USM_Usuario` FOREIGN KEY (`FK_USUARIO`) REFERENCES `seg_usuarios` (`ID_USUARIO`);

--
-- Filtros para la tabla `submodulos`
--
ALTER TABLE `submodulos`
  ADD CONSTRAINT `FK_SUBMODULOS_MODULO` FOREIGN KEY (`FKMODULO`) REFERENCES `modulos` (`IDMODULO`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
