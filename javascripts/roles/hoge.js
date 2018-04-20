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

  /* form validator */
  const validator = new FormValidator("#frm-hoge");

  $(document).on("click", "#btn-hoge", function(e) {
    if (!validator.reportValidity()) return false;
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