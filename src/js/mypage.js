function fileEdit(file_id) {
  setCookie('file_id', file_id, week_later_sec);
  deleteCookie('login');
  deleteCookie('session_id');
  window.open('/', '_parent');
  return false;
}
function getFileList() {
  if(user_id != '-1' && onetime != '-1') {
    var post_data = {
      user_id : user_id,
      onetime : onetime
    };
    $.ajax({
      type: 'GET',
      url: '/src/php/ajax/getFileList.php',
      data: post_data,
      success: function(_retval) {
        if(isError(_retval)) { return; }
        var retval = _retval.split(':');
        if(parseInt(retval[0]) == 200) {
          var file_list = _retval.replace(/200:/,'').split(':');
          var file_list_html = '<table border=\'1\' cellspacing=\'0\'><thead><tr><th>ファイル名</th><th>バージョン番号</th><th>最終編集日時</th></tr></thead><tbody>';
          for(var i = 0, max = file_list.length; i < max; i++) {
            var file = file_list[i].split(',');
            file_list_html += '<tr><td><a href=\'#\' onClick=\'fileEdit("'+file[2]+'");\'>'+file[0]+'</a></td><td>'+file[1]+'</td><td>'+file[3].replace(/--/g, ':')+'</td></tr>';
          }
          file_list_html += '</tbody></table>';
          $('#all_file_div').html(file_list_html);
          addInfo('ファイル一覧を取得しました');
        }else if(parseInt(retval[0] == 208)) {
          $('#all_file_div').html('<p>現在編集可能なファイルはありません</p>');          
          addInfo('ファイル一覧を取得しました');
        } else {
          if(debug){addInfo('不明なステータス'+_retval);}
        }
      },
      error: function(_retval) {
        addInfo('もう一度読み込みなおしてください['+_retval+']');
      }
    });
  } else {
    window.location.href = '/login';
  }
}

/*
** document.ready **/
$(document).ready(function() {
  getAllCookie();
  getFileList();
});
