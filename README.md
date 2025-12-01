# E-Commerce Platform

A full-stack e-commerce application built with Next.js 15, Prisma, PostgreSQL, and TypeScript. This platform provides a complete shopping experience with user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

### User Features
- **Authentication System**: Secure JWT-based authentication with bcrypt password hashing
- **Product Browsing**: Browse products with search, filtering, and sorting capabilities
- **Shopping Cart**: Add products to cart, manage quantities, and view cart total
- **Order Management**: Place orders and view order history
- **User Profiles**: View and manage user account information
- **Responsive Design**: Mobile-friendly interface with dark/light theme support

### Admin Features
- **Product Management**: Create, update, and delete products
- **Inventory Control**: Manage product stock levels
- **Category Management**: Organize products by categories
- **Admin Dashboard**: Dedicated admin interface for product management

## 📋 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Motion (Framer Motion), Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Tabler Icons, Lucide React

## 🗂️ Project Structure

```
capstone/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── cart/          # Cart management
│   │   │   ├── orders/        # Order processing
│   │   │   ├── products/      # Product CRUD
│   │   │   └── getUserInfo/   # User information
│   │   ├── admin/             # Admin pages
│   │   ├── cart/              # Cart page
│   │   ├── products/          # Product pages
│   │   ├── profile/           # User profile
│   │   ├── signin/            # Sign in page
│   │   ├── signup/            # Sign up page
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/                # UI primitives
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── product-card.tsx
│   │   ├── product-form.tsx
│   │   ├── add-to-cart-button.tsx
│   │   ├── search-input.tsx
│   │   └── auth-provider.tsx
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # Auth helpers
│   │   └── utils.ts           # General utilities
│   └── server/
│       └── db.ts              # Prisma client
└── public/                    # Static assets
```

## 🛣️ API Routes

### Authentication

#### `POST /api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

#### `POST /api/auth/signin`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "ADMIN | CUSTOMER"
  }
}
```

### Products

#### `GET /api/products`
Get paginated list of products with filtering and sorting.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `search` (string): Search in name and description
- `category` (string): Filter by category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sort` (string): Sort order (`price-asc`, `price-desc`, `newest`)

**Response:**
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "imageUrl": "string",
      "category": "string",
      "stock": "number",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pagination": {
    "total": "number",
    "pages": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### `POST /api/products`
Create a new product (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "category": "string",
  "stock": "number"
}
```

#### `GET /api/products/[id]`
Get a single product by ID.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "category": "string",
  "stock": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### `PUT /api/products/[id]`
Update a product (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:** Same as POST /api/products

#### `DELETE /api/products/[id]`
Delete a product (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

### Cart

#### `GET /api/cart`
Get current user's cart with items.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "items": [
    {
      "id": "string",
      "quantity": "number",
      "product": {
        "id": "string",
        "name": "string",
        "price": "number",
        "imageUrl": "string",
        "stock": "number"
      }
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### `POST /api/cart`
Add item to cart or update quantity if already exists.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "string",
  "quantity": "number"
}
```

#### `PUT /api/cart/[itemId]`
Update cart item quantity.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": "number"
}
```

#### `DELETE /api/cart/[itemId]`
Remove item from cart.

**Headers:**
- `Authorization: Bearer <token>`

### Orders

#### `GET /api/orders`
Get user's order history.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "string",
    "userId": "string",
    "total": "number",
    "status": "PENDING | COMPLETED | CANCELLED",
    "items": [
      {
        "id": "string",
        "quantity": "number",
        "price": "number",
        "product": {
          "id": "string",
          "name": "string",
          "imageUrl": "string"
        }
      }
    ],
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

#### `POST /api/orders`
Place an order from current cart items.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "total": "number",
  "status": "COMPLETED",
  "items": [...],
  "createdAt": "datetime"
}
```

**Note:** This endpoint:
- Validates stock availability for all items
- Creates the order
- Decrements product stock
- Clears the cart
- All operations are wrapped in a database transaction

### User

