---
title: The ups and downs of running enclaves in production
layout: slides
date: 2024-01-26T16:26:41Z
description: |-
  At Evervault we've been running production workloads in enclaves for 3 years and are building a platform to allow others to onboard and use enclaves easily. In the talk, I'll cover our experience scaling enclaves and how we load-tested them to optimise our workloads.

  I'll also cover how we built Evervault Enclaves to allow others to leverage what we learned to deploy and use enclaves more easily to have a secure, attestable working environment. Evervault Enclaves allows developers to easily deploy Docker containers to a Secure Enclave without the engineering overhead to leverage fully attestable connections to their backend.

  Ref:
  - [Evervault Enclaves](https://evervault.com/primitives/enclaves)
  - [Evervault Enclaves project](https://github.com/evervault/enclaves/)
  - [Evervault Enclave cli](https://github.com/evervault/enclave-cli)
  - [Confiential Computring as Evervault](https://evervault.com/solutions/confidential-computing)
author: 'Cian Butler <butlerx@notthe.cloud>'
slideOptions:
  theme: evervault
---

## The ups and downs of running enclaves in production

_Cian Butler SRE@Evervault_

===

## Some Context

Evervault offers tooling for data security and compliance.

- Encryption Proxy
- Secure Serverless Functions
- Embeddable UI components
- Enclaves

Notes:

At Evervault we offer tooling to allow our users to guarantee that data is
secure. We have a number of primitives to do this with. At the Core of all the
primitives are Services running in enclaves. These are AWS Nitro enclaves which
offer fully isolated VM and attestation capabilities.

---

## Relay

<svg width="45%" height="50%" viewBox="0 0 526 510" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31.9476 443.762L123.145 496.784C127.637 499.395 133.176 499.429 137.699 496.872C142.144 494.36 144.892 489.65 144.892 484.545V254.529C144.892 245.981 140.345 238.078 132.955 233.781L41.451 180.581C38.3813 178.797 34.5954 178.774 31.5042 180.521L27.0794 183.022C23.9407 184.796 22 188.122 22 191.727V426.472C22 433.595 25.7891 440.181 31.9476 443.762Z" fill="white" fill-opacity="0.1" stroke="white" stroke-width="1.5"></path><path d="M28.0105 189.387L121.444 243.709C126.987 246.932 130.397 252.859 130.397 259.27V494.048C130.397 497.132 127.053 499.056 124.386 497.506L30.9528 443.184C25.4102 439.961 22 434.034 22 427.623V192.845C22 189.761 25.3438 187.837 28.0105 189.387Z" stroke="white" stroke-opacity="0.4"></path><path d="M127.246 250.805L140.48 243.242" stroke="white" stroke-opacity="0.4"></path><rect width="30.1185" height="7.45132" rx="3.72566" transform="matrix(0.866009 0.500028 3.1686e-05 1 63.8923 228.848)" fill="white"></rect><path d="M246.295 199.471L189.689 232.191C185.052 234.872 182.196 239.822 182.196 245.178V310.155C182.196 315.48 185.019 320.406 189.614 323.098L246.22 356.254C250.902 358.997 256.701 358.997 261.383 356.254L317.989 323.098C322.584 320.406 325.407 315.48 325.407 310.155V245.178C325.407 239.822 322.551 234.872 317.914 232.191L261.308 199.471C256.664 196.787 250.939 196.787 246.295 199.471Z" fill="#6633EE" stroke="white" stroke-width="1.5"></path><path d="M182.696 238.758L252.955 278.327L322.696 237.258" stroke="white" stroke-opacity="0.3" stroke-linecap="round" stroke-linejoin="bevel"></path><path d="M252.955 278.258V357.758" stroke="white" stroke-opacity="0.3" stroke-linecap="round"></path><path d="M425.083 94.3391L368.477 127.059C363.84 129.74 360.984 134.69 360.984 140.046V205.022C360.984 210.348 363.808 215.274 368.403 217.966L425.009 251.122C429.691 253.864 435.489 253.864 440.171 251.122L496.777 217.966C501.372 215.274 504.196 210.348 504.196 205.022V140.046C504.196 134.69 501.34 129.74 496.702 127.059L440.097 94.3391C435.452 91.6545 429.728 91.6545 425.083 94.3391Z" fill="white" fill-opacity="0.1" stroke="white" stroke-width="1.5"></path><path d="M362.639 133.046L431.762 173.195L500.884 133.046" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="bevel"></path><path d="M431.762 173.195V252.251" stroke="white" stroke-opacity="0.4" stroke-linecap="round"></path><text x="102" y="129" fill="white" font-size="17px" opacity="1" style="transform: none; transform-origin: 121.038px 122.335px 0px;" transform-origin="121.03764533996582px 122.33474063873291px">User</text><text x="264" y="118" fill="white" font-size="17px" opacity="1" style="transform: none; transform-origin: 295.355px 111.335px 0px;" transform-origin="295.35448837280273px 111.33474063873291px">Encrypt</text><text x="264" y="138" fill="white" font-size="17px" opacity="1" style="transform: none; transform-origin: 300.798px 131.335px 0px;" transform-origin="300.7977828979492px 131.3347406387329px">via
Proxy</text><text x="445" y="12" fill="white" font-size="17px" opacity="1" style="transform: none; transform-origin: 471.536px 5.33474px 0px;" transform-origin="471.5360622406006px 5.33474063873291px">Server</text><circle cx="4" cy="4" transform="matrix(0.866009 0.500028 3.1686e-05 1 213.416 291.159)" fill="white" r="4"></circle><circle cx="4" cy="4" transform="matrix(0.866009 0.500028 3.1686e-05 1 391.396 187.682)" fill="white" r="4"></circle><path d="M145.196,339.5L217.359,297.988" stroke="white" data-element="path-1" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M322.696,237.258L395.338,194.512" stroke="white" data-element="path-2" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M90 195L90 115" stroke="white" data-element="label-line-1" opacity="0.4" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M253 186L253 105" stroke="white" data-element="label-line-2" opacity="0.4" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M433 80L433 0" stroke="white" data-element="label-line-3" opacity="0.4" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path></svg>

Notes:

Relay is a reverse Proxy that users can put in front of any web service to
encrypt or decrypt data prior to it reaching there backend.

Relay does an number of encryptions on users data using unique keys for each
users. To Secure our users Keys and data we do all this encryption in a backend
running inside of an enclave. This Service is the only place that users keys are
ever loaded and all crypto operations are performed in the enclave.

---

## The Problems

- Piles of custom automation.
- Nascent Libraries
- Observability
- Userspace Networking
- Time slippage

Notes:

Enclaves are at the heart of all operations we perform at evervault.
Unfortunately running enclaves is not as easy as running something like a VM or
docker. A lot of the issues we ran into will be no surprise to many people.

===

## Nascent Libraries

```rust
pub struct NsmConnection(i32);
impl NsmConnection {
    pub fn try_new() -> Result<Self, NsmConnectionError> {
        let nsm_fd = nitro::driver::nsm_init();
        if nsm_fd < 0 {
            return Err(NsmConnectionError::InitFailed);
        }
        Ok(Self(nsm_fd))
    }
}
impl std::ops::Drop for NsmConnection {
    fn drop(&mut self) {
        nitro::driver::nsm_exit(self.fd());
    }
}
```

Notes:

We use the aws-nitro and tokio-vsock libraries for communicating with the
service in the enclave. These are both rust libraries. Rust has a strong concept
of ownership around data and resources. This is even modeled in how you handle
dropping File Descriptors.

We unfortunately made incorrect assumptions about the library implementations
and these concepts and ended up having file descriptor leak for every connection
to the enclave. This issue was compounded by the limited Metrics and
Observability we had into the enclave.

===

## Observability

<img src="/img/enclavesInProd/k1-r1.png" width="500px" alt="Loadtest Graphs showing performance improvements moving from k1 to r1 curve">
<img alt="Loadtest Graphs showing performance improvements moving from m5 to c5 nodes" src="/img/enclavesInProd/m5-c5.png" width="500px">

Notes:

Our Encryption service load our users encrypted keys once it has been fully
attested by our KMS. Given we require full attestation we are unable to run in
debug mode (Not that we ever would want to do this) and produce any logs from
our service.

To begin to get metrics out of service we had started blackbox monitoring it. We
ran loadtests using artillery against it and instrumented the clients to produce
metrics that would tell us how the service would perform under different
workloads and scenarios.

This worked to help us fund bottlenecks in the service and optimise our
workload. But this only got us so far for monitoring real production. When we
wanted to actually debug real users queries we were missing vital details about
what was happening.

For this we had to actually implement a concept of traces into the enclave. The
Service would create a trace for each request store the finished trace and all
its meta in a buffer that would periodically be flushed to a reporter on the
host node for forwarding on to the central trace infra.

===

## Userspace Networking

![Graph showing performance difference show running a network request in a vm vs an enclave. Enclave is much lower then vm](/img/enclavesInProd/Request-Volume-Metrics.png)

Notes:

Now that we could see what was actually happening in the enclaves we noticed a
disturbing performance difference for certain processes and requests in the
enclave.

Any Service that communicated to another process in the enclave over local host
had a massive performance impact on requests. We believe that this is due to the
network being in userspace. We are hoping to try short circut this using sockmap
between processes but this is still being tested. If anyone else has had simliar
issues id love to talk about it with them after.

===

## Time slippage

There is no NTP in enclaves.

Notes:

Given we are running in an enclave we have no or limited network which means
many things don't just work. Given the lack of standard networking access we
notices that our enclaves would slip about 1 second a day, based on traffic
volume. Not much but enough that after running for a few days we'd begin to to
notice errors with anything time sensitive such as token validation.

---

## Evervault Enclaves

<svg width="50%" height="50%" viewBox="0 0 687 566" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M241.193 93.3375L171.382 133.811C163.978 138.104 159.42 146.015 159.42 154.574V235.063C159.42 243.572 163.926 251.445 171.263 255.756L241.073 296.769C248.578 301.178 257.883 301.178 265.388 296.769L335.198 255.756C342.535 251.445 347.041 243.572 347.041 235.063V154.574C347.041 146.015 342.483 138.104 335.079 133.811L265.268 93.3375C257.823 89.0213 248.638 89.0213 241.193 93.3375Z" fill="#6633EE" stroke="white" stroke-width="1.5"></path><path d="M244.263 127.93L196.114 155.762C191.477 158.442 188.621 163.392 188.621 168.748V224.013C188.621 229.338 191.445 234.265 196.04 236.956L244.189 265.159C248.871 267.901 254.669 267.901 259.351 265.159L307.5 236.956C312.095 234.265 314.919 229.338 314.919 224.013V168.748C314.919 163.392 312.063 158.442 307.425 155.762L259.277 127.93C254.632 125.245 248.908 125.245 244.263 127.93Z" fill="#171717" fill-opacity="0.7" stroke="white" stroke-width="1.5"></path><path d="M161.15 142.667L252.771 195.96L345 142" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="bevel"></path><path d="M252.771 195.96V300.356" stroke="white" stroke-opacity="0.4" stroke-linecap="round"></path><path d="M56.6421 236.706L8.49333 264.538C3.85607 267.218 1 272.168 1 277.524V332.789C1 338.115 3.82355 343.041 8.41869 345.732L56.5675 373.935C61.2496 376.678 67.0479 376.678 71.7301 373.935L119.879 345.732C124.474 343.041 127.298 338.115 127.298 332.789V277.524C127.298 272.168 124.441 267.218 119.804 264.538L71.6554 236.706C67.011 234.022 61.2865 234.022 56.6421 236.706Z" fill="white" fill-opacity="0.1" stroke="white" stroke-width="1.5"></path><path d="M3.19043 269.599L64.1491 305.007L125.108 269.599" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="bevel"></path><path d="M64.1484 305.007L64.1484 376.186" stroke="white" stroke-opacity="0.4" stroke-linecap="round"></path><circle cx="4" cy="4" r="4" transform="matrix(0.866009 0.500028 3.1686e-05 1 216.902 208.276)" fill="white"></circle><path d="M124.5,270L220.378,214.299" stroke="white" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M64 222L64 142" stroke="white" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M287,486L287,566" stroke="white" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M253 79L253 0" stroke="white" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M476 171L476 92" stroke="white" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M464.193 188.979L394.382 229.453C386.978 233.746 382.42 241.657 382.42 250.216V330.704C382.42 339.214 386.926 347.087 394.263 351.397L464.073 392.411C471.578 396.82 480.883 396.82 488.388 392.411L558.198 351.397C565.535 347.087 570.041 339.214 570.041 330.704V250.216C570.041 241.657 565.483 233.746 558.079 229.453L488.268 188.979C480.823 184.663 471.638 184.663 464.193 188.979Z" fill="#6633EE" stroke="white" stroke-width="1.5"></path><path d="M467.263 223.571L419.114 251.403C414.477 254.084 411.621 259.033 411.621 264.39V319.654C411.621 324.98 414.445 329.906 419.04 332.598L467.189 360.8C471.871 363.543 477.669 363.543 482.351 360.8L530.5 332.598C535.095 329.906 537.919 324.98 537.919 319.654V264.39C537.919 259.033 535.063 254.084 530.425 251.403L482.277 223.571C477.632 220.887 471.908 220.887 467.263 223.571Z" fill="#171717" fill-opacity="0.7" stroke="white" stroke-width="1.5"></path><path d="M384.15 238.308L475.771 291.602L568 237.641" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="bevel"></path><path d="M475.771 291.602V395.998" stroke="white" stroke-opacity="0.4" stroke-linecap="round"></path><path d="M279.642 332.348L231.493 360.179C226.856 362.86 224 367.81 224 373.166V428.431C224 433.756 226.824 438.682 231.419 441.374L279.567 469.577C284.25 472.319 290.048 472.319 294.73 469.577L342.879 441.374C347.474 438.682 350.298 433.756 350.298 428.431V373.166C350.298 367.81 347.441 362.86 342.804 360.179L294.655 332.348C290.011 329.663 284.286 329.663 279.642 332.348Z" fill="white" fill-opacity="0.1" stroke="white" stroke-width="1.5"></path><path d="M226.19 365.241L287.149 400.648L348.108 365.241" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="bevel"></path><path d="M287.148 400.648L287.148 471.827" stroke="white" stroke-opacity="0.4" stroke-linecap="round"></path><circle cx="4" cy="4" r="4" transform="matrix(0.866009 0.500028 3.1686e-05 1 439.902 303.917)" fill="white"></circle><path d="M347.5,365.641L443.378,309.94" stroke="white" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path d="M511 345L559.5 373.5" stroke="white" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M104.497 312.328C104.775 312.488 104.775 313.008 104.497 313.49L94.9733 329.985C94.6891 330.477 94.2261 330.736 93.9513 330.556L88.3496 326.891C88.0809 326.715 88.0954 326.187 88.3821 325.711L89.9388 323.127C90.2254 322.651 90.6756 322.408 90.9443 322.584L94.5364 324.934L101.982 312.038C102.26 311.557 102.71 311.297 102.988 311.457L104.497 312.328Z" fill="white" opacity="1" style="transform: none; transform-origin: 96.4314px 321.012px 0px;" transform-origin="96.43135452270508px 321.01153564453125px"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M316.904 419.539L312.801 417.17C312.469 416.978 312.469 416.357 312.801 415.782L314.604 412.659C314.936 412.084 315.475 411.773 315.807 411.965L319.805 414.273L323.469 407.625C323.79 407.043 324.328 406.711 324.671 406.883L326.535 407.816C326.878 407.988 326.897 408.598 326.576 409.179L322.812 416.009L327.354 418.632C327.686 418.823 327.686 419.445 327.354 420.02L325.551 423.143C325.219 423.718 324.681 424.029 324.349 423.837L319.91 421.275L315.836 428.668C315.516 429.249 314.978 429.581 314.634 429.409L312.77 428.477C312.427 428.305 312.409 427.695 312.729 427.113L316.904 419.539Z" fill="white" opacity="1" style="transform: none; transform-origin: 320.052px 418.146px 0px;" transform-origin="320.05169677734375px 418.14599609375px"></path><text x="72" y="156" fill="white" font-size="19px" opacity="1" style="transform: none; transform-origin: 97.9507px 149.113px 0px;" transform-origin="97.95073127746582px 149.11347579956055px">Client</text><text x="296" y="565" fill="white" font-size="19px" opacity="1" style="transform: none; transform-origin: 321.951px 558.113px 0px;" transform-origin="321.9507312774658px 558.1134757995605px">Client</text><text x="486" y="107" fill="white" font-size="19px" opacity="1" style="transform: none; transform-origin: 554.578px 100.113px 0px;" transform-origin="554.5783386230469px 100.11347579956055px">Secure
Enclave</text><text x="262" y="15" fill="white" font-size="19px" opacity="1" style="transform: none; transform-origin: 330.578px 8.11347px 0px;" transform-origin="330.5783386230469px 8.11347246170044px">Secure
Enclave</text><g style="transform: matrix(0.87, 0.5, -0.87, 0.5, 0, 0);"><text x="706" y="59" fill="white" font-size="19px" opacity="1" style="transform: none; transform-origin: 771.732px 52.1135px 0px;" transform-origin="771.7319030761719px 52.11347198486328px">Code
changed</text></g></svg>

[evervault.com/primitives/enclaves](https://evervault.com/primitives/enclaves)

Notes:

Putting it all together we created Evervault Enclaves as a platform for others
to deploy there services and don't have to worry about any of the issues we've
run into.

Evervault Enclaves build from a regular docker container and are deployed into a
enclave run in evervault infra. The enclaves have :

- fully attestable connections.
- TLS termination
- Ability to integrate with other evervault encryption services.
- And takes care of all the scaling issues

We want to take the pain that we experience out of running enclaves.

---

# Questions?

Notes: If you want to chat about enclaves or are interested in what evervault
does you can ping me or come up to me after.
