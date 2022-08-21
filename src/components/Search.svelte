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
		document.addEventListener('keydown', handleKeydown);
  }).catch(error => {
    console.log(error);
    return [];
  });
});

const handleKeydown = e => {
		// Focus on search input with Cmd/Ctrl p 
		if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			document.querySelector('.search input').focus();
		}

		// Close search input with escape key
		if (e.key === 'Escape') {
			e.preventDefault();
			query = '';
			document.querySelector('.search input').blur();
		}

		// If search is closed do not listen to other keys
		if (!query) {
			return;
		}

		// @todo: ArrowUp: previous search result
		// @todo: ArrowDown: next search result

}

$: filteredPages = pages.filter(page => {
	return page.title.toLowerCase().includes(query.toLowerCase());
}); 
</script>

<div class="search">
	<input type="text" bind:value={query} placeholder="Search" aria-label="Search">
	
	{#if query}
	<ul class="results" transition:slide>
		{#if (filteredPages.length > 0)}
			{#each filteredPages as page}
				<li><a href="{page.id}">{page.title}</a></li>
			{/each}
		{:else}
			<li>No results</li>
		{/if}
	</ul>
	{/if}
</div>


<style lang="scss">
	.search {
		--search-height: 2.3em;
		--search-width: 100%;
		
		@media (min-width: 500px)  {
			--search-width: 15em;
		}
		
		position: relative;
		text-align: right;
		padding-block-start: var(--space-50);
		z-index: 1;
	}

	input {
		width: var(--search-width);
		height: var(--search-height);
		border-style: dotted;
		padding-inline: .5em;

		&:focus-visible {
			border-style: solid;
			outline: none;
		}

		&::placeholder {
			color: inherit;
		}
	}

	ul {
		list-style: none;
		padding: var(--space-50);
		position: absolute;
		top: calc(var(--search-height) + 6px);
		right: 0;
		width: var(--search-width);
		background-color: var(--color-background);
		max-height: 50vh;
		overflow-y: scroll !important;
		box-shadow: 0 0 3rem hsla(var(--hsl-text), 0.05);
		border: 2px solid hsla(var(--hsl-text), 1);
	}

	li {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: unset;
	}

	a {
		text-decoration: none;
	}
</style>