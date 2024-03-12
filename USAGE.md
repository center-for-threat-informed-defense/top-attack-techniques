# Usage Instructions

## Determine which branch to use

Choose a template according to the needs of your project. You can find a list of features in each template, and the branch wherein the template can be found, in the [README](/README.md#templates).

## Initialize and create new repository

Follow these steps if you need to create a brand new repository for your project.

### Option 1: fork repository in browser

This option **keeps** both the history and all branches associated with this repository

1. Create a new fork
    1. From your browser, go to [this repository's homepage](https://gitlab.mitre.org/app-lab/al-boilerplate) and click the "Fork" button on the top right corner of the page, just above the blue "Clone" button
    2. On the next screen, name and host your project accordingly
    3. In the newly created repository, use the "Clone" button to clone your new repository for local development
    4. You will now have a repository that is an exact copy of this one, including all git history and branches
2. Select which branch to build off of
    1. Click the "Branches" button to see the different branch options available to you
    2. If you don't want to use Main, create a merge request for the branch you want to use and merge it into main. Now, you can delete the other branches and begin development

### Option 2: copy repository on command line

This option **deletes** both the history and all other branches associated with this repository (aside from the one copied).

1. If necessary, [install Tiged](#install-tiged)
2. Use Tiged to copy repository
    1. From your terminal, run `npx tiged gitlab.mitre.org:app-lab/al-boilerplate <path-to-project-directory>` where `<path-to-project-directory>` could be something like `my-project`
    2. **To specify a branch:** run `npx tiged gitlab.mitre.org:app-lab/al-boilerplate#<branch-name> <path-to-project-directory>` where `<branch-name>` would be the name of the branch you want to duplicate
3. **Optional** run project locally to test it out
    1. Navigate into the project directory in your terminal
    2. Run `npm install`
    3. Run `npm run dev`
4. Create an upstream repository in GitLab
    1. In your browser, click the purple "plus" icon in the top right corner of the page and select "New Repository"
    2. Select "Create Blank Project". Name your project accordingly and place it in the correct namespace
    3. When selecting options for your new repo, you can select "no" for creating a README to avoid future conflicts with this repository's README
5. Connect upstream respository to your local repository
    1. Navigate to the terminal of the project you just created locally
    2. Run `git init--initial-branch=main`
    3. Run `git remote add origin git@gitlab.mitre.org:<project-namespace>/<repository-name>.git`
    4. Commit and push your initialization of the repository
        1. `git add .`
        2. `git commit -m "Initial commit"`
        3. `git push -u origin main`

#### Install [Tiged](https://github.com/tiged/tiged#readme)

1. In your terminal, run `npm uninstall -g degit`
2. Run `npm install -g tiged`

## Copy into existing repository

This is a more difficult step. It is easiest if you create a repository from scratch in the process of initializing this one. However, if there is a repository that already exists where you need to copy this project to, then follow these steps.

### Before starting: check your permissions for destination repository

If your destination is not empty, you will need access to be able to force push to protected branches for some of these options

### Option 1: use Tiged to copy repository

You'll follow many of the same steps from the Tiged installation above. But this time, we do not want to create a new repository to connect to- we want to connect an existing repository as our upstream.

1. If necessary, [install Tiged](#install-tiged)
2. Use Tiged to copy repository
    1. From your terminal, run `npx tiged gitlab.mitre.org:app-lab/al-boilerplate <path-to-project-directory>` where `<path-to-project-directory>` could be something like `my-project`
    2. **To specify a branch:** run `npx tiged gitlab.mitre.org:app-lab/al-boilerplate#<branch-name> <path-to-project-directory>` where `<branch-name>` would be the name of the branch you want to duplicate
3. **Optional** run project locally to test it out
    1. Navigate into the project directory in your terminal
    2. Run `npm install`
    3. Run `npm run dev`
4. Connect existing upstream respository to your local repository
    1. Navigate to the terminal of the project you just created locally
    2. Run `git init--initial-branch=main`
    3. Run `git remote add origin git@gitlab.mitre.org:<project-namespace>/<repository-name>.git`
    4. Commit and push your initialization of the repository
        1. `git add .`
        2. `git commit -m "Initial commit"`
        3. `git push -uf origin main`

### Option 2: manually copy files into existing repository

If you do not have enough permissions in your destination repository to force push, then option 1 will not work for you. In this option, we will manually copy the information in this repository to your destination.

1. Clone this repository locally
    1. Navigate to this repository page in GitLab
    2. Click the blue "Clone" button and follow the steps listed there to get this project locally on your machine
    3. Open this repository in your text editor of choice
    4. **Optional:** if using one of the branches, run `git checkout <branch-name>` in the terminal to switch to the appropriate branch
2. Clone destination repository
    1. If it is not already on your local machine, navigate to your destination repository in Gitlab and clone that repository as well
3. Copy this repository's contents into destination repository
    1. Open both repositories in Finder or a text editor
    2. Delete the files in the destination repository, if any
    3. Select all the files in this repository and copy them. Then, paste them into the destination repository
    4. Commit and push your changes to your destination repository
