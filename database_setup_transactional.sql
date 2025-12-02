-- ====================================-- ====================================

-- SCRIPTS DE CREACIÓN DE BASE DE DATOS-- SCRIPTS DE CREACIÓN DE BASE DE DATOS CON TRANSACCIONES

-- Sistema de Tienda de Ropa - Supabase PostgreSQL-- Sistema de Tienda de Ropa - Versión Robusta

-- ====================================-- Supabase PostgreSQL con Rollback Automático

-- ====================================

-- INICIO DE TRANSACCIÓN PRINCIPAL

-- Transacción principal
BEGIN;

-- -------------------------------------------------------
-- Función de logging (mínima). Si ya la tienes, ignora.
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION log_setup_progress(step_name TEXT, status TEXT DEFAULT 'SUCCESS')
RETURNS void AS $$
BEGIN
  IF status = 'SUCCESS' THEN
    RAISE NOTICE '✅ %: Completado exitosamente', step_name;
  ELSIF status = 'ERROR' THEN
    RAISE NOTICE '❌ %: Error detectado', step_name;
  ELSIF status = 'START' THEN
    RAISE NOTICE '🔄 %: Iniciando...', step_name;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Mensaje: inicio de creación de tabla principal
DO $$ BEGIN RAISE NOTICE '🔄 Creación de tabla principal: Iniciando...'; END $$;

-- -------------------------------------------------------
-- PASO 1: Crear tabla productos
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(nombre)) >= 3),
  categoria VARCHAR(50) NOT NULL,
  descripcion TEXT,
  talla VARCHAR(10) NOT NULL,
  color VARCHAR(50) NOT NULL,
  material VARCHAR(100),
  precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  sku VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE productos IS 'Tabla para almacenar inventario de productos de la tienda de ropa';
COMMENT ON COLUMN productos.id IS 'Identificador único auto-incremental';
COMMENT ON COLUMN productos.nombre IS 'Nombre del producto (mínimo 3 caracteres)';
COMMENT ON COLUMN productos.categoria IS 'Categoría del producto (Camisetas, Pantalones, Vestidos, etc)';
COMMENT ON COLUMN productos.descripcion IS 'Descripción detallada del producto';
COMMENT ON COLUMN productos.talla IS 'Talla disponible (XS, S, M, L, XL, XXL)';
COMMENT ON COLUMN productos.color IS 'Color del producto';
COMMENT ON COLUMN productos.material IS 'Material de fabricación';
COMMENT ON COLUMN productos.precio IS 'Precio unitario del producto';
COMMENT ON COLUMN productos.stock IS 'Cantidad disponible en inventario';
COMMENT ON COLUMN productos.sku IS 'Código único del producto';
COMMENT ON COLUMN productos.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN productos.updated_at IS 'Fecha y hora de última actualización';

DO $$ BEGIN RAISE NOTICE '✅ Creación de tabla principal: Completado'; END $$;

-- -------------------------------------------------------
-- PASO 2: Índices
-- -------------------------------------------------------
DO $$ BEGIN RAISE NOTICE '🔄 Creación de índices: Iniciando...'; END $$;

CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_talla ON productos(talla);
CREATE INDEX IF NOT EXISTS idx_productos_nombre_color ON productos(nombre, color);
CREATE INDEX IF NOT EXISTS idx_productos_created_at ON productos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock);
CREATE INDEX IF NOT EXISTS idx_productos_fulltext ON productos USING GIN (
  to_tsvector('spanish', nombre || ' ' || COALESCE(descripcion, '') || ' ' || categoria)
);

DO $$ BEGIN RAISE NOTICE '✅ Creación de índices: Completado'; END $$;

-- -------------------------------------------------------
-- PASO 3: Función para actualizar updated_at y trigger
-- -------------------------------------------------------
DO $$ BEGIN RAISE NOTICE '🔄 Creación de funciones y triggers: Iniciando...'; END $$;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_productos_updated_at ON productos;

CREATE TRIGGER trigger_update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$ BEGIN RAISE NOTICE '✅ Creación de funciones y triggers: Completado'; END $$;

