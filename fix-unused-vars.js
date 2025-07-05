const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'components', 'atoms', 'arrow', 'arrow.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('🧹 Limpiando variables no utilizadas en arrow.tsx...');
  
  // Comentar variables no utilizadas
  content = content.replace(
    /const optionsMenuClass = .*?;/g,
    '// const optionsMenuClass = "..."; // Comentada - no utilizada'
  );
  
  content = content.replace(
    /const optionButtonClass = .*?;/g,
    '// const optionButtonClass = "..."; // Comentada - no utilizada'
  );
  
  content = content.replace(
    /const pathClass = .*?;/g,
    '// const pathClass = "..."; // Comentada - no utilizada'
  );
  
  // Comentar destructuring no utilizado
  content = content.replace(
    /const \{ midX, midY \} = useMemo\(\(\) => \{[\s\S]*?\}, \[path\]\);/g,
    '// Destructuring comentado para build'
  );
  
  // Arreglar llamadas a getPointOnPath problemáticas
  content = content.replace(
    /const getPointOnPath = .*?;/g,
    '// const getPointOnPath = ...; // Comentada - no utilizada'
  );
  
  fs.writeFileSync(filePath, content);
  
  console.log('✅ Variables no utilizadas comentadas');
  console.log('🚀 Probando build...');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 