#### `GET /api/getUserInfo`
Get current user information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "ADMIN | CUSTOMER",
  "createdAt": "datetime"
}
```

## 🗄️ Database Schema

### User
- `id`: UUID (Primary Key)
- `firstName`: String
- `lastName`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum (ADMIN, CUSTOMER)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: Cart (1:1), Orders (1:Many)

### Product
- `id`: UUID (Primary Key)
- `name`: String
- `description`: String
- `price`: Decimal
- `imageUrl`: String
- `category`: String
- `stock`: Integer
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: CartItems (1:Many), OrderItems (1:Many)

### Cart
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key, Unique)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: User (Many:1), CartItems (1:Many)

### CartItem
- `id`: UUID (Primary Key)
- `cartId`: UUID (Foreign Key)
- `productId`: UUID (Foreign Key)
- `quantity`: Integer
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: Cart (Many:1), Product (Many:1)

### Order
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key)
- `total`: Decimal
- `status`: String (PENDING, COMPLETED, CANCELLED)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: User (Many:1), OrderItems (1:Many)

### OrderItem
- `id`: UUID (Primary Key)
- `orderId`: UUID (Foreign Key)
- `productId`: UUID (Foreign Key)
- `quantity`: Integer
- `price`: Decimal (Snapshot of price at order time)
- Relations: Order (Many:1), Product (Many:1)

## 🎯 Use Cases

### Customer Use Cases

1. **User Registration**
   - New users can create an account with email and password
   - Passwords are securely hashed using bcrypt
   - Default role is set to CUSTOMER

2. **User Authentication**
   - Users can sign in with email and password
   - JWT token is issued for authenticated sessions
   - Token expires after 7 days

3. **Browse Products**
   - View all products with pagination
   - Search products by name or description
   - Filter products by category and price range
   - Sort products by price (ascending/descending) or date (newest first)

4. **View Product Details**
   - View detailed information about a specific product
   - Check product availability (stock)
   - See product category and pricing

5. **Shopping Cart Management**
   - Add products to cart with specified quantity
   - View all items in cart with product details
   - Update item quantities in cart
   - Remove items from cart
   - Stock validation when adding to cart

6. **Place Orders**
   - Convert cart items to an order
   - Automatic stock validation before order placement
   - Automatic inventory deduction upon successful order
   - Cart is cleared after successful order
   - Order total is calculated automatically

7. **Order History**
   - View all past orders
   - See order details including items, quantities, and prices
   - Track order status (PENDING, COMPLETED, CANCELLED)
   - Orders sorted by creation date (newest first)

8. **User Profile**
   - View personal information
   - See account creation date
   - Check account role

### Admin Use Cases

1. **Product Creation**
   - Create new products with name, description, price, image, category, and stock
   - Input validation using Zod schema
   - Only accessible to ADMIN role

2. **Product Management**
   - Update existing product information
   - Delete products from the catalog
   - Manage product categories
   - Control inventory levels

3. **Inventory Management**
   - Set initial stock levels for products
   - Stock automatically decrements when orders are placed
   - View current stock levels

4. **Admin Dashboard**
   - Access dedicated admin interface
   - Manage all products from centralized location
   - Create and edit products through admin forms

## 🔧 Key Functions & Components

### Authentication Functions (`src/lib/auth.ts`)
- `verifyAuth(req)`: Verify JWT token and return user data
- `unauthorized()`: Return 401 unauthorized response
- `forbidden()`: Return 403 forbidden response

### Components

#### `Navbar` (`src/components/navbar.tsx`)
- Main navigation component
- User authentication state display
- Cart icon with item count
- Responsive mobile menu
- Theme toggle (dark/light mode)
- Admin-specific navigation items

#### `ProductCard` (`src/components/product-card.tsx`)
- Display product information in card format
- Show product image, name, price, and category
- Link to product detail page
- Responsive grid layout

#### `ProductForm` (`src/components/product-form.tsx`)
- Form for creating and editing products
- Input validation
- Category selection
- Stock management
- Image URL input
- Admin-only component

#### `AddToCartButton` (`src/components/add-to-cart-button.tsx`)
- Add products to cart with quantity selection
- Stock validation
- Loading states
- Success/error notifications
- Authentication check

#### `SearchInput` (`src/components/search-input.tsx`)
- Real-time product search
- Debounced input for performance
- Updates URL search parameters
- Preserves other filters when searching

#### `AuthProvider` (`src/components/auth-provider.tsx`)
- Context provider for authentication state
- Manages JWT token storage
- Provides user information across the app
- Handles sign in/sign out functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ or Bun
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd capstone
```

2. Install dependencies:
```bash
bun install
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and JWT secret:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
```

4. Set up the database:
```bash
bun run db:generate

bun run db:migrate

bun run db:push
```

5. Start the development server:
```bash
bun run dev
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Management

```bash
bun run db:studio

bun run db:generate

bun run db:migrate

bun run db:push
```

## 📜 Available Scripts

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint errors
- `bun run format:check` - Check code formatting
- `bun run format:write` - Format code with Prettier
- `bun run typecheck` - Run TypeScript type checking
- `bun run check` - Run linting and type checking
- `bun run db:studio` - Open Prisma Studio
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run database migrations
- `bun run db:push` - Push schema to database

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin vs Customer permissions
- **API Route Protection**: Middleware for authenticated routes
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Protection**: Prisma ORM parameterized queries

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching with next-themes
- **Animations**: Smooth transitions with Motion (Framer Motion)
- **Toast Notifications**: User feedback with Sonner
- **Loading States**: Visual feedback for async operations
- **Form Validation**: Client and server-side validation
- **Accessible Components**: Radix UI primitives

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

This is a capstone project. Contributions are welcome for educational purposes.
