var _mt;
/*
** buttonClick **/
function logoutClick() {
  saveViaAjax('-1', true, '/saveSession.php', '/logout');
}
function loginClick() {
  saveViaAjax('-1', true, '/receive.php', '/login');
}
function registerClick() {
  saveViaAjax('-1', true, '/receive.php', '/register');
}
function saveClick() {
  saveViaAjax('-1', true, '/receive.php', '/register');
}
function renameFile() {
  saveViaAjax('-1', false, '/receive.php', '/');
}
function resetClick(version) {
  saveViaAjax(version, false, '/receive.php', '/');
}
function allFileClick() {
  // saveViaAjax('-1', true, '/saveSession.php', '/mypage');
  var _ti = -1;
  for(var i = 0, max = tabList.length; i < max; i++) {
    if(tabList[i].file_id === 'allfile') {
      _ti = i;
    }
  }
  if(_ti > 0) {
    tabList[current_tab_id].file_name = file_name;
    tabList[current_tab_id].file_id = file_id;
    tabList[current_tab_id].version = version;
    current_tab_id = _ti;
    file_name = tabList[current_tab_id].file_name;
    file_id = tabList[current_tab_id].file_id;
    version = tabList[current_tab_id].version;
    $('#tabid_'+current_tab_id).prop('checked', true);
    $('[data-tabid]').css('display', 'none');
    $('#button_div').css('display', 'none');
    $('[data-tabid="'+current_tab_id+'"]').css('display', 'block');
    return ;
  }
  getNewContent('/getFileList.php').done(function(_retval){
    if(_retval === null) {
      return ;
    }
    newTabPage(createAllFileHtml(_retval));
  });
}
function displayModeClick() {
  var _lc = $('#left_container');
  var _rc = $('#right_container');
  if(_lc.hasClass('left')) {
    _lc.removeClass('left');
    _rc.removeClass('right');
    $('.half').css({'width': '110%'});
    $('footer p').css({'padding-top': $('html').height()});
    $('#button_div span').addClass('inline');
  } else {
    _lc.addClass('left');
    _rc.addClass('right');
    $('.half').css({'width': '50%'});
    $('footer p').css({'padding-top': parseInt($('footer p').css('padding-top'))-$('html').height()});
    $('#button_div span').removeClass('inline');
  }
}
function mypageClick() {
  alert('mypage');
}
function createAllFileHtml(_retval) {
  var retval = _retval.split(':');
  if(retval[0] == 208) {
    addMessage('現在保存されているファイルはありません');
    return;
  } else if(retval[0] != 200) {
    addMessage('不明なステータス['+_retval+']');
    return ;
  }
  var allfileid = 'allfile';
  tabList[current_tab_id].file_name = file_name;
  tabList[current_tab_id].file_id = file_id;
  tabList[current_tab_id].version = version;
  current_tab_id = ++tabindex;
  tabList[current_tab_id] = new Tab();
  file_id = allfileid;
  file_name = '-1';
  version = '-1';
  var file_list = _retval.replace(/200:/,'').split(':');
  var file_list_html = '<table border=\'1\' cellspacing=\'0\'><thead><tr><th>ファイル名</th><th>バージョン番号</th><th>最終編集日時</th><th>ダウンロード</th></tr></thead><tbody>';
  for(var i = 0, max = file_list.length; i < max; i++) {
    var file = file_list[i].split(',');
    file_list_html += '<tr><td><a href=\'#\' onClick=\'fileEdit("'+file[2]+'");\'>'+file[0]+'</a></td><td>'+file[1]+'</td><td>'+file[3].replace(/--/g, ':')+'</td><td>';
    file_list_html += '              <div id=\'download_drop_div'+i+'\' class=\'left drop_div\'>\n                <a rel=\'tooltip\' title=\'ファイルの形式を指定してダウンロード\' class=\'left download_tt\'><button class=\'fa fa-download\'><span>ダウンロード</span></button></a>\n                 <ul id=\'download_ul\' class=\'dropdown\'>\n                  <a rel=\'tooltip\' title=\'.txt形式でダウンロード\' id=\'op_download_txt\'><li value=\'txt\' class=\'fa fa-file-text-o\'>.txt形式</li></a>\n                   <a rel=\'tooltip\' title=\'.html形式でダウンロード\' id=\'op_download_txt\'><li value=\'html\' class=\'fa fa-html5\'>.html形式</li></a>\n                  <a rel=\'tooltip\' title=\'.docx形式でダウンロード\' id=\'op_download_txt\'><li value=\'docx\' class=\'fa fa-file-word-o\'>.docx形式</li></a>\n                  <a rel=\'tooltip\' title=\'.txt形式をzip圧縮してダウンロード\' id=\'op_download_txt\'><li value=\'txt_zip\' class=\'fa fa-file-text-o\'>.txt形式（<span class=\'fa-file-zip-o\'>zip圧縮</span>）</li></a>\n                  <a rel=\'tooltip\' title=\'.html形式をzip圧縮してダウンロード\' id=\'op_download_txt\'><li value=\'html_zip\' class=\'fa fa-html5\'>.html形式（<span class=\'fa-file-zip-o\'>zip圧縮</span>）</li></a>\n                   <a rel=\'tooltip\' title=\'.docx形式をzip圧縮してダウンロード\' id=\'op_download_txt\'><li value=\'docx_zip\' class=\'fa fa-file-word-o\'>.docx形式（<span class=\'fa-file-zip-o\'>zip圧縮</span>）</li></a>\n                 </ul>\n             </div>\n';
    file_list_html += '</td></tr>';
  }
  file_list_html += '</tbody></table>';
  var afd = '<div id=\'all_file_div\' data-tabid=\''+current_tab_id+'\'>'+file_list_html+'</div>';
  var fd = '<div id=\'file_detail\' data-tabid=\''+current_tab_id+'\'></div>';
  return {left: afd, right: fd, title: 'ファイル一覧', id: allfileid, file_count: file_list.length};
}
function createResetFileHtml(_content, _file_id, _version) {
  tabList[current_tab_id].file_name = file_name;
  tabList[current_tab_id].file_id = file_id;
  tabList[current_tab_id].version = version;
  current_tab_id = ++tabindex;
  tabList[current_tab_id] = new Tab();
  file_id = _file_id;
  version = _version;
  var left = '<textarea id=\'main_textarea\' data-tabid=\''+current_tab_id+'\'>'+_content+'</textarea>';
  var right = '       <div id=\'outer_message_div\' data-tabid=\''+current_tab_id+'\'>\n          <div id=\'message_div\'></div>\n        </div>\n            <div id=\'outer_diff_div\' data-tabid=\''+current_tab_id+'\'>\n              <div id=\'diff_div\'></div>\n             </div>\n';
  return {left: left, right: right, title: file_name, id: file_id, message: 'ファイルを復元しました'}  
}
function newTabPage(_html) {
  var left = _html.left;
  var right = _html.right;
  var title = _html.title;
  var id = _html.id;
  var tabitem = '<input type=\'radio\' name=\'tabid\' id=\'tabid_'+current_tab_id+'\' checked><div><label for=\'tabid_'+current_tab_id+'\' id=\'tabid_label_'+current_tab_id+'\'>'+title+'</label></div>';
  $('#main_left_div').append(left);
  $('#main_right_div').append(right);
  var _tf = $('#tab_form');
  _tf.append(tabitem);
  _tf.scrollLeft(_tf.width());
  $('[data-tabid]').css('display', 'none');
  $('[data-tabid="'+current_tab_id+'"]').css('display', 'block');
  $('input[id="tabid_'+current_tab_id+'"]').on('change', function() {
    tabList[current_tab_id].file_name = file_name;
    tabList[current_tab_id].file_id = file_id;
    tabList[current_tab_id].version = version;
    current_tab_id = $(this).attr('id').replace('tabid_', '');
    $('[data-tabid]').css('display', 'none');
    $('[data-tabid="'+current_tab_id+'"]').css('display', 'block');
    file_name = tabList[current_tab_id].file_name;
    file_id = tabList[current_tab_id].file_id;
    version = tabList[current_tab_id].version;
  }); 
  if(id === 'allfile') {
    $('#button_div').css('display', 'none');
    $('input[id="tabid_'+current_tab_id+'"]').on('change', function() {
      $('#button_div').css('display', 'none');
    });
    for(var i = 0, max = _html.file_count; i < max; i++) {
      setDropdown('#download_drop_div'+i, false);
    }
  } else {
    addMessage(_html.message);
    $('input[id="tabid_'+current_tab_id+'"]').on('change', function() {
      $('#button_div').css('display', 'block');
    });
  }
}
/*
** save **/
function saveViaAjax(_reset, _save, _endpoint, _path) {
  if(sending) {
    alert('保存しています...');
    return ;
  } else {
    sending = true;
  }
  var content = '';  
  var reset = _reset;
  var save = _save;
  if(reset === '-1') {
    content = _mt.val();
  }
  

  var post_data = {
    user_id : user_id,
    onetime : onetime,
    file_name : file_name,
    file_id : file_id,
    version : version,
    reset : reset,
    save : Number(save),
    login : login,
    content : content
  };
  $.ajax({
    type: 'POST',
    url: '/src/php/ajax'+_endpoint,
    data: post_data,
    success: function(_retval) {
      if(isError(_retval)) { return; }
      if(session_id != '-1') {
      	deleteSessionFile();
      }
      var retval = _retval.split(':');
      if(parseInt(retval[0]) == 203) {
        addMessage('ファイルの保存に成功しました');
        /*保存成功*/
        setCookie('onetime', retval[1], week_later_sec);
        setCookie('version', retval[2], week_later_sec);
        onetime = retval[1];
        version = retval[2];
        /*diffをmessageに表示*/
        addDiff(_retval.replace(/^203:[a-zA-Z0-9]{64}:[0-9\.]{2,}:/, ''));
      }else if(parseInt(retval[0]) == 206) {
        if(login != '-1') {
          deleteCookie('login');
          login = '-1';
        }
        /*新しいファイル作成*/
        setCookie('onetime', retval[1], week_later_sec);
        setCookie('file_id', retval[2], week_later_sec);
        setCookie('version', retval[3], week_later_sec);
        _file_name = _retval.replace(/^206:[a-zA-Z0-9]{64}:[a-zA-Z0-9]{64}:[0-9\.]{2,}:/, '').split(':');
        file_name = _file_name[0];
        setCookie('file_name', file_name, week_later_sec);
        onetime = retval[1];
        file_id= retval[2];
        version = retval[3];
        addDiff(_retval.replace(/^206:[a-zA-Z0-9]{64}:[a-zA-Z0-9]{64}:[0-9\.]{2,}:.*:/, ''));
        addMessage('新しいファイル['+file_name+']を作成しました');
      }else if(parseInt(retval[0]) == 207) {
        addMessage('変更はありません')
        setCookie('onetime', retval[1], week_later_sec);
        onetime = retval[1];
      }else if(parseInt(retval[0]) == 209) {
        setCookie('onetime', retval[1], week_later_sec);
        setCookie('file_id', retval[2], week_later_sec);
        setCookie('version', retval[3], week_later_sec);
        onetime = retval[1];
        newTabPage(createResetFileHtml(_retval.replace(/^209:[a-zA-Z0-9]{64}:[a-zA-Z0-9]{64}:[0-9\.]{2,}:/, ''), retval[2], retval[3]));
      }else if(parseInt(retval[0]) == 301) {
        /*新規登録ページまたはログインページへ*/
        setCookie('session_id', retval[1], week_later_sec);        
        window.location.href = _path;
      }else if(parseInt(retval[0]) == 303) {
        /*セッションに保存成功 ログアウトページ/マイページへ*/
        setCookie('session_id', retval[1], week_later_sec);
        setCookie('onetime', retval[2], week_later_sec);
        window.location.href = _path;
      } else {
        if(debug){addMessage('不明なステータス'+_retval);}
      }
    },
    error: function(_retval) {
      addMessage('通信エラーです');
      addMessage('もう一度お試しください['+_retval+']');
    }
  });
  sending = false;
}
function getUserInfo() {
  if(user_id == '-1' || onetime == '-1') {
    nowLogout();
    $('#main_textarea').text('ここに文章を入力してください');
  }else if(session_id == '-1' && file_id == '-1') {
    window.location.href = '/mypage';
  }else{
    var post_data = {
      user_id : user_id,
      onetime : onetime,
      file_id : file_id,
      session_id : session_id
    };
    $.ajax({
      type: 'GET',
      url: '/src/php/ajax/getUserInfo.php',
      data: post_data,
      success: function(_retval) {
        if(isError(_retval)) { return; }
        var retval = _retval.split(':');
        if(parseInt(retval[0]) == 200) {
          onetime = retval[1];
          file_id = retval[2];
          file_name = retval[3];
          version = retval[4];
          setCookie('onetime', onetime, week_later_sec);
          setCookie('file_id', file_id, week_later_sec);
          setCookie('file_name', file_name, week_later_sec);
          setCookie('version', version, week_later_sec);
          $('#tabid_label_1').text(file_name);
          getFile();
        } else {
          if(debug){addMessage('不明なステータス'+_retval);}
        }
      },
      error: function(_retval) {
        nowLogout();
        addMessage('通信エラーです');
        addMessage('もう一度読み込みなおしてください['+_retval+']');
      }
    });    
  }
}

