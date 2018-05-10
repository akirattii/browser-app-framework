app.roles["settings"] = function() {

  const vm = new Vue({
    el: '#role-settings',
    data: {
      //
    },
    methods: {
      refresh,
    },
  });

  function refresh(param) {
    console.log("refresh:", param);
  }

  return { "default": vm };
}();