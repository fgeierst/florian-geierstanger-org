---
title: 'A CSS layout grid'
publishDate: '2022-07-27'
layout: '../../layouts/PostLayout.astro'
lang: 'en'
---

The twelfe column bootstrap grid is a great layout tool and still widely used. Here is a different approach, that is built upon the capabilites of modern CSS, especially CSS grid.

![Grid tracks](/src/images/layout-grid-tracks.jpeg)

## Features
Our mobile first grid provides four tracks (fullwidth, max content, wide content, text content), each with it's own start and end grid lines. On small devices, the three content tracks fall into one, only fullwidth track gives you the possiblity to reach out to the page margins. On bigger screens, the distinct tracks provide great variation how to present and distinguish content elements from each other. As this is based on CSS grid, mix and match these lines and place for example an image at the far left and the let it stretch across until the end of the text content track.

## Code (SCSS)
```scss
:root {
  --grid-margin: 16px;
  --grid-expansion: 160px;
  --grid-textcontent: 640px;

  --grid:
    [fullwidth-start] var(--grid-margin)
    [maxcontent-start widecontent-start textcontent-start]
    minmax(auto, var(--grid-textcontent))
    [textcontent-end widecontent-end maxcontent-end]
    var(--grid-margin) [fullwidth-end];

  /* grid-margin + textcontent + grid-margin + scrollbar (~15px) */
  @media (min-width: 720px) {
    --grid:
      [fullwidth-start] minmax(var(--grid-margin), 1fr)
      [maxcontent-start] minmax(0, var(--grid-expansion))
      [widecontent-start] minmax(0, var(--grid-expansion))
      [textcontent-start] var(--grid-textcontent) [textcontent-end]
      minmax(0, var(--grid-expansion)) [widecontent-end]
      minmax(0, var(--grid-expansion)) [maxcontent-end]
      minmax(var(--grid-margin), 1fr) [fullwidth-end];
	}
}

.layout-grid {
  grid-column: fullwidth !important;
  display: grid;
  grid-template-columns: var(--grid);
  > * {
    grid-column: fullwidth;
  }
}
```

## Subgrid

With the upcoming CSS subgrid feature, this grid will become even more powerfull, as you then can use the grid track from a parent.

