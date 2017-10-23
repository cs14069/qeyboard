function saveLogoutClick() {
  logout(file_id, version, session_id, login);
}
function dumpLogoutClick() {
  logout('-1', '1.0', '-1', '-1');
}
function logout(_file_id, _version, _session_id, _login) {
  if(sending) {
    alert('ログアウトしています...');
    return ;
  } else {
    sending = true;
  }

  var post_data = {
    user_id : user_id,
    onetime : onetime,
    file_id : _file_id,
    version : _version,
    session_id : _session_id,
    login : _login
  };
  $.ajax({
    type: 'POST',
    url: '/src/php/ajax/logout.php',
    data: post_data,
    success: function(_retval) {
      if(isError(_retval)) { return; }
      var retval = _retval.split(':');
      if(parseInt(retval[0]) == 300) {
        /*トップページへ*/
	    deleteAllCookie();
		window.location.href = '/';
      } else {
        if(debug){addInfo('不明なステータス'+_retval);}
      }
    },
    error: function(_retval) {
      addInfo('通信エラーです');
      addInfo('もう一度お試しください['+_retval+']');
    }
  });
  sending = false;
}
function cancelLogoutClick() {
  window.location.href = '/';
}

$(document).ready(function() {
  getAllCookie();
});
