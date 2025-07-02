# 📢 Configuración de Anuncios Google AdSense

Esta guía te ayudará a configurar y monetizar tu aplicación ArchitStudio con anuncios de Google AdSense.

## 🚀 Configuración Inicial

### 1. Crear Cuenta de Google AdSense

1. Ve a [Google AdSense](https://www.google.com/adsense/)
2. Crea una cuenta o inicia sesión
3. Agrega tu sitio web
4. Espera la aprobación (puede tomar días o semanas)

### 2. Obtener el Publisher ID

Una vez aprobado:
1. Ve a tu panel de AdSense
2. En "Sitios" → "Configuración" encontrarás tu Publisher ID
3. Será algo como: `ca-pub-1234567890123456`
4. Solo necesitas la parte numérica: `1234567890123456`

### 3. Crear Unidades de Anuncio

1. En AdSense ve a "Anuncios" → "Por unidad de anuncio"
2. Crea anuncios:
   - **Anuncio Principal**: Formato "Display adaptable" 300x250 o mayor
   - **Anuncio Banner**: Formato "Banner" 728x90 o 320x50

3. Copia los **Ad Slot IDs** de cada anuncio creado

## ⚙️ Configuración en la Aplicación

### 1. Variables de Entorno

Crea o actualiza tu archivo `.env.local`:

```bash
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_ID=1234567890123456
NEXT_PUBLIC_ADS_ENABLED=true
```

### 2. Actualizar IDs en el Código

En `app/components/organisms/side-panel/side-panel.tsx`:

```tsx
// Reemplaza estos IDs con los reales de AdSense
<GoogleAds
  adSlot="1234567890" // ← Tu Ad Slot ID real del primer anuncio
  adFormat="auto"
  // ...
/>

<GoogleAds
  adSlot="0987654321" // ← Tu Ad Slot ID real del segundo anuncio
  adFormat="banner"
  // ...
/>
```

## 🎯 Tipos de Anuncios Disponibles

### Formatos de Anuncio

- **`auto`**: Tamaño automático (recomendado)
- **`rectangle`**: Formato rectangular
- **`banner`**: Banner horizontal
- **`fluid`**: Responsive fluido

### Configuración Avanzada

```tsx
<GoogleAds
  adSlot="1234567890"
  adFormat="auto"
  adLayout="in-article"
  adLayoutKey="-fb+5w+4e-db+86"
  className="custom-ad-style"
  style={{ minHeight: '250px' }}
  fallbackText="Mensaje personalizado cuando no hay anuncios"
/>
```

## 🛠️ Componente GoogleAds

### Props Disponibles

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `adSlot` | string | ✅ | ID del slot del anuncio |
| `adFormat` | string | ❌ | Formato del anuncio |
| `adLayout` | string | ❌ | Layout para anuncios responsive |
| `adLayoutKey` | string | ❌ | Clave de layout |
| `className` | string | ❌ | Clases CSS personalizadas |
| `style` | object | ❌ | Estilos inline |
| `fallbackText` | string | ❌ | Texto cuando no hay anuncios |

### Ejemplo de Uso

```tsx
import { GoogleAds } from '@/app/components/atoms/google-ads/google-ads';

function MiComponente() {
  return (
    <GoogleAds
      adSlot="1234567890"
      adFormat="auto"
      className="my-4"
      style={{ minHeight: '200px' }}
      fallbackText="¡Apoya desactivando tu bloqueador de anuncios!"
    />
  );
}
```

## 🎨 Personalización de Estilos

### CSS para Anuncios

```css
/* styles/globals.css */
.google-ads-container {
  @apply rounded-lg overflow-hidden shadow-sm;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.google-ads-container .adsbygoogle {
  @apply rounded-lg;
}

/* Responsive */
@media (max-width: 640px) {
  .google-ads-container {
    @apply mx-2;
  }
}
```

## 📱 Responsive Design

Los anuncios están configurados para ser responsive:

```tsx
<GoogleAds
  adSlot="1234567890"
  adFormat="auto"
  className="w-full max-w-sm mx-auto sm:max-w-md lg:max-w-lg"
  style={{ 
    minHeight: '200px',
    maxWidth: '100%' 
  }}
/>
```

## 🚫 Bloqueadores de Anuncios

### Manejo de Ad Blockers

El componente detecta automáticamente cuando los anuncios están bloqueados y muestra un mensaje amigable:

```tsx
<GoogleAds
  adSlot="1234567890"
  fallbackText="🚀 Considera desactivar tu bloqueador para apoyar este proyecto gratuito"
/>
```

### Personalizar Mensaje

```tsx
const mensajesAlternos = [
  "💡 Los anuncios nos ayudan a mantener esta herramienta gratuita",
  "🚀 Desactiva tu bloqueador para ver contenido relevante",
  "❤️ Apoya este proyecto permitiendo anuncios no intrusivos"
];

<GoogleAds
  adSlot="1234567890"
  fallbackText={mensajesAlternos[Math.floor(Math.random() * mensajesAlternos.length)]}
/>
```

## 📊 Optimización y Mejores Prácticas

### 1. Posicionamiento

- **Above the fold**: Coloca al menos un anuncio visible sin scroll
- **En contenido**: Integra anuncios naturalmente en el flujo
- **Sidebar**: El panel lateral es ideal para anuncios verticales

### 2. Cantidad de Anuncios

- **Máximo recomendado**: 3-5 anuncios por página
- **Balance**: Más anuncios ≠ más ingresos
- **UX First**: No comprometas la experiencia del usuario

### 3. Formatos Efectivos

- **Auto**: Mejor para la mayoría de casos
- **Rectangle (300x250)**: Alto CTR
- **Banner (728x90)**: Bueno para headers
- **Mobile Banner (320x50)**: Específico para móviles

## 🐛 Resolución de Problemas

### Anuncios No Se Muestran

1. **Verifica configuración**:
   ```bash
   # Revisa variables de entorno
   echo $NEXT_PUBLIC_ADSENSE_ID
   echo $NEXT_PUBLIC_ADS_ENABLED
   ```

2. **Consola del navegador**:
   ```javascript
   // Verifica si AdSense se cargó
   console.log(window.adsbygoogle);
   ```

3. **Ad Slot IDs**: Asegúrate de usar los IDs correctos de AdSense

### Errores Comunes

- **`adsbygoogle.push is not a function`**: Script no cargado
- **Anuncios en blanco**: Ad Slot ID incorrecto
- **No revenue**: Configuración de AdSense pendiente

### Debugging

```tsx
// Modo debug para desarrollo
<GoogleAds
  adSlot="1234567890"
  fallbackText={`
    🔍 Debug Info:
    - Slot: 1234567890
    - Format: auto
    - Environment: ${process.env.NODE_ENV}
    - AdSense ID: ${process.env.NEXT_PUBLIC_ADSENSE_ID ? 'Configurado' : 'No configurado'}
  `}
/>
```

## 📈 Métricas y Seguimiento

### Google Analytics

Para rastrear performance de anuncios:

```tsx
// En tu componente
useEffect(() => {
  // Rastrear visualización de anuncio
  gtag('event', 'ad_impression', {
    ad_unit_id: '1234567890',
    page_location: window.location.href
  });
}, []);
```

### AdSense Reports

1. Ve a tu panel de AdSense
2. Revisa "Informes" para métricas detalladas
3. Analiza CTR, RPM, y earnings por unidad

## 🔐 Políticas y Cumplimiento

### Políticas de AdSense

- **No clicks propios**: Nunca hagas clic en tus anuncios
- **Contenido apropiado**: Asegúrate de cumplir las políticas
- **Placement**: Respeta las directrices de posicionamiento

### Privacy Policy

Actualiza tu política de privacidad para incluir:
- Uso de Google AdSense
- Cookies publicitarias
- Datos recopilados por terceros

## 🚀 Deployment en Producción

### Variables de Entorno

En tu plataforma de deployment (Vercel, Netlify, etc.):

```bash
NEXT_PUBLIC_ADSENSE_ID=1234567890123456
NEXT_PUBLIC_ADS_ENABLED=true
```

### Verificación

1. Deploy tu aplicación
2. Espera 24-48h para que AdSense reconozca los cambios
3. Verifica en AdSense que los anuncios aparecen correctamente

## 💰 Maximizar Ingresos

### A/B Testing

Prueba diferentes:
- Posiciones de anuncios
- Formatos y tamaños
- Mensajes de fallback

### Optimización Continua

- Revisa métricas semanalmente
- Ajusta posicionamiento según performance
- Considera anuncios estacionales

---

## 📞 Soporte

Si tienes problemas:

1. **Google AdSense Help**: [support.google.com/adsense](https://support.google.com/adsense)
2. **Community**: Foro de desarrolladores de Google
3. **Documentation**: [developers.google.com/adsense](https://developers.google.com/adsense)

---

*¡Buena suerte monetizando tu aplicación ArchitStudio! 🚀💰* 