function getFile() {
  if(session_id != '-1') {
    var post_data = {
      session_id : session_id,
      user_id : user_id,
      onetime : onetime,
      file_id : file_id,
      login : login
    };
    $.ajax({
      type: 'GET',
      url: '/src/php/ajax/getSessionFile.php',
      data: post_data,
      success: function(_retval) {
        if(isError(_retval)) { return; }
        var retval = _retval.split(':');
        if(parseInt(retval[0]) == 200) {
           	if(user_id == '-1' && file_id == '-1' && onetime == '-1') {
              nowLogout();
          		$('#main_textarea').text(_retval.replace(/^200:/, ''));
              addMessage('セッションから復元しました　ファイルはまだ保存されていません');
            }else if(login == '1') {
              nowLogin();
              $('#main_textarea').text(_retval.replace(/^200:/, ''));
              addMessage('セッションから復元しました');
              addMessage('ファイルはまだ保存されていません');
          	} else {
              nowLogin();
          		$('#main_textarea').text(_retval.replace(/^200:[a-zA-Z0-9]{64}:/, ''));
          		setCookie('onetime', retval[1], week_later_sec);
          		onetime = retval[1];
          		addMessage('セッションから復元しました');
              addMessage('ファイルはまだ保存されていません');
          	}
            getAllDiff();            
        } else {
          if(debug){addMessage('不明なステータス'+_retval);}
        }
      },
      error: function(_retval) {
        nowLogout();
        addMessage('通信エラーです');
        addMessage('もう一度読み込みなおしてください['+_retval+']');
      }
    });    
  } else {
    var post_data = {
      user_id : user_id,
      onetime : onetime,
      file_id : file_id,
    };
    $.ajax({
      type: 'GET',
      url: '/src/php/ajax/getFile.php',
      data: post_data,
      success: function(_retval) {
        nowLogin();
        if(isError(_retval)) { return; }
        var retval = _retval.split(':');
        if(parseInt(retval[0]) == 200) {
          addMessage('前回保存時のファイル['+file_name+']を読み込みました');
          $('#main_textarea').text(_retval.replace(/^200:/, ''));
          getAllDiff();            
        } else {
          if(debug){addMessage('不明なステータス'+_retval);}
        }
      },
      error: function(_retval) {
        nowLogin();
        addMessage('通信エラーです');
        addMessage('もう一度読み込みなおしてください['+_retval+']');
      }
    });
  }
}

