var sending = false;
var week_later_sec = 604800;
var user_name = '-1';
var user_id = '-1';
var file_name = '-1';
var file_id = '-1';
var version = '1.0';
var onetime = '-1';
var session_id = '-1';
var login = '-1';
var unusable1 = /[^a-zA-Z0-9-]/g;
var unusable2 = /[^a-zA-Z0-9]/g;
var blink_counter = 0;
var tabindex = 1;
var current_tab_id = 1;
var Tab = (function(){
  var Tab = function() {
    if(!(this instanceof Tab)) {
      return new Tab();
    }
    this.file_name = '-1';
    this.file_id = '-1';
    this.version = '1.0';
  }
  return Tab;
})();
var tabList = new Array({}, new Tab());

var debug = true;
/*
** html **/
function addMessage(message) {
  var blink_id = 'blink'+(++blink_counter);
  var _md = $('#outer_message_div[data-tabid="'+current_tab_id+'"] #message_div');
  _md.html('<p id=\''+blink_id+'\' class=\'blink\'>'+message+'（'+getCurrentTime('hh:mm:ss')+'）</p>'+_md.html());
  setTimeout(function(){
    $('#'+blink_id).removeClass('blink');
  }, 5000);
}
function addInfo(info) {
  var blink_id = 'blink'+(++blink_counter);
  $('#info_div_message').html('<p id=\''+blink_id+'\' class=\'blink\'>'+info+'</p>');
  setTimeout(function(){
    $('#'+blink_id).removeClass('blink');
  }, 5000);
}


/*
** common **/
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function hmac_hash(str) {
  var shaObj = new jsSHA('SHA-256', "TEXT");
  shaObj.setHMACKey("thankueveryone19960331", "TEXT");
  shaObj.update(str);
  var hmac = shaObj.getHMAC("HEX");
  return hmac;
}
function isError(_retval) {
  var retval = _retval.split(':');
  if(retval.length < 2) {
    addMessage('エラーが発生しました。文書を別の場所に保存してから、もう一度ページを読み込んでください');
    return true;
  }else if(retval.length >= 2) {
    if(parseInt(retval[0]) == 402 || parseInt(retval[0]) == 501) {
      deleteAllCookie();
      alert('セッションが切れています');
      window.location.href = '/';
    }
    if(parseInt(retval[0]) >= 400) {
      addMessage(retval[1]+':error_no['+retval[0]+']');
      addInfo(retval[1]+':error_no['+retval[0]+']');
      return true;    
    } else {
      return false;
    }
  }
}

/*
** Cookie **/
function getCookie() {
    var result = new Array();
    var allcookies = document.cookie;
    if(allcookies != '') {
        var cookies = allcookies.split('; ');
        for(var i = 0; i < cookies.length; i++) {
            var cookie = cookies[ i ].split('=');
            result[ cookie[ 0 ] ] = decodeURIComponent(cookie[ 1 ]);
        }
    }
    return result;
}
function getCookieByKey(key) {
    var result = new Array();
    var allcookies = document.cookie;
    if(allcookies != '') {
        var cookies = allcookies.split('; ');
        for(var i = 0; i < cookies.length; i++) {
            var cookie = cookies[ i ].split('=');
            if(cookie[0] == key) {
              return decodeURIComponent(cookie[1]);
            }
        }
    }
    return false;
}
function setCookie(key, val, sec) {
  if(!navigator.cookieEnabled) {
    return false;
  }
  document.cookie = 'visit=1';
  if(!getCookieByKey('visit')) {
    return false;
  }
  var date, utc_date;
  date = new Date();
  date.setTime(date.getTime() + sec*1000);
  utc_date = date.toUTCString();
  document.cookie = key+'='+val+';expires='+utc_date+';max-age='+sec;
  return true;
}
function deleteCookie(key) {
  var date, utc_date;
  date = new Date();
  date.setTime(0);
  utc_date = date.toUTCString();
  document.cookie = key+'=-1;expires='+utc_date;
}
function deleteAllCookie() {
  deleteCookie('session_id');
  deleteCookie('user_id');
  deleteCookie('onetime');
  deleteCookie('file_id');
  deleteCookie('version');
  deleteCookie('file_name');
  deleteCookie('user_name');
  deleteCookie('login');
  session_id = '-1';
  user_id = '-1';
  onetime = '-1';
  version = '1.0';
  file_id = '-1';
  user_name = '-1';
  file_name = '-1';
  login = '-1';
}
function getAllCookie() {
  var cookie = getCookie();
  if('user_id' in cookie) {
    user_id = cookie['user_id'];
  }
  if('file_name' in cookie) {
    file_name = cookie['file_name'];
  }
  if('user_name' in cookie) {
    user_name = cookie['user_name'];
  }
  if('file_id' in cookie) {
    file_id = cookie['file_id'];
  }
  if('version' in cookie) {
    version = cookie['version'];
  }
  if('onetime' in cookie) {
    onetime = cookie['onetime'];
  }
  if('session_id' in cookie) {
    session_id = cookie['session_id'];
  }
  if('login' in cookie) {
    login = cookie['login'];
  }
}
/*
**input event**/
function userNameKeyup(_un, _iu) {
  if(_un.val().match(unusable1)) {
    _iu.text('ユーザ名に使えない文字が含まれています');
    return false;
  }else if(_un.val().length < 3 || _un.val().length > 16){
    _iu.text('ユーザー名は3～16文字である必要があります');    
    return false;
  } else {
    _iu.text('');
    return true;
  }
}

