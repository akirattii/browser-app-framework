/**
 * Browser App Framework base library
 *
 * # Usage:
 * Load this script on just before `</html>` of main html file like this:
 * ```
 *  ...
 *  <!--### Browser App Framework dependencies (they must be loaded in below order): ###-->
 *  <link rel="stylesheet" href="css/extlib/bootstrap.min.css">
 *  <link rel="stylesheet" href="css/extlib/fontawesome/web-fonts-with-css/css/fontawesome-all.min.css">
 *  <link rel="stylesheet" href="css/self.css">
 *  <script src="javascripts/extlib/jquery-3.3.1.min.js"></script>
 *  <script src="javascripts/extlib/popper.min.js"></script>
 *  <script src="javascripts/extlib/bootstrap.min.js"></script>
 *  <script src="javascripts/extlib/vue.min.js"></script>
 * </head>
 * ...
 * <div id="role-hoge">...</div>
 * <div id="role-foo">...</div>
 * ...
 * <script type="text/javascript" src="path/to/browser-app-framework.js"></script>
 * <script type="text/javascript">
 * const app = new BrowserAppFramework({
 *   rootPath: "./javascripts",
 *   i18nAvailables: ["en", "ja"],
 *   loglevel: 1,
 * }); 
 * </script>
 * </html>
 * ```
 */

class BrowserAppFramework {

  constructor(p) {
    this.init(p);
  }

  init({
    rootPath = "./javascripts", // the path where `roles/` and `locales/` existed in.
    i18nAvailables = ["en"], // available i18n locales
    loglevel = 0, //
  }) {
    const self = this;

    if (self.appReady === true) {
      if (self.loglevel >= 1) console.warn("[BAF] app's already been ready! exit to init!");
      return;
    }

    // check required modules:
    // vue.js
    if (!Vue) throw Error("[BAF] requires 'vue.js'");
    // jqeury
    if (!$) throw Error("[BAF] requires 'jquery'");
    // bootstrap
    if (!$().modal) throw Error("[BAF] requires 'bootstrap'");

    this.rootPath = rootPath;
    this.i18nAvailables = i18nAvailables;
    this.loglevel = loglevel;
    this.lastAction = Date.now();
    this.roles = {}; // init roles

    // add UI events...
    self.addUIEvents();
    // i18n building...
    self.i18nInit(() => {
      // load roles...
      self.loadRoles(() => {
        // load finished
        self.onAppLoad();
      });
    });
  }

  addUIEvents() {
    const self = this;
    if (self.loglevel >= 1) console.log("[BAF] adding UI events...");
    // add jquery event handlers:

    // Navigation bar:
    $(document).on("click", "#nav .nav-link", function() {
      const $link = $(this);
      self.selectNavLink($link);
    });
    $(document).on("click", ".all-select-text", function() {
      $(this).select();
    });

    // add hashchange event listener:
    window.addEventListener("hashchange", function(event) {
      if (self.loglevel >= 1) console.log("hashchange", event);
      // 同じ画面はスルー
      if (event.newURL === event.oldURL) return;
      // location初期表示時(hash無しomnibarキック時)にrefresh()の二重呼出を防止
      const [oldURL, oldHash] = event.oldURL.split("#");
      if (!oldHash) return;
      // 連続クリック時のrefresh()の二重呼出を防止
      if (Date.now() - self.lastAction < 300) return;
      const parsedLinkHash = (window.location.hash == "") ? { role: "home" } : self.parseLinkHash(window.location.hash);
      self.changeRole(parsedLinkHash);
    }, false);
  }

