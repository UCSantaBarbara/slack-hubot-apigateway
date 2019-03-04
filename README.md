# ApiGateway Hubot (@apibot) for ucsbtech Slack workspace

## Why a chatbot?

This chatbot exists to provide developers and non-developers a natural language interface for interacting with the [Apigee Management APIs](https://apidocs.apigee.com/api-reference/content/introduction). The chatbot only focuses on performing commonly used administrative actions.

## Commands List

### Developers

- `devs created <days = 1>` - Find Devs created in last X days - Apigee

### Apps

- `apps (all|no|approved|pending|revoked)` - Display developer applications by status or by its api product status
- `apps search <text>` - Search all developer applications that contains `<text>`
- `apps (approve|revoke) <developerEmail> <developerApp>` - Approve or revoke a developer app and all of the api products associated with that developer app
- `apps (approve|revoke) <developerEmail> <developerApp> <apiProduct>` - Approve or revoke an apiProduct within a developer app. Does not apply status change to main developer app.

## Commands (in Development)

- `targetserver list <env>`
- `targetserver (add|update) <env> <name> <hostname>`
- `targetserver delete <env> <name>`
- `stats`

## Development

Ideally, development should work in both Windows and Mac/Linux environments because we are using [cross-spawn](https://www.npmjs.com/package/cross-spawn).

- Clone this repo
- standup your own slack community instance (this is because Slack only allows 5 integrations in their free tier and the UCSB Tech Community has already exhausted all 5 integration slots)
  - get a bot token in your community (TODO)
- Create a `.env` file in this repo's root directory so that it contains the following:

```sh
HUBOT_SLACK_TOKEN=your-hubot-slack-oauth-token-here

# this is the apigee account that calls the Apigee Management APIs
# note that this account is the organization administrator account so please be responsible in securing these credentials
APIGEE_USERNAME=your-apigee-username
APIGEE_PASSWORD=your-apigee-password
APIGEE_MFATOKEN=your-optional-2fa-totp-secret #optional
```

- `cd` into this repo and run `npm install`
- run `npm run dev`

## Deploying to Heroku

- **Create a `.env` file with its contents in this repo's root directory exactly as described in the [Development](#Development) area**
- Get the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) for your platform
- Login to your Heroku CLI if you haven't already
  - \$ `heroku login`
- \$ `heroku git:remote --app heroku-app-instance-name`
  - for example, this could be `hubot-ucsb-test`
- \$ `npm run heroku:set:env`

  - You should see something like this:
    ```
    Setting HUBOT_SLACK_TOKEN, APIGEE_USERNAME, APIGEE_PASSWORD, APIGEE_MFATOKEN, HUBOT_AUTH_ADMIN and restarting ⬢ hubot-ucsb-test2... done, v6
    APIGEE_MFATOKEN:   xxx
    APIGEE_PASSWORD:   xxx
    APIGEE_USERNAME:   xxx
    HUBOT_AUTH_ADMIN:  xxx
    HUBOT_SLACK_TOKEN: xxx
    ```

- ...`git push heroku javascript:master` (TODO: javascript is temporary until it becomes master branch)
  - For now, we're pushing the javascript branch to the heroku master branch. Non-master branches pushed to heroku does not build nor deploy.
- The heroku app should now be running
- ...Teams (TODO: )
