<script lang="ts">
  import type { PageData } from "./$types.js";
  import { fade } from "svelte/transition";

  let { data } = $props<{ data: PageData }>();

  // Filter out pending orders if desired, or show all
  let orders = $derived(data.orders || []);
</script>

<svelte:head>
  <title>LEDGER | MICROPOS</title>
</svelte:head>

<div class="mx-auto max-w-[1400px] px-4 md:px-8 py-8 w-full min-h-screen">
  <!-- Header Section -->
  <header class="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-4 border-black pb-6 gap-6 relative">
    <div class="absolute top-0 right-0 flex gap-1 opacity-20 pointer-events-none">
      {#each Array(15) as _, i}
        <div class="h-16 bg-black" style="width: {Math.random() * 8 + 2}px"></div>
      {/each}
    </div>

    <div class="relative z-10">
      <div class="inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest mb-4 bg-black text-white px-3 py-1.5 brutal-shadow">
        <div class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </div>
        DATA_ARCHIVE: ACCESSED
      </div>
      <h1 class="text-6xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
        Transaction<br />
        <span class="text-blue-600">Ledger</span>
      </h1>
    </div>

    <div class="flex gap-4 font-mono text-sm bg-white border-2 border-black p-4 brutal-shadow z-10">
      <div class="flex flex-col">
        <span class="text-gray-500 font-bold uppercase text-xs">Total Records</span>
        <span class="text-2xl font-black">{orders.length}</span>
      </div>
      <div class="w-0.5 bg-black"></div>
      <div class="flex flex-col">
        <span class="text-gray-500 font-bold uppercase text-xs">Completed</span>
        <span class="text-2xl font-black text-green-600">
          {orders.filter((o: any) => o.status === 'completed').length}
        </span>
      </div>
    </div>
  </header>

  {#if data.tenants?.length === 0}
    <div class="bg-[var(--color-brand)] text-white font-mono p-8 mb-8 border-2 border-black brutal-shadow text-center">
      <h2 class="text-2xl font-black uppercase tracking-widest mb-4">No Data Link Established</h2>
      <p class="mb-4">Your operator account is not assigned to any Active Storefronts (Tenants).</p>
    </div>
  {:else}
    <div class="bg-white border-2 border-black brutal-shadow overflow-x-auto">
      <table class="w-full text-left font-mono text-sm whitespace-nowrap">
        <thead class="bg-black text-white text-xs uppercase tracking-widest border-b-2 border-black">
          <tr>
            <th class="px-5 py-4 font-bold">Tx_ID</th>
            <th class="px-5 py-4 font-bold">Timestamp</th>
            <th class="px-5 py-4 font-bold">Operator</th>
            <th class="px-5 py-4 font-bold text-right">Total_Value</th>
            <th class="px-5 py-4 font-bold text-center">Status</th>
            <th class="px-5 py-4 font-bold text-center">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y-2 divide-black">
          {#if orders.length === 0}
            <tr>
              <td colspan="6" class="p-8 text-center text-gray-500 uppercase font-bold">No Transactions Found</td>
            </tr>
          {:else}
            {#each orders as order}
              <tr class="hover:bg-blue-50 transition-colors group cursor-default">
                <td class="px-5 py-4 font-bold">
                  #{order.id.toString().padStart(6, '0')}
                </td>
                <td class="px-5 py-4 text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td class="px-5 py-4">
                  OP-{order.userId}
                </td>
                <td class="px-5 py-4 text-right font-black text-lg">
                  ${Number(order.total).toFixed(2)}
                </td>
                <td class="px-5 py-4 text-center">
                  {#if order.status === 'completed'}
                    <span class="inline-block bg-green-500 text-black px-2 py-1 text-[10px] font-bold border-2 border-black shadow-[2px_2px_0_0_#000]">COMPLETED</span>
                  {:else}
                    <span class="inline-block bg-yellow-400 text-black px-2 py-1 text-[10px] font-bold border-2 border-black shadow-[2px_2px_0_0_#000] uppercase">{order.status}</span>
                  {/if}
                </td>
                <td class="px-5 py-4 text-center">
                  <a href="/dashboard/orders/{order.id}" class="text-blue-600 hover:text-blue-800 font-bold underline decoration-2 underline-offset-4">VIEW_RECEIPT</a>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</div>
