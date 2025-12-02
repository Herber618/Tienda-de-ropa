# 🚀 GUÍA RÁPIDA - Tienda de Ropa

### Lo que es ahora ✅
- Base de datos: tabla `productos` con campos de ropa
- Formulario para agregar productos de tienda (nombre, categoría, talla, precio, stock, etc.)
- Tabla mostrando inventario de productos
- Sistema de control de stock (Estados: Disponible, Bajo, Agotado)

---

## 📦 Datos de Ejemplo

Para probar el sistema, puedes agregar estos productos:

### Producto 1
- **Nombre**: Camiseta Básica Negra
- **Categoría**: Camisetas
- **Talla**: M
- **Color**: Negro
- **Material**: Algodón 100%
- **SKU**: CAM-001
- **Precio**: $19.99
- **Stock**: 25
- **Descripción**: Camiseta básica versátil

### Producto 2
- **Nombre**: Pantalón Jeans Classic
- **Categoría**: Pantalones
- **Talla**: L
- **Color**: Azul Denim
- **Material**: Denim 100%
- **SKU**: PAN-002
- **Precio**: $49.99
- **Stock**: 15
- **Descripción**: Pantalón jeans clásico

### Producto 3
- **Nombre**: Vestido Flores Verano
- **Categoría**: Vestidos
- **Talla**: S
- **Color**: Multicolor
- **Material**: Lino 80%, Algodón 20%
- **SKU**: VES-003
- **Precio**: $35.99
- **Stock**: 8
- **Descripción**: Vestido ligero perfecto para verano

---

## 🎯 Funciones Principales

### 1️⃣ Agregar Producto
1. Llena el formulario en la sección "Agregar Nuevo Producto"
2. Todos los campos son obligatorios
3. Haz clic en "✅ Agregar Producto"
4. Verás una notificación confirmando la acción

### 2️⃣ Buscar Productos
- En la sección "Inventario de Productos"
- Escribe en la barra "🔍 Buscar productos..."
- El sistema filtra automáticamente mientras escribes
- Busca por: nombre, categoría, color o SKU

### 3️⃣ Editar Producto
1. En la tabla, haz clic en el botón ✏️ de la fila
2. Se abrirá un modal con los datos del producto
3. Modifica los campos que necesites
4. Haz clic en "💾 Guardar Cambios"

### 4️⃣ Eliminar Producto
1. En la tabla, haz clic en el botón 🗑️ de la fila
2. Se abrirá un modal pidiendo confirmación
3. Haz clic en "✓ Eliminar" para confirmar
4. El producto será eliminado del inventario

### 5️⃣ Ver Estados de Stock
Observa la columna "Stock" de la tabla:
- ✅ **Verde** (Stock OK): Más de 10 unidades disponibles
- ⚠️ **Naranja** (Stock Bajo): Menos de 10 unidades
- ❌ **Rojo** (Agotado): 0 unidades

---

## 📋 Campos de Producto Explicados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| **Nombre** | Texto | Nombre descriptivo del producto (mín. 3 caracteres) |
| **Categoría** | Selector | Tipo de prenda (Camisetas, Pantalones, Vestidos, etc.) |
| **Talla** | Selector | Tamaño disponible (XS, S, M, L, XL, XXL) |
| **Color** | Texto | Color del producto |
| **Material** | Texto | Composición (ej: Algodón 100%, Poliéster 50%) |
| **SKU** | Texto | Código único identificador (debe ser único) |
| **Precio** | Número | Precio unitario con 2 decimales ($) |
| **Stock** | Número | Cantidad disponible en inventario |
| **Descripción** | Texto | Información adicional del producto (opcional) |

---

## 💾 Archivos Modificados

```
✏️ index.html → Formularios y tabla actualizados
✏️ app.js → Lógica de tienda en lugar de personas
✏️ supabaseConnection.js → CRUD para productos
✏️ styles.css → Colores y estilos de tienda
✏️ database_setup_transactional.sql → Tabla y vistas para productos
✏️ README.md → Documentación actualizada
```

---

## ⚙️ Pasos Iniciales

1. **Asegúrate de tener Supabase configurado**
   - Copia tus credenciales en `config.js`

2. **Ejecuta los scripts SQL**
   - Copia el contenido de `database_setup_transactional.sql`
   - Pégalo en el editor SQL de Supabase
   - Ejecuta para crear la tabla y vistas

3. **Abre el proyecto**
   - Abre `index.html` en tu navegador
   - ¡Comienza a agregar productos!

---

## 🎨 Temas de Color

El sistema ahora usa una paleta roja/rosada asociada con moda:

- **Rojo Principal**: #ff6b6b (botones, headers)
- **Verde**: Estados de stock disponible
- **Naranja**: Stock bajo (advertencia)
- **Rojo Oscuro**: Stock agotado (crítico)

---

## ❓ Preguntas Frecuentes

**P: ¿Cómo cambio las categorías disponibles?**
R: Edita el selector `<select>` en `index.html` y `app.js`. Ejemplo:
```html
<option value="Mi Categoría">Mi Categoría</option>
```

**P: ¿Puedo agregar más campos?**
R: Sí, necesitas:
1. Agregar columna en SQL
2. Agregar campo en HTML
3. Incluirlo en `supabaseConnection.js`

**P: ¿Cómo funciona la búsqueda?**
R: Busca en: nombre, categoría, color y SKU (búsqueda case-insensitive)

**P: ¿Se pueden eliminar productos por accidente?**
R: No, hay confirmación antes de eliminar. Pero no hay papelera, ¡cuidado!

---

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari (navegadores modernos)
- ✅ Tablets y smartphones (responsive)
- ✅ Supabase PostgreSQL

---

## 🎉 ¡Listo para empezar!

Tu tienda de ropa está completamente configurada.

**Próximos pasos opcionales:**
- 📊 Agregar reportes de ventas
- 📸 Agregar galería de imágenes
- 🛒 Integrar carrito de compras
- 💳 Agregar sistema de pagos
- 👥 Sistema de clientes/usuarios

---

**¿Preguntas?** Revisa el código comentado o la documentación completa en `README.md` y `CAMBIOS.md`.

¡Buena suerte con tu tienda! 👔👗
