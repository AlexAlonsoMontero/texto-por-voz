# 🚫 Exclusiones para Análisis de IA

## 📁 Directorios Excluidos

### Dependencias y Build Artifacts
```
node_modules/
dist/
build/
www/
coverage/
.angular/
.nx/
```

### Plataformas Nativas
```
android/
ios/
capacitor/
```

### Archivos Temporales
```
*.tmp
*.temp
.DS_Store
.vscode/
.idea/
*.swp
*.swo
*~
```

### Logs y Reportes
```
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
reports/
```

## 🔧 Configuración de Herramientas

### .gitignore Compatible
```gitignore
# AI Analysis Exclusions
node_modules/
dist/
build/
www/
coverage/
android/
ios/
capacitor/
*.log
.DS_Store
.vscode/
.idea/
```

### ESLint Ignore
```
# .eslintignore
node_modules/
dist/
android/
ios/
capacitor/
www/
coverage/
```

### Prettier Ignore
```
# .prettierignore  
node_modules/
dist/
android/
ios/
capacitor/
www/
coverage/
*.min.js
```

## 🎯 Archivos de Enfoque

### Incluir Siempre
```
src/app/**/*.ts
src/app/**/*.html
src/app/**/*.scss
*.md
package.json
angular.json
tsconfig.json
capacitor.config.ts
ionic.config.json
```

### Contextos Críticos
```
.github/context/
.github/agents.md
.github/copilot-instructions.md
docs/
README.md
CONTRIBUTING.md
ACCESSIBILITY.md
```

## ⚠️ Notas Importantes

- **node_modules** contiene +50k archivos irrelevantes para análisis
- **android/ios** son builds nativos generados automáticamente
- **dist/www** son artifacts de build que cambian constantemente
- **coverage** son reportes temporales de testing

Los agentes de IA deben enfocar el análisis en el código fuente (`src/`), configuración del proyecto, y documentación solamente.