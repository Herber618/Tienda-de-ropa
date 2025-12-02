// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Supabase

const SUPABASE_CONFIG = {
    url: 'https://gwmrntblmllqcealjojx.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bXJudGJsbWxscWNlYWxqb2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTI4NTYsImV4cCI6MjA4MDI2ODg1Nn0.fCXE4PBclV0oEttfUaOas9HeiEEEsQJiPtO53RQhNQ8',
    
    // Configuración adicional
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        realtime: {
            params: {
                eventsPerSecond: 2
            }
        }
    }
};

// Configuración de la tabla
const TABLE_CONFIG = {
    tableName: 'productos', // Nombre de la tabla en Supabase
    
    // Campos de la tabla
    fields: {
        id: 'id',
        nombre: 'nombre',
        categoria: 'categoria',
        talla: 'talla',
        color: 'color',
        material: 'material',
        precio: 'precio',
        stock: 'stock',
        sku: 'sku',
        descripcion: 'descripcion',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};

// Configuración de la aplicación
const APP_CONFIG = {
    // Configuración de notificaciones
    notifications: {
        duration: 5000, // Duración en milisegundos
        showSuccess: true,
        showErrors: true,
        showInfo: true
    },
    
    // Configuración de la tabla
    table: {
        itemsPerPage: 10,
        enableSearch: true,
        enableSort: true
    },
    
    // Validaciones
    validation: {
        minNameLength: 2,
        maxNameLength: 50,
        cedulaPattern: /^[0-9]{7,10}$/,
        phonePattern: /^[0-9+\-\s()]+$/,
        emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
};

// Exportar configuraciones para uso global
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.TABLE_CONFIG = TABLE_CONFIG;
    window.APP_CONFIG = APP_CONFIG;
}