/*
** download **/
function downloadFile(_content, _type, _zip, _file_name) {
  alert('a');
  if(_file_name == '-1') {
    _file_name = 'qey';
  }
  if(_type == 'docx') {

    return ;
  }
  var blob = new Blob([_content], { 'type': 'application/x-msdownload' });
    
  var link = document.createElement('a');
  link.setAttribute('download', _file_name+'.'+_type);
  link.href = URL.createObjectURL(blob);
  if (window.navigator.msSaveBlob) { 
    window.navigator.msSaveBlob(blob, downloadFileName); 
    window.navigator.msSaveOrOpenBlob(blob, downloadFileName); 
  }else {
    var evt = document.createEvent('MOuseeVents');
    evt.initEvent('click', false, true);
    link.dispatchEvent(evt);
  }
}

/*
** dropdownをセットする **/
function setDropdownOld(_trigger, _target, _isblock) {
  var trigger = $(_trigger);
  var target = $(_target);    
  trigger.click(function() {
    if(!_isblock) {
      target.css('display', 'block');
      target.css('opacity', '1');
      _isblock = true;
      setTimeout(function() {
        if(_isblock) {
          target.css('opacity', '0');
          _isblock = false;
        }
      }, 3000);
      setTimeout(function() {
        if(!_isblock) {
          target.css('display', 'none');
        }
      }, 4500);
    } else {
      target.css('display', 'none');      
      target.css('opacity', '0');
      _isblock = false;
    }
  });
  // trigger.blur(function() {
  //   target.css('display', 'none');    
  //   _isblock = false;
  // });
}
function setDropdown(_div, _isblock) {
  $(_div+' > a').on('click', function() {
    var target = $(this).next().find('li');
    if(!_isblock) {
      target.css('display', 'block');
      target.css('opacity', '1');
      _isblock = true;
      setTimeout(function() {
        if(_isblock) {
          target.css('opacity', '0');
          _isblock = false;
        }
      }, 3000);
      setTimeout(function() {
        if(!_isblock) {
          target.css('display', 'none');
        }
      }, 4500);
    } else {
      target.css('display', 'none');      
      target.css('opacity', '0');
      _isblock = false;
    }
  });
  // trigger.blur(function() {
  //   target.css('display', 'none');    
  //   _isblock = false;
  // });
}

/*
** 現在時刻をフォーマットに合わせて返す **/
function getCurrentTime(_format) {
  var current = new Date();
  if(!_format) {
    _format = 'YYYY-MM-DD hh:mm:ss';
  }
  var result = _format.replace(/YYYY/g, current.getFullYear())
  .replace(/MM/g, ('0'+(current.getMonth()+1)).slice(-2))
  .replace(/DD/g, ('0'+current.getDate()).slice(-2))
  .replace(/hh/g, ('0'+current.getHours()).slice(-2))
  .replace(/mm/g, ('0'+current.getMinutes()).slice(-2))
  .replace(/ss/g, ('0'+current.getSeconds()).slice(-2));
  return result;
}

/*
** document.ready **/
$(document).ready(function() {
});

