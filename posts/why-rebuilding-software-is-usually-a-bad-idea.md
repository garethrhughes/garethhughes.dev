---
title: "Why rebuilding software is (usually) a bad idea"
datePublished: 2024-12-03T03:00:45Z
slug: why-rebuilding-software-is-usually-a-bad-idea
tags: software-development, architecture
---

This was originally going to be a presentation I put together for work, but I shelved that for now and decided to create a blog post with roughly the same content. Images are, of course, courtesy of ChatGPT.

My company (prior to me joining) embarked on the journey of trying to rebuild the core platform, and it did not go as planned. Here, I will outline why this is so often the case and suggest an approach for how we might drive the platform forward.

### **Imagine a town, it’s a little run down**

![](/images/975184ce-fe4d-4195-8dfe-2f2863302043.png)

The town has grown organically over the past few years, with new buildings constructed in response to the residents' requests. The road network wasn't really planned and just developed over time.

You start to run into issues: there are traffic jams, some of the buildings leak, and some buildings just aren't finished. It's becoming more and more expensive to change things and to add new buildings.

### **We decided to rebuild the whole thing**

![](/images/f6157915-7b47-4836-95ab-3f9469bedefa.png)

The townsfolk are frustrated, and the council decides to take everything they learned from building the town and all the issues it has and build a brand new one from scratch with all those learnings.

So we start to build the new town. People are excited and looking forward to their new homes being built.

### Problems start to arise

![](/images/39c2889c-3a92-485b-9ad3-181a0ce2fdcb.png)

Now the rebuild is well under way, good progress has been made. But we start to run into problems; there are delays, there are increases in scope. It turns out we need to build some new infrastructure that the old town doesn’t have.

### The townsfolk get annoyed

![](/images/08087e5f-6959-480d-acd8-04e51f5e9a87.png)

Meanwhile, back in the old town, the townsfolk have not had any of their issues addressed for a while. The infrastructure needs work, the streets are overcrowded, and some people are considering moving out.

They're tired of hearing that the new town is coming soon and aren't sure anymore that they actually want to move.

### The new development is ready to move people in, now what?

![](/images/5fba3bed-344f-4848-aab2-3dae98aece98.png)

After many years of development, the new town is ready for people to move in, but the townsfolk realize that not all their problems were solved. The new town, having spent most of the last few years building out the basics, hasn't actually added any new amenities or space.

Furthermore, there are new problems with things that actually worked fine in the old town; there are traffic problems, and the internet connection is unreliable.

### How is this relevant?

Obviously, we wouldn’t actually build a new town and try to move everyone from an old town into the new build; that would be crazy.

But this is something we often try to do with software. We often underestimate the complexity of doing something like this and overcommit. Meanwhile, existing clients and customers are stuck with an older version and will eventually start to look elsewhere.

We also often fail to consider the most difficult challenge: moving the clients onto the new platform. There is a lot of data to deal with; we need to consider logs, audit trails, integrations, and many other things that make moving to a new system challenging. In many cases, we aren’t providing any new value to the clients; we’re giving them new problems while we deal with teething issues with the new platform.

### What should we have done?

What we should have done, and what we are doing, is to reinvest the effort into the existing platform. Issues arise when feature after feature is shipped with little consideration for quality.

What we are doing to move the platform forward:

* Putting better standards around unit and integration testing and building them into the pipelines
    
* Adopted [ConfigCat](https://configcat.com/) to manage our feature flags
    
* Established a [Platform Team](https://tetrate.io/learn/what-is-a-platform-team/) to own the deployment processes and support better DevSecOps across our product teams
    
* Creating patterns for establishing micro front ends and ways to deliver discrete chunks of the application
    
* Setting up cross-functional groups of people to ensure better cross-team collaboration
    
* [Shifting left](https://www.sonarsource.com/learn/shift-left/)
    

### Conclusion

Rebuilding software from scratch often seems like an appealing solution to address existing issues, but it usually leads to unforeseen challenges and complications. The process is time-consuming, resource-intensive, and can result in new problems without necessarily solving the old ones. Instead, focusing on improving and iterating on the existing platform can be more effective.

By implementing better testing standards, managing feature flags, establishing dedicated teams for platform development, and fostering cross-team collaboration, we can enhance the current system.

This approach not only addresses existing issues but also adds value to the platform, ensuring that clients and customers continue to receive reliable and improved services without the disruption of a complete overhaul.
