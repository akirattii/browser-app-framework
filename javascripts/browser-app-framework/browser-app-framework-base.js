/**
 * Browser App Framework base library
 * This instance is set as global `window.app`.
 *
 * # Usage:
 * Load this script on just before `</html>` of main html file like this:
 * ```
 *  ...
 *  <link rel="stylesheet" href="css/extlib/bootstrap.min.css">
 *  <script src="javascripts/extlib/vue.js"></script>
 *  <script src="javascripts/extlib/jquery-3.3.1.min.js"></script>
 *  <script src="javascripts/extlib/tether.min.js"></script>
 *  <script src="javascripts/extlib/bootstrap.min.js"></script>
 *  <script src="javascripts/bundle.js"></script>
 * </head>
 * ...
 * <div id="role-hoge">...</div>
 * <div id="role-foo">...</div>
 * ...
 * <script type="text/javascript" src="javascripts/browser-app-framework-base.js"></script>
 * <script type="text/javascript" src="javascripts/browser-app-framework-ext.js"></script>
 * </html>
 * ```
 */

// check required modules:
// vue.js
if (!Vue) throw Error("[BAF] requires 'vue.js'");
// jqeury
if (!$) throw Error("[BAF] requires 'jquery'");
// bootstrap
if (!$().modal) throw Error("[BAF] requires 'bootstrap'");

// Application global object:
if (window.app) throw Error("[BAF] global `app` instance's already declared");
const app = {};

// Global locale availables. element of index:0 is a default locale.
app.i18nAvailables = ["en", "ja"];
// Global this framework's root path:
app.rootPath = null;
// Global flag for check whether app's already initialized 
app.initialized = false;


//
// Navigation bar:
//

$(document).on("click", "#nav .nav-link", function() {
  const $link = $(this);
  app.selectNavLink($link);
});

//
// Global generic events:
//

$(document).on("click", ".all-select-text", function() {
  $(this).select();
});

$(document).on('click', '[name=btn-collapse-toggle]', function() {
  const $self = $(this);
  const text = $self.text();
  const changeTxt = (text == "[+]") ? "[-]" : "[+]";
  $self.text(changeTxt);
});

//
// Application base global functions
//

app.i18nInit = function(cb) {
  console.log("[BAF] localizing...");
  if (!$) throw Error("[BAF] jQuery instance required");
  const language = navigator.language;
  let locale = getMatchedLocale();
  const script = document.createElement('script');
  script.onload = function() {
    if (!messageResources) return;
    localizeHtmlPage();
    return cb && cb(null);
  };
  script.src = `${app.rootPath}/locales/${locale}.js`;
  document.head.appendChild(script);

  function getMatchedLocale() {
    const matchedIdx = app.i18nAvailables.findIndex(x => x == language);
    if (matchedIdx >= 1) return app.i18nAvailables[matchedIdx];
    console.warn(`[BAF] \`${app.rootPath}/locales/${language}.js\` not found. fallbacking default locale...`);
    return app.i18nAvailables[0];
  }

  /** Localizes index html */
  function localizeHtmlPage() {
    //Localize by replacing __MSG_***__ meta tags
    let objects = document.getElementsByTagName('html');
    let obj, valStrH, valNewH;
    for (let len = objects.length, j = 0; j < len; j++) {
      obj = objects[j];
      valStrH = obj.innerHTML.toString();
      valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1) {
        return v1 ? app.getMessage(v1) : "";
      });
      if (valNewH != valStrH) {
        obj.innerHTML = valNewH;
      }
    }
  }
};

// "Hello %s!" with args:["World"] => "Hello World!"
app.getMessage = function(key, args) {
  let str = messageResources[key] ? messageResources[key] : key;
  if (!Array.isArray(args)) return str;
  return _sprintf(str, args);

  function _sprintf(format, args) {
    let i = 0;
    let v;
    return format.replace(/%s/g, function() {
      v = args[i];
      if (!v) return "";
      i += 1;
      return v;
    });
  }
};

