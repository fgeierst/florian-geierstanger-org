---
title: 'Hello'
description: "This is my first post."
publishDate: '2021-10-01'
layout: '../../layouts/Post.astro'
---

This is my first post.


```js
export async function getStaticPaths() {
	const response = await fetch('https://florian.geierstanger.org/lib/exe/ajax.php?call=api&fn=pages');
	const pages = await response.json();
	const paramsList = pages.map(page => {
		return {
			params: {
				id: page.id
			}
		}
	})
  return paramsList;
}
const {id} = Astro.request.params;

```