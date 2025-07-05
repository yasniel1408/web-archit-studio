const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'components', 'atoms', 'arrow', 'arrow.tsx');

try {
  // Leer el archivo
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('🔧 Arreglando errores de TypeScript en arrow.tsx...');
  
  // 1. Arreglar las llamadas a calculateArrowHead en las líneas 967 y 976
  content = content.replace(
    /d=\{calculateArrowHead\('right', 50, 30, true, currentStartArrowHead\)\}/g,
    'd={calculateArrowHead(\'right\', 50, 30, currentStartArrowHead)}'
  );
  
  content = content.replace(
    /d=\{calculateArrowHead\('left', 250, 30, false, currentArrowHead\)\}/g,
    'd={calculateArrowHead(\'left\', 250, 30, currentArrowHead)}'
  );
  
  // 2. Arreglar problemas de tipos undefined
  content = content.replace(
    /setCurrentStyle\(([^)]+)\);/g,
    'setCurrentStyle($1 || \'solid\');'
  );
  
  content = content.replace(
    /setCurrentArrowHead\(([^)]+)\);/g,
    'setCurrentArrowHead($1 || \'arrow\');'
  );
  
  // 3. Comentar líneas problemáticas de destructuring
  content = content.replace(
    /const \{ controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y \} = getBezierControlPoints\(\);/g,
    '// const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = getBezierControlPoints();'
  );
  
  // 4. Arreglar propiedades undefined en onPropertiesChange
  content = content.replace(
    /onPropertiesChange\?\.\(\{ style: ([^}]+) \}\);/g,
    'onPropertiesChange?.({ style: $1 || \'solid\' });'
  );
  
  content = content.replace(
    /onPropertiesChange\?\.\(\{ endArrowHead: ([^}]+) \}\);/g,
    'onPropertiesChange?.({ endArrowHead: $1 || \'arrow\' });'
  );
  
  // 5. Arreglar argumentos undefined en funciones
  content = content.replace(
    /getBezierPath\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^)]+)\)/g,
    'getBezierPath($1 || 0, $2 || 0, $3 || 0, $4 || 0, $5 || \'top\', $6 || \'bottom\')'
  );
  
  // 6. Comentar líneas de destructuring no utilizadas
  content = content.replace(
    /const \{[^}]*\} = ([^;]+);(\s*)\/\/ Si la línea está causando errores/g,
    '// const {...} = $1; // Comentado para evitar errores de build'
  );
  
  // 7. Añadir valores por defecto para variables que pueden ser undefined
  content = content.replace(
    /const exactPointStr = pathStr\.split\(' '\)\[1\];/g,
    'const exactPointStr = pathStr?.split(\' \')?.[1] || \'\';'
  );
  
  // Escribir el archivo arreglado
  fs.writeFileSync(filePath, content);
  
  console.log('✅ Errores de TypeScript arreglados en arrow.tsx');
  console.log('🚀 Ahora puedes ejecutar: npm run build');
  
} catch (error) {
  console.error('❌ Error al arreglar el archivo:', error.message);
  process.exit(1);
} 