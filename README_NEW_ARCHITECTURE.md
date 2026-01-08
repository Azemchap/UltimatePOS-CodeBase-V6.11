# Ultimate POS v1.0 - Modern Architecture

## 🚀 Complete Transformation to Modern TypeScript Stack

This is a **complete rewrite** of Ultimate POS using cutting-edge 2026 technologies, transforming it from a Laravel/PHP monolith to a modern, scalable, type-safe full-stack TypeScript application.

## 📚 Technology Stack

### Core Framework
- **[TanStack Start](https://tanstack.com/start)** - Modern full-stack React framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19](https://react.dev/)** - Latest React with Server Components

### Data Layer
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe SQL ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Zod](https://zod.dev/)** - Runtime type validation

### Routing & State
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight client state

### UI & Styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Lucide Icons](https://lucide.dev/)** - Modern icon library

### Security & Auth
- **[JWT (jose)](https://www.npmjs.com/package/jose)** - Secure token-based auth
- **[bcrypt](https://www.npmjs.com/package/bcryptjs)** - Password hashing
- **RBAC** - Role-based access control

## 🏗️ Architecture Overview

```
app/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Homepage (redirects to login)
│   ├── login.tsx       # Login page
│   └── dashboard/      # Protected dashboard routes
│       ├── index.tsx
│       ├── products.tsx
│       ├── sales.tsx
│       └── ...
├── components/
│   ├── ui/             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── features/       # Feature-specific components
│       ├── auth/
│       ├── dashboard/
│       └── products/
├── server/
│   ├── api/            # API endpoints
│   │   ├── auth/
│   │   ├── products/
│   │   └── ...
│   ├── auth/           # Auth utilities (JWT, password)
│   ├── db/             # Database queries
│   └── middleware/     # Server middleware
├── stores/             # Zustand state stores
│   ├── auth-store.ts
│   └── theme-store.ts
├── lib/                # Utilities and helpers
│   └── utils.ts
└── styles/
    └── globals.css     # Global styles with theme

db/
├── schema/             # Drizzle schema definitions
│   ├── users.ts
│   ├── business.ts
│   ├── products.ts
│   └── ...
├── migrations/         # Auto-generated migrations
└── index.ts           # Database connection
```

## 🔒 Security Features

✅ **JWT-based authentication** with secure token signing
✅ **Password hashing** with bcrypt (10 rounds)
✅ **SQL injection prevention** via Drizzle ORM
✅ **XSS protection** through React's auto-escaping
✅ **CSRF protection** ready (implement with tokens)
✅ **Input validation** with Zod schemas
✅ **Type safety** throughout the stack
✅ **Role-based access control (RBAC)** ready

## 📦 Database Schema

The new schema includes:

- **Users** - Authentication and user management
- **Businesses** - Multi-tenant business support
- **Products** - Product catalog with variants
- **Categories** - Hierarchical product categorization
- **Brands** - Product brands
- **Units** - Measurement units
- **Tax Rates** - Flexible tax configuration
- **Permissions & Roles** - RBAC system
- *...and more to be migrated*

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd UltimatePOS-CodeBase-V6.11
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.new .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb ultimate_pos

   # Generate and run migrations
   npm run db:generate
   npm run db:migrate

   # Or push schema directly (development)
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:3000`

## 🛠️ Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to DB (dev)
npm run db:studio    # Open Drizzle Studio (DB GUI)
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

## 🎨 Theme System

The app includes a complete dark/light theme system:

- **CSS Variables** for consistent theming
- **System preference** detection
- **Persistent** theme selection
- **shadcn/ui** compatible colors

Toggle theme via the `useTheme()` hook:

```typescript
import { useTheme } from '~/stores/theme-store'

const { theme, setTheme, applyTheme } = useTheme()
setTheme('dark') // 'light' | 'dark' | 'system'
```

## 🔐 Authentication Flow

1. **User Login** → `POST /api/auth/login`
   - Validates credentials
   - Returns JWT token + user data
   - Stores in Zustand + localStorage

2. **Protected Routes**
   - Check `useAuthStore().isAuthenticated`
   - Send token in `Authorization: Bearer <token>`
   - Server validates JWT on each request

3. **Logout**
   - Clears Zustand store
   - Redirects to login

## 📊 State Management

### Client State (Zustand)
```typescript
// Auth state
const user = useAuthStore(state => state.user)
const token = useAuthStore(state => state.token)
const logout = useAuthStore(state => state.logout)
```

### Server State (TanStack Query)
```typescript
// Fetch data with caching
const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetch('/api/products')
})
```

## 🗄️ Database Operations

### Using Drizzle ORM

```typescript
import { db, products } from '@db'
import { eq } from 'drizzle-orm'

// Insert
await db.insert(products).values({ name: 'New Product', ... })

// Select
const allProducts = await db.select().from(products)

// Update
await db.update(products).set({ name: 'Updated' }).where(eq(products.id, 1))

// Delete
await db.delete(products).where(eq(products.id, 1))
```

## 🎯 Migration Progress

### ✅ Completed
- [x] Project setup & tooling
- [x] Database schema (core tables)
- [x] Authentication system (JWT)
- [x] Authorization (RBAC ready)
- [x] UI components (shadcn/ui)
- [x] Theme system
- [x] Products module (API + UI example)
- [x] Dashboard layout

### 🔄 In Progress / TODO
- [ ] Complete all product CRUD operations
- [ ] Sales/POS module
- [ ] Purchases module
- [ ] Inventory management
- [ ] Customers/Contacts
- [ ] Reports & Analytics
- [ ] Payment integrations
- [ ] Multi-tenant support
- [ ] Real-time features (WebSockets)
- [ ] Notifications system
- [ ] File uploads (images)
- [ ] Barcode generation
- [ ] Receipt printing
- [ ] Tax calculations
- [ ] Discount management
- [ ] Testing (Vitest + React Testing Library)

## 📈 Performance Optimizations

- **Code splitting** via TanStack Router
- **Lazy loading** for routes and components
- **Server-side rendering** with TanStack Start
- **Database indexing** on frequently queried columns
- **Connection pooling** with postgres.js
- **Optimistic updates** with TanStack Query

## 🔧 Best Practices

1. **Type Safety** - Use TypeScript everywhere
2. **Validation** - Validate with Zod on both client & server
3. **Security** - Never trust client input
4. **Components** - Keep them small and reusable
5. **API Design** - RESTful endpoints, consistent responses
6. **Error Handling** - Graceful errors with user feedback
7. **Code Style** - Follow ESLint + Prettier rules

## 📝 API Structure

All APIs follow this pattern:

```typescript
// app/server/api/resource/index.ts
export const APIRoute = createAPIFileRoute('/api/resource')({
  GET: async ({ request }) => { /* List */ },
  POST: async ({ request }) => { /* Create */ },
})

// app/server/api/resource/[id].ts
export const APIRoute = createAPIFileRoute('/api/resource/$id')({
  GET: async ({ params }) => { /* Get one */ },
  PUT: async ({ params, request }) => { /* Update */ },
  DELETE: async ({ params }) => { /* Delete */ },
})
```

## 🤝 Contributing

1. Create feature branch
2. Make changes with tests
3. Run `npm run lint` and `npm run type-check`
4. Submit pull request

## 📄 License

[Your License Here]

## 🆘 Support

For issues or questions, please [open an issue](your-repo/issues).

---

**Built with ❤️ using the latest 2026 technologies**