function getAllDiff() {
  if(user_id != '-1' && file_id != '-1' && onetime != '-1') {
    var post_data = {
      user_id : user_id,
      onetime : onetime,
      file_id : file_id
    };
    $.ajax({
      type: 'GET',
      url: '/src/php/ajax/getDiffList.php',
      data: post_data,
      success: function(_retval) {
        if(isError(_retval)) { return; }
        var retval = _retval.split(':');
        if(parseInt(retval[0]) == 207) {
          setCookie('onetime', retval[1], week_later_sec);
          onetime = retval[1];
          var boundary = retval[2];
          var diff = _retval.replace(/^207:[a-zA-Z0-9]{64}:[a-zA-Z0-9]{64}:/, '').split(':'+boundary+':');
          for(var i = (diff.length - 2); i >= 0; i--) {
            addDiff(diff[i]);
          }
          addMessage('変更履歴を取得しました');
        }else if(parseInt(retval[0]) == 210) {
          addMessage('新しいファイルです');
        } else {
          if(debug){addMessage('不明なステータス'+_retval);}
        }
      },
      error: function(_retval) {
        addMessage('もう一度読み込みなおしてください['+_retval+']');
      }
    });
  }
}
function getNewContent(_endpoint) {
  var post_data = {
    user_id : user_id,
    onetime : onetime
  };
  return $.ajax({
    type: 'GET',
    url: '/src/php/ajax'+_endpoint,
    data: post_data,
    success: function(_retval) {
      if(isError(_retval)) { return; }
      var retval = _retval.split(':');
      if(parseInt(retval[0])%200 < 100) {
      } else {
        if(debug){addMessage('不明なステータス'+_retval);}
      }
    },
    error: function(_retval) {
      addMessage('もう一度お試しください['+_retval+']');
    }
  });
}
function deleteSessionFile() {
  var post_data = {
    session_id : session_id,
	  user_id : user_id,
	  onetime : onetime,
    version: version,
	  file_id : file_id
  };
  deleteCookie('session_id');
  session_id = '-1';
  $.ajax({
	type: 'GET',
    url: '/src/php/ajax/deleteSessionFile.php',
    data: post_data,
    success: function(_retval) {
   	}
  });    
}

