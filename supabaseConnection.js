/**
 * Módulo de conexión y operaciones con Supabase - Tienda de Ropa
 * Proporciona funciones para realizar operaciones CRUD usando Ajax
 */

if (!window.SupabaseConnection) {
    class SupabaseConnection {
        constructor() {
            this.supabase = null;
            this.isInitialized = false;
            this.initializeConnection();
        }

        initializeConnection() {
            try {
                // Verificar configuración
                if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url || !window.SUPABASE_CONFIG.key) {
                    console.warn(' Config aún no disponible, se intentará más tarde');
                    return;
                }

                this.supabase = supabase.createClient(
                    window.SUPABASE_CONFIG.url,
                    window.SUPABASE_CONFIG.key,
                    window.SUPABASE_CONFIG.options || {}
                );

                this.isInitialized = true;
                console.log(' Conexión con Supabase inicializada correctamente');
                this.testConnection();
                
            } catch (error) {
                console.error(' Error al inicializar Supabase:', error);
                this.showNotification('Error de conexión: ' + error.message, 'error');
            }
        }

        async testConnection() {
            try {
                const { data, error } = await this.supabase.from('productos').select('count', { count: 'exact', head: true });
                
                if (error) {
                    console.warn(' Advertencia de conexión:', error.message);
                } else {
                    console.log(' Conexión a base de datos verificada');
                }
            } catch (error) {
                console.error(' Error al verificar conexión:', error);
            }
        }

        async getAllProductos() {
            try {
                if (!this.isInitialized) {
                    return { success: false, message: 'Supabase no inicializado', data: [] };
                }

                const { data, error, count } = await Promise.race([
                    this.supabase
                        .from('productos')
                        .select('*', { count: 'exact' })
                        .order('nombre', { ascending: true }),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout: tabla no accesible')), 5000)
                    )
                ]);

                if (error) {
                    console.error('Error al obtener productos:', error);
                    if (error.message.includes('relation') || error.message.includes('no existe')) {
                        return { 
                            success: false, 
                            message: '⚠️ Tabla "productos" no existe. Necesitas ejecutar el SQL en Supabase primero.', 
                            data: [] 
                        };
                    }
                    return { success: false, message: 'Error al cargar productos: ' + error.message, data: [] };
                }

                return { success: true, message: 'Productos cargados correctamente', data: data || [], count: count };

            } catch (error) {
                console.error('Error inesperado:', error);
                if (error.message.includes('Timeout')) {
                    return { 
                        success: false, 
                        message: '⚠️ La base de datos tarda demasiado en responder. Verifica que la tabla exista.', 
                        data: [] 
                    };
                }
                return { success: false, message: 'Error inesperado: ' + error.message, data: [] };
            }
        }

        async getProductoById(id) {
            try {
                if (!this.isInitialized) {
                    return { success: false, message: 'Supabase no inicializado', data: null };
                }

                const { data, error } = await this.supabase
                    .from('productos')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error al obtener producto:', error);
                    return { success: false, message: 'Error al cargar producto: ' + error.message, data: null };
                }

                return { success: true, message: 'Producto cargado correctamente', data: data };

            } catch (error) {
                console.error('Error inesperado:', error);
                return { success: false, message: 'Error inesperado: ' + error.message, data: null };
            }
        }

        async checkSkuExists(sku) {
            try {
                if (!this.isInitialized) {
                    return false;
                }

                const { data, error } = await this.supabase
                    .from('productos')
                    .select('id', { count: 'exact' })
                    .eq('sku', sku)
                    .limit(1);

                if (error) {
                    console.error('Error al verificar SKU:', error);
                    return false;
                }

                return data && data.length > 0;
            } catch (error) {
                console.error('Error inesperado en checkSkuExists:', error);
                return false;
            }
        }

        async createProducto(productoData) {
            try {
                if (!this.isInitialized) {
                    return { success: false, message: 'Supabase no inicializado' };
                }

                // Validación previa: verificar si SKU ya existe
                if (productoData.sku) {
                    const skuExists = await this.checkSkuExists(productoData.sku);
                    if (skuExists) {
                        return { 
                            success: false, 
                            message: `⚠️ El SKU "${productoData.sku}" ya existe en la base de datos. Usa un SKU único.` 
                        };
                    }
                }

                // Mostrar payload para depuración (temporal)
                console.debug('createProducto - payload:', productoData);

                const { data, error } = await this.supabase.from('productos').insert([productoData]);

                if (error) {
                    // Registrar información detallada del error para diagnóstico
                    console.error('Error al crear producto:', error);
                    console.error('Error detalles:', error.details || null, 'Hint:', error.hint || null, 'Code:', error.code || null);

                    // Detectar violación de unicidad (por ejemplo SKU duplicado)
                    let userMessage = 'Error al crear producto: ' + (error.message || 'Error desconocido');
                    // PostgreSQL unique_violation suele devolver el código '23505'
                    if (error.code === '23505' || (error.details && /duplicate/i.test(error.details))) {
                        userMessage = '⚠️ SKU duplicado. Asegúrate de usar un SKU único.';
                    }

                    return { success: false, message: userMessage, details: error };
                }

                return { success: true, message: 'Producto creado exitosamente', data: data };

            } catch (error) {
                console.error('Error inesperado:', error);
                return { success: false, message: 'Error inesperado: ' + error.message };
            }
        }

        async updateProducto(id, productoData) {
            try {
                if (!this.isInitialized) {
                    return { success: false, message: 'Supabase no inicializado' };
                }

                const { error } = await this.supabase
                    .from('productos')
                    .update(productoData)
                    .eq('id', id);

                if (error) {
                    console.error('Error al actualizar producto:', error);
                    return { success: false, message: 'Error al actualizar producto: ' + error.message };
                }

                return { success: true, message: 'Producto actualizado exitosamente' };

            } catch (error) {
                console.error('Error inesperado:', error);
                return { success: false, message: 'Error inesperado: ' + error.message };
            }
        }

        async deleteProducto(id) {
            try {
                if (!this.isInitialized) {
                    return { success: false, message: 'Supabase no inicializado' };
                }

                const { error } = await this.supabase.from('productos').delete().eq('id', id);

                if (error) {
                    console.error('Error al eliminar producto:', error);
                    return { success: false, message: 'Error al eliminar producto: ' + error.message };
                }

                return { success: true, message: 'Producto eliminado exitosamente' };

            } catch (error) {
                console.error('Error inesperado:', error);
                return { success: false, message: 'Error inesperado: ' + error.message };
            }
        }

        showNotification(message, type) {
            if (window.showNotification && typeof window.showNotification === 'function') {
                window.showNotification(message, type);
            }
        }
    }

    // Instanciar en DOMContentLoaded para asegurar que todo esté cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.supabaseConnection) {
                window.supabaseConnection = new SupabaseConnection();
            }
        });
    } else {
        if (!window.supabaseConnection) {
            window.supabaseConnection = new SupabaseConnection();
        }
    }
}
