/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const TenantController = () => import('#controllers/tenant_controller')
const CategoryController = () => import('#controllers/category_controller')
const ProductController = () => import('#controllers/product_controller')
const OrderController = () => import('#controllers/order_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

// Authentication Routes (rate-limited: 10 attempts per 60s per IP)
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('/auth')
  .use(middleware.throttle({ maxAttempts: 10, windowSeconds: 60 }))

// Protected API Routes
router
  .group(() => {
    // Tenants
    router.get('/tenants', [TenantController, 'index'])
    router.post('/tenants', [TenantController, 'store'])

    // Multi-tenant resources (tenant membership enforced by middleware)
    router
      .group(() => {
        // Inventory: Categories
        router.get('/categories', [CategoryController, 'index'])
        router.post('/categories', [CategoryController, 'store'])
        router.put('/categories/:id', [CategoryController, 'update'])
        router.delete('/categories/:id', [CategoryController, 'destroy'])

        // Inventory: Products
        router.get('/products', [ProductController, 'index'])
        router.post('/products', [ProductController, 'store'])
        router.put('/products/:id', [ProductController, 'update'])
        router.delete('/products/:id', [ProductController, 'destroy'])

        // Sales: Orders & Payments
        router.get('/orders', [OrderController, 'index'])
        router.post('/orders', [OrderController, 'store'])
        router.get('/orders/:id', [OrderController, 'show'])
        router.post('/orders/:id/pay', [OrderController, 'pay'])
      })
      .prefix('/t/:tenant_id')
      .use(middleware.tenant())
  })
  .prefix('/api/v1')
  .use(middleware.auth())
