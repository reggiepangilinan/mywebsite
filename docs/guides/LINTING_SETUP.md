# Code Quality & Linting Setup

## 📋 **Overview**

This project uses automated code quality checks to ensure consistent code style and catch errors before they reach production.

## 🛠️ **Tools Configured**

### **ESLint**

- **Purpose**: JavaScript/TypeScript linting and error detection
- **Config**: Next.js ESLint configuration with TypeScript support
- **Command**: `npm run lint` (check), `npm run lint:fix` (auto-fix)

### **Prettier**

- **Purpose**: Code formatting and style consistency
- **Config**: `.prettierrc.json` with project-specific rules
- **Auto-runs**: On staged files via pre-commit hook

### **TypeScript**

- **Purpose**: Type checking and compile-time error detection
- **Command**: `npm run type-check`
- **Integration**: Runs before every push

### **Husky + lint-staged**

- **Purpose**: Git hooks for automated quality checks
- **Pre-commit**: Runs Prettier and ESLint on staged files
- **Pre-push**: Runs full lint check and type checking

---

## 🔄 **Automated Workflows**

### **Pre-Commit Hook**

Automatically runs when you `git commit`:

```bash
✅ Prettier formatting on staged files
✅ ESLint with auto-fix on staged TypeScript/JavaScript files
```

### **Pre-Push Hook**

Automatically runs when you `git push`:

```bash
✅ Full ESLint check on entire codebase
✅ TypeScript type checking
✅ Prevents push if errors found
```

---

## 📝 **Configuration Files**

### **.prettierrc.json**

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### **.prettierignore**

Excludes build outputs, dependencies, and specific files from formatting.

### **package.json lint-staged**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix"],
    "*.{js,jsx,ts,tsx,json,css,md}": ["prettier --write"]
  }
}
```

---

## 🚀 **Manual Commands**

### **Linting**

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Type checking only
npm run type-check
```

### **Formatting**

```bash
# Format all files
npx prettier --write .

# Check formatting without changes
npx prettier --check .
```

### **Pre-commit checks manually**

```bash
# Run the same checks as pre-commit hook
npm run pre-commit
```

---

## 🔧 **Bypassing Hooks (Emergency Only)**

### **Skip pre-commit hook**

```bash
git commit --no-verify -m "emergency commit"
```

### **Skip pre-push hook**

```bash
git push --no-verify
```

**⚠️ Warning:** Only use `--no-verify` in emergencies. Always fix issues properly.

---

## ✅ **Benefits**

### **Consistency**

- ✅ **Code Style**: Prettier ensures consistent formatting
- ✅ **Best Practices**: ESLint enforces coding standards
- ✅ **Type Safety**: TypeScript catches errors early

### **Quality**

- ✅ **Error Prevention**: Catches issues before deployment
- ✅ **Team Alignment**: Everyone follows same standards
- ✅ **Automated**: No manual intervention required

### **CI/CD Integration**

- ✅ **Build Safety**: Prevents broken builds on Netlify
- ✅ **Early Detection**: Issues caught locally, not in production
- ✅ **Fast Feedback**: Immediate feedback on code quality

---

## 🐛 **Troubleshooting**

### **Hook not running**

```bash
# Reinstall hooks
npx husky install
```

### **ESLint errors**

```bash
# View detailed error info
npm run lint -- --verbose

# Fix auto-fixable issues
npm run lint:fix
```

### **TypeScript errors**

```bash
# Verbose type checking
npx tsc --noEmit --verbose
```

### **Prettier conflicts**

```bash
# Check what Prettier would change
npx prettier --check .

# See diff of changes
npx prettier --check . --list-different
```

---

## 📚 **Related Documentation**

- **[Component Convention](./COMPONENT_CONVENTION.md)** - Code organization standards
- **[Testing Strategy](./TESTING_STRATEGY.md)** - Testing implementation
- **[Code Quality Roadmap](./CODE_QUALITY_ROADMAP.md)** - Quality improvement checklist

---

_Last updated: June 19, 2025_
_Automated linting and formatting setup_
