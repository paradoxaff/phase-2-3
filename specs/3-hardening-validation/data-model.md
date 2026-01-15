# Data Model: Hardening and Validation

## JWT Token Validation

### Fields
- **token**: String (JWT token to validate)
- **isValid**: Boolean (Token signature validity)
- **isExpired**: Boolean (Token expiration check)
- **userId**: String (User ID extracted from token)
- **expiresAt**: DateTime (Token expiration time)

### Validation Rules
- Token must have valid JWT format
- Signature must be verified against secret
- Token must not be expired
- User ID must be present in claims

## API Request Validation

### Fields
- **method**: String (HTTP method)
- **url**: String (Request URL)
- **userId**: String (User ID from JWT)
- **resourceOwnerId**: String (Owner ID from URL/resource)
- **isAuthorized**: Boolean (Authorization status)
- **statusCode**: Number (HTTP response code)

### Validation Rules
- User ID must match resource owner ID for protected resources
- Valid JWT token required for all protected endpoints
- Appropriate HTTP status codes returned for validation results
- Request must conform to expected format

## Error Response

### Fields
- **statusCode**: Number (HTTP status code)
- **error**: String (Error message)
- **detail**: String (Additional error details)
- **timestamp**: DateTime (Time of error occurrence)

### Validation Rules
- Status code must match error type (401, 403, 404)
- Error messages must be user-friendly
- Sensitive information must not be exposed
- Consistent format across all error responses

## Configuration Validation

### Fields
- **databaseUrl**: String (Database connection string)
- **jwtSecret**: String (JWT signing secret)
- **isValid**: Boolean (Configuration validity)
- **errorMessage**: String (Error message if invalid)

### Validation Rules
- Database URL must be properly formatted
- JWT secret must be present and secure
- Configuration values must be accessible
- Environment variables must be properly loaded