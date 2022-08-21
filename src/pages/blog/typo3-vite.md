---
title: 'TYPO3 and Vite'
description: 'Modern Frontend Tooling for Typo3 — Integrating Vite'
publishDate: '2022-08-07'
layout: '../../layouts/PostLayout.astro'
lang: 'en'
---

In recent days the tooling for frontend development has improved a lot. After experiencing Vite's ultra fast hot module reloading, I never want to back. At the [TYPO3 Developer Days 2022 in Karlsruhe](https://t3dd22.typo3.com/schedule) I worked on a quick demo, how to integrate Vite with TYPO3.

<div class="video">
  <video src="/assets/images/typo3-vite-hmr-screenrecording.mp4" width="1920" height="1080" autoplay loop controls muted></video>
</div>

Using [DDEV](https://ddev.readthedocs.io/en/stable/) as a local PHP development environments, the [ddev-viteserve add-on](https://github.com/torenware/ddev-viteserve) already got me halve the way there. The CLI command `ddev vite-serve start` start's the Vite dev server and exposes it at port 5173 on the DDEV server.

There is no existing TYPO3 Vite integration (yet), but what is left to do is described in the [Vite Backend Integration Guide](https://vitejs.dev/guide/backend-integration.html). 

- [Github Repository](https://github.com/fgeierst/typo3-vite-demo/)