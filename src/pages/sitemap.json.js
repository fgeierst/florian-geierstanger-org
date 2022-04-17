export async function get() {
	let pages = []

	// collect fetched pages
	const response = await fetch('https://wiki.fgeierst.de/lib/exe/ajax.php?call=api&fn=pages');
	const allFetchedPages = await response.json();
	allFetchedPages.forEach(page => {
		pages.push({
			title: page.title,
			id: page.id.replaceAll(':', '/')
		})
	});

	// collect Markdown pages 
	const allMarkdownPages = await import.meta.globEager(`./blog/*.md`);
	Object.values(allMarkdownPages).forEach(page => {
		pages.push({
			title: page.frontmatter.title,
			id: page.url.substring(1)
		})
	});

	// collect Astro pages 
	const allAstroPages = await import.meta.globEager(`./*.astro`);
	Object.values(allAstroPages).forEach(page => {
		if (page.frontmatter) {
			pages.push({
				title: page.frontmatter.title,
				id: '' // @todo add id
			})
		}
	});

	// build json
  return {
    body: JSON.stringify(
      Object.values(pages).map((page) => {
        return {
          title: page.title,
          id: page.id,
        };
      }),
      false,
      1
    ),
  };
}

