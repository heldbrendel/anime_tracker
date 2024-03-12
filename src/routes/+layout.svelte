<script lang="ts">
	import type { LayoutData } from './$types';
	import '../app.css';

	export let data: LayoutData
</script>

<nav class="fixed w-full bg-white border-b border-gray-200 z-30">
	<div class="p-3">
		<div class="flex items-center justify-between">
			<h1>Tracker</h1>
			<div>{#if data.username}{data.username}{/if}</div>
		</div>
	</div>
</nav>

<slot />
