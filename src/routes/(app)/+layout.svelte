<script>
	import '../../app.css';
</script>

<div class="flex overflow-hidden pt-16">
	<aside id="sidebar" class="fixed h-full w-64 flex">
		<div class="relative flex-1 flex flex-col">
			<div class="flex1 flex flex-col pt-5 pb-4 overflow-y-auto">
				<div class="flex-1 px-3 space-y-1">
					<ul class="space-y-2 pb-2">
						<li>
							<a href="/static" class="text-base text-gray-900 font-normal flex items-center p-2 hover:bg-gray-100 group">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
										 stroke="currentColor" class="w-6 h-6">
									<path stroke-linecap="round" stroke-linejoin="round"
												d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
								</svg>
								<span class="ml-3 flex-1 whitespace-nowrap">Dashboard</span>
							</a>
						</li>
						<li>
							<a href="/settings"
								 class="text-base text-gray-900 font-normal flex items-center p-2 hover:bg-gray-100 group">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
										 stroke="currentColor" class="w-6 h-6">
									<path stroke-linecap="round" stroke-linejoin="round"
												d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
								</svg>
								<span class="ml-3 flex-1 whitespace-nowrap">Settings</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</aside>
	<div id="main-content" class="h-full w-full relative overflow-y-auto ml-64">
		<main>
			<slot />
		</main>
	</div>
</div>


