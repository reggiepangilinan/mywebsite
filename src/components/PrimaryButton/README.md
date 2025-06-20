# PrimaryButton Component

A standardized primary button component that provides consistent styling and functionality across the website.

## Features

- ✅ Consistent gradient background matching the site's design system
- ✅ Support for both links (`href`) and buttons (`onClick`)
- ✅ Icon support with proper positioning
- ✅ Hover animations and accessibility features
- ✅ Responsive design with mobile optimizations
- ✅ TypeScript support with comprehensive props
- ✅ CSS variables integration for theming consistency

## Usage

### As a Link (Navigation/Downloads)
```tsx
import PrimaryButton from '@/components/PrimaryButton'

// Simple link
<PrimaryButton href="/contact">
  Contact Us
</PrimaryButton>

// Download link with icon
<PrimaryButton
  href="/resume.pdf"
  download="resume.pdf"
  target="_blank"
  rel="noopener noreferrer"
  icon={<DownloadIcon />}
>
  Download Resume
</PrimaryButton>

// Email link with emoji icon
<PrimaryButton
  href="mailto:me@reggiepangilinan.com"
  icon={<span>✉️</span>}
>
  Drop me a message
</PrimaryButton>
```

### As a Button (Forms/Actions)
```tsx
import PrimaryButton from '@/components/PrimaryButton'

// Simple button
<PrimaryButton onClick={() => handleSubmit()}>
  Submit Form
</PrimaryButton>

// Button with icon
<PrimaryButton
  onClick={() => handleSave()}
  icon={<SaveIcon />}
>
  Save Changes
</PrimaryButton>

// Submit button
<PrimaryButton type="submit">
  Create Account
</PrimaryButton>

// Disabled button
<PrimaryButton disabled onClick={() => {}}>
  Processing...
</PrimaryButton>
```

## Props Interface

```typescript
interface PrimaryButtonProps {
  children: ReactNode          // Button text/content
  href?: string               // For links - destination URL
  onClick?: () => void        // For buttons - click handler
  download?: string           // For download links - filename
  target?: string             // For links - target attribute
  rel?: string                // For links - rel attribute
  className?: string          // Additional CSS classes
  icon?: ReactNode            // Icon component or element
  type?: 'button' | 'submit' | 'reset'  // For buttons - type attribute
  disabled?: boolean          // For buttons - disabled state
}
```

## Styling

The component uses CSS variables from the design system:

```css
.primaryButton {
  /* Background */
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  
  /* Spacing */
  padding: var(--space-md) var(--space-xl);
  gap: var(--space-sm);
  
  /* Typography */
  font-family: var(--font-family);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  
  /* Border */
  border-radius: var(--radius-lg);
  
  /* Transitions */
  transition: var(--transition-base);
}
```

## Responsive Behavior

### Desktop (Default)
- Full padding and font size
- Hover animations enabled
- Flex layout with icon support

### Tablet (≤768px)
- Reduced padding
- Smaller font size
- Maintained hover effects

### Mobile (≤480px)
- Minimal padding
- Full width layout
- Centered content
- Touch-optimized sizing

## Accessibility Features

- ✅ Focus outline for keyboard navigation
- ✅ Proper semantic HTML (button vs anchor)
- ✅ Disabled state handling
- ✅ Screen reader compatible
- ✅ Touch target sizing (44px minimum)

## Integration Examples

### About Page Contact Button
```tsx
<PrimaryButton
  href="mailto:me@reggiepangilinan.com"
  icon={<span>✉️</span>}
>
  Drop me a message
</PrimaryButton>
```

### Resume Download Button
```tsx
<PrimaryButton
  href="/CV - REGGIE PANGILINAN 2025.pdf"
  download="Reggie_Pangilinan_Resume.pdf"
  target="_blank"
  rel="noopener noreferrer"
  icon={<DownloadIcon />}
>
  Download Full Resume
</PrimaryButton>
```

## File Structure

```
src/components/PrimaryButton/
├── PrimaryButton.tsx          # Main component
├── PrimaryButton.module.css   # Component styles
└── index.tsx                  # Re-export
```

## Design System Integration

The PrimaryButton component is fully integrated with the site's design system:

- **Colors**: Uses CSS custom properties for theming
- **Typography**: Follows font size and weight scales
- **Spacing**: Uses consistent spacing variables
- **Border Radius**: Matches site border radius system
- **Transitions**: Uses standardized transition timing

## Migration from Legacy Buttons

When migrating existing buttons to use PrimaryButton:

1. **Replace** custom button elements with `<PrimaryButton>`
2. **Move** `href` attributes to the `href` prop
3. **Convert** inline styles to the `icon` prop
4. **Remove** custom CSS classes (component provides styling)
5. **Update** event handlers to use `onClick` prop

### Before
```tsx
<a href="/download" className={styles.downloadLink}>
  Download
  <SomeIcon className={styles.icon} />
</a>
```

### After
```tsx
<PrimaryButton href="/download" icon={<SomeIcon />}>
  Download
</PrimaryButton>
```

## Best Practices

1. **Use for primary actions** - Main CTAs, form submissions, important links
2. **Limit usage** - Don't overuse; maintains visual hierarchy
3. **Provide clear labels** - Descriptive button text
4. **Include icons when helpful** - Enhance understanding, don't clutter
5. **Consider loading states** - Use disabled prop during processing

## Future Enhancements

Potential future additions:
- Loading spinner state
- Size variants (small, medium, large)
- Color variants (secondary, danger, success)
- Outline variant
- Icon-only variant
