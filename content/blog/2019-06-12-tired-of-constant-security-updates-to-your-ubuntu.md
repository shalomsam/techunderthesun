---
title: Security patches now a breeze on your Ubuntu Server/Machine! 💻
slug: tired-of-constant-security-updates-to-your-ubuntu
date_published: 2019-06-12T12:44:40.000Z
date_updated: 2019-06-14T14:05:06.000Z
tags: Ubuntu, Server, Hosting, VPS, Kernel
---

You heard that right folks no more do you have to deal with the frequent (yet some times annoying) updates and security patches to the kernel, that invokes downtime in most cases. Now you can apply those security patches without any intervention from you and that too without a system restart! And better yet, it’s free for use on up to 3 machines! 😱

**What Am I talking about, you ask!?**

I am talking about Ubuntu's new [LivePatch Service](https://ubuntu.com/livepatch). If you are interested in setting this up follow simple steps stated below and you'll be good to go!

### 1. Create an Ubuntu One Account

If you don't already have an Ubuntu One account head on over to their portal [here](https://login.ubuntu.com) and create a new account.

### 2. Install Snapd

****Snapd**** is a REST API daemon for managing snap packages. Users can interact with it by using the *snap* client, which is part of the same package. You can package any app for every Linux desktop, server, cloud or device. 

    sudo apt update && sudo apt install snapd
    

At this point, if you are running an Ubuntu 14.04 LTS, you are required to run the Ubuntu v4.4 kernel in Trusty. Please reboot into the correct kernel if you are not currently running it.

    sudo reboot
    

### 3. Install canonical-livepatch

Install canonical livepatch using the following command on your terminal

    sudo snap install canonical-livepatch
    

### 4. Enable canonical-livepatch

Now you can head over to Ubuntu's livepatch page and retrieve your own token. Ex: `d3b07384d213edec49eaa6238ad5ff00`. Then you can enable `canonical-livepatch` using the token obtained earlier, on your server/machine, using the following command:

    sudo canonical-livepatch enable d3b07384d113edec49eaa6238ad5ff00
    

### 5. And You are all set!

That's all you need now you can check your status at anytime using the below command:

    canonical-livepatch status
    kernel: 4.4.0-70.91~14.04.1-generic
    fully-patched: true
    version: "21.1"
    

## That's All Folks! 🐰🥕

Thanks for reading this article. I hope this article has been helpful to you and has spared you some trouble in setting up Jest at the very least. Hopefully, you don’t have to struggle as I did try to set up testing for my Expo/React Native project.

> Hi 👋, I’m [Shalom Sam](https://react.shalomsam.com/) a Full Stack Developer. I have been working as a developer for a lil over 9 years now. I’m a code-aholic and love building stuff on the web, and now on native devices thanks to React Native. I hope this article was helpful in some way. If you did like this article and would like to see more like these please share & subscribe. **✌️**

---

*Also published on [medium](https://medium.com/@shalomsam/security-patches-now-a-breeze-on-your-ubuntu-server-machine-9824f1a30c0d).*
