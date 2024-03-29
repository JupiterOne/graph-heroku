# Development

This integration uses the
[Heroku Platform API](https://devcenter.heroku.com/articles/platform-api-reference).
When running `j1-integration collect`, the root of the entity and relationship
ingestion begins with a
[Heroku Enterprise Account](https://devcenter.heroku.com/categories/enterprise-accounts).
Therefore, while developing locally with a non-enterprise account, developers
will only be able to test certain non-enterprise API endpoints (such as `/teams`
or `/apps`).

## Prerequisites

Aside from what is documented in the [README](../README.md), no special tooling
is required to run and test this integration.

## Provider account setup

To setup a Heroku account for development, please take the following steps:

1. Visit the [Heroku](https://signup.heroku.com/) sign-up page.
1. Fill out the free account sign-up form then click `Create Free Account`.
1. Follow the account verification steps to finish your account set-up.

As noted above, the root of data ingestion begins with a Heroku Enterprise
Account. Developers will not receive a response from the `/enterprise-accounts`
endpoint, but will be able to test other endpoints, such as `/teams`, `/apps`,
etc.

## Authentication

Once you've created your account, you'll need to generate an API Key to access
the Heroku API.

NOTE: The account used to generate the API key will dictate what permissions it
has. For full access to all available data, an account with the `admin` role
should be used. Using an account with the `member` role will be able to pull in
most data, but currently application add-on information is only available using
the `admin` role.

1. Visit <https://dashboard.heroku.com/account/applications> and click
   `Create authorization`.
   ![Heroku Authorizations Page](./images/heroku-authorizations.png)

1. Add a `Description` and an optional `Expires after (seconds)` value , then
   click `Create`.
   ![Heroku Create Authorization Modal](./images/create-authorization.png)

1. Copy your API key into a `.env` file at the root of this project. The file's
   contents should appear as below:

   ```bash
   API_KEY=<your-api-key>
   ```

The API always requires two headers to be set - `Authorization`, using your
specific `API_KEY`, and `Accept`, with the value
`application/vnd.heroku+json; version=3`. More information is available in the
[Heroku API Overview](https://devcenter.heroku.com/articles/platform-api-reference#overview)

Example API request:

```bash
curl https://api.heroku.com/<resource> \
-H "Accept: application/vnd.heroku+json; version=3" \
-H "Authorization: Bearer <your-api-key>"
```
