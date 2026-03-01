<script lang="ts">
  import type { PageData } from "./$types.js";

  let { data } = $props<{ data: PageData }>();
  let order = $derived(data.order);
</script>

<svelte:head>
  <title>RECEIPT | MICROPOS</title>
</svelte:head>

<div class="mx-auto max-w-[800px] px-4 py-8 w-full min-h-screen">
  <div class="mb-6 flex items-center justify-between">
    <a href="/dashboard/orders" class="inline-block border-2 border-black bg-white px-4 py-2 font-mono text-sm font-bold uppercase hover:bg-black hover:text-white transition-colors brutal-shadow">
      &lt;&lt; BACK_TO_LEDGER
    </a>
  </div>

  {#if !order}
    <div class="bg-red-500 text-white font-mono p-8 border-2 border-black brutal-shadow text-center">
      <h2 class="text-2xl font-black uppercase tracking-widest mb-4">Error 404</h2>
      <p>Transaction record not found or inaccessible.</p>
    </div>
  {:else}
    <div class="bg-white border-4 border-black brutal-shadow p-8 md:p-12 relative overflow-hidden">
      <!-- Receipt zigzag top/bottom decoration -->
      <div class="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBMMTAgMEwyMCAyMFoiIGZpbGw9IiNmNGY0ZjAiLz48L3N2Zz4=')] opacity-50"></div>

      <header class="text-center mb-10 border-b-4 border-black pb-8">
        <h1 class="font-display font-black text-5xl uppercase tracking-tighter mb-2">MicroPOS</h1>
        <p class="font-mono text-xs text-gray-500 font-bold uppercase">Storefront / Terminal 1</p>
        <p class="font-mono text-sm font-bold mt-4 bg-black text-white inline-block px-3 py-1">
          RECEIPT NO. #{order.id.toString().padStart(6, '0')}
        </p>
      </header>

      <div class="grid grid-cols-2 gap-4 mb-8 font-mono text-sm border-b-2 border-dashed border-black pb-8">
        <div>
          <span class="text-gray-500 block text-xs font-bold uppercase">Date / Time</span>
          <span class="font-bold">{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div class="text-right">
          <span class="text-gray-500 block text-xs font-bold uppercase">Operator</span>
          <span class="font-bold">OP-{order.userId}</span>
        </div>
        <div>
          <span class="text-gray-500 block text-xs font-bold uppercase">Status</span>
          <span class="font-bold uppercase {order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}">{order.status}</span>
        </div>
        <div class="text-right">
          <span class="text-gray-500 block text-xs font-bold uppercase">Customer ID</span>
          <span class="font-bold">{order.customerId || 'WALK-IN'}</span>
        </div>
      </div>

      <div class="mb-8 border-b-4 border-black pb-8">
        <table class="w-full text-left font-mono text-sm">
          <thead>
            <tr class="text-gray-500 text-xs uppercase border-b-2 border-black">
              <th class="py-2 font-bold">Qty</th>
              <th class="py-2 font-bold">Item</th>
              <th class="py-2 font-bold text-right">Price</th>
              <th class="py-2 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {#each order.items as item}
              <tr class="border-b border-gray-200 last:border-0">
                <td class="py-3 font-bold">{item.quantity}x</td>
                <td class="py-3 uppercase pr-4">{item.product?.name || `ITEM_${item.productId}`}</td>
                <td class="py-3 text-right text-gray-600">${Number(item.price).toFixed(2)}</td>
                <td class="py-3 text-right font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-end mb-8 font-mono">
        <span class="text-lg font-bold uppercase">Total Due</span>
        <span class="text-4xl font-display font-black leading-none">${Number(order.total).toFixed(2)}</span>
      </div>

      {#if order.payments && order.payments.length > 0}
        <div class="bg-gray-100 p-4 border-2 border-black font-mono text-sm mb-8">
          <h3 class="font-bold uppercase mb-2 border-b-2 border-black pb-2">Payment Records</h3>
          {#each order.payments as payment}
            <div class="flex justify-between py-1">
              <span class="uppercase text-gray-600">{payment.method}</span>
              <span class="font-bold">${Number(payment.amount).toFixed(2)}</span>
            </div>
          {/each}
        </div>
      {/if}

      <div class="text-center font-mono text-xs text-gray-500 uppercase flex flex-col items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="square"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <p>END_OF_RECORD<br/>THANK_YOU_FOR_YOUR_BUSINESS</p>
      </div>
    </div>
    
    <div class="mt-8 flex justify-center gap-4">
      <button class="bg-black text-white px-6 py-3 font-mono font-bold uppercase border-2 border-black brutal-shadow hover:bg-[var(--color-brand)] transition-colors" onclick={() => window.print()}>
        [PRINT_RECORD]
      </button>
    </div>
  {/if}
</div>
