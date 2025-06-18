# Component Structure Convention

This project follows a strict component folder structure convention to maintain code organization and enable clean imports.

## Convention Overview

Each React component must have its own folder containing:
- **Main component file**: `ComponentName.tsx`
- **CSS module**: `ComponentName.module.css`
- **Index file**: `index.tsx` (for re-exports)

## Folder Structure

```
src/components/ComponentName/
├── ComponentName.tsx          # Main component file
├── ComponentName.module.css   # CSS modules for styling
└── index.tsx                  # Re-export for clean imports
```

## Example Structure

```
src/components/
├── Header/
│   ├── Header.tsx
│   ├── Header.module.css
│   └── index.tsx
├── Footer/
│   ├── Footer.tsx
│   ├── Footer.module.css
│   └── index.tsx
├── BlogCard/
│   ├── BlogCard.tsx
│   ├── BlogCard.module.css
│   └── index.tsx
```

## Index File Pattern

Each `index.tsx` file should contain a simple re-export:

```typescript
// For default exports
export { default } from './ComponentName';

// For named exports
export { ComponentName } from './ComponentName';
```

## Import Pattern

This structure enables clean imports throughout the codebase:

```typescript
// Clean import from anywhere in the project
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
```

## Benefits

1. **Organization**: Each component is self-contained
2. **Clean Imports**: No need to specify file extensions or full paths
3. **Scalability**: Easy to add new components without cluttering
4. **Maintainability**: Related files are grouped together
5. **Consistency**: Standardized structure across all components

## Creating New Components

When creating a new component, follow these steps:

1. Create a new folder: `src/components/ComponentName/`
2. Create the main component: `ComponentName.tsx`
3. Create the CSS module: `ComponentName.module.css`
4. Create the index file: `index.tsx` with proper re-export
5. Import using: `import ComponentName from '@/components/ComponentName'`

## Migration Complete

All existing components have been migrated to this structure:
- ✅ AnimatedSection
- ✅ BlogCard
- ✅ Footer
- ✅ Header
- ✅ RichTextRenderer
- ✅ ThemeProvider
- ✅ ThemeToggle

All imports have been updated and tested successfully.
