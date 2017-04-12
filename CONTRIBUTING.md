# Contributing to @ultimate/ngxerrors

All contributions are greatly appreciated.

Please make sure that any contribution you make has an issue for it, and that you link to the issue in your pull request. Before the pull request is merged the issue must have an approved label on it (this will be added if it's an approved feature/fix etc and needs to be done).

# Submitting an issue

When you submit an issue, please keep to the pre-filled template, as it will help speed things along when your issue is addressed.

# Make a change

To setup `@ultimate/ngxerrors` for development, run the following -

```bash
git clone git@github.com:UltimateAngular/ngxerrors.git
cd ngxerrors
yarn install
yarn example
```

This will start watching for changes to any source files, and compile/bundle the source.

You'll then need to open up the generated `dist` folder and run `yarn link`.

Then, inside a different project that's running webpack (for example, our `ng-boilerplate`), run:
 
```bash
yarn link @ultimate/ngxerrors
```

You'll then be using your local version as the loader.

## Committing and adding a PR

Once you're ready, commit your changes and submit your PR. All commits should follow [these guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit) (to keep things neat).

Your PR should keep to the pre-filled template.
