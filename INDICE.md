# 📑 ÍNDICE DEL PROYECTO - Tienda de Ropa

## 🎯 Empezar Aquí

👉 **Lee primero**: [`GUIA_RAPIDA.md`](./GUIA_RAPIDA.md) - Guía rápida en 5 minutos

👉 **Abre en navegador**: [`index.html`](./index.html) - Interfaz principal de la aplicación

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| **GUIA_RAPIDA.md** | ⭐ Guía de inicio rápido con ejemplos de productos |
| **README.md** | 📖 Documentación completa del proyecto |
| **CAMBIOS.md** | 📝 Detalle de todos los cambios realizados |
| **INDICE.md** | 📑 Este archivo - Índice del proyecto |

---

## 💻 Archivos del Proyecto

### Frontend (Interfaz de Usuario)

| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| **index.html** | Página principal con formularios y tabla | 13.7 KB |
| **styles.css** | Estilos, colores y diseño responsive | 10.2 KB |
| **app.js** | Lógica principal de la aplicación | 14.3 KB |

### Backend (Conexión Supabase)

| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| **supabaseConnection.js** | Módulo CRUD para operaciones con BD | 5.9 KB |
| **config.js** | Configuración de credenciales Supabase | 2.0 KB |

### Base de Datos

| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| **database_setup_transactional.sql** | Scripts para crear tabla y vistas | 17.6 KB |

### Dependencias

| Archivo | Descripción |
|---------|-------------|
| **package.json** | Gestión de dependencias (Supabase) |
| **package-lock.json** | Lock file de dependencias |

---

## 🏗️ Estructura de Carpetas

```
RegistroPersonas/
│
├── 📄 index.html                    ← Abre esto en navegador
├── 🎨 styles.css                   ← Estilos y diseño
├── 📜 app.js                        ← Lógica de la app
│
├── 🔌 supabaseConnection.js         ← Conexión a BD
├── ⚙️ config.js                     ← Credenciales Supabase
│
├── 🗄️ database_setup_transactional.sql  ← Scripts BD
│
├── 📦 package.json                  ← Dependencias
├── 📦 package-lock.json             ← Lock file
│
├── 📖 README.md                     ← Documentación completa
├── 📝 CAMBIOS.md                    ← Detalle de cambios
├── ⚡ GUIA_RAPIDA.md                ← Guía de inicio
└── 📑 INDICE.md                     ← Este archivo
```

---

## 🎯 Funciones Principales por Archivo

### `index.html` - Estructura HTML
```
✓ Formulario de entrada (9 campos)
✓ Tabla de productos
✓ Modal de edición
✓ Modal de confirmación de eliminación
✓ Contenedor de notificaciones
```

### `app.js` - Lógica de Aplicación
```
✓ TiendaApp.init() - Inicialización
✓ TiendaApp.handleFormSubmit() - Agregar producto
✓ TiendaApp.handleEditSubmit() - Actualizar producto
✓ TiendaApp.deleteProducto() - Eliminar producto
✓ TiendaApp.filterProductos() - Buscar/filtrar
✓ TiendaApp.renderTable() - Mostrar tabla
```

### `supabaseConnection.js` - Operaciones BD
```
✓ getAllProductos() - Obtener todos
✓ getProductoById() - Obtener uno
✓ createProducto() - Crear nuevo
✓ updateProducto() - Actualizar
✓ deleteProducto() - Eliminar
✓ testConnection() - Prueba conexión
```

### `styles.css` - Diseño
```
✓ Header con gradiente rojo
✓ Formularios responsive
✓ Tabla con estados de stock
✓ Modales animados
✓ Notificaciones deslizantes
✓ Responsive para móviles
```

---

## 📊 Campos de Producto

```
┌─────────────────────────────────────┐
│ TABLA: productos                    │
├─────────────────────────────────────┤
│ • id (PK)                           │
│ • nombre (VARCHAR 150)              │
│ • categoria (VARCHAR 50)            │
│ • descripcion (TEXT)                │
│ • talla (VARCHAR 10)                │
│ • color (VARCHAR 50)                │
│ • material (VARCHAR 100)            │
│ • precio (DECIMAL 10,2)             │
│ • stock (INTEGER)                   │
│ • sku (VARCHAR 50) UNIQUE           │
│ • created_at (TIMESTAMP)            │
│ • updated_at (TIMESTAMP)            │
└─────────────────────────────────────┘
```

---

## 🌈 Paleta de Colores

| Color | Uso | Código |
|-------|-----|--------|
| **Rojo Primario** | Botones y headers | `#ff6b6b` |
| **Verde** | Stock disponible | `#27ae60` |
| **Naranja** | Stock bajo | `#f39c12` |
| **Rojo Oscuro** | Stock agotado | `#c0392b` |
| **Gris** | Campos de entrada | `#95a5a6` |
| **Azul** | Botones info | `#3498db` |

