# Admin Panel

Admin panel for photograph management system.

## Features

- **Authentication**: Login page (admin role required)
- **Dashboard**: Statistics overview (categories, photos, users)
- **Categories Management**: Full CRUD operations for categories

## Getting Started

### Installation

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm start
# or
yarn start
```

## Project Structure

```
admin/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Public routes (login)
│   │   ├── (admin)/         # Protected admin routes
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   └── categories/  # Categories management
│   │   └── layout.tsx       # Root layout
│   └── assets/
│       ├── components/      # Reusable components
│       ├── layouts/         # Layout components (sidebar, header)
│       ├── providers/       # Context providers
│       ├── services/        # API services
│       ├── guards/          # Route guards
│       └── lib/             # Utilities
```

## Authentication

- Only users with `role: 'admin'` can access admin pages
- Login page is accessible without authentication
- All admin routes are protected by `AdminRouteGuard`

## API Endpoints

The admin app uses the same API as the gallery app:
- Base URL: `http://localhost:4000` (configurable via `NEXT_PUBLIC_API_URL`)
- Authentication: JWT tokens stored in cookies
- All API requests include Bearer token in Authorization header

## Pages

### Login (`/login`)
- Simple login form
- Email and password authentication
- Redirects to `/dashboard` on success

### Dashboard (`/dashboard`)
- Statistics cards showing:
  - Total Categories
  - Total Photos (placeholder)
  - Total Users (placeholder)

### Categories (`/categories`)
- Full CRUD operations:
  - Create new category
  - View all categories in table
  - Edit existing category
  - Delete category (with confirmation)
- Table features:
  - Sorting by name and date
  - Pagination
  - Search/filter (can be added)

