export async function get() {
	let pages = []

	// collect fetched pages
	const response = await fetch('https://wiki.fgeierst.de/lib/exe/ajax.php?call=api&fn=pages');
	const allFetchedPages = await response.json();
	allFetchedPages.forEach(page => {
		pages.push({
			title: page.title,
			id: '/' + page.id.replaceAll(':', '/')
		})
	});

	// collect Markdown pages 
	const allMarkdownPages = await import.meta.glob('./blog/*.md', { eager: true });
	Object.values(allMarkdownPages).forEach(page => {
		pages.push({
			title: page.frontmatter.title,
			id: page.url
		})
	});

	// collect Astro pages 
	const allAstroPages = await import.meta.glob('./*.astro', { eager: true });
	Object.values(allAstroPages).forEach(page => {
		if (page.frontmatter) {
			pages.push({
				title: page.frontmatter.title,
				id: page.url ? page.url : '/'
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

