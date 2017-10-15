---
title: Setup Your .ezbake Folder
---

# .ezbake Folder Structure

## .ezbake/index.js

`index.js` is what drives the `ezbake` process. It defines several things for the utility.

### Sample 

```js
module.exports = {
  source: { 
    "**/*.txt": true,
    "**/*.sql": true,
    "**/*.yml": true,
    "**/ignore_me.sql": false,
    "**/data/ignore_this_entire_folder/**": false,
    "**/*.sh": true
  },
  ingredients: [
    {
      "type": "input",
      "name": "favoriteFood",
      "message": "What is your favorite food?",
      "default": "Steak"
    },
    {
      "type": "input",
      "name": "favoriteSnack",
      "message": "What is your favorite snack?",
      "default": "Nutella"
    }
  ],
  "env": [
    {
      "type": "input",
      "name": "SOME_SECRET",
      "message": "Please specify a value for SOME_SECRET for the .env file",
      "default": "its_def_a_secret"
    }
  ],
  icing: [
    {
      description: 'Says something on Mac',
      cmd: ['./icing.sh']
    },
    {
      description: 'Tells me the job is done',
      cmd: ['echo', `job's done`]
    }
  ]
}
```

### Usage

#### source

The keys of the `source` property are [globs](https://www.npmjs.com/package/minimatch) that we use to match files in the directory. Only files that match the glob patterns and with the value set to `true` are template replaced.

All of your globs will start with `**/` to denote any path to either a particular file or set of files.  This is intentional, as `ads-baseline` will match the glob of the full path of the files it creates for you.  After the initial `**/` you can then set whatever glob pattern you like.

#### ingredients

The keys of the `ingredients` is where you would define the inputs from a user via [inquirer](https://www.npmjs.com/package/inquirer).  See the examples on the Inquirer documentation to see how to structure specific questions.  You have full control over the `inquirer` questions to ask, as well as validations, filters, etc.

You can then embed in your files the names of the question prompts.  For example, above, `localPortWebApp` would correspond to a templatized value of `<%= localPortWebApp %>` on some file in your project.

#### env

The keys of `env` is similar to `questions`. They are also [inquirer](https://www.npmjs.com/package/inquirer) prompts that then map to a corresponding .env file value.  For example, the above file would generate a `.env` file in the root of the generated project that looks like the following:

```
JWT_SECRET=shhh_its_a_secret
```

#### icing

The keys of `icing` is an array of commands you want to execute after ezbake completes scaffolding your project. This could be anything, from plain bash commands to a reference to an executable script.

You may also execute local commands relative to the root of the project being cloned. For example, above, we packaged an `icing.sh` script at the root of the project and can invoke it directly.

## .ezbake/recipes

Recipes are configurable generators for any type of file you wish to create.  They are invoked by the `ezbake cook` command.  For example `ezbake cook -r Query` will look for a `Query.js` under `.ezbake/recipes`, prompts the user with the `ingredients` listed, and write out the `source` specified.

### Example

1. Execute `ezbake prepare -r https://github.com/ericnograles/ads-baseline-madlibs.git`
1. `cd` into the directory you specified
1. Execute `ezbake cook -r Query`

### Conventions

1. One file/directory = one recipe
2. RecipeName = `.ezbake/recipes/<RecipeName>.js` or `.ezbake/recipes/RecipeName/`

### Recipe Definitions

#### description

The description to be listed when a user executes `ezbake menu`.

#### destination

The destination directory on which the created file will live. This is in relation to the root of a project that was scaffolded by `.ezbake`

#### source

A [JavaScript template literal string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) of the file's contents, with template strings to swap out.

#### ingredients

The keys of the `ingredients` is where you would define the inputs from a user via [inquirer](https://www.npmjs.com/package/inquirer).  See the examples on the Inquirer documentation to see how to structure specific questions.  You have full control over the `inquirer` questions to ask, as well as validations, filters, etc.

**Note**: At a minimum, you should provide a `fileName` object in `ingredients` to ask the user what the file name will be called when it is dropped in `destination`. Otherwise, it is defaulted to the name of the recipe with no file extension.

#### icing

The keys of `icing` is an array of commands you want to execute after ezbake completes cooking the recipe. This could be anything, from plain bash commands to a reference to an executable script.

You may also execute local commands relative to the root of the project being cloned. For example, above, we packaged an `icing.sh` script at the root of the project and can invoke it directly.