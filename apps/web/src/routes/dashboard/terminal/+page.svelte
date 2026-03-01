<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types.js";
  import type { Product, Category } from "$lib/api";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  // Use state for search, active category, and cart
  let searchQuery = $state("");
  let activeCategoryId = $state<number | null>(null);

  type CartItem = {
    product: Product;
    quantity: number;
  };

  let cart = $state<CartItem[]>([]);
  let paymentMethod = $state<"cash" | "card" | "transfer">("cash");

  // Derive filtered products
  let filteredProducts = $derived(
    data.products.filter((p: Product) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategoryId === null || p.categoryId === activeCategoryId;
      return matchesSearch && matchesCategory;
    }),
  );

  let cartTotal = $derived(
    cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  let isCheckingOut = $state(false);

  function addToCart(product: Product) {
    if (product.stock <= 0) return;

    const existingIndex = cart.findIndex((i) => i.product.id === product.id);
    if (existingIndex >= 0) {
      if (cart[existingIndex].quantity < product.stock) {
        cart[existingIndex].quantity += 1;
      }
    } else {
      cart.push({ product, quantity: 1 });
    }
  }

  function removeFromCart(index: number) {
    cart.splice(index, 1);
  }

  function updateQuantity(index: number, newQuantity: number) {
    const item = cart[index];
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else if (newQuantity <= item.product.stock) {
      item.quantity = newQuantity;
    } else {
      item.quantity = item.product.stock;
    }
  }

  function clearCart() {
    cart = [];
  }
</script>

<svelte:head>
  <title>TERMINAL | MICROPOS</title>
</svelte:head>

<div class="mx-auto max-w-[1600px] px-4 md:px-8 py-8 w-full min-h-[calc(100vh-4rem)] flex flex-col">
  <!-- Header Section -->
  <header class="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-4 border-black pb-6 gap-6 relative">
    <!-- Decorative barcode-like lines -->
    <div class="absolute top-0 right-0 flex gap-1 opacity-20 pointer-events-none">
      {#each Array(15) as _, i}
        <div class="h-16 bg-black" style="width: {Math.random() * 8 + 2}px"></div>
      {/each}
    </div>

    <div class="relative z-10">
      <div class="inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest mb-4 bg-[var(--color-brand)] text-white px-3 py-1.5 brutal-shadow">
        <div class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </div>
        LIVE_TERMINAL: SECURE
      </div>
      <h1 class="text-6xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
        Point of<br />
        <span class="text-[var(--color-brand)]">Sale</span>
      </h1>
    </div>

    <div class="w-full lg:w-auto flex flex-1 max-w-md bg-white border-2 border-black brutal-shadow z-10 p-2">
      <input
        type="text"
        placeholder="[SCAN OR SEARCH...]"
        class="w-full bg-transparent border-none focus:ring-0 font-mono text-lg uppercase px-4 py-2"
        bind:value={searchQuery}
        autofocus
      />
    </div>
  </header>

  {#if data.tenants?.length === 0}
    <div class="bg-[var(--color-brand)] text-white font-mono p-8 mb-8 border-2 border-black brutal-shadow text-center">
      <h2 class="text-2xl font-black uppercase tracking-widest mb-4">No Data Link Established</h2>
      <p class="mb-4">Your operator account is not assigned to any Active Storefronts (Tenants).</p>
      <p class="text-xs opacity-75">&gt;&gt; Please register a new operator account to auto-provision a storefront. &lt;&lt;</p>
    </div>
  {:else}
    <!-- Terminal Layout -->
    <div class="flex h-[800px] flex-col lg:flex-row gap-6 grid-bg">
      
      <!-- LEFT: PRODUCT SELECTION (70%) -->
      <div class="flex flex-1 flex-col gap-6 overflow-hidden">
        <!-- Categories Filter -->
        <div class="flex flex-wrap gap-2 brutal-border bg-paper p-4 brutal-shadow">
          <button
            class="px-6 py-3 border-2 border-ink uppercase font-mono text-sm font-bold transition-all {activeCategoryId === null ? 'bg-ink text-surface shadow-[inset_0_4px_0_rgba(0,0,0,0.5)]' : 'bg-surface hover:bg-paper hover:shadow-[4px_4px_0_0_#000]'}"
            onclick={() => (activeCategoryId = null)}
          >
            [ALL_ASSETS]
          </button>
          {#each data.categories as category}
            <button
              class="px-6 py-3 border-2 border-ink uppercase font-mono text-sm font-bold transition-all {activeCategoryId === category.id ? 'bg-ink text-surface shadow-[inset_0_4px_0_rgba(0,0,0,0.5)]' : 'bg-surface hover:bg-paper hover:shadow-[4px_4px_0_0_#000]'}"
              onclick={() => (activeCategoryId = category.id)}
            >
              {category.name}
            </button>
          {/each}
        </div>

        <!-- Product Grid -->
        <main class="flex-1 overflow-y-auto pr-2 pb-2">
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each filteredProducts as product}
              <button
                class="flex flex-col text-left brutal-border bg-paper p-4 h-44 relative group overflow-hidden {product.stock <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all'}"
                onclick={() => addToCart(product)}
                disabled={product.stock <= 0}
              >
                <!-- Badge for low/no stock -->
                {#if product.stock <= 0}
                  <div class="absolute top-0 right-0 bg-black text-white text-[10px] font-bold font-mono px-2 py-1 border-b-2 border-l-2 border-black z-10">
                    DEPLETED
                  </div>
                {:else if product.stock < 10}
                  <div class="absolute top-0 right-0 bg-[var(--color-brand)] text-white text-[10px] font-bold font-mono px-2 py-1 border-b-2 border-l-2 border-black z-10">
                    LOW: {product.stock}
                  </div>
                {/if}

                <div class="flex-1">
                  <h3 class="font-display font-bold text-xl leading-tight mb-1 group-hover:underline decoration-2 underline-offset-4 line-clamp-2 uppercase">{product.name}</h3>
                  {#if product.sku}
                    <div class="text-[10px] font-mono text-gray-500 mb-2">UID:{product.sku}</div>
                  {/if}
                </div>
                
                <div class="mt-auto flex justify-between items-end border-t-2 border-black/10 pt-2 w-full">
                  <div class="text-2xl font-display font-black">
                    ${Number(product.price).toFixed(2)}
                  </div>
                  <div class="text-[10px] font-mono font-bold text-gray-600 bg-gray-100 px-2 py-1 border border-black/20">
                    QTY:{product.stock}
                  </div>
                </div>
              </button>
            {/each}
            
            {#if filteredProducts.length === 0}
              <div class="col-span-full py-16 text-center brutal-border bg-white brutal-shadow">
                <h3 class="text-2xl text-gray-400 uppercase font-mono font-bold">[NO_ASSETS_FOUND]</h3>
              </div>
            {/if}
          </div>
        </main>
      </div>

      <!-- RIGHT: CART & CHECKOUT (30%) -->
      <aside class="w-full lg:w-96 flex flex-col bg-white brutal-border brutal-shadow overflow-hidden">
        <div class="bg-black text-white p-4 border-b-2 border-black flex justify-between items-center">
          <h2 class="font-display text-xl font-black uppercase m-0 tracking-tight">Active_Order</h2>
          <div class="font-mono text-xs bg-[var(--color-brand)] px-2 py-1 font-bold">
            {cart.length} ITEM{cart.length === 1 ? '' : 'S'}
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[var(--color-surface)]">
          {#each cart as item, i}
            <div class="brutal-border bg-white p-3 flex flex-col gap-2 shadow-[2px_2px_0_0_#000]">
              <div class="flex justify-between items-start">
                <h4 class="font-display font-bold text-sm leading-tight uppercase pr-4">{item.product.name}</h4>
                <button 
                  class="text-red-500 hover:text-red-700 transition-colors"
                  onclick={() => removeFromCart(i)}
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              
              <div class="flex justify-between items-center mt-2">
                <div class="flex border-2 border-black h-8 bg-white">
                  <button 
                    class="w-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors border-r-2 border-black font-mono font-bold"
                    onclick={() => updateQuantity(i, item.quantity - 1)}
                  >
                    -
                  </button>
                  <div class="w-10 flex items-center justify-center font-mono text-sm font-bold">
                    {item.quantity}
                  </div>
                  <button 
                    class="w-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors border-l-2 border-black font-mono font-bold"
                    onclick={() => updateQuantity(i, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                
                <div class="font-mono font-bold text-sm">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          {/each}
          
          {#if cart.length === 0}
            <div class="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 h-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" class="mb-4"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <p class="font-mono font-bold text-center uppercase text-sm">[AWAITING_INPUT]</p>
            </div>
          {/if}
        </div>

        <!-- Checkout Section -->
        <div class="border-t-4 border-black p-4 flex flex-col gap-4 bg-white z-10 relative">
          <div class="flex justify-between items-end">
            <span class="font-mono text-sm font-bold text-gray-500 uppercase">Total_Due</span>
            <span class="text-4xl font-display font-black leading-none">${cartTotal.toFixed(2)}</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            {#each ['cash', 'card', 'transfer'] as method}
              <button
                class="py-3 border-2 border-black font-mono uppercase text-xs sm:text-sm font-bold transition-colors {paymentMethod === method ? 'bg-black text-white shadow-[inset_0_4px_0_rgba(255,255,255,0.2)]' : 'bg-gray-100 hover:bg-white hover:shadow-[2px_2px_0_0_#000]'}"
                onclick={() => paymentMethod = method as any}
              >
                {method}
              </button>
            {/each}
          </div>

          <form
            method="POST"
            action="?/checkout"
            use:enhance={() => {
              isCheckingOut = true;
              return async ({ result, update }) => {
                isCheckingOut = false;
                if (result.type === 'success') {
                  clearCart();
                }
                update();
              };
            }}
          >
            <input type="hidden" name="tenantId" value={data.activeTenantId} />
            <input type="hidden" name="items" value={JSON.stringify(cart.map(c => ({ productId: c.product.id, quantity: c.quantity })))} />
            <input type="hidden" name="amount" value={cartTotal} />
            <input type="hidden" name="method" value={paymentMethod} />

            {#if form?.error}
              <div class="bg-red-500 text-white p-2 mb-4 font-mono text-xs font-bold uppercase border-2 border-red-700">
                >> ERR: {form.error}
              </div>
            {/if}
            {#if form?.success}
              <div class="bg-green-500 text-black p-2 mb-4 font-mono text-xs font-bold uppercase border-2 border-black brutal-shadow">
                >> TX_COMPLETE. ID: #{form.orderId}
              </div>
            {/if}

            <button
              type="submit"
              class="w-full bg-[var(--color-brand)] text-white font-display text-2xl font-black py-4 border-4 border-black brutal-shadow uppercase transition-all flex justify-center items-center gap-3 {cart.length === 0 || isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#000]'}"
              disabled={cart.length === 0 || isCheckingOut}
            >
              {#if isCheckingOut}
                <span class="animate-pulse">PROCESSING...</span>
              {:else}
                <span>EXECUTE TX</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="square"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              {/if}
            </button>
            
            <button 
              type="button" 
              class="w-full mt-4 py-2 font-mono text-xs font-bold uppercase text-gray-500 hover:text-black hover:underline transition-colors"
              onclick={clearCart}
              disabled={cart.length === 0}
            >
              [ VOID_TRANSACTION ]
            </button>
          </form>
        </div>
      </aside>
    </div>
  {/if}
</div>