-- -------------------------------------------------------
-- PASO 4: Vistas
-- -------------------------------------------------------
DO $$ BEGIN RAISE NOTICE '🔄 Creación de vistas: Iniciando...'; END $$;

CREATE OR REPLACE VIEW productos_disponibles AS
SELECT
  id, nombre, categoria, descripcion, talla, color, material,
  precio, stock, sku, created_at, updated_at
FROM productos
WHERE stock > 0
ORDER BY nombre, talla;

CREATE OR REPLACE VIEW productos_stats AS
SELECT
  COUNT(*) AS total_productos,
  COUNT(DISTINCT categoria) AS categorias,
  SUM(stock) AS stock_total,
  ROUND(AVG(precio)::NUMERIC, 2) AS precio_promedio,
  MAX(precio) AS precio_maximo,
  MIN(precio) AS precio_minimo,
  COUNT(*) FILTER (WHERE stock = 0) AS productos_agotados,
  COUNT(*) FILTER (WHERE stock < 10) AS productos_bajo_stock
FROM productos;

CREATE OR REPLACE VIEW productos_por_categoria AS
SELECT
  categoria,
  COUNT(*) AS cantidad_productos,
  SUM(stock) AS stock_total,
  ROUND(AVG(precio)::NUMERIC, 2) AS precio_promedio,
  MAX(precio) AS precio_maximo,
  MIN(precio) AS precio_minimo
FROM productos
GROUP BY categoria
ORDER BY categoria;

DO $$ BEGIN RAISE NOTICE '✅ Creación de vistas: Completado'; END $$;

-- -------------------------------------------------------
-- PASO 5: Funciones útiles (search_productos, validate_stock ejemplo)
-- -------------------------------------------------------
DO $$ BEGIN RAISE NOTICE '🔄 Creación de funciones útiles: Iniciando...'; END $$;

