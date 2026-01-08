# Migration Guide: Laravel PHP → TypeScript Full-Stack

## Overview

This guide explains how the legacy Laravel PHP codebase has been transformed into a modern TypeScript full-stack application.

## Architecture Comparison

### Before (Laravel PHP)
```
Legacy Stack:
- Backend: Laravel 9 (PHP)
- Frontend: jQuery + AdminLTE
- Database: MySQL (Eloquent ORM)
- Auth: Laravel Passport (OAuth2)
- Templates: Blade
- Routing: Laravel Router
```

### After (Modern TypeScript)
```
New Stack:
- Full-Stack: TanStack Start (TypeScript)
- Frontend: React 19 + shadcn/ui
- Database: PostgreSQL (Drizzle ORM)
- Auth: JWT (jose)
- Components: React Components
- Routing: TanStack Router
```

## Database Migration

### Schema Transformation

**Laravel (Eloquent)**
```php
// database/migrations/2017_08_08_115903_create_products_table.php
Schema::create('products', function (Blueprint $table) {
    $table->increments('id');
    $table->string('name');
    $table->integer('business_id')->unsigned();
    $table->foreign('business_id')->references('id')->on('business');
    // ...
});
```

**Drizzle (TypeScript)**
```typescript
// db/schema/products.ts
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id, { onDelete: 'cascade' }),
  // ...
})
```

### Migration Steps

1. **Export data from MySQL**
   ```bash
   mysqldump -u root -p ultimate_pos > backup.sql
   ```

2. **Convert schema to PostgreSQL**
   - Drizzle schema already created in `db/schema/`
   - Run: `npm run db:push` or `npm run db:migrate`

3. **Import data**
   - Transform MySQL dump to PostgreSQL format
   - Use data import scripts (create custom scripts as needed)

## API Transformation

### Before: Laravel Controllers
```php
// app/Http/Controllers/ProductController.php
class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('business')->get();
        return view('products.index', compact('products'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            // ...
        ]);

        $product = Product::create($validated);
        return redirect()->route('products.index');
    }
}
```

### After: TanStack Start API Routes
```typescript
// app/server/api/products/index.ts
export const APIRoute = createAPIFileRoute('/api/products')({
  GET: async ({ request }) => {
    const token = await verifyToken(request.headers.get('Authorization'))
    const products = await db.select().from(products)
    return json({ data: products })
  },

  POST: async ({ request }) => {
    const token = await verifyToken(request.headers.get('Authorization'))
    const body = await request.json()
    const validated = insertProductSchema.parse(body)
    const [product] = await db.insert(products).values(validated).returning()
    return json({ data: product }, { status: 201 })
  }
})
```

## Frontend Transformation

### Before: Blade + jQuery
```php
<!-- resources/views/products/index.blade.php -->
@extends('layouts.app')

@section('content')
<div class="box">
    <div class="box-header">
        <h3>Products</h3>
    </div>
    <div class="box-body">
        <table id="products-table" class="table">
            @foreach($products as $product)
            <tr>
                <td>{{ $product->name }}</td>
            </tr>
            @endforeach
        </table>
    </div>
</div>

<script>
$(document).ready(function() {
    $('#products-table').DataTable();
});
</script>
@endsection
```

### After: React + TypeScript
```typescript
// app/components/features/products/products-list.tsx
export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const token = useAuthStore(state => state.token)

  useEffect(() => {
    fetch('/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setProducts(data.data))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
```

## Authentication Migration

### Before: Laravel Passport (Session + OAuth)
```php
// app/Http/Controllers/Auth/LoginController.php
public function login(Request $request)
{
    $credentials = $request->only('username', 'password');

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return redirect()->intended('dashboard');
    }

    return back()->withErrors(['username' => 'Invalid credentials']);
}
```

### After: JWT Authentication
```typescript
// app/server/api/auth/login.ts
export const APIRoute = createAPIFileRoute('/api/auth/login')({
  POST: async ({ request }) => {
    const { username, password } = await request.json()

    const [user] = await db.select().from(users)
      .where(eq(users.username, username))

    if (!user || !await verifyPassword(password, user.password)) {
      return json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signToken(user)
    return json({ user, token })
  }
})
```

## Routing Comparison

### Before: Laravel Routes
```php
// routes/web.php
Route::get('/', 'HomeController@index');
Route::resource('products', 'ProductController');
Route::post('/login', 'Auth\LoginController@login');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', 'DashboardController@index');
    Route::resource('sales', 'SellController');
});
```

### After: TanStack Router (File-Based)
```
app/routes/
├── __root.tsx              → Layout
├── index.tsx               → '/'
├── login.tsx               → '/login'
├── dashboard.tsx           → '/dashboard' (protected)
│   ├── index.tsx          → '/dashboard'
│   ├── products.tsx       → '/dashboard/products'
│   └── sales.tsx          → '/dashboard/sales'
```

## State Management

### Before: Server State (Laravel)
```php
// Data fetched on every request
$products = Product::all();
return view('products', ['products' => $products]);
```

### After: Client State (Zustand + TanStack Query)
```typescript
// Global auth state
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}))

// Server data caching
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetch('/api/products').then(r => r.json())
})
```

## Validation

### Before: Laravel Validation
```php
$request->validate([
    'name' => 'required|string|max:255',
    'sku' => 'required|unique:products',
    'price' => 'required|numeric|min:0',
]);
```

### After: Zod Validation
```typescript
const productSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1),
  price: z.number().min(0),
})

// Client-side
const validated = productSchema.parse(formData)

// Server-side
const validated = insertProductSchema.parse(body)
```

## File Structure Mapping

| Laravel | TanStack Start |
|---------|---------------|
| `app/Http/Controllers/` | `app/server/api/` |
| `app/Models/` | `db/schema/` |
| `resources/views/` | `app/routes/` + `app/components/` |
| `resources/js/` | `app/` |
| `public/` | `public/` |
| `database/migrations/` | `db/migrations/` |
| `routes/web.php` | File-based routing in `app/routes/` |
| `routes/api.php` | `app/server/api/` |

## Key Improvements

### Type Safety
- **Before**: Runtime errors, no autocomplete
- **After**: Compile-time errors, full IntelliSense

### Performance
- **Before**: Full page reload on every navigation
- **After**: SPA with code splitting, instant navigation

### Developer Experience
- **Before**: PHP + JS context switching
- **After**: Single language (TypeScript)

### Scalability
- **Before**: Monolithic architecture
- **After**: API-first, can scale independently

### Security
- **Before**: Session-based, CSRF tokens
- **After**: JWT tokens, stateless, CORS-ready

## Next Steps

1. **Data Migration**: Export existing data and import to PostgreSQL
2. **Feature Parity**: Implement remaining Laravel features
3. **Testing**: Add comprehensive tests with Vitest
4. **Deployment**: Set up CI/CD pipeline
5. **Monitoring**: Add error tracking and analytics

## Need Help?

- Check `README_NEW_ARCHITECTURE.md` for setup
- Review examples in `app/server/api/products/`
- See component patterns in `app/components/`
