app.roles["error"] = function() {

  const vm = new Vue({
    el: '#role-error',
    data: {
      error: null,
    },
    methods: {
      refresh,
    },
  });

  function refresh(param) {
    console.log("refresh:", param);
    vm.error = param;
  }

  return { "default": vm };
}();