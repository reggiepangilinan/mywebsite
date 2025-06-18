# Testing Infrastructure Improvements

## Current State
- No testing framework implemented
- No component tests
- No integration tests
- No E2E tests

## Recommended Testing Stack

### Unit & Component Testing
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### E2E Testing
```bash
npm install --save-dev @playwright/test
```

### Visual Regression Testing
```bash
npm install --save-dev @storybook/react @storybook/nextjs
```

## Test File Structure
```
src/
├── __tests__/
│   ├── components/
│   │   ├── Header.test.tsx
│   │   ├── Footer.test.tsx
│   │   └── BlogCard.test.tsx
│   ├── pages/
│   │   ├── Home.test.tsx
│   │   └── About.test.tsx
│   └── utils/
│       └── contentful.test.ts
├── __mocks__/
│   └── contentful.ts
└── test-utils/
    └── setup.ts
```

## Example Test Implementation

### Component Test Example
```typescript
// src/__tests__/components/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header Component', () => {
  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    // Add assertions for menu state
  });
});
```

### Integration Test Example
```typescript
// src/__tests__/pages/Blog.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BlogPage } from '@/app/blog/page';

// Mock contentful
jest.mock('@/lib/contentful', () => ({
  getBlogPosts: jest.fn().mockResolvedValue({
    items: [
      {
        sys: { id: '1' },
        fields: {
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test excerpt',
          publishDate: '2024-01-01'
        }
      }
    ]
  })
}));

describe('Blog Page', () => {
  it('renders blog posts', async () => {
    render(<BlogPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
  });
});
```

## Package.json Scripts to Add
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage"
  }
}
```
