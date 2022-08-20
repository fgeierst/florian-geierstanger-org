---
title: 'Quick TYPO3 Installation Guide using DDEV, Composer and Sitepackagebuilder'
description: ''
publishDate: '2022-08-20'
layout: '../../layouts/PostLayout.astro'
lang: 'en'
---

## Prerequisites

Install [Docker Desktop and DDEV Local](https://ddev.readthedocs.io/en/stable/users/install/).

## Make a new directory 
(for example in the folder *~/Projects/*)  

```shell
mkdir my-new-project
cd my-new-project
```

## Install TYPO3 with DDEV  

(The following steps are taken from https://get.typo3.org/, section *Set up a new project via DDEV Local and Composer*)  
- when prompted to *Specify the site setup type*, select `site`  
- when prompted, you may use these conventions for local development  
  - username: `admin`  
  - password: `password`  
  
```shell
ddev config --project-type=typo3 --docroot=public --create-docroot
ddev composer create --no-install "typo3/cms-base-distribution:^11.5"
ddev composer install
ddev typo3cms install:setup
```

## Add this snippet to /composer.json, as a child of `"config":`  

```json
"repositories": [
	{
		"type": "path",
		"url": "./packages/*"
	}
],
```
## Create a new basepackage with [sitepackagebuilder.com](https://www.sitepackagebuilder.com/new/)

- Select *Fluid Styled Content* base package  
- Company and title fields will be used to generate namespace and package name, so you might want to keep these rather short  
- Add ` base` to the end of your title (for example `my new project base`) to indicate this is your basepackage.  
- Create new folder `mkdir packages`  
- Download the and extract the .zip file and copy the folder to /packages/  
  
## In */packages/my_new_project_base/composer.json* add a version number  
 
```json
{
	"name": "my-company/my-new-project-base",
	"version": "0.0.1",
}
```

## Require the new base package with composer, using name and version from above  
 
```bash
ddev composer require my-company/my-new-project-base:^0.0.1
```

## Import setup and configuration typoscript from your base package  

Open the TYPO3 backend in your browser  

```shell
ddev launch typo3
```

- Open the Template module  
- In the pagetree, select the rootpage ("Home", globe icon)  
- Open the *Info/modify* pane  
- Click in the *Edit the whole template record* button  
- Under *Constants* add this line  
  
```typoscript
@import 'EXT:my_new_project_base/Configuration/TypoScript/constants.typoscript'
```

- Under *Setup*, remove the existing typoscript code and replace it with  

```typoscript
@import 'EXT:my_new_project_base/Configuration/TypoScript/setup.typoscript'
```