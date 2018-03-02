app.roles["hoge"] = function() {

  const vm = new Vue({
    el: '#role-hoge',
    data: {
      name: null,
      age: null,
    },
    methods: {
      refresh,
    },
  });

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