---
title: "Cutting Cloud Costs: Transforming Legacy Systems with Event-Driven Architecture"
datePublished: 2024-11-18T12:58:08Z
slug: cutting-cloud-costs-transforming-legacy-systems-with-event-driven-architecture
tags: aws, architecture, cost-optimisation
---

I previously worked for A-League, and during my time there we launched [aleagues.com.au](https://aleagues.com.au) and migrated all the club websites to a WordPress platform developed by a third party.

The system we inherited had a set of APIs deployed into AWS. Games, Teams, and Competitions were imported from a third-party provider via EventBridge and a series of Lambdas. The data was stored in MongoDB, then surfaced via API Gateway and Lambda API endpoints. The website itself was built in WordPress, with Matches, Teams, and Competitions synced via WordPress Cron running every few minutes.

Here's a simplified diagram of that architecture.

![Legacy Architecture Diagram](/images/e8d22d85-2f37-487a-87ec-9e92c0e30978.png)

The WordPress website was actually a WordPress Multisite deployment, and problems began to surface when we added 14 additional websites — each with their own running Crons and database tables.

Fixtures would not reliably update, requiring a full re-sync of the database on a regular basis.

There were other issues with this approach. We were syncing and storing data for competitions we didn't care about, and we were attempting to sync constantly — even though fixture updates only happened a few times per month.

## Event-Driven Architecture

The legacy system was never designed with cost efficiency in mind, and we wanted to improve both cost and reliability. We decided to switch to an event-driven architecture using SQS and SNS.

Here's a simplified diagram of the new architecture.

![Event-Driven Architecture Diagram](/images/1908d579-1d98-4240-a998-6897bf895485.png)

The first step was migrating from MongoDB to DynamoDB, primarily for the improved AWS tooling and native integration with the rest of the stack.

From there, a DynamoDB Stream was connected to an SNS topic. That topic fanned out to several SQS queues, each with a corresponding Lambda that pushed updates to the WordPress APIs across the various websites. Each queue also had a Dead-Letter Queue (DLQ) configured to send failure notifications to Slack.

Instead of WordPress polling for updates, we were able to disable WP Cron entirely and rely on changes in DynamoDB being pushed through to the sites in real time.

By disabling Cron across 15 websites, we reduced AWS operating costs from **$40,000 USD to under $1,000 USD per month**. Platform reliability improved significantly, and fixture updates appeared on the websites faster than they ever had under the polling approach.

## Conclusion

Switching from a legacy polling architecture to an event-driven model using SQS, SNS, and DynamoDB Streams solved two problems at once: unreliable fixture updates and runaway cloud costs. The key insight was that we were paying to sync data constantly, when the data itself rarely changed. Eliminating the Cron jobs and letting DynamoDB push changes only when they occurred was the right architectural fit for the problem — and the cost reduction speaks for itself.