/*
** register **/
var _un;
var _iu;

function submitUserName() {
  if(!userNameKeyup(_un, _iu)){
    return false;
  }
  user_name = _un.val();
  var post_data = {
    user_name : user_name
  };
  $.ajax({
    type: 'GET',
    url: '/src/php/ajax/checkUserName.php',
    data: post_data,
    success: function(_retval) {
      if(isError(_retval)) { return; }
      var retval = _retval.split(':');
      if(parseInt(retval[0]) == 200) {
        user_id = retval[1];
        showSecondForm();
        return ;
      } else {
        if(debug){addInfo('不明なステータス'+_retval);}
      }
    },
  });
}

var _p;
var _ip;
var _pc;
function showSecondForm() {
  $('#register_user_name_form').css('display', 'none');
  var _rand = getRandom(133000, 699100);/* happybirthday */
   $('#register_pass_form').html("      <label for=\'register_password\'>パスワード（半角英数字のみ 6～16文字）</label>\n      <input type=\'password\' placeholder=\'password"+_rand+"\' id=\'register_password\' pattern=\'^([a-zA-Z0-9]{6,16})$\' required>\n\n     <div id=\'register_invalid_password\'><p class='invalid'></p></div>    \n    \n      <label for=\'register_password_check\'>パスワード（確認用 上と同じパスワードを入力してください）</label>\n      <input type=\'password\' placeholder=\'password"+_rand+"\' id=\'register_password_check\' pattern=\'^([a-zA-Z0-9]{6,16})$\' required>\n     <label for=\'register_email_address\'>メールアドレス（連絡用にこちらからメールを送信することがあります）</label>\n     <input type=\'email\' placeholder=\'user@example.com\' id=\'register_email_address\' pattern=\'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$\' required>\n\n     <label for=\'register_file_name\'>ファイル名（16文字まで）</label>\n     <input type=\'text\' placeholder=\'無題.txt/.docx/.html\' id=\'register_file_name\' maxlength=\'16\' required>\n      <input type=\'submit\' id=\'register_submit_pass\' class=\'soft_button green_button\' value=\'アカウント作成\'>\n");
  _p = $('#register_password');
  _ip = $('#register_invalid_password p');
  _pc = $('#register_password_check');
  _edit = false;
  _p.keyup(function() {
    if(!_edit) { return ; }
    checkPassword();
  });
  _pc.keyup(function() {
    _edit = true;
    checkPassword();
  });
}
function checkPassword() {
  if(_p.val().match(unusable2)) {
    _ip.text('パスワードに使えない文字が含まれています');
    return false;
  }else if(_p.val().length < 6 || _p.val().length > 16){
    _ip.text('パスワードは6～16文字である必要があります');
    return false;
  }else if( _p.val() != _pc.val() ) {
    _ip.text('パスワードが異なります。同じ文字を入力してください');
    return false;
  }else if(_p.val().length == _pc.val().length) {
    _ip.text('');    
    return true;
  }
}
function register() {
  if(!checkPassword()) { return false; }
  var cookie = getCookie();
  var session_id = '-1';
  if('session_id' in cookie) {
    session_id = cookie['session_id'];
  }
  var login_time = getCurrentTime();
  var uidp = hmac_hash(user_id+':qey.jp:'+hmac_hash(_p.val()));
  var file_name = $('#register_file_name').val();
  var post_data = {
    user_id : user_id,
    user_name : user_name,
    uidp : uidp,
    login_time : login_time,
    session_id : session_id,
    file_name : file_name
  };

  $.ajax({
    type: 'POST',
    url: '/src/php/ajax/register.php',
    data: post_data,
    success: function(_retval) {
      var retval = _retval.split(':');
      if(parseInt(retval[0]) == 402) {
        alert('セッションが切れているため、登録前の文書を保存できませんでした');
        window.location.href = '/';
        return ;
      }
      if(isError(_retval)) { return; }
      if(parseInt(retval[0]) == 201) {
        deleteCookie('session_id');
        /*返ってきた値をクッキーに保存*/
        setCookie('file_id', retval[1], week_later_sec);
        setCookie('onetime', retval[2], week_later_sec);
        setCookie('user_id', user_id, week_later_sec);
        setCookie('version', '1.0', week_later_sec);
        window.location.href = '/';
        return ;
      } else {
        if(debug){addInfo('不明なステータス'+_retval);}
      }
    },
  });
}

function getCurrentTime() {
  var current = new Date();
  var y = current.getFullYear();
  var m = current.getMonth() + 1;
  var d = current.getDate();
  var h = current.getHours();
  var mi = current.getMinutes();
  var s = current.getSeconds();
  return y+'-'+m+'-'+d+' '+h+':'+mi+':'+s;
}

$(document).ready(function() {
  _un = $('#register_user_name');
  _iu = $('#register_invalid_user_name');
  _un.keyup(function() {
    userNameKeyup(_un, _iu);
  });
});
