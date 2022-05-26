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
		Search
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
	}
	.results {
		list-style: none;
		padding: 0;
		position: absolute;
		top: 2em;
		right: 0;
		width: 20em;
		max-width: 80vw;
		background-color: white;
		max-height: 50vh;
		overflow-y: scroll;
		box-shadow: 1rem 1rem 1rem rgba(0,0,0,0.2);
		border: 2px solid black;
	}
</style>