/*
** html **/
var _diff_block_count = 0;
function addDiff(_diff) {
  var diff = _diff.split(/\r|\n|\r\n/);
  var diff_length = diff.length;
  var old_version_id = diff[0].replace('--- ', '');
  var new_version_id = diff[1].replace('+++ ', '');
  var x = 2;
  var max = -1;
  var label = '';
  var old_content = '';
  var new_content = '';
  var start_x = '-1';
  var no_new_line_old = false;
  var no_new_line_new = false;
  var diff_block_count = ++_diff_block_count;

  var all_diff = '<div class=\'diff_block\'>'
  +'<div class=\'float diff_block_bar\'>'
  +'<input type=\'text\' placeholder=\'編集理由を入力してください\' class=\'left\'><button onclick=\'submitMemo("'+new_version_id+'")\' class=\'soft_button mate_button fa fa-pencil diff_block_memo_save left\'>保存</button>'
  +'<div id=\'diff_block_menu'+diff_block_count+'\' class=\'drop_div right\'><a rel=\'tooltip\' title=\'変更履歴に関するメニュー\' class=\'left\'><button class=\'soft_button mate_button diff_block_menu_button fa\' >メニュー<span class=\'fa fa-caret-down\'></span></button></a>'
  +'<ul class=\'dropdown\'><a rel=\'tooltip\' title=\'この編集直後に戻る\' ><li value=\''+new_version_id+'\' class=\'fa fa-rotate-left\' id=\'reset_button'+diff_block_count+'\' data-resetid=\''+new_version_id+'\'>変更直後['+new_version_id+']に戻る</li></a>'
  +'</ul></div></div>';
  label = /^@@ -([\d\.]+),?([\d\.])* \+([\d\.]+),?([\d\.])*/.exec(diff[x]);
  while(label) {
    start_x = x;
    old_content = '';
    new_content = '';
    old_row = label[1];
    old_count = (label[2] != null)? label[2]:1;
    new_row = label[3];
    new_count = (label[4] != null)? label[4]:1;

    for(x++, left = true;x < diff_length && diff[x].indexOf('@@ ') != 0;) {
      if(diff[x].indexOf('-') == 0) {
        old_content += '<p><span class=\'line_number\'>'+(old_row++)+'</span><span class=\'diff_change_row\'>_'+diff[x].replace(/^-/,'').replace()+'</span></p>';
      }else if(diff[x].indexOf('+') == 0) {
        new_content += '<p><img src=\'/skin/img/arrow_r.svg\'><span class=\'line_number\'>'+(new_row++)+'</span><span class=\'diff_change_row\'>_'+diff[x].replace(/^\+/,'')+'</span></p>';
      }else if(diff[x].indexOf('\\ No newline at end of file') == 0) {
        if(diff[x-1].indexOf('-') == 0) {
          no_new_line_old = true;
        } else {
          no_new_line_new = true;        
        }
      } else {
        old_content += '<p><span class=\'line_number\'>'+(old_row++)+'</span><span class=\'diff_no_change_row\'>_'+diff[x].replace(/^ /,'')+'</span></p>';
        new_content += '<p><span class=\'line_number\'>'+(new_row++)+'</span><span class=\'diff_no_change_row\'>_'+diff[x].replace(/^ /,'')+'</span></p>';
      }
      x++;
    }
    if(!(label = /^@@ -([\d\.]+).* \+([\d\.]+)/.exec(diff[x]))) {
        if(!no_new_line_old && old_row <= old_count) {
          old_content += '<p><span class=\'line_number\'>'+(old_row++)+'</span><span class=\'diff_no_change_row\'>_</span></p>';
        }
        if(!no_new_line_new && new_row <= new_count) {
          new_content += '<p><span class=\'line_number\'>'+(new_row++)+'</span><span class=\'diff_no_change_row\'>_</span></p>';
        }
    }
    all_diff += '<div class=\'float diff_block_content\'><div class=\'left\'>'+old_content
    +'</div><div class=\'right\'>'+new_content
    +'</div></div>';
  }
  all_diff += '</div>'+$('#diff_div').html();
  $('#outer_diff_div[data-tabid="'+current_tab_id+'"] #diff_div').html(all_diff);
  for(var i = 1; i <= diff_block_count; i++) {
    setDropdown('#diff_block_menu'+i, false);
    $('#reset_button'+i).on('click', function() {
      resetClick($(this).data('resetid'));
    });
  }
}

