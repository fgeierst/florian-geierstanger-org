<script>
import { onMount } from "svelte";
import { slide } from 'svelte/transition';

let pages = [];
let query = '';

onMount(async () => {
  fetch('/sitemap.json')
  .then(response => response.json())
  .then(data => {
		// console.log(data);
		pages = data;
  }).catch(error => {
    console.log(error);
    return [];
  });
});

$: filteredPages = pages.filter(page => {
	return page.title.toLowerCase().includes(query.toLowerCase());
}); 
</script>

<div class="search">
	<label>
		Suche
		<input type="text" bind:value={query}>
	</label>
	
	{#if query}
	<ul class="results" transition:slide>
		{#each filteredPages as page}
			<li><a href="{page.id}">{page.title}</a></li>
		{/each}
	</ul>
	{/if}
</div>


<style>
	.search {
		position: relative;
		text-align: right;
		padding-block-start: var(--space-100);
	}
	.results {
		list-style: none;
		padding: 0;
		position: absolute;
		top: var(--space-300);
		right: 0;
		width: 20em;
		max-width: 80vw;
		background-color: var(--color-background);
		max-height: 50vh;
		overflow-y: scroll;
		box-shadow: 1rem 1rem 1rem hsla(var(--hsl-text), 0.2);
		border: 2px solid hsla(var(--hsl-text), 0.5);
	}
</style>