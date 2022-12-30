---
title: "Handling media-queries with PostCSS Mixins."
slug: "how-to-maintain-device-specific-css-in-your-webapp-website"
date_published: 2020-02-29T09:02:02.000Z
date_updated: 2020-03-02T21:23:07.000Z
---

### What are Mixins?

Mixins are means to create simple css templates to prevent duplication of code. Exmaple of a mixin in PostCSS:

    @define-mixin transition $property: all, $time: 150ms, $easing: ease-out {
      transition: $(property) $(time) $(easing);
    }
    

The above mixin enables us to templatize transition definitions in our css. The above mixin can be used as follows:

    body {
      @mixin transition color, 2s, ease-in;
    }
    

Another example of an use case for mixins could be, if we had multiple Icons across our website that shared the same styles. We could define a mixin for those icons as follows:

    @define-mixin icon $name {
        padding-left: 16px;
        &::after {
            content: "";
            background: url(/icons/$(name).png);
        }
    }
    

And this mixin could be used as:

    .search {
        @mixin icon search;
    }
    
    .hamburger {
        @mixin icon hamburger;
    }
    

### How to enable mixins in PostCSS?

In PostCSS, [mixins](https://github.com/postcss/postcss-scss) are available as a plugin.

#### Installation:

PostCSS-Mixins can be install using npm:

    npm i -D postcss-mixins
    

#### Usage:

To enable the plugin, we need to load the plugin by including them in the postcss config:

    postcss([ require('postcss-mixins') ])
    

### How does mixins help manage media queries?

We can use mixins to create device/screen-size specific media query templates. This allows us to call these mixins within a target class or any css selector to target styling for the same class or selector for the given device/screen-size. Confused?

Lets try this with examples. Lets create mixins (templates) for device/screen-size specific media queries:

    @define-mixin tablet {
        @media (--tablet-screen-size) {
            @mixin-content;
        }
    }
    
    @define-mixin desktop {
        @media (--desktop-screen-size) {
            @mixin-content;
        }
    }
    
    OR
    
    @define-mixin small {
        @media (--small-screen) {
            @mixin-content;
        }
    }
    
    @define-mixin medium {
        @media (--medium-screen) {
            @mixin-content;
        }
    }
    

So now we have mixins that help write css targeting specific device/screen size.

> Note: Naming a mixin by device type like `tablet` or by sizing like `small` are just different implementations to acheive the same end result.

The mixin can now be used as follows:

    
    h2 {
        font-size: 14px;
     
        @mixin tablet {
            font-size: 16px;
        }
     
        @mixin desktop {
            font-size: 24px;
        }
    }
    
    OR 
    
    h2 {
        font-size: 14px;
     
        @mixin small {
            font-size: 16px;
        }
    
        @mixin medium {
            font-size: 24px;
        }
    }
    
    /* Where traditionaly you would define it as: */
    
    h2 {
        font-size: 14px;
    }
    
    @media (min-width: --small) {
        font-size: 16px;
    }
    
    @media (min-width: --medium) {
        font-size: 24px;
    }
    
    
    

This allows for target specific styling to be address in one place and makes it more readable and clear.

---

### Advanced usage of mixins

Unlike Sass, PostCSS has no if or while statements. If you need some complicated logic, you should use function mixin.

#### Function Mixin

This type of mixin gives you full power of JavaScript. You can define this mixins in mixins option.

This type is ideal for CSS hacks or business logic.

Function mixins can be defined in your PostCSS config file:

    require('postcss-mixins')({
        mixins: {
            icons: function (mixin, dir) {
                fs.readdirSync('/images/' + dir).forEach(function (file) {
                    var icon = file.replace(/\.svg$/, '');
                    var rule = postcss.rule({ selector: '.icon.icon-' + icon });
                    rule.append({
                        prop:  'background',
                        value: 'url(' + dir + '/' + file + ')'
                    });
                    mixin.replaceWith(rule);
                });
            }
        }
    });
    

Defined function mixin can be used as follows:

    @mixin icons signin;
    

Which compiles to the following:

    .icon.icon-back { background: url(signin/back.svg) }
    .icon.icon-secret { background: url(signin/secret.svg) }
    