  i18nInit(cb) {
    const self = this;
    if (self.loglevel >= 1) console.log("[BAF] localizing...");
    if (!$) throw Error("[BAF] jQuery instance required");
    const language = navigator.language;
    let locale = getMatchedLocale();
    const script = document.createElement('script');
    script.onload = function() {
      if (!messageResources) return;
      localizeHtmlPage();
      return cb && cb(null);
    };
    script.src = `${self.rootPath}/locales/${locale}.js`;
    document.head.appendChild(script);

    function getMatchedLocale() {
      const matchedIdx = self.i18nAvailables.findIndex(x => x == language);
      if (matchedIdx >= 1) return self.i18nAvailables[matchedIdx];
      console.warn(`[BAF] \`${self.rootPath}/locales/${language}.js\` not found. fallbacking default locale...`);
      return self.i18nAvailables[0];
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
          return v1 ? self.getMessage(v1) : "";
        });
        if (valNewH != valStrH) {
          obj.innerHTML = valNewH;
        }
      }
    }
  }

  // "Hello %s!" with args:["World"] => "Hello World!"
  getMessage(key, args) {
    if (!messageResources) throw Error("[BAF] `messageResources` not found. please call `i18nInit()` at first")
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
  }

  // onAppLoad event
  onAppLoad() {
    const self = this;
    self.appReady = true;
    if (self.loglevel >= 1) console.log("[BAF] app ready!");
    self.changeRole(self.parseLinkHash(window.location.hash));
  }

  // emit event
  emit(eventKey, ...args) {
    const self = this;
    if (self.loglevel >= 2) console.log(`[BAF] emit '${eventKey}' event with args:`, args);
    _emit(self.roles, eventKey, args);

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
  }

  // load all roles automatically
  loadRoles(cb) {
    const self = this;
    if (self.loglevel >= 1) console.log("[BAF] loading roles...");

    // roles auto-load
    $("[id^=role-]").each((idx, el) => {
      const role = el.id.substring("role-".length);
      self.roles[role] = null;
    });

    const roleKeys = Object.keys(self.roles);
    const ite = function*() {
      for (let len = roleKeys.length, i = 0; i < len; i++) {
        const scriptPath = `${self.rootPath}/roles/${roleKeys[i]}.js`;
        const script = document.createElement('script');
        script.src = scriptPath;
        script.onload = function() {
          if (self.loglevel >= 1) console.log(`[BAF] "${scriptPath}" loaded`);
          ite.next();
        };
        document.head.appendChild(script);
        yield;
      }
      return cb && cb(null);
    }();
    ite.next();
  }

  selectNavLink($selectedLink) {
    const self = this;
    const parsedLinkHash = self.parseLinkHash($selectedLink.attr("href"));
    self.changeRole(parsedLinkHash);
  }

  changeRole(parsedLinkHash) {
    const self = this;
    let role = parsedLinkHash.role;
    let param = parsedLinkHash.param;
    let roleSelector;

    let refreshFn;
    if (self.roles[role]) {
      refreshFn = self.roles[role]["default"].refresh;
      roleSelector = `#role-${role}`;
    } else {
      refreshFn = self.roles["error"]["default"].refresh;
      param = "Not Found";
      roleSelector = `#role-error`;
    }
    if (refreshFn)
      refreshFn(param);
    else
    if (self.loglevel >= 1) console.warn(`[app-framework-base] role:"${role}" has no \`refresh\` function in vm's \`methods:{...}\``);

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
    const hash = (param && typeof param === "object" && Object.keys(param).length >= 1) ?
      role + "?" + self.stringifyQS(param) : role;
    window.location.hash = hash;

    // 連続クリック時のrefresh()の二重呼出を防止用
    self.lastAction = Date.now();
  }

  parseLinkHash(link) {
    const self = this;
    if (!link) link = "#home";
    let [role, qstr] = link.split("?");
    role = role.substring(1);
    let param; // querystring object
    if (qstr) param = self.parseQS(qstr);
    return { role, param };
  }

  ajax({ url, method = "GET", data = {} }, cb) {
    if (self.loglevel >= 1) console.log(`ajaxing ${method} ${url} ${JSON.stringify(data)}`);
    $.ajax({
      method,
      data,
      url,
      json: true,
    }).done(function(msg) {
      if (self.loglevel >= 1) console.log("ajax done:", msg);
      return cb && cb(null, msg);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      if (self.loglevel >= 1) console.error("ajax fail:", jqXHR);
      return cb && cb(jqXHR, textStatus, errorThrown);
    });
  };

  // parse querystring
  parseQS(s) {
    if (!s) return null;
    if (typeof s !== "string") throw Error("must be a string");
    s = s.trim();
    if (s.substring(0, 1) === "?") s = s.substring(1);
    const ret = {};
    const arr = s.split("&");
    for (let len = arr.length, i = 0; i < len; i++) {
      let [k, v] = arr[i].split("=");
      ret[decodeURIComponent(k)] = decodeURIComponent(v);
    }
    return ret;
  }

  // create querystring
  stringifyQS(o) {
    if (!o) return "";
    const arr = [];
    if (typeof o !== "object") throw Error("must be an object");
    const keys = Object.keys(o);
    for (let len = keys.length, i = 0; i < len; i++) {
      let k = keys[i];
      let v = o[k];
      if (v === undefined || v === null) v = "";
      arr.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
    return arr.join("&");
  }

};