---
title: "Cutting Cloud Costs: Transforming Legacy Systems with Event-Driven Architecture"
datePublished: Mon, 18 Nov 2024 12:58:08 GMT
slug: cutting-cloud-costs-transforming-legacy-systems-with-event-driven-architecture
tags: aws, cost-optimisation, event-driven-architecture
---

I previously worked for A-League and during my time there we launched [aleagues.com.au](https://aleagues.com.au) and migrated all the club websites to a Wordpress platform developed by a third-party.

The system we inherited had a set of APIs deployed into AWS. Games, Teams, and Competitions are imported from a third-party provider via Event Bridge and a series of Lambdas.

The data is stored in MongoDB, then surfaced via API Gateway and Lambda API endpoints. The website itself was built in WordPress, and the Matches, Teams, and Competitions are synced via WordPress Cron running every few minutes.

This is a simplified diagram showing this architecture.

![](/images/e8d22d85-2f37-487a-87ec-9e92c0e30978.png)

The WordPress website is actually a WordPress Multi-site deployment, and problems started to occur when we added 14 additional websites, each with their own running Crons and database tables.

Fixtures would not reliably update, and it would require a re-sync of the whole database regularly.

There were other issues with this approach. We were syncing and storing information about competitions that we didn’t care about and we were attempting to sync data constantly, even though fixture updates would only happen a few times per month.

### Event-Driven Architecture

The legacy system wasn't designed with cost efficiency in mind, and we wanted to improve both costs and reliability. So, we decided to switch to an event-driven architecture with SQS and SNS.

This is a simplified diagram showing the new architecture.

![](/images/1908d579-1d98-4240-a998-6897bf895485.png)

Firstly, we migrated from MongoDB to DynamoDB, the main reason being improved AWS tooling.

Then a Dynamo event stream was connected to an SNS topic. This topic had several queues and Lambdas that would trigger updates into the WordPress APIs across the various websites - these queues also had DLQs (Dead-Letter Queues) configured which would send notifications of failures to Slack.

This means that instead of WordPress polling for updates, the team was able to disable the WP Cron and instead rely on changes made in Dynamo being pushed through to the sites via API.

And because we disabled the Cron on 15 websites, the team was able to reduce AWS operating costs from $40,000 USD to under $1,000 USD per month. This also increased the reliability of the platform and updates appeared on the website faster than when updating by Cron.

### Conclusion

In conclusion, transitioning from a legacy architecture to an event-driven architecture using SQS and SNS significantly improved the efficiency and cost-effectiveness of the system. By migrating from MongoDB to DynamoDB and leveraging AWS's improved tooling, the team was able to streamline data updates and reduce unnecessary data syncing.

Disabling the WP Cron across multiple websites and relying on real-time updates through DynamoDB and SNS not only resolved the issues with unreliable fixture updates but also drastically reduced AWS operating costs from $40,000 USD to under $1,000 USD per month. This transformation highlights the benefits of adopting modern cloud architecture practices to optimize performance and control costs.
