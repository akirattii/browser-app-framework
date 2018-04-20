app.roles["home"] = function() {

  const vm = new Vue({
    el: '#role-home',
    data: {
      //
      hello: null,
      currentTime: null,
      tickerTimeId: null,
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

  function refresh(param) {
    console.log("refresh:", param);
    vm.hello = app.getMessage("hello", ["World"]);
  }

  $("#btn-home-tick").on("click", function() {
    const $self = $(this);
    if (vm.tickerTimeId) {
      clearInterval(vm.tickerTimeId);
      vm.tickerTimeId = null;
      $self.text("Ticking start!");
    } else {
      vm.tickerTimeId = setInterval(() => {
        // emit!
        app.emit("update-current-time", { currentTime: Date.now() });
      }, 1000);
      $self.text("Ticking stop!");
    }
  });

  return { "default": vm };
}();