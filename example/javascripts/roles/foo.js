app.roles["foo"] = function() {

  const vm = new Vue({
    el: '#role-foo',
    data: {
      //
      currentTime: null
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

  $(document).on("click", "#btn-foo", function(e) {
    const param = {
      name: "Hanako",
      age: 20,
    };
    alert(`Going hoge with param: ${JSON.stringify(param)}...`);
    // change role to "hoge" with a param:
    app.changeRole({ role: "hoge", param });
  });

  function refresh(param) {
    console.log("refresh:", param);
  }


  return { "default": vm };
}();