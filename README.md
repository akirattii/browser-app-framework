# Browser App Framework

A simple browser application framework, supporting modern browser only.

## Example

This project is the very example. `index.html` of this project is a main page of this example. Try it on browser.


## Make your app

### Prerequisities

- [`browserify`](https://github.com/browserify/browserify) installed
- [`UglifyJS2`](https://github.com/mishoo/UglifyJS2) installed

### Dependencies

This framework requires:

- [`vue`](https://github.com/vuejs/vue) (v2)
- [`jquery`](https://github.com/jquery/jquery) (v3)
- [`bootstrap`](https://github.com/twbs/bootstrap) (v4) and its dependencies 
- [`querystring`](https://www.npmjs.com/package/querystring) (npm module)

**NOTE:** This framework uses `querystring` npm module, so you must set `global.querystring = require('querystring');` on `javascripts/browser-app-framework/index.js` and browserify it to generate `javascripts/browser-app-framework/bundle.js` even if you never use any npm modules.

### Installing

Clone this project:

```
$ git clone git@github.com:akirattii/browser-app-framework.git
$ cd browser-app-framework/
$ cp -R javascripts/browser-app-framework /path/to/your_project/public_js_folder/
```

Browserify to generate `bundle.js` and copy it into your project:

```
$ npm run browserify
$ cp javascripts/browser-app-framework/bundle.js /path/to/your_project/public_js_foloder/
```

And import them on your html like this:

```
<head>
  ...
  <!-- Dependencies for Browser App Framework: -->
  <link rel="stylesheet" href="css/extlib/bootstrap.min.css">
  <script src="javascripts/extlib/vue.js"></script>
  <script src="javascripts/extlib/form-validator.js"></script>
  <script src="javascripts/extlib/jquery-3.3.1.min.js"></script>
  <script src="javascripts/extlib/tether.min.js"></script>
  <script src="javascripts/extlib/bootstrap.min.js"></script>
  ...
  <!-- Used by Browser App Framework: -->
  <script src="javascripts/browser-app-framework/bundle.js"></script>
</head>

...

<!-- Browser App Framework Suites (must load them in below order): -->
<script type="text/javascript" src="javascripts/browser-app-framework/browser-app-framework-base.js"></script>
<script type="text/javascript" src="javascripts/browser-app-framework/browser-app-framework-ext.js"></script>

</html>
```

#### Project structure

Typically your public project structure might look like this:

```
<PROJECT_ROOT>
  │ 
  ├ index.html
  │
  ├ javascripts/
  │    │ 
  │    ├ browser-app-framework/
  │    │    ├ browser-app-framework-base.js
  │    │    ├ browser-app-framework-ext.js
  │    │    ├ index.js
  │    │    └ bundle.js
  │    │
  │    ├ roles/
  │    │    ├ <role>.js
  │    │    ├ ...
  │    │
  │    ├ locales/
  │    │    ├ en.js
  │    │    ├ <locale>.js
  │    │    ├ ...
  │    │    
  │    └ extlib/
  │          ├ jquery.min.js
  │          ├ ...
  │
  ├ css/
  │
  ├ package.json
  │
  └ npm_modules/
      ├ querystring/
      ├ ...


```


### More detail about installing

#### index.html

`index.html` is a main page of single-page app made from this framework.
Below is a typical frame of `index.html`:
```
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  ...
  <link rel="stylesheet" href="css/extlib/bootstrap.min.css">
  <script src="javascripts/extlib/vue.js"></script>
  <script src="javascripts/extlib/form-validator.js"></script>
  <script src="javascripts/extlib/jquery-3.3.1.min.js"></script>
  <script src="javascripts/extlib/tether.min.js"></script>
  <script src="javascripts/extlib/bootstrap.min.js"></script>
  <script src="javascripts/browser-app-framework/bundle.js"></script>
</head>

<body class="container-fluid">
  
  <!-- navigation bar -->
  <nav id="nav" class="row navbar navbar-toggleable-md navbar-light bg-faded">
    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <span class="navbar-brand">
      __MSG_title__
    </span>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#home">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#hoge?aaa=111&bbb=234">Hoge</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#foo">Foo</a>
        </li>
      </ul>
    </div>
  </nav>

  <!-- page role: error (Required!) -->
  <div id="role-error" class="mt-3 d-none">
    Error!
  </div>
  
  <!-- page role: home -->
  <div id="role-home" class="role mt-2 d-none">
    ...
  </div>

  <!-- page role: hoge -->
  <div id="role-hoge" class="role mt-2 d-none">
    ...
  </div>

  <!-- page role: foo -->
  <div id="role-foo" class="role mt-2 d-none">
    ...
  </div>
  ...
</body>

<!-- Browser App Framework Suites (must load them in below order) -->
<script type="text/javascript" src="javascripts/browser-app-framework/browser-app-framework-base.js"></script>
<script type="text/javascript" src="javascripts/browser-app-framework/browser-app-framework-ext.js"></script>

</html>
```

#### bundle.js 

You can use your favorite npm modules to code `require(...)` on `javascripts/browser-app-framework/index.js` and browserify it.
Even if you never use any npm modules, you must browserfiy `javascripts/browser-app-framework/index.js` to generate `javascripts/browser-app-framework/bundle.js` because this framework requires `querystring` npm module.  
  
To generate `javascripts/browser-app-framework/bundle.js` from `javascripts/browser-app-framework/index.js`:

```
$ npm run browserify
# ...or
$ npm run browserify:compress
```

Then import `javascripts/browser-app-framework/bundle.js` by setting `script` tag on `index.html` like this:
```
...
<head>
  ...
  <script src="javascripts/browser-app-framework/bundle.js"></script>
</head>
...
```

Then you can use them as global instances.

#### Load Browser App Framework

`javascripts/browser-app-framework/browser-app-framework-base.js` is a base of this framework. When it is loaded, `window.app` instance is created.
To make the instance properly, you must load them on `index.html` in below order:

```
...
<script type="text/javascript" src="javascripts/browser-app-framework/browser-app-framework-base.js"></script>
<script type="text/javascript" src="javascripts/browser-app-framework/browser-app-framework-ext.js"></script>
</html>
```

Below is files that you have to customize by yourself depending on your app:

- `browser-app-framework-base.js`  
  For your app's localization, you can append some locales into `app.i18nAvailables` array on `browser-app-framework-base.js`. Below is an example you append *"ja"* (Japanese):
  `app.i18nAvailables = ["en", "ja"];`  
  On this case, keep in mind you must also append a locale file named `locales/ja.js`.
- `browser-app-framework-ext.js`  
  Using this file, you can extend `app` object depending on your app. For example, you can add `app.yourCustomLogic = function(){...}` into this file to use its function in your app.

### Roles

*Role* means a page of your app.
Elements of `index.html` which elementId starts with `role-` are loaded as page roles automatically, and related with `roles/*.js`.    
For example, `<div id="role-hoge">...</div>` is auto-loaded as `hoge` role and related with `roles/hoge.js`.

### Localization

Relatinal files: 

- `locales/<language>.js`

Locale files must be contained under the directory `locales/<language>.js`.
The message resource of the localization is loaded as a global variable `window.messageResources`.
A part of `language` of `locales/<language>.js` comes from browser's `navigator.language`. If an user cannot get an appropriate `<language>.js`, it is set a default file which is `locales/en.js`. Default setting is coded at below line on `browser-app-framework-base.js`:
```
app.i18nAvailables = ["en"]; // "en" is default locale!
```

If you add a locale file into the `locales/`, for instance `ja`, you must also add `"ja"` into the `app.i18nAvailables` on `javascripts/browser-app-framework-base.js` like this:

```
app.i18nAvailables = ["en", "ja"];
```

Below is a template of `locales/<language>.js`:

```
const messageResources = {
  "title": "HELLO APP",
  "hello": "Hello %s!",
  "enterYourName": "Enter your name",
  "enterYourAge": "Enter your age",
  ...
};
```

Above message resource can be used on `index.html` like this:
```
...
<div>__MSG_title__</div>
...
<label>__MSG_enterYourName__:</label>
<input type="text" placeholder="__MSG_enterYourName__">
...
```

Also you can get a locale message programatically:

```
var title = app.getMessage("title"); // "HELLO APP"
var hello = app.getMessage("hello", ["World"]); // "Hello %s!" => "Hello World!"
```


### Development cycle

Below is the typical steps for implement a new role named `hoge` on an app.

**Step 0:** Run `browserify` on this app's project root:

```
$ npm run browserify
```

**Step 1:** Add `<div id="role-hoge">...</div>` on `index.html`:
```
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  ...
  <!--** load required external libraries **-->
  <link rel="stylesheet" href="css/extlib/bootstrap.min.css">
  <script src="javascripts/extlib/vue.js"></script>
  <script src="javascripts/extlib/form-validator.js"></script>
  <script src="javascripts/extlib/jquery-3.3.1.min.js"></script>
  <script src="javascripts/extlib/tether.min.js"></script>
  <script src="javascripts/extlib/bootstrap.min.js"></script>
  <script src="javascripts/browser-app-framework/bundle.js"></script>
</head>

<body class="container-fluid">

  <!--### Role: "error" (required) ###-->
  <div id="role-error" class="mt-3 d-none">
    Error!
  </div>

  <!--### Role: "hoge" ###-->
  <div id="role-hoge">
    <div class="h4">This is "hoge" role</div>
    <form id="frm-hoge" class="col-12">
      <div class="form-group row">
        <label>__MSG_enterYourName__:</label>
        <input type="text" name="name" v-model="name" class="form-control" required data-errmsg="__MSG_enterYourName__">
      </div>
      <div class="form-group row">
        <label>__MSG_enterYourAge__:</label>
        <input type="number" name="age" v-model:number="age" class="form-control" required min="0" data-errmsg="__MSG_enterYourAge__">
      </div>
      <div class="form-group row">
        <button type="button" id="btn-hoge" class="btn btn-primary">OK</button>
      </div>
    </form>
  </div>
  ...
</body>
<!--** load Browser App Framework (IMPORTANT: must be imported in below order) **-->
<script type="text/javascript" src="javascripts/browser-app-framework/browser-app-framework-base.js"></script>
<script type="text/javascript" src="javascripts/browser-app-framework/browser-app-framework-ext.js"></script>

</html>
```

**Step 2:** Create `javascripts/roles/hoge.js`:
```
app.roles["hoge"] = function() {

  const vm = new Vue({
    el: '#role-hoge',
    data: {
      name: null,
      age: null,
    },
    methods: {
      // NOTE: it is called when this page are shown. 
      // `refresh` function is called from the framework.
      refresh: function(param) {
        // `param` made from querystring on omnibar is passed: 
        console.log("refresh:", param);
      },
    },
  });

  const validator = new FormValidator("#frm-hoge"); // built-in simple form validator

  $(document).on("click", "#btn-hoge", function(e) {
    // you can check validity by built-in form validator just before posting them:
    if (!validator.reportValidity()) return false;
    alert("OK!");
    return false;
  });

  return { "default": vm }; // "default" vue instance is necessary
}();
```

**Step 3:** Append some message resources to `locale/en.js` (and other locale js):
```
const messageResources = {
  "title": "HELLO APP",
  "hello": "Hello %s!",
  "enterYourName": "Enter your name",
  "enterYourAge": "Enter your age",
};
```

That's all!  
Now open `index.html` with modern browser to run this app.

## Authors

- **Akira Tanaka** - *Founder* - [akirattii@github](https://github.com/akirattii)

## LICENSE

This project is licensed under the MIT License - see the [LICENSE.txt](./LICENSE.txt) file for details



  
END