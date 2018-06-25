# ApiGateway Hubot (@apibot) for ucsbtech Slack workspace

## Why?

This chat robot exists because:
* ?? (TODO)

## Current Commands

* `devs created <days = 1>` - Find Devs created in last X days - Apigee

* `targetserver list <env>` - Apigee
* `targetserver (add|update) <env> <name> <hostname>` - Apigee
* `targetserver delete <env> <name>` - Apigee

* `stats`


## Development

* Clone this repo
* ...
* standup your own slack community instance (this is because Slack only allows 5 integrations in their free tier and the UCSB Tech Community has already exhausted all 5 integration slots)

### Windows

* ...

### Mac

* Create a `.env` file in this repo's root directory so that it contains the following:
```sh
HUBOT_SLACK_TOKEN=your-hubot-slack-oauth-token-here

# this is the apigee account that calls the Apigee Management APIs
APIGEE_USERNAME=your-apigee-username
APIGEE_PASSWORD=your-apigee-password 
```

## Deploying to Google App Engine Standard Environment

* Create a new GAE standard environment
* open up your console
* clone this repo
* cd into this repo
* configure app.yaml and ensure your environmental variables
* ...
* `gcloud app deploy`
