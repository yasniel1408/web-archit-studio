# 📦 Dependencias Recomendadas - ArchitStudio

## 🚀 Implementación Inmediata

```bash
# Bundle analyzer para optimización
npm install --save-dev @next/bundle-analyzer

# SVG loader (ya configurado)
npm install --save-dev @svgr/webpack
```

## 🔴 Alta Prioridad

### Testing & Quality
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
npm install --save-dev @playwright/test
```

### Error Monitoring
```bash
npm install @sentry/nextjs
```

### Analytics
```bash
npm install @vercel/analytics web-vitals
```

## 🟡 Media Prioridad

### PWA
```bash
npm install next-pwa
```

### Internacionalización
```bash
npm install next-intl
```

### Auth
```bash
npm install next-auth
```

## 🔧 Scripts Recomendados

Agregar a `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:e2e": "playwright test",
    "build:analyze": "ANALYZE=true npm run build",
    "pre-deploy": "npm run typecheck && npm run lint:check && npm run test"
  }
}
```

Ver `MEJORAS_PROFESIONALES.md` para detalles completos. 