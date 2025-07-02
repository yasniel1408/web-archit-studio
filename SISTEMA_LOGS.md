# 🐛 Sistema de Logs Profesional - ArchitStudio

## 📋 Resumen

Se ha implementado un **sistema de logs profesional** que permite:
- Logs ocultos por defecto
- Switch elegante en el navbar para mostrar/ocultar
- Panel de debug avanzado con filtros
- Captura automática de errores del sistema
- Logs categorizados por nivel y origen

## 🎯 Características Principales

### **1. Switch en el Navbar** 🔄
- **Ubicación**: Esquina derecha del toolbar
- **Indicadores visuales**:
  - 🔵 Azul cuando está activo
  - 🔴 Rojo cuando hay errores nuevos
  - ⚪ Gris cuando está inactivo
  - Badge con contador de logs
  - Pulsación animada para errores críticos

### **2. Panel de Debug Avanzado** 📊
- **Posición**: Bottom-right, flotante
- **Funciones**:
  - Expandir/contraer
  - Filtros por nivel (error, warn, info, debug)
  - Búsqueda en tiempo real
  - Auto-scroll inteligente
  - Copiar logs al clipboard
  - Limpiar historial
  - Configurar máximo de logs

### **3. Niveles de Log** 📈
- **Error** 🔴: Errores críticos y problemas
- **Warning** 🟡: Advertencias importantes
- **Info** 🔵: Información general del sistema
- **Debug** ⚪: Detalles técnicos para desarrollo

### **4. Captura Automática** 🕸️
- Errores no capturados de JavaScript
- Promesas rechazadas no manejadas
- Errores del sistema de la aplicación
- Contexto adicional para debugging

## 🚀 Cómo Usar

### **Activar/Desactivar Logs**
1. Busca el botón 🐛 en la barra de herramientas
2. Haz clic para mostrar/ocultar el panel
3. El botón cambia de color según el estado

### **Navegación en el Panel**
```
🔍 Filtros: Nivel y búsqueda de texto
📋 Copiar: Exportar logs al clipboard  
🗑️ Limpiar: Borrar historial
↕️ Expandir: Cambiar tamaño del panel
❌ Cerrar: Ocultar panel
```

### **Para Desarrolladores**

#### **Uso Básico en Componentes**
```typescript
import { useLogger } from '@/app/contexts/debug-context';

const MyComponent = () => {
  const logger = useLogger('MyComponent');

  const handleAction = () => {
    logger.info('Acción ejecutada');
    logger.debug('Detalles técnicos', { data: 'ejemplo' });
    
    try {
      // código que puede fallar
    } catch (error) {
      logger.error('Error en la acción', { error: error.message });
    }
  };
};
```

#### **Logging con Contexto**
```typescript
// Log simple
logger.info('Usuario logueado');

// Log con contexto
logger.debug('Datos cargados', { 
  count: items.length, 
  source: 'api',
  timestamp: Date.now() 
});

// Log de error con detalles
logger.error('Error de red', {
  url: '/api/users',
  status: 500,
  retries: 3
});
```

#### **Hook de Logger Rápido**
```typescript
import { useLogger } from '@/app/contexts/debug-context';

// Con fuente específica
const logger = useLogger('DiagramCanvas');

// Métodos disponibles
logger.info('Mensaje informativo');
logger.warn('Advertencia importante');  
logger.error('Error crítico');
logger.debug('Detalles de desarrollo');
```

## 🎨 Estados Visuales del Switch

### **Estado Normal**
```
🐛 Debug [⚪]
```
- Gris claro
- Indicador inactivo
- Sin notificaciones

### **Estado Activo**
```
🐛 Debug ON [🟢] (12)
```
- Azul brillante
- Indicador pulsante
- Badge con contador

### **Estado de Error**
```
🐛 Debug [🔴●]
```
- Rojo intermitente
- Indicador de alerta
- Pulsación para llamar atención

## 📱 Funcionalidades del Panel

### **Filtros Avanzados**
- **Nivel**: Todos, Error, Warning, Info, Debug
- **Búsqueda**: Texto en mensaje, fuente o contexto
- **Límite**: Máximo de logs a mantener (10-1000)
- **Auto-scroll**: Seguimiento automático de nuevos logs

### **Interacciones**
- **Click en log**: Expandir contexto si está disponible
- **Scroll manual**: Desactiva auto-scroll temporalmente
- **Filtro activo**: Resalta logs coincidentes
- **Hover en botones**: Tooltips informativos

### **Accesibilidad**
- Navegación por teclado
- Lectores de pantalla compatibles
- Alto contraste en colores
- Textos descriptivos

## ⚡ Performance

### **Optimizaciones**
- Límite automático de logs (100 por defecto)
- Lazy rendering de logs largos
- Debounce en búsqueda (300ms)
- Virtual scrolling para grandes volúmenes

### **Memoria**
- Auto-limpieza de logs antiguos
- Compresión de contextos grandes
- Garbage collection inteligente

## 🔧 Configuración

### **Variables de Entorno**
```bash
# Habilitar panel de debug en producción
NEXT_PUBLIC_DEBUG_PANEL=true

# Nivel de log por defecto
NEXT_PUBLIC_LOG_LEVEL=info

# Máximo de logs a mantener
NEXT_PUBLIC_MAX_LOGS=100
```

### **Configuración en Código**
```typescript
// En lib/config.ts
export const config = {
  features: {
    debugPanel: process.env.NEXT_PUBLIC_DEBUG_PANEL === 'true',
  },
  
  debug: {
    maxLogs: parseInt(process.env.NEXT_PUBLIC_MAX_LOGS || '100'),
    defaultLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'all',
  }
};
```

## 🎯 Casos de Uso

### **Durante Desarrollo**
- Depurar flujos complejos
- Monitorear performance
- Rastrear eventos de usuario
- Verificar estados de componentes

### **En Staging**
- Capturar errores de integración
- Monitorear comportamiento
- Validar flujos completos
- Detectar problemas tempranos

### **En Producción** (opcional)
- Logging minimal para admins
- Captura de errores críticos
- Telemetría básica
- Soporte técnico

## 🛡️ Seguridad y Privacidad

### **Datos Sensibles**
- ❌ **No logear**: Contraseñas, tokens, PII
- ✅ **Sí logear**: IDs, tipos, estados, métricas

### **Filtrado Automático**
```typescript
// Ejemplo de logging seguro
logger.debug('Usuario autenticado', {
  userId: user.id, // ✅ Safe
  role: user.role, // ✅ Safe
  // password: user.password ❌ NEVER
});
```

### **Configuración por Ambiente**
- **Development**: Todos los logs visibles
- **Staging**: Logs filtrados por relevancia  
- **Production**: Solo errores críticos

## 📈 Monitoreo y Métricas

### **KPIs del Sistema**
- Número de errores por sesión
- Tiempo entre logs críticos
- Performance de componentes
- Patrones de uso

### **Integración Futura**
- Sentry para error tracking
- Analytics para métricas
- APM para performance
- Alertas automáticas

## 🎉 Resultado Final

El sistema de logs ahora es:

- **🔒 Discreto**: Oculto por defecto
- **🎨 Elegante**: Diseño profesional
- **⚡ Rápido**: Performance optimizada
- **🧭 Útil**: Debugging efectivo
- **📱 Responsive**: Funciona en todos los dispositivos
- **♿ Accesible**: Cumple estándares WCAG
- **🔧 Configurable**: Adaptable a necesidades

¡Ahora puedes debuggear tu aplicación como un profesional! 🚀 