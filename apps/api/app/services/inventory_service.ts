import Category from '#models/category'
import Product from '#models/product'

interface CreateCategoryPayload {
  name: string
  description?: string | null
}

interface CreateProductPayload {
  categoryId?: number | null
  name: string
  description?: string | null
  price: number
  stock: number
  sku?: string | null
}

export default class InventoryService {
  /**
   * Create a new category for a tenant
   */
  async createCategory(tenantId: number, payload: CreateCategoryPayload): Promise<Category> {
    return await Category.create({
      tenantId,
      ...payload,
    })
  }

  /**
   * Get all categories for a tenant
   */
  async getCategories(tenantId: number): Promise<Category[]> {
    return await Category.query().where('tenantId', tenantId).orderBy('name', 'asc')
  }

  /**
   * Create a new product for a tenant
   */
  async createProduct(tenantId: number, payload: CreateProductPayload): Promise<Product> {
    return await Product.create({
      tenantId,
      ...payload,
    })
  }

  /**
   * Update an existing product
   */
  async updateProduct(
    tenantId: number,
    productId: number,
    payload: Partial<CreateProductPayload>
  ): Promise<Product> {
    const product = await Product.query()
      .where('tenantId', tenantId)
      .where('id', productId)
      .firstOrFail()

    product.merge(payload)
    await product.save()

    return product
  }

  /**
   * Get all products for a tenant
   */
  async getProducts(tenantId: number, categoryId?: number): Promise<Product[]> {
    const query = Product.query()
      .where('tenantId', tenantId)
      .preload('category')
      .orderBy('name', 'asc')

    if (categoryId) {
      query.where('categoryId', categoryId)
    }

    return await query
  }

  /**
   * Adjust stock manually
   */
  async adjustStock(tenantId: number, productId: number, quantityChange: number): Promise<Product> {
    const product = await Product.query()
      .where('tenantId', tenantId)
      .where('id', productId)
      .firstOrFail()

    product.stock += quantityChange
    await product.save()

    return product
  }
}
