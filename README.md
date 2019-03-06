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

### Misc

- `misc version` - Displays the current version of the running chabot (useful for determining whether the running chatbat has the latest changes)

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

# this is the list of hubot admins (see admins.md for full list)
HUBOT_AUTH_ADMIN=U1TJWQEG3,U1TLTC690,U1TT6U50W, ...and more
```

- `cd` into this repo and run `npm install`
- run `npm run dev`

## Hubot admins

Please review the [admins.md](admins.md) file for the list of Hubot admins. **Changes to the [admins.md](admins.md) file will require an update to the Heroku environmental variables.**

## Heroku setup instructions

**Note: the admins should have already done this during the setup of Heroku so you shouldn't need to do this again unless there are changes to the configuration of the production environment.**

Heroku needs the following environmental variables setup. You can set these environmental variables via the Heroku CLI or through the Heroku Web GUI:

- NODE_ENV: production
- HUBOT_SLACK_TOKEN: your-hubot-slack-oauth-token-here
- APIGEE_USERNAME: your-apigee-username
- APIGEE_PASSWORD: your-apigee-password
- APIGEE_MFATOKEN: your-optional-2fa-totp-secret
- HUBOT_AUTH_ADMIN: your-list-of-hubot-admins

It's also nice to install the [Dyno Metadata](https://devcenter.heroku.com/articles/dyno-metadata) from Heroku Labs so that we can get useful information about the app that is deployed. This is a requirement for the `misc version` chatbot command. To install this:

`$ heroku labs:enable runtime-dyno-metadata -a slack-hubot-apigateway`

## Deploying to Heroku

You can contact the admins for this repo to help deploy this safely in Heroku.

Alternatively, you can read the [Heroku: Deploying with Git](https://devcenter.heroku.com/articles/git) guide. The gist of it is:

- `$ heroku login` (if you haven't already logged in)
- `$ heroku git:remote -a slack-hubot-apigateway` (if you haven't already added the remote Heroku location)
- `git push heroku master`

The last `git push` command is actually the one that pushes your master branch to Heroku for deployment. At this point, you should see messages from Heroku that the Build was successful. If not, investigate the error.

To debug a Heroku deployed released, use `$ heroku logs -a slack-hubot-apigateway`

TODO: determine how to securely integrate GitHub with Heroku so that deployments to Heroku is done via a commit to the GitHub master branch instead.

## What version am I running?

To ensure that Heroku is running your deployed changes, you can chat `misc version` to see what version is running in Heroku. That version running should match the commit sha in HEAD on master. This command requires that [Dyno Metadata](https://devcenter.heroku.com/articles/dyno-metadata) be enabled.

## Todo List

- ...Teams (TODO: )
