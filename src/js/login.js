/*
** login **/
var _un;
var _iu;
var _p;
var _ip;
$(document).ready(function() {
  _un = $('#login_user_name');
  _iu = $('#login_invalid_user_name p');
  _p = $('#login_pass');
  _ip = $('#login_invalid_password p');
  _un.keyup(function() {
    userNameKeyup(_un, _iu);
  });
  _p.keyup(function() {
    checkPassword2();
  });
});

function checkPassword2() {
  if(_p.val().match(unusable2)) {
    _ip.text('パスワードに使えない文字が含まれています');
    return false;
  }else if(_p.val().length < 6 || _p.val().length > 16){
    _ip.text('パスワードは6～16文字である必要があります');    
    return false;
  } else {
    _ip.text('');    
    return true;
  }
}
function login() {
  if(sending) {
    alert('ログイン中...');
    return;
  } else {
    sending = true;
  }
  if(!userNameKeyup(_un, _iu)){ return false; }
  if(!checkPassword2()) { return false; }
  var cookie = getCookie();
  var session_id = '-1';
  if('session_id' in cookie) {
    session_id = cookie['session_id'];
  }
  var login_time = getCurrentTime();
  var user_name = _un.val();
  var hashed_pass = hmac_hash(_p.val());
  var post_data = {
    user_name : user_name,
    hashed_pass : hashed_pass,
    login_time : login_time,
    session_id : session_id
  };

  $.ajax({
    type: 'GET',
    url: '/src/php/ajax/login.php',
    data: post_data,
    success: function(_retval) {
      if(isError(_retval)) { return; }
      var retval = _retval.split(':');
      if(parseInt(retval[0]) == 205) {
        setCookie('user_id', retval[1], week_later_sec);
        setCookie('onetime', retval[2], week_later_sec);
        setCookie('user_name', user_name, week_later_sec);
        setCookie('login', '1', week_later_sec);
        window.location.href = '/';
        return ;
      } else {
        if(debug){addInfo('不明なステータス'+_retval);}
      }
    },
    error: function() {
      addInfo('通信エラーです');
      addInfo('もう一度お試しください');
    }
  });
  sending = false;
}