---

## 🔄 Flujo de Datos

```
┌─────────────┐
│  index.html │  ← Usuario interactúa
└──────┬──────┘
       │
       ▼
   ┌────────┐
   │ app.js │  ← Procesa eventos
   └────┬───┘
        │
        ▼
┌──────────────────────┐
│ supabaseConnection   │  ← Realiza operaciones
└────────┬─────────────┘
         │
         ▼
   ┌──────────────┐
   │ Supabase API │  ← Base de datos
   └──────────────┘
```

---

## ⚙️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **HTML5** | - | Estructura |
| **CSS3** | - | Estilos |
| **JavaScript ES6+** | - | Lógica |
| **Supabase** | 2.x | Base de datos |
| **PostgreSQL** | - | Motor BD |

---

## 📱 Compatibilidad

| Navegador | Estado |
|-----------|--------|
| Chrome | ✅ Totalmente soportado |
| Firefox | ✅ Totalmente soportado |
| Safari | ✅ Totalmente soportado |
| Edge | ✅ Totalmente soportado |
| Mobile | ✅ Responsive |
| Tablet | ✅ Responsive |

---

## 🚀 Pasos de Configuración

### 1. Preparar Supabase
```bash
1. Crear cuenta en supabase.com
2. Crear nuevo proyecto PostgreSQL
3. Obtener URL y Key de API
4. Copiar credenciales en config.js
```

### 2. Configurar Base de Datos
```bash
1. Abrir editor SQL de Supabase
2. Copiar contenido de database_setup_transactional.sql
3. Ejecutar scripts
4. Verificar que se creó tabla "productos"
```

### 3. Ejecutar Aplicación
```bash
1. Abrir index.html en navegador
2. Agregar productos usando el formulario
3. ¡Empezar a usar!
```

---

## 💡 Consejos de Uso

### Búsqueda Efectiva
- 🔍 Busca por cualquier palabra (fuzzy search)
- 📌 Funciona en: nombre, categoría, color, SKU
- ⏱️ Búsqueda en tiempo real (sin retraso)

### Gestión de Stock
- ✅ Verde (>10) = Comprar más pronto
- ⚠️ Naranja (<10) = Stock bajo, urgente
- ❌ Rojo (=0) = Producto agotado

### Mejor Práctica
- 🔐 Usa SKU único para cada variante
- 📸 Talla + Color + Precio = SKU único
- 💾 Guarda cambios antes de cerrar

---

## ❓ FAQ - Preguntas Frecuentes

**P: ¿Dónde está el archivo config.js con mis credenciales?**
R: En la raíz del proyecto. Reemplaza los valores de SUPABASE_URL y SUPABASE_KEY con tus credenciales.

**P: ¿Cómo cambio el tema de colores?**
R: Edita las variables de color en `styles.css`. Busca `#ff6b6b` (rojo principal).

**P: ¿Puedo agregar más campos a los productos?**
R: Sí, necesitas actualizar: SQL, HTML, app.js y supabaseConnection.js

**P: ¿Hay límite de productos?**
R: No, Supabase soporta millones de registros.

**P: ¿Cómo hago backup de los datos?**
R: Descarga datos desde Supabase o usa el panel de respaldo.

---

## 🆘 Solución de Problemas

| Problema | Solución |
|----------|----------|
| **No se cargan productos** | Verifica credenciales en config.js y que la tabla exista |
| **Error al agregar producto** | Verifica que todos los campos requeridos estén llenos |
| **SKU duplicado** | El SKU debe ser único; cambia el código |
| **Búsqueda no funciona** | Recarga la página y vuelve a intentar |
| **Modal no se abre** | Verifica consola del navegador (F12) para errores |

---

## 📞 Soporte

Para más información:
- 📖 [Documentación Supabase](https://supabase.com/docs)
- 🎓 [Tutoriales JavaScript](https://javascript.info)
- 💬 [Stack Overflow](https://stackoverflow.com)

---

## ✅ Checklist de Instalación

- [ ] Credenciales de Supabase en `config.js`
- [ ] Scripts SQL ejecutados en Supabase
- [ ] Tabla `productos` creada verificada
- [ ] `index.html` abierto en navegador
- [ ] Primer producto agregado exitosamente
- [ ] Búsqueda funciona
- [ ] Edición funciona
- [ ] Eliminación funciona

---

## 🎉 ¡Listo!

Tu tienda de ropa está completamente configurada y lista para usar.

**Siguiente paso**: Abre `index.html` en tu navegador y ¡comienza a gestionar tu inventario!

---

**Última actualización**: 18 de Noviembre de 2025
**Versión**: 1.0 - Sistema de Tienda de Ropa
**Estado**: ✅ Producción
