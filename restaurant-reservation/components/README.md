# Reusable UI Components

This directory contains reusable UI components for the restaurant reservation system.

## Components

### Button

A versatile button component with multiple variants and sizes.

**Props:**

- `variant`: 'primary' | 'secondary' | 'danger' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `loading`: boolean (default: false)
- All standard HTML button attributes

**Example:**

```tsx
import Button from '@/components/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="danger" loading={isLoading}>
  Delete
</Button>
```

### Input

An input component with label, error display, and validation styling.

**Props:**

- `label`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- All standard HTML input attributes

**Example:**

```tsx
import Input from "@/components/Input";

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  helperText="We'll never share your email"
/>;
```

### Modal

A modal dialog component with backdrop and keyboard support.

**Props:**

- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string (optional)
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `closeOnBackdropClick`: boolean (default: true)
- `children`: React.ReactNode (required)

**Example:**

```tsx
import Modal from "@/components/Modal";

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex gap-2 mt-4">
    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={handleConfirm}>
      Confirm
    </Button>
  </div>
</Modal>;
```

### Toast

A toast notification system with context provider for global usage.

**Setup:**
Wrap your app with ToastProvider:

```tsx
import ToastProvider from "@/components/Toast";

<ToastProvider>
  <YourApp />
</ToastProvider>;
```

**Usage:**

```tsx
import { useToast } from "@/components/Toast";

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success("Operation completed successfully!");
  };

  const handleError = () => {
    error("Something went wrong!", 7000); // Custom duration
  };

  return (
    <div>
      <Button onClick={handleSuccess}>Show Success</Button>
      <Button onClick={handleError}>Show Error</Button>
    </div>
  );
}
```

**Toast Methods:**

- `success(message, duration?)`: Show success toast
- `error(message, duration?)`: Show error toast
- `warning(message, duration?)`: Show warning toast
- `info(message, duration?)`: Show info toast
- `addToast(message, variant, duration?)`: Generic toast method
- `removeToast(id)`: Manually remove a toast

**Default Duration:** 5000ms (5 seconds)

## Brand Colors

The components use the restaurant's brand colors:

- Brown: `#5F361D` (primary actions)
- Gold: `#FACF10` (secondary actions)
- Cream: `#F6EFBD` (backgrounds)

## Accessibility

All components follow accessibility best practices:

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Sufficient color contrast

## Testing

All components have comprehensive unit tests. Run tests with:

```bash
npm test -- __tests__/components/
```
