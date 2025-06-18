import { forwardRef, HTMLAttributes } from 'react';

interface AccessibleButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  function AccessibleButton({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled = false, 
    children, 
    type = 'button',
    className = '',
    ...props 
  }, ref) {
    const baseClasses = 'btn';
    const variantClasses = `btn--${variant}`;
    const sizeClasses = `btn--${size}`;
    const stateClasses = loading ? 'btn--loading' : '';
    
    const allClasses = [baseClasses, variantClasses, sizeClasses, stateClasses, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={allClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span aria-hidden="true" className="btn__spinner">
            ⏳
          </span>
        )}
        <span className={loading ? 'btn__text--hidden' : 'btn__text'}>
          {children}
        </span>
      </button>
    );
  }
);

// Skip link for keyboard navigation
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: 'var(--color-primary)',
        color: 'white',
        padding: '8px',
        textDecoration: 'none',
        borderRadius: '0 0 4px 4px',
        zIndex: 9999,
        transform: 'translateY(-100%)',
        transition: 'transform 0.3s',
      }}
      onFocus={(e) => {
        e.target.style.transform = 'translateY(0)';
      }}
      onBlur={(e) => {
        e.target.style.transform = 'translateY(-100%)';
      }}
    >
      Skip to main content
    </a>
  );
}
