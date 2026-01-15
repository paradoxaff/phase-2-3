# Data Model: Todo Full-Stack Web Application

## User Entity

### Fields
- **id**: UUID (Primary Key, Auto-generated)
- **email**: String (Required, Unique, Validated)
- **password_hash**: String (Required, Encrypted)
- **created_at**: DateTime (Auto-generated)
- **updated_at**: DateTime (Auto-generated, Updated on change)

### Relationships
- One-to-Many: User → Tasks (user owns multiple tasks)

### Validation Rules
- Email: Must be valid email format
- Password: Minimum 8 characters with complexity requirements
- Email: Must be unique across all users

## Task Entity

### Fields
- **id**: UUID (Primary Key, Auto-generated)
- **title**: String (Required, Max 255 chars)
- **description**: String (Optional, Max 1000 chars)
- **completed**: Boolean (Default: False)
- **user_id**: UUID (Foreign Key, Required, References User.id)
- **created_at**: DateTime (Auto-generated)
- **updated_at**: DateTime (Auto-generated, Updated on change)

### Relationships
- Many-to-One: Task → User (task belongs to one user)

### Validation Rules
- Title: Required, minimum 1 character, maximum 255 characters
- Description: Optional, maximum 1000 characters
- Completed: Boolean value (true/false)
- User_id: Must reference an existing user

## State Transitions

### Task Completion States
- **Incomplete** → **Complete**: When user marks task as done
- **Complete** → **Incomplete**: When user unmarks task as done

### User Authentication States
- **Unauthenticated** → **Authenticated**: After successful login
- **Authenticated** → **Unauthenticated**: After logout or token expiration

## Indexes

### Required Indexes
- User.email: Unique index for fast lookup and uniqueness enforcement
- Task.user_id: Index for efficient user-based queries
- Task.created_at: Index for sorting and filtering by creation date

## Constraints

### Referential Integrity
- Task.user_id must reference an existing User.id (foreign key constraint)
- Prevent deletion of users who have associated tasks (or cascade delete with confirmation)

### Business Logic Constraints
- Users can only access/modify their own tasks
- Task titles must not be empty strings
- Task ownership cannot be transferred between users