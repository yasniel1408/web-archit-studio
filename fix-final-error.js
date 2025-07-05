const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'components', 'atoms', 'arrow', 'arrow.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('🔧 Arreglando error final: getBezierControlPoints no utilizada...');
  
  // Buscar donde se necesita usar getBezierControlPoints
  // La función se usa en getPointOnCurve y getBezierPath
  
  // 1. Asegurar que getPointOnCurve use getBezierControlPoints
  if (content.includes('const getPointOnCurve = (t: number) => {')) {
    content = content.replace(
      /const getPointOnCurve = \(t: number\) => \{([^}]+)\}/s,
      `const getPointOnCurve = (t: number) => {
    const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = getBezierControlPoints();
    
    const x = Math.pow(1-t, 3) * startX + 
              3 * Math.pow(1-t, 2) * t * controlPoint1X +
              3 * (1-t) * Math.pow(t, 2) * controlPoint2X +
              Math.pow(t, 3) * endX;
              
    const y = Math.pow(1-t, 3) * startY + 
              3 * Math.pow(1-t, 2) * t * controlPoint1Y +
              3 * (1-t) * Math.pow(t, 2) * controlPoint2Y +
              Math.pow(t, 3) * endY;
              
    return { x, y };
  }`
    );
  }
  
  // 2. Asegurar que getBezierPath use getBezierControlPoints
  content = content.replace(
    /const getBezierPath = \([^)]+\): string => \{[^}]+\}/s,
    `const getBezierPath = (sX: number, sY: number, eX: number, eY: number, 
                         sPos: ConnectionPosition, ePos: ConnectionPosition): string => {
    const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = getBezierControlPoints();
    return \`M \${sX} \${sY} C \${controlPoint1X} \${controlPoint1Y}, \${controlPoint2X} \${controlPoint2Y}, \${eX} \${eY}\`;
  }`
  );
  
  // 3. Si aún no se usa, agregar una llamada en el componente principal
  if (!content.includes('getBezierControlPoints()')) {
    // Buscar el lugar apropiado para agregar la llamada
    const renderSectionMatch = content.match(/(return \(\s*<>)/);
    if (renderSectionMatch) {
      content = content.replace(
        renderSectionMatch[1],
        `// Obtener puntos de control para el path
  const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = getBezierControlPoints();
  const bezierPath = \`M \${startX} \${startY} C \${controlPoint1X} \${controlPoint1Y}, \${controlPoint2X} \${controlPoint2Y}, \${endX} \${endY}\`;

  ${renderSectionMatch[1]}`
      );
    }
  }
  
  fs.writeFileSync(filePath, content);
  
  console.log('✅ Error final arreglado: getBezierControlPoints ahora se utiliza');
  console.log('🚀 Ejecuta: npm run build');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 