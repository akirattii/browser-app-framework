# Browser App Framework

A simple browser application framework, supporting modern browser only.

## Example

`example/index.html` of this project is a main page of this example. Try it on browser.

## Run example

### `http:` protocol:

```
$ npm install -g serve
$ serve -p 8000

# or ...

$ python -m SimpleHTTPServer 8000
```

Then open http://localhost:8000/example/ with browser.

### `file:` protocol:

Just open `index.html` file with browser.  

**CAUTION:** This method might have any restriction of browser.


## Make your app

### Dependencies

This framework requires:

- [`vue`](https://github.com/vuejs/vue) (v2)
- [`jquery`](https://github.com/jquery/jquery) (v3)
- [`bootstrap`](https://github.com/twbs/bootstrap) (v4) and its dependencies 


### Installing

Copy `lib/browser-app-framework.js` into your project's external library folder:

```
$ git clone git@github.com:akirattii/browser-app-framework.git
$ cd browser-app-framework/
$ cp lib/browser-app-framework.js /path/to/your/project/public/extlib/
```

And import them on your html like this:

```
<head>
  ...
  <!-- Dependencies for Browser App Framework: -->
  <link rel="stylesheet" href="css/extlib/bootstrap.min.css">
  <link rel="stylesheet" href="css/extlib/fontawesome/web-fonts-with-css/css/fontawesome-all.min.css">
  <link rel="stylesheet" href="css/app.css">
  <script src="javascripts/extlib/jquery-3.3.1.min.js"></script>
  <script src="javascripts/extlib/popper.min.js"></script>
  <script src="javascripts/extlib/bootstrap.min.js"></script>
  <script src="javascripts/extlib/vue.min.js"></script>
</head>
<body>
  ...
  <!-- Browser App Framework: -->
  <script type="text/javascript" src="./extlib/browser-app-framework.js"></script>
  <script type="text/javascript">
  // An instance named `app` is a convention, lives in global:
  const app = new BrowserAppFramework({
    rootPath: "./javascripts",
    i18nAvailables: ["en", "ja"],
    loglevel: 1,
  }); 
  </script>
</html>
```

#### Project structure

Both `roles/` and `locales/` folders are used by this framework.
Typically your public project structure might look like this:

```
<PROJECT_ROOT>
  │ 
  ├ index.html
  │
  ├ javascripts/
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
  │          ├ browser-app-framework.js
  │          ├ jquery.min.js
  │          ├ ...
  │
  ├ css/
  │
  └ package.json
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
  <link rel="stylesheet" href="css/extlib/fontawesome/web-fonts-with-css/css/fontawesome-all.min.css">
  <link rel="stylesheet" href="css/app.css">
  <script src="javascripts/extlib/jquery-3.3.1.min.js"></script>
  <script src="javascripts/extlib/popper.min.js"></script>
  <script src="javascripts/extlib/bootstrap.min.js"></script>
  <script src="javascripts/extlib/vue.min.js"></script>
</head>

<body>
  <!--###################### Nav ######################-->
  <nav id="nav" class="navbar navbar-expand-lg navbar-light bg-light">
    <span class="navbar-brand" title="__MSG_title__">__MSG_title__</span>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href="#home">
          <i class="fa fa-home"></i>
          __MSG_home__
        </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#hoge?name=Akira&age=999">Hoge</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#foo">Foo</a>
        </li>
      </ul>
    </div>
  </nav>
  
  <!--###################### Header ######################-->
  <header id="header"></header>

  <!--###################### Main ######################-->
  <main role="main" class="container-fluid">

    <!--###################### Role: "error" ######################-->
    <div id="role-error" class="mt-2 d-none">
      Error: {{ error }}
    </div>

    <!--###################### Role: "home" ######################-->
    <div id="role-home" class="mt-2 d-none">
      ...
    </div>
    
    <!--###################### Role: "hoge" ######################-->
    <div id="role-hoge" class="mt-2 d-none">
      ...
    </div>

    <!--###################### Role: "foo" ######################-->
    <div id="role-foo" class="mt-2 d-none">
      ...
    </div>
  
  </main>
  
  <!--###################### Footer ######################-->
  <footer id="footer" class="footer">
    <div class="container">
      <div class="row col-12 text-muted text-center">
        <span class="col-12">&copy; __MSG_title__</span>
      </div>
    </div>
  </footer>

</body>

<script>
<!-- bootstrap custom form validator. fires when clicking type="submit" button on ".needs-validation" form -->  
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();
</script>

<!-- Browser App Framework -->
<script type="text/javascript" src="./extlib/browser-app-framework.js"></script>
<script type="text/javascript">
// An instance named `app` is a convention, lives in global:
const app = new BrowserAppFramework({
  rootPath: "./javascripts",
  i18nAvailables: ["en", "ja"],
  loglevel: 1,
}); 
</script>

</html>
```

#### Load Browser App Framework

Load it like this:

```
...
<script type="text/javascript" src="./extlib/browser-app-framework.js"></script>
<script type="text/javascript">
// An instance named `app` is a convention, lives in global:
const app = new BrowserAppFramework({
  rootPath: "./javascripts",
  i18nAvailables: ["en", "ja"],
  loglevel: 1,
}); 
</script>

</html>
```

##### Parameters:

- `rootPath`: a project's root path for this framework, in which `roles/` and `locales/` exist. 
- `i18nAvailables`: Locales your project supports. Defaults to "en". If you add new locale, you must add new locale js file too.
- `loglevel`: if set loglevel up to 1, this framework's logs output on console. 

**CAUTION:** The instance's name `app` is a convention. Don't change this!


### Roles

*Role* means a page of your app.
Elements of `index.html` which elementId starts with `role-` are loaded as page roles automatically, and related with `roles/*.js`.    
For example, `<div id="role-hoge">...</div>` is auto-loaded as `hoge` role and related with `roles/hoge.js`.

### Localization

Relatinal files: 

- `locales/<language>.js`

Locale files must be contained under the directory `locales/<language>.js`.
The message resource of the localization is loaded as a global variable `window.messageResources`.
A part of `language` of `locales/<language>.js` comes from browser's `navigator.language`. If an user cannot get an appropriate `<language>.js`, it is set `locales/en.js` as default. You can make some locales availeble when you create the instance:

```
const app = new BrowserAppFramework({
  rootPath: "./javascripts",
  i18nAvailables: ["en", "ja"], // <= here!
  loglevel: 1,
});
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

### Custom event

This framework uses `vue2`'s [Event API](https://vuejs.org/v2/api/index.html#Instance-Methods-Events), so you can emit and handle your custom event using vue2's way.  
  
Emit an event with some values on somewhere `app` instance referable, like this:
```
// emit!
app.emit("update-current-time", { currentTime: Date.now() }, { name: "akira" });
```

Handle it on role page, like this:
```  
/* custom event handler */
vm.$on('update-current-time', function(msg) {
  // use received `msg` (array object) as you like!
  // `msg` looks like this: `[{ currentTime: 1234567890 }, { name: "akira" }]`
});
```

### Form validation

This framework uses a simple validation of [bootstrap4's form validation](https://getbootstrap.com/docs/4.0/components/forms/#validation). For using this feature, below code is appended on `index.html`:

```
<script>
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();
</script>
```


### Development cycle

Below is the typical steps for implement a new role named `hoge` on an app.

**Step 0:** Run `browserify` on this app's project root:

```
$ npm run browserify
```

**Step 1:** Add `<div id="role-hoge">...</div>` on `index.html`:
```
...
<body>
  ...

  <!--###################### Role: "hoge" ######################-->
  <div id="role-hoge" class="mt-2 d-none">
    <div class="h4">Here is "hoge" role</div>
    <div>currentTime: {{ currentTime }}</div>
    <form id="frm-hoge" class="col-12 needs-validation" novalidate>
      <div class="form-group row">
        <label>__MSG_enterValidName__:</label>
        <input type="text" name="name" v-model="name" class="form-control" required>
        <div class="valid-feedback">__MSG_looksGood__</div>
        <div class="invalid-feedback">__MSG_enterValidName__</div>
      </div>
      <div class="form-group row">
        <label>__MSG_enterValidAge__:</label>
        <input type="number" name="age" v-model:number="age" class="form-control" required min="0" data-errmsg="__MSG_enterValidAge__">
        <div class="valid-feedback">__MSG_looksGood__</div>
        <div class="invalid-feedback">__MSG_enterValidAge__</div>
      </div>
      <div class="form-group row">
        <button type="submit" id="btn-hoge" class="btn btn-primary">OK</button>
      </div>
    </form>
  </div>
  ...
</body>
...
```

**Step 2:** Create `roles/hoge.js`:
```
app.roles["hoge"] = function() {

  const vm = new Vue({
    el: '#role-hoge',
    data: {
      name: null,
      age: null,
      currentTime: null,
    },
    methods: {
      refresh,
    },
  });

  /* custom event handler */
  vm.$on('update-current-time', function(msg) {
    const data = msg[0];
    vm.currentTime = data.currentTime;
  });

  $(document).on("submit", "#frm-hoge", function(e) {
    alert(`Hi, ${vm.name}.`);
    return false;
  });

  function refresh(param) {
    console.log("refresh:", param);
    vm.name = param.name;
    vm.age = param.age;
  }

  return { "default": vm };
}();
```

**Step 3:** Append some message resources to `locale/en.js` (and other locale js):
```
/* DO NOT change variable name `messageResources` */
const messageResources = {
  "title": "Browser App Framework Example",
  "hello": "Hello %s!",
  "looksGood": "Looks good!",
  "enterValidName": "Enter your name",
  "enterValidAge": "Enter your age",
};
```

That's all!  
Now open `index.html` with modern browser to run this app.

## Authors

- **Akira Tanaka** - *Founder* - [akirattii@github](https://github.com/akirattii)

## LICENSE

This project is licensed under the MIT License - see the [LICENSE.txt](./LICENSE.txt) file for details



  
END