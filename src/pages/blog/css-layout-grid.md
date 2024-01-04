---
title: 'Re-thinking the layout grid with CSS grid'
publishDate: '2022-07-27'
layout: '../../layouts/PostLayout.astro'
lang: 'en'
---

While the twelfe column [Bootstrap grid](https://getbootstrap.com/docs/5.0/layout/grid/) has become the de facto standard for website layouts, modern CSS and especially [CSS grid](https://web.dev/learn/css/grid/) provides the oportunity to re-think this concept. Here is a fresh take on how a responsive, mobile first layout grid can be built.

<div class="video">
  <video src="/assets/images/layout-grid-responsive.mp4" poster="/assets/images/layout-grid-responsive-poster.jpg" width="1920" height="270" autoplay loop controls muted></video>
</div>

## Features
Our mobile first grid provides four tracks (fullwidth, max content, wide content, text content), each with it's own start and end grid lines. On small devices, the three content tracks fall into one, only fullwidth track gives you the possiblity to reach out to the page margins. On bigger screens, the distinct tracks provide great variation how to present and distinguish content elements from each other. As this is based on CSS grid, you can mix and match these lines and place for example an image at the far left and the let it stretch across until the end of the text content track.

## Code (CSS)
```css
:root {
  --grid-margin: 16px;
  --grid-expansion: 160px;
  --grid-textcontent: 640px;

  --grid:
    [fullwidth-start] var(--grid-margin)
    [maxcontent-start widecontent-start textcontent-start]
    1fr
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
<p><a href="https://codepen.io/fgeierst/pen/OJQOeaR" >Codepen</a></p>

## Notes

- With the upcoming [CSS subgrid feature]([https://](https://caniuse.com/css-subgrid)), this grid will become even more powerfull, as you then can use the grid track from a parent.

- Shout-out to Lukas Bahr  who's UI designs inspired this grid in the first place, back in January of this year, and who closely colaborated in improving it ever since.

