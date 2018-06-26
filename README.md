# ApiGateway Hubot (@apibot) for ucsbtech Slack workspace

## Why?

This chat robot exists because:
* ?? (TODO) (diana: what should hubot do?  requirements?)

## Current Commands (TODO)

* `devs created <days = 1>` - Find Devs created in last X days - Apigee

* `targetserver list <env>` - Apigee
* `targetserver (add|update) <env> <name> <hostname>` - Apigee
* `targetserver delete <env> <name>` - Apigee

* `stats`

## Development

* Clone this repo
* standup your own slack community instance (this is because Slack only allows 5 integrations in their free tier and the UCSB Tech Community has already exhausted all 5 integration slots)
  * get a bot token in your community (TODO)
* `cd` into this repo and run `npm install`
* Create a `.env` file in this repo's root directory so that it contains the following:
```sh
HUBOT_SLACK_TOKEN=your-hubot-slack-oauth-token-here

# this is the apigee account that calls the Apigee Management APIs
APIGEE_USERNAME=your-apigee-username
APIGEE_PASSWORD=your-apigee-password 
```

Ideally, this should work in both Windows and Mac/Linux environments because we are using [cross-spawn](https://www.npmjs.com/package/cross-spawn).


## Deploying to Google App Engine Standard Environment (TODO)

* Create a new GAE standard environment (beta?)
* open up your GAE shell console
* clone this repo
* cd into this repo
* run `npm install`
* configure `app.yaml` and ensure your environmental variables (ideally, we can spit this out using deploy scripts launched from `npm run start`) (TODO)
* ...??
* run `gcloud app deploy`
