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