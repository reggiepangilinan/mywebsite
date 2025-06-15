# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js personal website project with the following specifications:
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules (no Tailwind CSS)
- **Build**: Static Site Generation (SSG)
- **Purpose**: Personal portfolio website

## Development Guidelines
1. **Styling**: Use CSS Modules for all component styles. File naming convention: `ComponentName.module.css`
2. **Static Generation**: Configure for static export with `output: 'export'` in next.config.js
3. **Components**: Create reusable components with proper TypeScript interfaces
4. **Images**: Use Next.js Image component with `unoptimized: true` for static export
5. **Responsive Design**: Implement mobile-first responsive design using CSS Grid and Flexbox
6. **SEO**: Include proper metadata in layout.tsx and page components

## File Structure
- `/app` - App Router pages and layouts
- `/components` - Reusable React components
- `/public` - Static assets
- `/styles` - Global CSS and CSS modules

When generating code, follow these patterns and maintain consistency with the existing codebase.
