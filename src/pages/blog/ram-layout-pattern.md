---
title: 'The RAM Layout Pattern'
description: "No media queries, layout designed from the inside out"
publishDate: '2021-12-11'
layout: '../../layouts/PostLayout.astro'
lang: 'en'
---

- RAM (Repeat, Auto, Minmax)
- Tldr
	- No media queries, the layout is designed from the inside out.
- Alternative names
	- fluid columns
	- intrinsic design
	- responsive grid columns
- Resources:
	- https://web.dev/patterns/layout/repeat-auto-minmax/ by [[Una Kravets]]
	- https://css-tricks.com/responsive-layouts-fewer-media-queries/#using-auto-fit-and-minmax by [[Temani Afif]]
- Code

```css
.parent {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

- How to design for the RAM pattern
	- You only have to specify the min width of one child item.