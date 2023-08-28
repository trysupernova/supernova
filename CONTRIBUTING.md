# Contributing to Supernova

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- Before jumping into a PR be sure to search [existing PRs](https://github.com/trysupernova/supernova/pulls) or [issues](https://github.com/trysupernova/supernova/issues) for an open or closed item that relates to your submission.

## Developing

The development branch is `main`. This is the branch that all pull
requests should be made against. The changes on the `main`
branch are tagged into a release monthly.

To develop locally:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your
   own GitHub account and then
   [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch:

   ```sh
   git checkout -b MY_BRANCH_NAME
   ```

3. Install pnpm and turbo globally:

   ```sh
   npm install -g pnpm
   npm install -g turbo
   ```

4. Install the dependencies with:

   ```sh
   pnpm i
   ```

5. Create environment files

   - For the API, you need to configure the `.env` file. You can copy the example file and edit it. Mostly you need to configure the database connection. Default values of those are in `apps/api/docker-compose.yml`:

     ```sh
     cp .env.example .env
     // then edit .env for the database connection variables as specified
     // see docker-compose.yml
     ```

6. Start developing and watch for code changes:

   - For the API, you need to run infra pieces that the project depends locally (e.g the main MySQL database), then run the migrations on the database. Make sure you have Docker installed and running, then run:

     ```sh
     pnpm db:start
     pnpm db:migrate
     ```

     Then run the API:

     ```sh
     pnpm run dev:api
     ```

## Building

You can build the entire project with:

```bash
pnpm build
```

If you want to build a specific package, you can do so with:

```bash

```

Please be sure that you can make a full production build before pushing code.

## Testing

More info on how to add new tests coming soon.

## Linting

To check the formatting of your code:

```sh
yarn lint
```

If you get errors, be sure to fix them before committing.

## Making a Pull Request

- Be sure to [check the "Allow edits from maintainers" option](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) while creating you PR.
- If your PR refers to or fixes an issue, be sure to add `refs #XXX` or `fixes #XXX` to the PR description. Replacing `XXX` with the respective issue number. See more about [Linking a pull request to an issue
  ](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
- Be sure to fill the PR Template accordingly.