function nowLogin() {
  $('#button_div').css('display', 'block');
  $('#login_tt').css('display', 'none');
  $('#register_tt').css('display', 'none');
  $('#login_tt').css('visibility', 'false');
  $('#register_tt').css('visibility', 'false');
  $('#loading_div').css('display', 'none');
}
function nowLogout() {
  $('#button_div').css('display', 'block');
  $('#logout_tt').css('display', 'none');
  $('#download_drop_div').css('display', 'none');
  $('#history_tt').css('display', 'none');
  $('#mypage_tt').css('display', 'none');
  $('#logout_tt').css('visibility', 'false');
  $('#download_drop_div').css('visibility', 'false');
  $('#history_tt').css('visibility', 'false');
  $('#mypage_tt').css('visibility', 'false');
  $('#loading_div').css('display', 'none');
}

/*
** document.ready **/
$(document).ready(function() {
  $('html').css('height', window.innerHeight);

  getAllCookie();
  getUserInfo();

  setDropdown('#download_drop_div', false);
  setDropdown('#menu_drop_div', false);
  var _od;
  var _odt;
  var _odh;
  var _odd;
  var _odtz;
  var _odhz;
  var _oddz;
  var _opal;
  var _opdm;

  _od = $('#op_download');
  _odt = $('#op_download_txt');
  _odh = $('#op_download_html');
  _odd = $('#op_download_docx');
  _odtz = $('#op_download_txt_zip');
  _odhz = $('#op_download_html_zip');
  _oddz = $('#op_download_docx_zip');
  _opal = $('#op_allfile');
  _opdm = $('#op_display_mode');
  _odt.click(function(){ downloadFile(_mt.val(), 'txt', false, file_name); });
  _odh.click(function(){ downloadFile(_mt.val(),'html', false, file_name); });
  _odd.click(function(){ downloadFile(_mt.val(),'docx', false, file_name); });
  _odtz.click(function(){ downloadFile(_mt.val(),'txt', true, file_name); });
  _odhz.click(function(){ downloadFile(_mt.val(),'html', true, file_name); });
  _oddz.click(function(){ downloadFile(_mt.val(),'docx', true, file_name); });
  _opal.click(function(){ allFileClick(); return false; });
  _opdm.click(function(){ displayModeClick(); return false; });

  _mt = $('#main_textarea');
  _mt.keydown(function (e) {
    var code = (event.keyCode ? event.keyCode : event.which);
    /*tab入力*/
    (function() {
      var elem, end, start, value;
      if (code === 9) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        elem = e.target;
        start = elem.selectionStart;
        end = elem.selectionEnd;
        value = elem.value;
        elem.value = "" + (value.substring(0, start)) + "\t" + (value.substring(end));
        elem.selectionStart = elem.selectionEnd = start + 1;
        return false;
      }
    })();
    (function() {
      /*ctrl*/
      if(event.ctrlKey) {
        /*ctrl + s*/
        if(code === 83) {
          event.preventDefault();
          saveClick();
          return false;
        }
      }
    })();
  });
  $('input[id="tabid_1"]').on('change', function() {
    tabList[current_tab_id].file_name = file_name;
    tabList[current_tab_id].file_id = file_id;
    tabList[current_tab_id].version = version;
    current_tab_id = $(this).attr('id').replace('tabid_', '');
    $('[data-tabid]').css('display', 'none');
    $('[data-tabid="'+current_tab_id+'"]').css('display', 'block');
    $('#button_div').css('display', 'block');    
    file_name = tabList[1].file_name;
    file_id = tabList[1].file_id;
    version = tabList[1].version;
  }); 
});

