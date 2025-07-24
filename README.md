# E-commerce Backend API

A Node.js + Express backend for an e-commerce website with MongoDB, JWT authentication, and role-based access control.

## Features

- **Authentication & Authorization**: JWT-based authentication with user and admin roles
- **Database**: MongoDB with Mongoose ODM
- **Models**: User, Product, Category with comprehensive schemas
- **API**: RESTful API with proper validation and error handling
- **Security**: Rate limiting, CORS, Helmet, input validation
- **Architecture**: MVC pattern with separated controllers, services, and routes

## Project Structure

```
server/
├── config/
│   ├── database.js
│   └── jwt.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   └── categoryController.js
├── middlewares/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validate.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Category.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   └── categories.js
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── productService.js
│   └── categoryService.js
├── index.js
├── package.json
├── env.example
└── README.md
```

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**

   - Copy `env.example` to `.env`
   - Update the values in `.env`:
     ```
     NODE_ENV=development
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/ecommerce
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     JWT_EXPIRES_IN=7d
     BCRYPT_ROUNDS=12
     ```

3. **Database Setup**

   - Make sure MongoDB is running locally
   - Or update `MONGODB_URI` to point to your MongoDB instance

4. **Run the Server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint           | Description         | Auth Required |
| ------ | ------------------ | ------------------- | ------------- |
| POST   | `/register`        | Register new user   | No            |
| POST   | `/login`           | User login          | No            |
| GET    | `/profile`         | Get user profile    | Yes           |
| PUT    | `/profile`         | Update user profile | Yes           |
| PUT    | `/change-password` | Change password     | Yes           |

### Users (`/api/users`) - Admin Only

| Method | Endpoint          | Description      | Auth Required |
| ------ | ----------------- | ---------------- | ------------- |
| GET    | `/`               | Get all users    | Admin         |
| GET    | `/:id`            | Get user by ID   | Admin         |
| PUT    | `/:id`            | Update user      | Admin         |
| DELETE | `/:id`            | Delete user      | Admin         |
| PUT    | `/:id/deactivate` | Deactivate user  | Admin         |
| PUT    | `/:id/activate`   | Activate user    | Admin         |
| PUT    | `/:id/role`       | Change user role | Admin         |

### Products (`/api/products`)

| Method | Endpoint                | Description              | Auth Required |
| ------ | ----------------------- | ------------------------ | ------------- |
| GET    | `/`                     | Get all products         | No            |
| GET    | `/featured`             | Get featured products    | No            |
| GET    | `/search`               | Search products          | No            |
| GET    | `/category/:categoryId` | Get products by category | No            |
| GET    | `/slug/:slug`           | Get product by slug      | No            |
| GET    | `/:id`                  | Get product by ID        | No            |
| POST   | `/:id/ratings`          | Add product rating       | User          |
| PUT    | `/:id/ratings`          | Update product rating    | User          |
| POST   | `/`                     | Create product           | Admin         |
| PUT    | `/:id`                  | Update product           | Admin         |
| DELETE | `/:id`                  | Delete product           | Admin         |

### Categories (`/api/categories`)

| Method | Endpoint      | Description                       | Auth Required |
| ------ | ------------- | --------------------------------- | ------------- |
| GET    | `/`           | Get all categories                | No            |
| GET    | `/with-count` | Get categories with product count | No            |
| GET    | `/slug/:slug` | Get category by slug              | No            |
| GET    | `/:id`        | Get category by ID                | No            |
| POST   | `/`           | Create category                   | Admin         |
| PUT    | `/:id`        | Update category                   | Admin         |
| DELETE | `/:id`        | Delete category                   | Admin         |

## Authentication

### Register User

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Using JWT Token

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Models

### User Model

- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: 'user', 'admin')
- `isActive`: Boolean (default: true)
- `phone`: String (optional)
- `address`: Object (optional)

### Product Model

- `name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `category`: ObjectId (required, ref: Category)
- `images`: Array of Strings
- `stock`: Number (required)
- `sku`: String (unique)
- `slug`: String (unique, auto-generated)
- `isActive`: Boolean (default: true)
- `isFeatured`: Boolean (default: false)
- `ratings`: Array of rating objects
- `averageRating`: Number (auto-calculated)
- `totalRatings`: Number (auto-calculated)

### Category Model

- `name`: String (required, unique)
- `description`: String (optional)
- `slug`: String (unique, auto-generated)
- `isActive`: Boolean (default: true)
- `image`: String (optional)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Prevents abuse
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Role-based Access**: User and admin permissions

## Development

- **Hot Reload**: Nodemon for development
- **Environment Variables**: dotenv for configuration
- **Error Handling**: Centralized error handling middleware
- **Validation**: Request validation with detailed error messages

## Production Considerations

1. **Environment Variables**: Update all sensitive values
2. **JWT Secret**: Use a strong, unique secret
3. **Database**: Use a production MongoDB instance
4. **Rate Limiting**: Adjust limits based on your needs
5. **CORS**: Configure allowed origins
6. **Logging**: Add proper logging for production
7. **Monitoring**: Add health checks and monitoring

## License

MIT
