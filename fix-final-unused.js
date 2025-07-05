const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'components', 'atoms', 'arrow', 'arrow.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('🧹 Limpieza final de arrow.tsx...');
  
  // Comentar funciones específicas no utilizadas
  const functionsToComment = [
    'handleStyleChange',
    'handleAnimationButtonClick', 
    'handleAnimationSelect',
    'handleArrowHeadChange',
    'handleStartArrowHeadChange',
    'getAnimationIcon'
  ];
  
  functionsToComment.forEach(funcName => {
    const regex = new RegExp(`const ${funcName} = [\\s\\S]*?(?=\\n\\s*(?:const|function|\\}|$))`, 'g');
    content = content.replace(regex, `// ${funcName} comentada - no utilizada`);
  });
  
  // Comentar variables específicas no utilizadas
  const varsToComment = [
    'closeModal',
    'getArrowClass', 
    'getArrowStyle',
    'getPathClasses',
    'getPathStyles',
    'handlePropertyChange'
  ];
  
  varsToComment.forEach(varName => {
    const regex = new RegExp(`const ${varName} = [\\s\\S]*?(?=\\n\\s*(?:const|function|\\}|$))`, 'g');
    content = content.replace(regex, `// ${varName} comentada - no utilizada`);
  });
  
  // Comentar useEffect no utilizados
  content = content.replace(
    /useEffect\(\(\) => \{[^}]*function handleClickOutside[^}]+\}[^}]+\}, \[isOptionsModalOpen\]\);/g,
    '// useEffect comentado - no utilizado'
  );
  
  fs.writeFileSync(filePath, content);
  
  console.log('✅ Limpieza final completada');
  console.log('🚀 Probando build final...');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 