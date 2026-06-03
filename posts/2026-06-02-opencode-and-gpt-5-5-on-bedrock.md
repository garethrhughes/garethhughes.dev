---
title: "OpenCode & GPT-5.5 on Bedrock"
datePublished: "2026-06-02T12:24:27Z"
slug: "opencode-and-gpt-5-5-on-bedrock"
tags: ["ai", "aws", "typescript", "software-development"]
coverImage: "/images/opencode-openai-plugin.png"
---

We use Amazon Bedrock with Claude Code at MyPass, and we're trialling GPT-5.5 and Codex via Bedrock too.

As a manager I'm off the critical path for coding, so I've been using OpenCode with my own skills for anything I'm working on.

I wanted to get GPT-5.5 working with OpenCode, which mostly works out of the box with the `bedrock-openai` provider — but it requires an AWS Bearer Token available in the environment.

What I really wanted was what I already had with the `amazon-bedrock` provider: specify an SSO profile and have it work automagically.

A workaround was to create a script using `@aws/bedrock-token-generator`, which worked well enough but was clunky and relied on the token staying available. This also needed to run OpenCode with a script for it to work which added a layer of complexity and maintenance.

Once I got that working I figured a proper OpenCode plugin would be a better approach. So introducing the `opencode-bedrock-openai-token` plugin:

### How to use it

Add the plugin and provider to your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-bedrock-openai-token"],
  "provider": {
    "bedrock-openai": {
      "npm": "@ai-sdk/openai",
      "name": "OpenAI on Bedrock",
      "options": {
        "baseURL": "https://bedrock-mantle.us-east-1.api.aws/openai/v1",
        "region": "us-east-1",
        "profile": "my-profile"
      },
      "models": {
        "openai.gpt-5.5": { "name": "GPT-5.5 (Bedrock)" }
      }
    }
  }
}
```

The plugin seeds authentication on startup — no manual `auth.json` editing required.

### How authentication works

The plugin uses the AWS Node Provider Chain, so it supports environment variables, shared credentials files, SSO profiles, and IAM roles (EC2, ECS, Lambda). If you set `profile` in the provider options (or `AWS_PROFILE` in your environment), that named profile is used.

Tokens are cached for 11 hours and refreshed automatically — no more worrying about stale credentials mid-session.

### How it works under the hood

1. On plugin load, `client.auth.set` seeds a placeholder entry in `auth.json` so the provider is recognised.
2. The `config` hook reads `region` and `profile` from your provider config.
3. The `auth.loader` hook provides an initial `apiKey` (bearer token) to the provider.
4. The `chat.headers` hook injects a fresh `Authorization: Bearer <token>` header on every request to the `bedrock-openai` provider.

### Links

- [GitHub](https://github.com/garethrhughes/opencode-bedrock-openai-token)
- [NPM](https://www.npmjs.com/package/opencode-bedrock-openai-token)
