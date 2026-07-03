# Base de datos AWAY

## Cómo crear la base de datos

### Opción A — phpMyAdmin (XAMPP)

1. Abre phpMyAdmin en el navegador (suele ser `http://localhost/phpmyadmin`).
2. Ve a la pestaña **Importar**.
3. Selecciona el archivo `schema.sql` de esta carpeta.
4. Pulsa **Continuar**. Se creará la base de datos `away_game` con sus tablas y el admin por defecto.

### Opción B — Consola MySQL

```bash
mysql -u root -P 3307 -h 127.0.0.1 < database/schema.sql
```

Si tu XAMPP no tiene contraseña para root, omite `-p`. Si la tiene, añade `-p` y te la pedirá.

## Tablas creadas

| Tabla              | Uso                                              |
|--------------------|--------------------------------------------------|
| `administradores`  | Cuentas de administrador (login del panel)       |
| `usuarios`         | Suscriptores que quieren recibir novedades      |
| `mensajes`         | Mensajes enviados desde el panel de admin        |

## Admin por defecto

- Usuario: `admin`
- Contraseña: `admin123`

> El servidor Express también crea/actualiza este admin automáticamente al arrancar usando las variables `ADMIN_USER` y `ADMIN_PASS` del archivo `.env`. Puedes cambiarlas ahí cuando quieras.