CREATE OR REPLACE FUNCTION search_productos(search_term TEXT)
RETURNS TABLE (
  id BIGINT,
  nombre VARCHAR,
  categoria VARCHAR,
  descripcion TEXT,
  talla VARCHAR,
  color VARCHAR,
  material VARCHAR,
  precio DECIMAL,
  stock INTEGER,
  sku VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $func$
BEGIN
  RETURN QUERY
  SELECT p.id, p.nombre, p.categoria, p.descripcion, p.talla, p.color,
         p.material, p.precio, p.stock, p.sku, p.created_at, p.updated_at
  FROM productos p
  WHERE
    p.nombre ILIKE '%' || search_term || '%' OR
    p.categoria ILIKE '%' || search_term || '%' OR
    p.sku ILIKE '%' || search_term || '%' OR
    p.color ILIKE '%' || search_term || '%' OR
    to_tsvector('spanish', p.nombre || ' ' || COALESCE(p.descripcion, '') || ' ' || p.categoria) @@ plainto_tsquery('spanish', search_term)
  ORDER BY p.nombre, p.talla;
END;
$func$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_stock(quantity INTEGER)
RETURNS BOOLEAN AS $func$
BEGIN
  RETURN quantity >= 0;
END;
$func$ LANGUAGE plpgsql;

DO $$ BEGIN RAISE NOTICE '✅ Creación de funciones útiles: Completado'; END $$;

-- -------------------------------------------------------
-- PASO 6: Sistema de auditoría (ejemplo para personas)
-- -------------------------------------------------------
DO $$ BEGIN RAISE NOTICE '🔄 Creación del sistema de auditoría: Iniciando...'; END $$;

CREATE TABLE IF NOT EXISTS personas_audit (
  audit_id BIGSERIAL PRIMARY KEY,
  persona_id BIGINT,
  operation_type VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT DEFAULT current_user,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_personas_audit_persona_id ON personas_audit(persona_id);
CREATE INDEX IF NOT EXISTS idx_personas_audit_operation ON personas_audit(operation_type);
CREATE INDEX IF NOT EXISTS idx_personas_audit_changed_at ON personas_audit(changed_at DESC);

CREATE OR REPLACE FUNCTION personas_audit_trigger()
RETURNS TRIGGER AS $func$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO personas_audit (persona_id, operation_type, old_data)
    VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO personas_audit (persona_id, operation_type, old_data, new_data)
    VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO personas_audit (persona_id, operation_type, new_data)
    VALUES (NEW.id, 'INSERT', to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$func$ LANGUAGE plpgsql;

-- El trigger se crea solo si la tabla personas existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'personas') THEN
    DROP TRIGGER IF EXISTS trigger_personas_audit ON personas;
    CREATE TRIGGER trigger_personas_audit
      AFTER INSERT OR UPDATE OR DELETE ON personas
      FOR EACH ROW EXECUTE FUNCTION personas_audit_trigger();
  END IF;
END$$;

DO $$ BEGIN RAISE NOTICE '✅ Creación del sistema de auditoría: Completado'; END $$;

-- -------------------------------------------------------
-- PASO 7: Datos de prueba (opcional) — insertar solo si existe la tabla productos
-- -------------------------------------------------------
DO $$ BEGIN RAISE NOTICE '🔄 Inserción de datos de prueba: Iniciando...'; END $$;

INSERT INTO productos (nombre, categoria, descripcion, talla, color, material, precio, stock, sku) VALUES
  ('Camiseta Básica', 'Camisetas', 'Camiseta básica de algodón 100%', 'M', 'Negro', 'Algodón 100%', 19.99, 25, 'CAM-001'),
  ('Camiseta Básica', 'Camisetas', 'Camiseta básica de algodón 100%', 'L', 'Blanco', 'Algodón 100%', 19.99, 30, 'CAM-002'),
  ('Pantalón Jeans', 'Pantalones', 'Pantalón jeans clásico', 'M', 'Azul Denim', 'Denim 100%', 49.99, 15, 'PAN-001'),
  ('Pantalón Chino', 'Pantalones', 'Pantalón chino casual', 'L', 'Gris', 'Algodón/Poliéster', 39.99, 8, 'PAN-002'),
  ('Vestido Flores', 'Vestidos', 'Vestido ligero para verano', 'S', 'Multicolor', 'Lino/Algodón', 35.99, 5, 'VES-001'),
  ('Chaqueta Denim', 'Chaquetas', 'Chaqueta de denim clásica', 'M', 'Azul', 'Denim 100%', 59.99, 12, 'CHA-001'),
  ('Zapatillas Deportivas', 'Zapatos', 'Zapatillas cómodas para deporte', '10', 'Blanco/Negro', 'Tela', 79.99, 3, 'ZAP-001'),
  ('Cinturón Piel', 'Accesorios', 'Cinturón de piel auténtica', 'M', 'Marrón', 'Piel', 29.99, 20, 'ACC-001');

DO $$ BEGIN RAISE NOTICE '✅ Inserción de datos de prueba: Completado'; END $$;

-- -------------------------------------------------------
-- Verificación final sencilla
-- -------------------------------------------------------
DO $$
DECLARE
  verification_errors TEXT[] := '{}';
  error_count INTEGER := 0;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'productos') THEN
    verification_errors := array_append(verification_errors, 'Tabla productos no existe');
    error_count := error_count + 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'productos' AND indexname = 'idx_productos_sku') THEN
    verification_errors := array_append(verification_errors, 'Índice idx_productos_sku no existe');
    error_count := error_count + 1;
  END IF;

  IF error_count > 0 THEN
    RAISE EXCEPTION E'Verificación fallida. Errores encontrados:\n%', array_to_string(verification_errors, E'\n');
  END IF;

  RAISE NOTICE '✅ Verificación final del sistema: OK';
END $$;

-- -------------------------------------------------------
-- Commit
-- -------------------------------------------------------
COMMIT;

-- Mensaje final
DO $$
BEGIN
  RAISE NOTICE '🎉 ¡INSTALACIÓN COMPLETADA EXITOSAMENTE!';
  RAISE NOTICE 'Tabla principal: productos';
  RAISE NOTICE 'Índices y vistas creados';
  RAISE NOTICE 'Triggers y funciones configurados';
END $$;