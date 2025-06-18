# CSS Variables & Design Tokens

This document outlines all the CSS custom properties (variables) available in the project's design system. All variables are defined in `src/app/globals.css` and can be used throughout the project.

## 🎨 Color System

### Theme Colors
```css
/* Dark Theme (default) */
--color-bg: #0a0a0a
--color-bg-secondary: #1a1a1a
--color-text: #ededed
--color-text-secondary: #b0b0b0
--color-text-muted: #888888
--color-border: #333333
--color-primary: #7c3aed
--color-primary-hover: #8b5cf6
--color-card-bg: #1a1a1a
--color-card-shadow: rgba(0, 0, 0, 0.2)
--color-card-shadow-hover: rgba(0, 0, 0, 0.3)

/* Light Theme */
--color-bg: #ffffff
--color-bg-secondary: #f8f9fa
--color-text: #333333
--color-text-secondary: #666666
--color-text-muted: #888888
--color-border: #e5e7eb
--color-primary: #667eea
--color-primary-hover: #5a67d8
--color-card-bg: #ffffff
--color-card-shadow: rgba(0, 0, 0, 0.05)
--color-card-shadow-hover: rgba(0, 0, 0, 0.1)
```

## 📝 Typography

### Font Family
```css
--font-family: var(--font-roboto), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### Font Weights
```css
--font-weight-light: 300
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-black: 900
```

### Font Sizes
```css
--font-size-xs: 0.75rem     /* 12px */
--font-size-sm: 0.875rem    /* 14px */
--font-size-base: 1rem      /* 16px */
--font-size-lg: 1.125rem    /* 18px */
--font-size-xl: 1.25rem     /* 20px */
--font-size-2xl: 1.5rem     /* 24px */
--font-size-3xl: 1.875rem   /* 30px */
--font-size-4xl: 2.25rem    /* 36px */
--font-size-5xl: 3rem       /* 48px */
```

## 📏 Spacing System

```css
--space-xs: 0.25rem    /* 4px */
--space-sm: 0.5rem     /* 8px */
--space-md: 0.75rem    /* 12px */
--space-lg: 1rem       /* 16px */
--space-xl: 1.5rem     /* 24px */
--space-2xl: 2rem      /* 32px */
--space-3xl: 2.5rem    /* 40px */
--space-4xl: 3rem      /* 48px */
--space-5xl: 4rem      /* 64px */
```

## 🔲 Border Radius

```css
--radius-xs: 0.125rem    /* 2px */
--radius-sm: 0.25rem     /* 4px */
--radius-md: 0.375rem    /* 6px */
--radius-lg: 0.5rem      /* 8px */
--radius-xl: 0.75rem     /* 12px */
--radius-2xl: 1rem       /* 16px */
--radius-3xl: 1.5rem     /* 24px */
--radius-full: 9999px
```

## 🌊 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

## ⚡ Transitions

```css
--transition-fast: 0.15s ease
--transition-base: 0.2s ease
--transition-slow: 0.3s ease
```

## 📚 Z-Index Scale

```css
--z-dropdown: 1000
--z-sticky: 1010
--z-fixed: 1020
--z-modal: 1030
--z-popover: 1040
--z-tooltip: 1050
```

## 🎨 Gradients

```css
--gradient-primary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)
--gradient-text: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)
```

## 📐 Layout

```css
--container-max-width: 1200px
--header-height: 68px
```

## 🛠️ Utility Classes

### Gradient Text
```css
.gradient-text               /* Apply gradient to text */
.gradient-text-hover         /* Gradient text with hover animation */
```

### Cards
```css
.card-base                   /* Base card styling */
.card-hover                  /* Card with hover effects */
```

### Layout
```css
.flex-center                 /* Flex center alignment */
.flex-between                /* Flex space-between alignment */
.container                   /* Main container with max-width */
```

### Interactive Elements
```css
.interactive                 /* Base interactive element styling */
```

## 🎬 Animations

### Available Keyframes
```css
@keyframes gradientShift     /* Gradient background animation */
@keyframes fadeIn            /* Fade in from bottom */
@keyframes slideIn           /* Slide in from left */
```

## 📱 Usage Examples

### Typography
```css
.title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}
```

### Spacing
```css
.section {
  padding: var(--space-5xl) 0;
  margin-bottom: var(--space-3xl);
}
```

### Cards
```css
.card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}
```

### Interactive Elements
```css
.button:hover {
  background-color: var(--color-bg-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}
```

## 🎯 Benefits

1. **Consistency**: Standardized design tokens across the entire project
2. **Maintainability**: Single source of truth for design values
3. **Theme Support**: Automatic dark/light theme switching
4. **Performance**: Reduced CSS bundle size through variable reuse
5. **Developer Experience**: Semantic naming for better understanding
6. **Scalability**: Easy to extend and modify design system

## 🔧 Migration Guide

When updating existing CSS:

1. Replace hardcoded values with appropriate variables
2. Use utility classes where possible
3. Remove duplicate animation definitions
4. Consolidate similar styling patterns

Example migration:
```css
/* Before */
.element {
  padding: 24px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

/* After */
.element {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  transition: var(--transition-base);
}
```
