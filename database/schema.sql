-- ============================================================
--  AWAY - Base de datos del sitio del videojuego
--  Importar este archivo desde phpMyAdmin o ejecutar en MySQL
--  Compatible con XAMPP (puerto 3307 en este proyecto)
-- ============================================================

CREATE DATABASE IF NOT EXISTS away_game
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE away_game;

-- ------------------------------------------------------------
--  Tabla: administradores
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administradores (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario       VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre        VARCHAR(100),
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  Tabla: usuarios (suscriptores a novedades)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  acepta_novedades TINYINT(1) NOT NULL DEFAULT 1,
  creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuarios_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  Tabla: mensajes (enviados desde el panel admin)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT NULL,
  asunto      VARCHAR(200) NOT NULL,
  cuerpo      TEXT NOT NULL,
  enviado_por INT NOT NULL,
  leido       TINYINT(1) NOT NULL DEFAULT 0,
  creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mensajes_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_mensajes_admin FOREIGN KEY (enviado_por)
    REFERENCES administradores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  Datos semilla: administrador por defecto
--  usuario: admin   contraseña: admin123
--  El hash se genera con bcrypt (cost 10). Si lo prefieres,
--  el servidor Express creará/actualizará este admin en el
--  primer arranque usando las variables de .env, así que
--  puedes omitir este INSERT si el servidor se encarga.
-- ------------------------------------------------------------
INSERT IGNORE INTO administradores (usuario, password_hash, nombre)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador');
