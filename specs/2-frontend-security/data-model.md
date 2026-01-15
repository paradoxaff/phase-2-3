# Data Model: Frontend Completion & Secure API Integration

## Authentication Session

### Fields
- **token**: String (JWT token, stored in localStorage)
- **user**: Object (User data from authentication)
- **expiresAt**: DateTime (Token expiration time)
- **isLoggedIn**: Boolean (Authentication status)

### Validation Rules
- Token must be valid JWT format
- Expiration time must be in the future
- User data must match JWT claims

## API Request Enhancement

### Fields
- **headers**: Object (Request headers including Authorization)
- **authorization**: String (Bearer token format)
- **method**: String (HTTP method)
- **url**: String (API endpoint URL)

### Validation Rules
- Authorization header must be present for protected endpoints
- Token must be valid and unexpired
- Method must be appropriate for endpoint

## Security Enforcement

### Fields
- **authenticatedUserId**: String (User ID from JWT token)
- **requestedResourceId**: String (Resource owner ID from URL/path)
- **isAuthorized**: Boolean (Access validation result)
- **statusCode**: Number (HTTP response code for unauthorized access)

### Validation Rules
- authenticatedUserId must match requestedResourceId for resource access
- Unauthorized access must return appropriate HTTP status codes
- Sensitive operations must be logged

## UI State Management

### Fields
- **isLoading**: Boolean (Request in progress)
- **error**: String/Object (Error message/state)
- **success**: Boolean (Operation success status)
- **data**: Object (Response data from API)

### Validation Rules
- Loading state must be shown during API requests
- Error messages must be user-friendly
- Success state must update UI immediately
- Data must be validated before UI updates

## Task Access Control

### Fields
- **taskId**: String (Unique task identifier)
- **taskOwnerId**: String (User ID of task creator)
- **requestingUserId**: String (User ID of current authenticated user)
- **canModify**: Boolean (Permission to edit/delete task)
- **canView**: Boolean (Permission to read task)

### Validation Rules
- requestingUserId must equal taskOwnerId for modification
- requestingUserId must equal taskOwnerId for deletion
- Access requests must be validated server-side
- Response must include appropriate authorization flags