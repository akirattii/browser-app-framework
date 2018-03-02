app.roles["home"] = function() {

  const vm = new Vue({
    el: '#role-home',
    data: {
      //
      hello: null,
    },
    methods: {
      refresh,
    },
  });


  function refresh(param) {
    console.log("refresh:", param);
    vm.hello = app.getMessage("hello", ["World"]);
  }

  return { "default": vm };
}();