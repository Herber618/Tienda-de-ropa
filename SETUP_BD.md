# 🔧 CÓMO CONFIGURAR LA BASE DE DATOS

## ❌ Error que recibiste:
```
Failed to run sql query: ERROR: P0001: Error al crear sistema de auditoría: 
relation "personas" does not exist
```

## ✅ Problema Identificado:
El archivo SQL anterior contenía código antiguo del sistema de "Registro de Personas" y hacía referencia a una tabla que no existía (`personas`).

## ✅ Solución Implementada:
Se creó un nuevo archivo SQL completamente limpio que SOLO contiene código para la tabla `productos`.

---

## 📋 PASOS PARA CONFIGURAR LA BASE DE DATOS

### 1. Accede a Supabase
```
Dirección: https://app.supabase.com
Inicia sesión con tu cuenta
```

### 2. Abre el Editor SQL
```
1. Ve a tu proyecto
2. Lado izquierdo → "SQL Editor"
3. Haz clic en "New query"
```

### 3. Copia el Script SQL
```
1. Abre el archivo: database_setup_transactional.sql
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
```

### 4. Pega en Supabase
```
1. En el editor SQL de Supabase, pega (Ctrl+V)
2. El script aparecerá en el editor
```

### 5. Ejecuta el Script
```
1. Haz clic en el botón "Run" (triangular, arriba a la derecha)
2. O presiona: Ctrl+Enter
3. Espera a que termine (verás un mensaje de éxito)
```

### 6. Verifica la Creación
```
1. Ve a "Table Editor" en la barra lateral izquierda
2. Deberías ver la tabla "productos" en la lista
3. Abre "productos" y verifica los 8 productos de ejemplo
```

---

## 📦 QUÉ CREA EL SCRIPT

### Tabla: `productos`
```sql
CREATE TABLE productos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion TEXT,
    talla VARCHAR(10) NOT NULL,
    color VARCHAR(50) NOT NULL,
    material VARCHAR(100),
    precio DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Campos Creados
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGINT | Identificador único (PK) |
| `nombre` | VARCHAR 150 | Nombre del producto |
| `categoria` | VARCHAR 50 | Categoría (Camisetas, Pantalones, etc.) |
| `descripcion` | TEXT | Descripción detallada (opcional) |
| `talla` | VARCHAR 10 | Talla (XS, S, M, L, XL, XXL) |
| `color` | VARCHAR 50 | Color del producto |
| `material` | VARCHAR 100 | Material (Algodón, Denim, etc.) |
| `precio` | DECIMAL 10,2 | Precio unitario |
| `stock` | INTEGER | Cantidad disponible |
| `sku` | VARCHAR 50 | Código único (UNIQUE) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

### Índices Creados (7)
- `idx_productos_sku` - Para búsquedas rápidas por SKU
- `idx_productos_categoria` - Para filtrar por categoría
- `idx_productos_talla` - Para filtrar por talla
- `idx_productos_nombre_color` - Búsqueda por nombre y color
- `idx_productos_created_at` - Ordenamiento por fecha
- `idx_productos_stock` - Filtros de stock
- `idx_productos_fulltext` - Búsqueda de texto completo

### Triggers Creados (1)
- `trigger_update_productos_updated_at` - Actualiza automáticamente `updated_at` en cada cambio

### Vistas Creadas (3)
1. **`productos_disponibles`** - Muestra solo productos con stock > 0
2. **`productos_stats`** - Estadísticas del inventario (total, promedio de precio, agotados, etc.)
3. **`productos_por_categoria`** - Productos agrupados por categoría

### Funciones Creadas (2)
1. **`update_updated_at_column()`** - Función para el trigger
2. **`search_productos()`** - Búsqueda avanzada de productos

### Datos de Ejemplo Insertados (8)
Se incluyen 8 productos de ejemplo:
- 2 Camisetas
- 2 Pantalones  
- 1 Vestido
- 1 Chaqueta
- 1 Zapatilla
- 1 Cinturón

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de ejecutar el script, verifica:

- [ ] No hay errores en la consola SQL
- [ ] La tabla `productos` aparece en "Table Editor"
- [ ] Puedes ver los 8 productos de ejemplo
- [ ] Los índices están creados (verifica en detalles de tabla)
- [ ] La columna `updated_at` existe
- [ ] Las vistas `productos_disponibles`, `productos_stats`, `productos_por_categoria` existen

---

## 🐛 Si reciben errores:

### Error: "relation already exists"
```
Solución: La tabla ya existe. Usa:
DROP TABLE IF EXISTS productos CASCADE;
Luego vuelve a ejecutar el script.
```

### Error: "duplicate key value"
```
Solución: SKU duplicado. Verifica los datos de ejemplo.
Puedes cambiar el SKU de uno de los productos de ejemplo.
```

### Error: "permission denied"
```
Solución: Verifica que tienes permisos en Supabase.
Usa una cuenta de administrador del proyecto.
```

---

## 🚀 PRÓXIMO PASO

Una vez que la tabla esté creada:

1. Abre `index.html` en tu navegador
2. Verifica que `config.js` tiene tus credenciales de Supabase
3. ¡La aplicación debería cargar los productos automáticamente!

---

## 📞 Soporte

Si sigue habiendo problemas:

1. Verifica que copias TODO el contenido del SQL (incluyendo BEGIN; y COMMIT;)
2. Asegúrate de pegar en el editor correcto de Supabase
3. Verifica que no hay caracteres especiales dañados
4. Intenta ejecutar línea por línea para identificar cuál falla

¡Tu base de datos estará lista en minutos! ⏱️
