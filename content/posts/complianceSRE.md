---
title: Compliance, it's just being an SRE
layout: slides
date: 2023-12-05T10:28:18Z
description:
  Does this talk contain instructions on how to bend the forces of compliance to
  your will? Does it explore the slow creeping horror that... we're on the same
  side as the lawyers?
author: Cian Butler <butlerx@notthe.cloud>
slideOptions:
  theme: evervault
---

### Compliance, it's just being an SRE

===

![Our goal for this talk](/img/complianceSRE/compliance-and-sre.jpg)

Or how building compliant systems builds stable systems

===

![screenshot of press release of SEC Charges SolarWinds and Chief Information Security Officer with Fraud, Internal Control Failures ](/img/complianceSRE/sec-charges.png)

---

### What is an SRE

> Site reliability engineering (SRE) is a set of principles and practices that
> applies aspects of software engineering to IT infrastructure and operations.
> SRE claims to create highly reliable and scalable software systems
>
> Wikipedia

===

### And Compliance is...

> Compliance refers to the adherence to laws, regulations, standards, and
> internal policies that are relevant and applicable to a specific industry,
> organization, or activity. It involves ensuring that businesses or entities
> operate within the legal and regulatory boundaries set forth by governing
> bodies or industry standards.
>
> A well known LLM

===

Sound pretty similar.

---

## Lets look at some example

===

#### Requirements for Changes to Production Environments

- Reason for, and description of, the change.
- Documentation of security impact.
- Documented change approval by authorized parties.
- Testing to verify that the change does not adversely impact system security.
- For bespoke and custom software changes, all updates are tested for compliance
  with Requirement 6.2.4 before being deployed into production.
- Procedures to address failures and return to a secure state.

Notes:

- Ok. Dry notes. Not a fun blog post on using the latest CI/CD for deploying.

===

### Let Break it down

<ul>
<li class="fragment fade-up">Well documented PR with reason for change</li>
<li class="fragment fade-up">Potential security impacts have been considered and noted</li>
<li class="fragment fade-up">Code is reviewed</li>
<li class="fragment fade-up">Code is tested</li>
<li class="fragment fade-up">Code is patched and up to date before being deployed</li>
<li class="fragment fade-up">You have a roll back plan</li>
</ul>

Notes:

- Some very sensible defaults.
- Probably stuff you're already doing

---

## Maybe Bigger Example

<p class="fragment fade-up">Data Tenancy</p>

<p class="fragment fade-up">or</p>

<p class="fragment fade-up">Keeping latency low and Multi-region deployments</p>

Notes:

Big one data cant leave the EU for EU citizens

---

### And more

- Reproducible builds
- Attestable builds
- Tagging resources
- Keeping systems patched
- Keep data encrypted, TLS, encryption at rest.

===

Sounds like the talk line up for a conference

<p class="fragment fade-in">Do lawyers have conferences?</p>

---

"But the lawyer just says no"

or

"These Requirements seem over kill"

<p class="fragment fade-in">Think I've definitely heard a developer say that about SREs</p>

---

Sounds like we are on the same side.

===

Compliance is a Framework

<p class="fragment fade-in">Guiding practices</p>
<p class="fragment fade-in">There to help and make it safer</p>

Notes:

- Its there to help you be more secure and ensure you protect user data.
- Its a set of rule that you can check and refer back to.
  - When a developer says i want to do something bad you can point and say
    compliance says no.
  - Not a scapegoat
  - but a Rule on the wall
- Compliance rules weren't handed down from on high
- They are based of well founded practices that are designed to protect Users
  and ensure systems remain secure.

---

### Compliance is hard.

- Documents are often PDF
- Many set of checklist

===

## How can we make it better

<ul>
<li class="fragment fade-up">Better tooling. eg. vanta.</li>
<li class="fragment fade-up">Talk to your compliance team sooner</li>
<li class="fragment fade-up">Build compliant from day 1</li>
</ul>

Notes:

- We need better tooling. Ive seen too many spreadsheets.
  - Vanta is a great example of how we can make its easier.
  - Evervault Can help you too.
- Talk to the compliance team from the start.
  - Involve them in requirement gathering.
  - They dont want to come in and make it complicated at the end either.
- Build compliant software from day one.
  - too often the default is not secure, reliable or compliant.
  - Making it easier to on board or get started by skipping this just makes it
    someone else job to document how to productionise or secure it a and someone
    elses job actioning those docs.

---

# Kweschens?
