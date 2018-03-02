/*
 Simple Form Validator
 @dependencies: vue.js, bootstrap4
 @see: https://gist.github.com/akirattii/83937626062fc38f8f1ac5c91f172e72

 # Usage
 
 Code html:
 First, load `FormValidator` after vue loaded:
 ```
  <!-- Vue.js: -->
  <script src="//cdn.jsdelivr.net/npm/vue"></script>
  <!-- FormValidator: -->
  <script src="./form-validator.js"></script>
  <!-- jQuery & Bootstrap4: -->
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css">
  <script src="//code.jquery.com/jquery-3.1.1.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js"></script>
  <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js"></script>
 ...
 ```
 And set input type controls you like (including "input", "select" and "textarea" etc)
  into wrapper element having following class: "form-group", "form-inline" or "form-row".
 
 html example:
 ```
 <form name="myform" action="#" method="POST" class="col-12">
  <div class="form-group row">
    Username (Required field and minlength=6 and maxlength=50):
    <input type="text" 
      v-model="required_field" 
      name="required_field" 
      required 
      minlength="6" 
      maxlength="50" 
      data-errmsg="You must enter something valid!" 
      class="form-control">
  </div>
  ...
  <div class="form-group row">
    <button id="btn-submit" class="btn btn-primary" type="button" name="submit" disabled>Submit</button>
  </div>
 ```
 Code js:
 Create formValidator's instance. At this point simple validations is made available:
 
 ```
 const validator = new FormValidator("[name='myform']");
 ```
 And set `if (!validator.reportValidity()) return false;` just before submitting:
 ```
 $("#btn-submit").on("click", function() {
  if (!validator.reportValidity()) return false;
  submit();
 });
 ```
 
 Below makes the submit button enabled on input the form values:
 
 ```
 $(document).on("input", "[name=myform]", function(){
   $("#btn-submit").prop("disabled", !$(this)[0].checkValidity());
 });
 ```
 
 If you want to use complex validations, code like this:
 ```
  validator.setComplexValidation({
    inputs: ["required_field", "email_field"], // NOTE:  a list of v-model's name which must be same as input's `name` attribute 
    errmsg: "If you set an email already, username must be same as email address.",
    validate: function(e) {
      const requiredFieldVal = vm.required_field;
      const emailFieldVal = vm.email_field;
      return (!emailFieldVal || requiredFieldVal === emailFieldVal);
    },
  });
 ```
 Above is checking whether "required_field" and "email_field" are the same value.
 If not valid, an error message set into `errmsg` will be shown.
*/
class FormValidator {
  constructor(rootSelector = "form") {
    this._checkInstance();
    this._document = document.querySelector(rootSelector);
    this._load();
  }

  //
  // Complex validation:
  // Dependencies: vue.js
  //
  setComplexValidation({ inputs, errmsg, validate, validateAsync }) {
    const self = this;
    for (let len = inputs.length, i = 0; i < len; i++) {
      let el = this._document.querySelector(`[name='${inputs[i]}']`);
      if (!el) {
        console.warn(`[FormValidator] element not found: "[name='${inputs[i]}']"`);
        continue;
      }
      // custom input check:
      el.addEventListener("input", function(e) {
        const target = e.currentTarget;
        // 既に 直前の generic validation で引っかかっている場合は処理を抜ける
        if (target.checkValidity() === false) {
          return;
        }
        // 同期、非同期で処理を切り替え:
        if (validate) {
          if (validate(e) === false) self._checkInput(target, errmsg);
        } else if (validateAsync) {
          validateAsync(e, (bool) => {
            self._checkInput(target, (bool === false) ? errmsg : "");
          });
        } else {
          console.error("[FormValidator] either `validate` or `validateAsync` must be set, if use `setComplexValidation` on:", target);
        }
      });
    }
  }

  reportValidity() {
    this.updateErrorClass();
    return this._document.reportValidity();
  }

  checkValidity() {
    return this._document.checkValidity();
  }

  _checkInstance() {
    if (!document) throw Error("[FormValidator] requires `document` instance. it can be used on webpage only.");
    if (!Vue) throw Error("[FormValidator] requires `Vue` instance. please load 'vue.js' before creating instance.");
  }

  _load() {
    const self = this;
    // built-in generic input check:
    this._getAllInputElements().forEach(function(el) {
      el.addEventListener("input", checkInput);
    });

    function checkInput(e) {
      const errmsgDataAttrPropName = "errmsg"; // "errmsg" is a property name of "data-errmsg" attribute
      const target = e.currentTarget;
      let errmsg = target.dataset[errmsgDataAttrPropName];
      if (!errmsg) console.warn("[FormValidator] set `data-errmsg` attribute as a generic error message of its element:", target);
      target.setCustomValidity(""); // init
      const validity = target.validity;
      const checkValid = target.checkValidity();
      if (checkValid === true) errmsg = "";
      self._checkInput(target, errmsg);
    }
  }

  _checkInput(target, errmsg) {
    target.setCustomValidity(errmsg); // init
    this.updateErrorClass(target);
    const allValid = target.reportValidity();
    return allValid;
  }

  _getAllInputElements() {
    return this._document.querySelectorAll("input, select, textarea");
  }

  updateErrorClass(element) {
    const errClassName = "has-danger";
    const wrapSelector = ".form-group, .form-inline, .form-row";
    const self = this;
    const els = element ? [element] : this._getAllInputElements();
    for (let len = els.length, i = 0; i < len; i++) {
      let el = els[i];
      if (!el.checkValidity()) {
        // add error class
        el.closest(wrapSelector).classList.add(errClassName);
      } else {
        // remove error class
        el.closest(wrapSelector).classList.remove(errClassName);
      }
    }
  }
};

/** for browserify: */
// module.exports = FormValidator;