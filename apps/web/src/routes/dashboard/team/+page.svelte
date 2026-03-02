<script lang="ts">
	import { enhance } from "$app/forms";
	import { fade, slide } from "svelte/transition";
	import type { PageData } from "./$types";

	let { data, form }: { data: PageData; form: any } = $props();

	let showInviteForm = $state(false);
	let editingMemberId = $state<number | null>(null);

	let members = $derived(data.members ?? []);

	// Role counts
	let ownerCount = $derived(members.filter((m) => m.role === "owner").length);
	let adminCount = $derived(members.filter((m) => m.role === "admin").length);
	let employeeCount = $derived(members.filter((m) => m.role === "employee").length);

	function roleBadgeClass(role: string): string {
		switch (role) {
			case "owner":
				return "bg-emerald-600 text-white border-emerald-800";
			case "admin":
				return "bg-black text-white border-black";
			case "employee":
				return "bg-white text-black border-black";
			default:
				return "bg-gray-200 text-black border-gray-400";
		}
	}
</script>

<svelte:head>
	<title>[ TEAM ] - MicroPOS</title>
</svelte:head>

<div class="mx-auto max-w-[1400px] px-4 md:px-8 py-8 w-full min-h-screen">
	<!-- Header Section -->
	<header
		class="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-4 border-black pb-6 gap-6 relative"
	>
		<!-- Decorative barcode-like lines -->
		<div class="absolute top-0 right-0 flex gap-1 opacity-20 pointer-events-none">
			{#each Array(15) as _, i}
				<div class="h-16 bg-black" style="width: {Math.random() * 8 + 2}px"></div>
			{/each}
		</div>

		<div class="relative z-10">
			<div
				class="inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest mb-4 bg-black text-[var(--color-surface)] px-3 py-1.5 brutal-shadow"
			>
				<div class="relative flex h-3 w-3">
					<span
						class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
					></span>
					<span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
				</div>
				ACCESS: OWNER ONLY
			</div>
			<h1
				class="text-6xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none"
			>
				Team<br />
				<span class="text-emerald-600">Management</span>
			</h1>
		</div>

		<div
			class="flex gap-6 font-mono text-sm bg-white border-2 border-black p-4 brutal-shadow z-10"
		>
			<div class="flex flex-col">
				<span class="text-gray-500 font-bold uppercase text-xs">Total</span>
				<span class="text-2xl font-black">{members.length}</span>
			</div>
			<div class="w-0.5 bg-black"></div>
			<div class="flex flex-col">
				<span class="text-emerald-600 font-bold uppercase text-xs">Owners</span>
				<span class="text-2xl font-black">{ownerCount}</span>
			</div>
			<div class="flex flex-col">
				<span class="text-gray-700 font-bold uppercase text-xs">Admins</span>
				<span class="text-2xl font-black">{adminCount}</span>
			</div>
			<div class="flex flex-col">
				<span class="text-gray-400 font-bold uppercase text-xs">Employees</span>
				<span class="text-2xl font-black">{employeeCount}</span>
			</div>
		</div>
	</header>

	{#if data.tenants?.length === 0}
		<div
			class="bg-emerald-600 text-white font-mono p-8 mb-8 border-2 border-black brutal-shadow text-center"
		>
			<h2 class="text-2xl font-black uppercase tracking-widest mb-4">
				No Data Link Established
			</h2>
			<p class="mb-4">
				Your operator account is not assigned to any Active Storefronts (Tenants).
			</p>
			<p class="text-xs opacity-75">
				&gt;&gt; Please register a new operator account to auto-provision a storefront. &lt;&lt;
			</p>
		</div>
	{:else}
		{#if form?.error}
			<div
				class="bg-black text-[var(--color-brand)] font-mono p-4 mb-8 border-2 border-[var(--color-brand)] brutal-shadow flex justify-between items-center"
				transition:fade
			>
				<span class="font-bold">&gt;&gt; ERR: {form.error}</span>
			</div>
		{/if}

		{#if form?.success}
			<div
				class="bg-emerald-600 text-white font-mono p-4 mb-8 border-2 border-black brutal-shadow flex justify-between items-center"
				transition:fade
			>
				<span class="font-bold">&gt;&gt; Operation completed successfully.</span>
			</div>
		{/if}

		<!-- Action Bar -->
		<div
			class="bg-black border-2 border-black p-4 brutal-shadow flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6"
		>
			<div class="font-mono text-xs font-bold uppercase text-gray-400 tracking-widest">
				PERSONNEL ROSTER &mdash; {members.length} ACTIVE MEMBERS
			</div>

			<button
				onclick={() => (showInviteForm = !showInviteForm)}
				class="font-mono text-xs font-bold uppercase bg-emerald-500 text-white px-4 py-2 border-2 border-emerald-500 hover:bg-white hover:text-black hover:border-white transition-colors"
			>
				{showInviteForm ? "[-] Close" : "[+] Invite Member"}
			</button>
		</div>

		<!-- Invite Member Form -->
		{#if showInviteForm}
			<div
				class="bg-white border-2 border-black p-6 brutal-shadow mb-6 relative overflow-hidden"
				transition:slide
			>
				<div
					class="absolute right-0 bottom-0 w-32 h-32 grid-bg opacity-20 pointer-events-none"
				></div>

				<form
					method="POST"
					action="?/invite"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							if (!form?.error) {
								showInviteForm = false;
							}
						};
					}}
				>
					<input type="hidden" name="tenantId" value={data.activeTenantId} />

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div>
							<label
								for="invite-name"
								class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1"
								>&gt; Full Name *</label
							>
							<input
								id="invite-name"
								name="fullName"
								type="text"
								required
								class="w-full brutal-input"
								placeholder="John Doe"
							/>
						</div>
						<div>
							<label
								for="invite-email"
								class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1"
								>&gt; Email *</label
							>
							<input
								id="invite-email"
								name="email"
								type="email"
								required
								class="w-full brutal-input"
								placeholder="user@example.com"
							/>
						</div>
						<div>
							<label
								for="invite-role"
								class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1"
								>&gt; Role *</label
							>
							<select
								id="invite-role"
								name="role"
								required
								class="w-full brutal-input"
							>
								<option value="">-- SELECT ROLE --</option>
								<option value="admin">Admin</option>
								<option value="employee">Employee</option>
							</select>
						</div>
						<div>
							<label
								for="invite-password"
								class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1"
								>&gt; Password *</label
							>
							<input
								id="invite-password"
								name="password"
								type="password"
								required
								class="w-full brutal-input"
								placeholder="Min 8 characters"
							/>
						</div>
						<div>
							<label
								for="invite-password-confirm"
								class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1"
								>&gt; Confirm Password *</label
							>
							<input
								id="invite-password-confirm"
								name="password_confirmation"
								type="password"
								required
								class="w-full brutal-input"
								placeholder="Re-enter password"
							/>
						</div>
					</div>

					<div class="mt-2 font-mono text-xs text-gray-400">
						&gt;&gt; If a user with this email already exists, they will be added to the team without creating a new account.
					</div>

					<div class="mt-6 flex justify-end">
						<button
							type="submit"
							class="bg-emerald-600 text-white font-mono text-sm font-black uppercase px-8 py-3 border-2 border-black hover:bg-black transition-colors brutal-shadow"
						>
							Invite Member
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- Team Members Table -->
		<div class="bg-white border-2 border-black brutal-shadow overflow-x-auto">
			<table class="w-full text-left font-mono text-sm whitespace-nowrap">
				<thead
					class="bg-black text-white text-xs uppercase tracking-widest border-b-2 border-black"
				>
					<tr>
						<th class="px-5 py-4 font-bold">Member_ID</th>
						<th class="px-5 py-4 font-bold">Designation</th>
						<th class="px-5 py-4 font-bold">Contact_Email</th>
						<th class="px-5 py-4 font-bold">Role</th>
						<th class="px-5 py-4 font-bold">Joined</th>
						<th class="px-5 py-4 font-bold text-center">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y-2 divide-black">
					{#if members.length === 0}
						<tr>
							<td colspan="6" class="p-8 text-center text-gray-500 uppercase font-bold"
								>No Team Members Found</td
							>
						</tr>
					{:else}
						{#each members as member (member.id)}
							{#if editingMemberId === member.id}
								<tr class="bg-[var(--color-surface)] border-b-2 border-black">
									<td colspan="6" class="p-4">
										<form
											method="POST"
											action="?/updateRole"
											class="flex flex-col sm:flex-row items-start sm:items-end gap-4"
											use:enhance={() => {
												return async ({ update }) => {
													await update();
													editingMemberId = null;
												};
											}}
										>
											<input type="hidden" name="id" value={member.id} />
											<input
												type="hidden"
												name="tenantId"
												value={data.activeTenantId}
											/>

											<div class="flex-1">
												<div class="text-[10px] font-bold text-gray-500 mb-1">
													EDITING: {member.user.fullName || member.user.email}
												</div>
												<div class="flex items-center gap-4">
													<div>
														<label
															class="text-[10px] font-bold text-gray-500 block mb-1"
															>ROLE</label
														>
														<select
															name="role"
															class="brutal-input py-1 px-2 text-xs"
														>
															<option
																value="owner"
																selected={member.role === "owner"}
																>Owner</option
															>
															<option
																value="admin"
																selected={member.role === "admin"}
																>Admin</option
															>
															<option
																value="employee"
																selected={member.role === "employee"}
																>Employee</option
															>
														</select>
													</div>
												</div>
											</div>

											<div class="flex gap-2">
												<button
													type="button"
													onclick={() => (editingMemberId = null)}
													class="bg-white text-black border-2 border-black font-mono text-xs px-4 py-2 hover:bg-gray-100"
													>CANCEL</button
												>
												<button
													type="submit"
													class="bg-black text-white font-mono text-xs px-4 py-2 hover:bg-emerald-600 border-2 border-black"
													>UPDATE</button
												>
											</div>
										</form>

										<!-- Separate remove form -->
										<form
											method="POST"
											action="?/removeMember"
											class="mt-3 flex justify-end"
											use:enhance={() => {
												return async ({ update }) => {
													await update();
													editingMemberId = null;
												};
											}}
										>
											<input type="hidden" name="id" value={member.id} />
											<input
												type="hidden"
												name="tenantId"
												value={data.activeTenantId}
											/>
											<button
												type="submit"
												class="bg-red-500 text-white font-mono text-xs px-4 py-2 border-2 border-red-700 hover:bg-red-600"
												>REMOVE FROM TEAM</button
											>
										</form>
									</td>
								</tr>
							{:else}
								<tr
									onclick={() => (editingMemberId = member.id)}
									onkeydown={(e) =>
										e.key === "Enter" && (editingMemberId = member.id)}
									tabindex="0"
									class="hover:bg-emerald-50 transition-colors group cursor-pointer"
								>
									<td class="px-5 py-4 text-gray-500 group-hover:text-emerald-700">
										TM-{member.id.toString().padStart(4, "0")}
									</td>
									<td
										class="px-5 py-4 font-bold font-display text-lg uppercase tracking-tight"
									>
										{member.user.fullName || "--"}
									</td>
									<td class="px-5 py-4 text-gray-600">
										{member.user.email}
									</td>
									<td class="px-5 py-4">
										<span
											class="inline-block px-3 py-1 border-2 text-xs font-black uppercase tracking-widest {roleBadgeClass(member.role)}"
										>
											{member.role}
										</span>
									</td>
									<td class="px-5 py-4 text-gray-500 text-xs">
										{new Date(member.createdAt).toLocaleDateString()}
									</td>
									<td class="px-5 py-4 text-center">
										<span
											class="text-emerald-600 font-bold underline decoration-2 underline-offset-4 text-xs uppercase"
											>EDIT</span
										>
									</td>
								</tr>
							{/if}
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	{/if}
</div>
