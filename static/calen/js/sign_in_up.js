
function post_sign_in_info(){
  $.ajax({
      url : "calen/sign_in",
      data: $('#sign_in_form').serialize(),
      type:'POST',
  })
  .then(
      function (data) {
        check_user_login_statement()
      },
      function () {
        alert("読み込み失敗");
  });
};

function post_sign_up_info(){
  $.ajax({
      url : "calen/sign_up",
      data: $('#sign_up_form').serialize(),
      type:'POST',
  })
  .then(
      function (data) {
        alert(data["message"]);

      },
      function () {
        alert("読み込み失敗");
  });
};
