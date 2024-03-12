# Vue Template Project

The App Lab Template library has several templates available for frontend developers to leverage, allowing MITRE to quickly and efficiently create new web applications that meet sponsor needs. It is developed and maintained by [App Lab](http://applab.mitre.org/).

This **Vue 3 with Tailwind** template contains the rough structure for a Vue 3 application without the boilerplate components that come from using `create-vue`. This template also contains options for leveraging additional frameworks and libraries, such as adding Vue Router and Pinia for state management. Simply select which branch to create your repository from and you'll get a clean template ready to be worked on.

This template was originally created by Kevin Long. [Original repo here](https://gitlab.mitre.org/klong/vue-3-with-tailwind-template).

## Tech Stack

|Template | Vite [2] | Tailwind [3] | ESLint [4] | Vue Router [5] | Pinia [6] |
|---|---|---|---|---|---|
| [Main](#main) | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :x: |
| [Vue Router](#vue-router) | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: |
| [Vue Router with Pinia](#vue-router-and-pinia) | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |

1. [**Vue 3**](https://v3-migration.vuejs.org/) (using TypeScript)
2. [**Vite**](https://vitejs.dev/): uses Rollup to enable hot reloads, faster builds, and speed up development
3. [**Tailwind CSS**](https://tailwindcss.com/): utitlity-first CSS framework that gives more flexibility and control to the developer without needing as much CSS
4. [**ESLint**](https://eslint.org/docs/latest/use/): find and fix problems in code as well as enforce consistent code formatting across your project
5. [**Vue Router**](https://router.vuejs.org/guide/): basic router used for navigation
6. [**Pinia**](https://pinia.vuejs.org/introduction.html): store library that allows for sharing states across components and pages in an application

## Templates

This repo has several templates available as jumping off points to start your next project repository, each of which is housed in a branch on this repository. Pick the one that best suits project needs and developer preferences, and follow the [usage instructions](/USAGE.md) to jumpstart your project!

### [Main](https://gitlab.mitre.org/app-lab/al-boilerplate/-/tree/main)

The main branch of this repo contains a boilerplate Vue 3 project with minimal scaffolding. It comes with support from Vite, Tailwind, and ESLint already set up. It allows the user complete flexibility in the type of project they ultimately create, providing a blank slate for development.

### [Vue Router](https://gitlab.mitre.org/app-lab/al-boilerplate/-/tree/vue-router)

This branch already has a router set up for navigation. If your project will need navgation and plans to use the Vue Router to do that, then this branch saves some time in setting that up! This branch contains a Home component and a router already set up that points all misc paths to the Home component.

### [Vue Router and Pinia](https://gitlab.mitre.org/app-lab/al-boilerplate/-/tree/vue-router-and-pinia)

This branch scaffolds out the implementation for Pinia, a state management store. It contains everything from the Vue Router branch and also implements Pinia, providing an example store that passes data to the Home component. This is also a great example for developers who are not yet familiar with Pinia and want to learn more about the implementation.

## Usage

Detailed installation instructions can be found in the [USAGE.md](/USAGE.md) file in this repository

### Setup instructions

- [Initialize and create new repository](/SETUP-INSTRUCTIONS.md#initialize-and-create-new-repository)
  - [Option 1: fork repository](/SETUP-INSTRUCTIONS.md#option-1-fork-repository-in-browser) (Keeps history and branches)
  - [Option 2: copy repository using Tiged](/SETUP-INSTRUCTIONS.md#option-2-copy-repository-on-command-line) (deletes history and branches)
- [Copy into existing repository](/SETUP-INSTRUCTIONS.md#copy-into-existing-repo)
  - [Option 1: copy repository using Tiged](/SETUP-INSTRUCTIONS.md#option-1-use-tiged-to-copy-repo)
  - [Option 2: manually copy repository](/SETUP-INSTRUCTIONS.md#option-2-manually-copy-files-into-existing-repository)
