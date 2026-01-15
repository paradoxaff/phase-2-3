# API Contract: Hardening and Validation

## Overview
Security-hardened API contract for the todo application with strict authentication and authorization requirements.

## Security Requirements

### JWT Token Validation
All endpoints require JWT authentication via Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Token Validation Rules
- Token must be valid and unexpired
- Invalid tokens return 401 Unauthorized
- Expired tokens return 401 Unauthorized
- Malformed tokens return 401 Unauthorized
- Missing tokens return 401 Unauthorized

### User Isolation
- Users can only access their own resources
- Requests for other users' resources return 403 Forbidden
- Resource ownership validated server-side
- User ID in JWT must match resource owner

## API Behavior

### HTTP Status Codes
- `200 OK`: Successful GET requests and successful updates
- `201 Created`: Successful resource creation
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Valid token but unauthorized access to resource
- `404 Not Found`: Requested resource does not exist

### Response Format
Successful responses:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

## Endpoint Security

### Authentication Endpoints (No JWT Required)
- `POST /api/auth/register` - Returns 201 Created on success
- `POST /api/auth/login` - Returns 200 OK on success
- `POST /api/auth/logout` - Returns 200 OK on success

### Protected Endpoints (JWT Required)
All other endpoints require valid JWT token:

#### Task Endpoints
- `GET /api/tasks` - Returns 200 OK with user's tasks, 401 if unauthorized
- `POST /api/tasks` - Returns 201 Created with new task, 401 if unauthorized
- `GET /api/tasks/{id}` - Returns 200 OK with task, 401 if unauthorized, 403 if wrong user, 404 if not found
- `PUT /api/tasks/{id}` - Returns 200 OK with updated task, 401 if unauthorized, 403 if wrong user, 404 if not found
- `DELETE /api/tasks/{id}` - Returns 200 OK on success, 401 if unauthorized, 403 if wrong user, 404 if not found
- `PATCH /api/tasks/{id}/complete` - Returns 200 OK with updated task, 401 if unauthorized, 403 if wrong user, 404 if not found

## Frontend Integration Requirements

### JWT Token Handling
- JWT token must be attached to all API requests (except auth endpoints)
- 401 responses should trigger automatic logout
- 403 responses should show access denied message
- Error handling must be consistent across all API calls

### Error Response Handling
- 401 responses: Clear authentication state and redirect to login
- 403 responses: Show "access forbidden" message to user
- 404 responses: Show "resource not found" message
- Network errors: Show connectivity issues
- Validation errors: Show specific field errors

## Validation Requirements

### Backend Validation
- All endpoints verify JWT token validity before processing
- User ownership checked for all resource access
- Appropriate HTTP status codes returned for all error conditions
- Sensitive information not exposed in error messages
- Input validation performed on all requests

### Frontend Validation
- JWT tokens stored securely
- Automatic cleanup on logout or token expiration
- Proper error state handling
- No sensitive data stored in plain text