// Get this framework's root path
app.getRootPath = function(cb) {
  const suffix = "/browser-app-framework/browser-app-framework-base.js";
  if (app.rootPath) return cb && cb(null, app.rootPath);
  const scripts = document.querySelectorAll("script");
  for (let len = scripts.length, i = 0; i < len; i++) {
    let el = scripts[i];
    let src = el.src;
    if (src) {
      let tmp = src.substring(src.length - suffix.length);
      if (tmp == suffix) {
        app.rootPath = src.substring(0, src.length - suffix.length)
        return cb && cb(null, app.rootPath);
      }
    }
  }
  const errmsg = `[BAF] must load "${suffix}" on main page`;
  return cb && cb(errmsg);
};


// onAppLoad event
app.onAppLoad = function() {
  app.initialized = true;
  console.log("[BAF] app ready!");
  app.changeRole(app.parseLink(window.location.hash));
};

// emit event
app.emit = function(eventKey, ...args) {
  _emit(app.roles, eventKey, args);

  function _emit(roles, eventKey, args) {
    const keys = Object.keys(roles);
    for (let len = keys.length, i = 0; i < len; i++) {
      let role = roles[keys[i]];
      _emitBySubRole(role, eventKey, args);
    }
  }

  function _emitBySubRole(role, eventKey, args) {
    const keys = Object.keys(role);
    for (let len = keys.length, i = 0; i < len; i++) {
      let subRole = role[keys[i]];
      if (subRole && subRole.$emit)
        subRole.$emit(eventKey, args);
    }
  }
};


// load roles js
app.loadRoles = function(cb) {
  console.log("[BAF] loading roles...");

  // roles auto-load
  app.roles = {};
  $("[id^=role-]").each((idx, el) => {
    let role = el.id.substring("role-".length);
    app.roles[role] = null;
  });

  const roleKeys = Object.keys(app.roles);
  const ite = function*() {
    for (let len = roleKeys.length, i = 0; i < len; i++) {
      let scriptPath = `${app.rootPath}/roles/${roleKeys[i]}.js`;
      let script = document.createElement('script');
      script.src = scriptPath;
      script.onload = function() {
        console.log(`[BAF] "${scriptPath}" loaded`);
        ite.next();
      };
      document.head.appendChild(script);
      yield;
    }
    return cb && cb(null);
  }();
  ite.next();
};

app.selectNavLink = function($selectedLink) {
  const parsedLink = app.parseLink($selectedLink.attr("href"));
  app.changeRole(parsedLink);
};

app.changeRole = function(parsedLink) {
  let role = parsedLink.role;
  let param = parsedLink.param;
  let roleSelector;

  let refreshFn;
  if (app.roles[role]) {
    refreshFn = app.roles[role]["default"].refresh;
    roleSelector = `#role-${role}`;
  } else {
    refreshFn = app.roles["error"]["default"].refresh;
    param = "Not Found";
    roleSelector = `#role-error`;
  }
  if (refreshFn)
    refreshFn(param);
  else
    console.warn(`[BAF] role:"${role}" has no \`refresh\` function in vm's \`methods:{...}\``);

  $("body").fadeOut(100);
  setTimeout(() => {
    const $allRoles = $("[id^=role-]").addClass("d-none");
    $(roleSelector).removeClass("d-none");
    $("body").fadeIn(100);
  }, 100);

  // make nav's menu style "active"
  $("#nav .nav-link").removeClass("active")
  $(`#nav .nav-link[href^='#${role}']`).addClass("active");

  // omnibar's location change
  const hash = (param) ? role + "?" + querystring.stringify(param) : role;
  location.hash = hash;
};

app.parseLink = function(link) {
  if (!link) link = "#home";
  let [role, qstr] = link.split("?");
  role = role.substring(1);
  let param; // querystring object
  if (!querystring)
    throw Error("`querystring` not found. please append `global.querystring = require('querystring');` to `javascripts/index.js` then `npm run browserify` to load this module.")
  if (qstr) param = querystring.parse(qstr);
  return { role, param };
};


/**
 * Page roles loading
 */
if (!app) throw Error("'app-base.js' must be loaded previously");

// building app main page
if (!app.initialized) {
  // get rootPath...
  app.getRootPath((err, rootPath) => {
    if (err) throw err;
    // i18n building...
    app.i18nInit(() => {
      // load roles...
      app.loadRoles(() => {
        // load finished
        app.onAppLoad();
      });
    });
  });
}