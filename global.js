const aeTimezone = 'America/New_York';

VeeValidate.Validator.extend('validateCn', {
  getMessage: function(_field) {
  },
  validate: function(_value) {
    if (_value.match(/[^\u3447-\uFA29]/ig)) {
      return true;
    } else {
      if (_value.length > 1) {
        return true;
      } else {
        return false;
      }
    }
  }
});

VeeValidate.Validator.extend('validateName', {
  getMessage: function(_field) {
  },
  validate: function(_value) {
    if (_value.match(/^[\u4e00-\u9fa5_a-zA-Z]+$/ig)) {
      return true;
    } else {
      return false;
    }
  }
});

VeeValidate.Validator.extend('validateCnMobile', {
  getMessage: function(_field) {
  },
  validate: function(_value) {
    if (_value.match(/^1[34578]\d{9}$/ig) || _value.match(/^\d{2}\*{7}\d{2}$/ig)) {
      return true;
    } else {
      return false;
    }
  }
});

VeeValidate.Validator.extend('pwdRule', {
  getMessage: function(_field) {
  },
  validate: function(_value) {
    if (_value.match(/^.[A-Za-z0-9]+$/ig)) {
      return true;
    } else {
      return false;
    }
  }
});

VeeValidate.Validator.extend('equalTo', {
  getMessage: function(_field) {
  },
  validate: function(_value, _target) {
    var _confirmEl = $('[name=' + _target[0] + ']');
    if (_value == _confirmEl.val()) {
      return true;
    } else {
      return false;
    }
  }
});

VeeValidate.Validator.extend('dynamicBetween', {
  getMessage: function(_field) {
  },
  validate: function(_value, _target) {
    var _this = $('#' + _target);
    var _max = _this.data('maxamount');
    var _min = _this.data('minamount');

    if (_value > _max || _value < _min) {
      return false;
    } else {
      return true;
    }
  }
});

var randNum = function() {
  return new Date().getTime() + '_' + Math.random();
};

var memberObj = {
  'jsonrpc': '2.0',
  'params': new Object()
};

const depositWord = ['公司入款', '线上存款', '人工存款', '存款优惠'];
const withdrawWord = ['会员提出', '手工提出', '其他出款'];
const orderStats = ['', '未结算', '赢', '和', '输', '取消', '过期', '系统取消'];
const chargeStatus = {
  0: '申请中',
  1: '已存入',
  2: '取消',
  3: '拒绝',
  8: '系统审核',
  9: '系统取消'
};
const withdrawalStatus = {
  0: '申请中',
  1: '已审核(预备出款)',
  2: '取消',
  3: '拒绝',
  4: '已出款',
  8: '系统已出款',
  9: '系统取消'
};


function fillZero(n, length) {
	var lz = '0';
	if(length == undefined || length < 1) {
		length = 1;
	}
	for(var i = 0; i < length; i++) {
		lz += '0';
	}
	return(lz + n).slice(-(length));
};

var _ajaxPostFunc = function(_data, _path, _dataType, _onSuccess, _onErr, asyncFlag) {
	if(_dataType == undefined) {
		_dataType == 'JSON';
	}

	$.ajax({
		async: asyncFlag,
		url: _path,
		dataType: _dataType,
		type: 'POST',
		data: {json:JSON.stringify(_data)},
    timeout: 5000,
		beforeSend: function(xhr) {
			//	TODO	Before sending data.
      if (!$('.preloader')[0]) {
				$('body').append(loadingTpl);
      }
		},
		complete: function(xhr) {
			//	TODO	Success
			$('.preloader').delay(100).fadeOut('fast', function () {
				$(this).remove();
			});
		},
		success: _onSuccess,
		error: _onErr
	});
};

var _ajaxGetFunc = function(_path, _onSuccess, _onErr, _dataType) {
	if(_dataType == undefined) {
		_dataType == 'JSON';
	}
	$.ajax({
		url: _path,
		dataType: _dataType,
		type: 'GET',
    timeout: 5000,
		beforeSend: function(xhr) {
			//	TODO	Before sending data.
		},
		complete: function(xhr) {
			//	TODO	Success
		},
		success: _onSuccess,
		error: _onErr
	});
};

//{{{ TODO  Call api
var callApi = function(_paramsObj, _method, _async, _successHandle, _logicalErrorHandle, _errorHandle) {
  memberObj.id = randNum();
  memberObj.method = _method;
  memberObj.params = _paramsObj;
  //  _path = (_path == undefined) ? '' : _path;

  _ajaxPostFunc(memberObj, apiPath, 'json', function(_data){
    if (_data.error != null) {
      var _errorObj = _data.error;
      var _code = _errorObj.code;
      var _errMsg = (_code in errMsg) ? errMsg[_code] : _errorObj.message;
      _logicalErrorHandle(_errMsg, _code, _errorObj.reason);
      if (_code == '2202' || _code == '2221') {
        swal({
          title: _errMsg,
          type: 'error'
        }, function() {
          timeout();
        });
      } else {
        swal({
          title: _errMsg,
          type: 'error'
        });
      }
    } else {
      _successHandle(_data);
    }
  }, function(_e){
    _errorHandle(_e);
  }, _async);
}
//}}}

//{{{ TODO  Call api for test
var callApiTest = function(_paramsObj, _method, _async, _successHandle, _logicalErrorHandle, _errorHandle) {
  memberObj.id = randNum();
  memberObj.method = _method;
  memberObj.params = _paramsObj;

  _ajaxPostFunc(memberObj, 'http://dev.bg1207.com/cloud/api/', 'json', function(_data){
    if (_data.error != null) {
      var _errorObj = _data.error;
      var _code = _errorObj.code;
      var _errMsg = (_code in errMsg) ? errMsg[_code] : _errorObj.message;
      _logicalErrorHandle(_errMsg, _code, _errorObj.reason);
      if (_code == '2202' || _code == '2221') {
        swal({
          title: _errMsg,
          type: 'error'
        }, function() {
          timeout();
        });
      } else {
        swal({
          title: _errMsg,
          type: 'error'
        });
      }
    } else {
      _successHandle(_data);
    }
  }, function(_e){
    _errorHandle(_e);
  }, _async);
}
//}}}

//{{{  TODO  get url parameter
var getUrlParameter = function(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'), sParameterName, i;

	for(i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if(sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};
//}}}

//{{{  TODO  get currency information
var getCurrencyInfo = function(_sn, _currencyId) {
  var _currencyInfo;

  callApi({
    sn: _sn,
    currencyId: _currencyId
  }, apiMethod.currencyGet, false, function(_data) {
    _currencyInfo = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _currencyInfo;
}
//}}}

//{{{  TODO  get third party information
var getThirdPartyInfo = function(_sessionNum) {
  var _thirdPartyInfo;

  callApi({
    sessionId: _sessionNum
  }, apiMethod.getThirdpartyBalance, false, function(_data) {
    _thirdPartyInfo = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _thirdPartyInfo;
}
//}}}

//{{{  TODO  current page symbol
var setCurrentClass = function() {
  var _url = window.location.href;
  var _titleText = '';
  $('#primary-nav a').each(function(_index, _item){
    if (_url.endsWith($(_item).attr('href'))) {
      $(_item).addClass('current');
      _titleText = $(_item).text();
    }
  });

  if (_titleText == '') {
    if (_url.endsWith('member-new-depositStep.html') || _url.endsWith('member-new-depositStep.html?tm=ali') || _url.endsWith('member-new-depositStep.html?tm=wx')) {
      $('#depositPage').addClass('current');
      _titleText = $('#depositPage').text();
    }
  }

  _titleText = (_titleText == '') ? '会员中心' : _titleText;
  return _titleText;
}
//}}}

//{{{  TODO  get deposit value
var getDWVal = function(_token, _sn, sDate, eDate) {
  var _totalDVal = 0;
  var _totalWVal = 0;

  callApi({
    sn: _sn,
    clazz: 'userview'
  }, apiMethod.itemList, false, function(_data) {
    var _items = _data.result;
    $.each(_items, function(_i, _t){
      if ($.inArray(_t.itemName, depositWord) >= 0 || $.inArray(_t.itemName, withdrawWord) >= 0) {
        var _resultData = getTransRec(_token, _t.itemId, eDate, sDate + ' 23:59:59', 1, 1000);
        if ($.inArray(_t.itemName, depositWord) >= 0) {
          _totalDVal += _resultData.stats.incomeAmount;
        } else {
          _totalWVal += _resultData.stats.expenditureAmount;
        }
      }
    });
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return {'deposit': _totalDVal, 'withdraw': _totalWVal};
}
//}}}

//{{{   TODO  Get transaction item name.
var getItemList = function(_sn) {
  var _rstObj;

  callApi({
    sn: _sn,
    clazz: 'ltuserview'
  }, apiMethod.itemList, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  get trancition record
var getTransRec = function(_token, _code, _sDate, _eDate, _index, _size) {
  var _rstObj;

  callApi({
    sessionId: _token,
    accountItem: _code,
    startTime: _sDate,
    endTime: _eDate,
    pageIndex: _index,
    pageSize: _size
  }, apiMethod.cashflowQuery, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  get trancition record
var getTransRecs = function(_token, _codes, _sDate, _eDate, _index, _size) {
  var _rstObj;

  callApi({
    sessionId: _token,
    accountItems: _codes,
    startTime: _sDate,
    endTime: _eDate,
    pageIndex: _index,
    pageSize: _size
  }, apiMethod.cashflowQuery, false, function(_data) {
    _rstObj = _data.result;
    //  _rstObj = {"total":3,"pageIndex":1,"stats":{"userCount":1,"incomeAmount":1,"balanceAmount":-1,"expenditureAmount":2},"pageSize":20,"etag":null,"page":1,"items":[{"amount":1,"loginId":"json8","accountItemName":"MG转入BG","balance":2459.67,"cashflowId":4612977163,"operateTime":"2017-06-27 01:53:26","bizId":55317490,"sn":"ag00","accountItem":10602,"userId":13404039},{"amount":-1,"loginId":"json8","accountItemName":"BG转入MG","balance":1459.67,"cashflowId":4612671442,"operateTime":"2017-06-26 23:46:14","bizId":55313749,"sn":"ag00","accountItem":20602,"userId":13404039},{"amount":-1,"loginId":"json8","accountItemName":"BG转入MG","balance":1419.67,"cashflowId":4596102731,"operateTime":"2017-06-20 13:08:50","bizId":55078913,"sn":"ag00","accountItem":20602,"userId":13404039}]};
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  get charge record
var getChargeRec = function(_token, _code, _sDate, _eDate, _index, _size) {
  var _rstObj;
  var _sendObj;
  var _chargeStatus = null;
  var _chargeStatuses = null;

  _sendObj = {
    sessionId: _token,
    token: _token,
    popupFlag: 'N',
    startTime: _sDate,
    beginTime: _sDate,
    endTime: _eDate,
    pageIndex: _index,
    pageSize: _size,
  }

  if (_code != '') {
    if (_code.split(',').length > 1) {
      _sendObj.chargeStatuses = _code.split(',');
    } else {
      _sendObj.chargeStatus = _code;
    }
  }

  callApi(_sendObj, apiMethod.getUserChargeList, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  get withdrawal record
var getWithdrawRec = function(_token, _code, _sDate, _eDate, _index, _size) {
  var _rstObj;
  var _sendObj;
  var _chargeStatus = null;
  var _chargeStatuses = null;

  _sendObj = {
    sessionId: _token,
    token: _token,
    popupFlag: 'N',
    startTime: _sDate,
    beginTime: _sDate,
    endTime: _eDate,
    pageIndex: _index,
    pageSize: _size,
    scope: '0'
  }

  if (_code != '') {
    if (_code.split(',').length > 1) {
      _sendObj.withdrawStatuses = _code.split(',');
    } else {
      _sendObj.withdrawStatus = _code;
    }
  }

  callApi(_sendObj, apiMethod.getWithdrawList, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  get user play list
var getUserOrderCost = function(_token, _sDate, _eDate) {
  var _rstObj;

  callApi({
    sessionId: _token,
    startTimeStr: _sDate,
    endTimeStr: _eDate
  }, apiMethod.orderCostSum, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  get user thired party balance
var getThBalance = function(_token) {
  var _rstObj;

  callApi({
    sessionId: _token
  }, apiMethod.getThirdpartyBalance, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  get third party order list
var getThOrderList = function(_token, _moduleId, _sDate, _eDate, _index, _size) {
  var _rstObj;
  var _url;

  switch(_moduleId) {
    case '205':
      _url = apiMethod.ag_orderQuery;
      break;
    case '209':
      _url = apiMethod.gd_orderQuery;
      break;
    case '210':
      _url = apiMethod.ab_orderQuery;
      break;
    case '201':
      _url = apiMethod.lb_orderQuery;
      break;
    case '204':
      _url = apiMethod.bbin_orderQuery;
      break;
    case '206':
      _url = apiMethod.og_orderQuery;
      break;
    case '214':
      _url = apiMethod.sunbet_orderQuery;
      break;
    case '211':
      _url = apiMethod.pt_orderQuery;
      break;
    case '215':
      _url = apiMethod.dg_orderQuery;
      break;
    case '218':
      _url = apiMethod.gc_orderQuery;
      break;
    case '222':
      _url = apiMethod.threesing_orderQuery;
      break;
    case '208':
      _url = apiMethod.im_orderQuery;
      break;
    case '213':
      _url = apiMethod.saba_orderQuery;
      break;
    case '224':
      _url = apiMethod.ug_orderQuery;
      break;
    case '202':
      _url = apiMethod.mg_orderQuery;
      break;
    case '2041':
      _url = apiMethod.bbin_gameQuery;
      break;
    case '2051':
      _url = apiMethod.ag_gameQuery;
      break;
    case '217':
      _url = apiMethod.gpi_orderQuery;
      break;
    case '223':
      _url = apiMethod.isb_orderQuery;
      break;
    case '221':
      _url = apiMethod.ttg_orderQuery;
      break;
    case '220':
      _url = apiMethod.qt_orderQuery;
      break;
    case '219':
      _url = apiMethod.haba_orderQuery;
      break;
    case '225':
      _url = apiMethod.bgfish_orderQuery;
      break;
    case '212':
      _url = apiMethod.ytx_orderQuery;
      break;
    default:
      _url = apiMethod.orderQuery;
      break;
  }

  callApi({
    sessionId: _token,
    moduleId: _moduleId,
    startTime: _sDate,
    endTime: _eDate,
    pageIndex: _index,
    pageSize: _size
  }, _url, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  get News
var getNewsList = function(_current, _popupFlag, _noticeFrom, _pageIndex, _pageSize) {
	var _rstObj;

  callApi({
    current: _current,
    popupFlag: _popupFlag,
    noticeFrom: _noticeFrom,
    pageIndex: _pageIndex,
    pageSize: _pageSize
  }, apiMethod.n_systemQuery, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

	return _rstObj;
}
//}}}

//{{{  TODO  get system News
var getSysNewsList = function(_sessionId, _popupFlag, _pageIndex, _pageSize) {
	var _rstObj;

  callApi({
    sessionId: _sessionId,
    popupFlag: _popupFlag,
    pageIndex: _pageIndex,
    pageSize: _pageSize
  }, apiMethod.notice_newQuery, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

	return _rstObj;
}
//}}}

//{{{  TODO  get history News
var getHisNewsList = function(_sessionId, _popupFlag, _pageIndex, _pageSize) {
	var _rstObj;

  callApi({
    sessionId: _sessionId,
    popupFlag: _popupFlag,
    pageIndex: _pageIndex,
    pageSize: _pageSize
  }, apiMethod.notice_historyQuery, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

	return _rstObj;
}
//}}}

//{{{  TODO  get personal News
var getPersonalNewsList = function(_sessionId, _popupFlag) {
	var _rstObj;

  callApi({
    sessionId: _sessionId,
    popupFlag: _popupFlag
  }, apiMethod.user_noticeQuery, false, function(_data) {
    _rstObj = _data;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

	return _rstObj;
}
//}}}

//{{{  TODO  get third party list
var getThirdpartyList = function(_sn) {
  var _rstObj;

  callApi({
    sn: _sn,
  }, apiMethod.thirdpartylist, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  toggle collapse icon
var toggleIcon = function(){
  $('body').delegate('.collapse', 'show.bs.collapse', function(e) {
    var _this = $(e.target);
    $('#' + _this.attr('id') + '_title' ).find('i').removeClass('fa-plus-circle').addClass('fa-minus-circle');
  }).end().delegate('.collapse', 'hide.bs.collapse', function(e) {
    var _this = $(e.target);
    $('#' + _this.attr('id') + '_title').find('i').addClass('fa-plus-circle').removeClass('fa-minus-circle');
  });
}
//}}}

//{{{  TODO  toggle collapse open and load available bet data.
var loadBetData = function(_token, _vm) {
  $('body').delegate('.available-bet.collapse', 'show.bs.collapse', function(e) {
    var _itemArr = ['lg', 'vg', 'sg'];
    var _betItemArr = new Array();
    var _amtObj;
    var _el = $(e.target);

    _amtObj = getUserOrder(_token, _el.data('sdate'),  _el.data('edate'), 1, 12, [2,3,4], false);
    _vm.playAmtTotal = _amtObj.total;
    if (_amtObj.total > 0) {
      _vm.playAmtList = _amtObj.items;
    }

    setTimeout(function(){
      $('#available-bet .order-status').each(function(_i, _t){
        var _el = $(_t);
        if (_el.data('orderstats') == 2) {
          _el.addClass('orderwin');
        } else if (_el.data('orderstats') == 4) {
          _el.addClass('orderlose');
        }
      });
    },100);
  });
}
//}}}

//{{{ TODO  Get select tool
var getBetSelectTool = function(_clazz) {
  var _rstObj;

  callApi({
    clazz: _clazz,
  }, apiMethod.getSelectTool, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get user order
var getUserOrder = function(_token, _sDate, _eDate, _pageIndex, _pageSize, _status, _async) {
  var _rstObj;

  callApi({
    sessionId: _token,
    stats: _status,
    startTime: _sDate,
    endTime: _eDate,
    pageIndex: _pageIndex,
    pageSize: _pageSize,
    async: _async
  }, apiMethod.orderQuery, false, function(_data) {
    //  _data = {"id":"1494567714403_0.8993978572778172","result":{"total":1,"pageIndex":1,"stats":{"validAmountTotal":20,"aAmountTotal":40,"userCount":1,"paymentTotal":20,"bAmountTotal":-20,"validBetTotal":20},"pageSize":12,"etag":null,"page":1,"items":[{"gameId":1,"tranId":null,"issueId":"BGA0317051206A","aAmount":40,"loginId":"F6917","orderId":4080850582,"playName":"闲赢","moduleName":"视讯","orderStatus":2,"userId":16163742,"playId":"268435458","uid":16163742,"orderTime":"2017-05-12 01:32:52","gameName":"百家乐","fromIp":"61.216.135.102","orderFrom":1,"payment":20,"sn":"ad00","bAmount":-20,"moduleId":2,"validBet":20,"lastUpdateTime":"2017-05-12 01:33:07"}]},"error":null,"jsonrpc":"2.0"};

    _rstObj = _data.result;

  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  TODO  session time out
var timeout = function() {
  cms.delCookie("loginStatus");
  logout(cms.getToken());
  opener.bgPage.loginOut();
  window.opener = null;
  window.close();
}
//}}}

//{{{  TODO  Error handle
var errorHandle = function(_msg, _code) {
  var _errBox;
  var _body = $('body');
  var _errMsgArr = new Object();
  if (_body.find('#errorBox').length == 0) {
    $('body').append(errorBox);
  }

  _errorBox = $('#errorBox');
  if (_code in _errMsgArr) {
    _errorBox.text(_errMsgArr[_code]);
  } else {
    _errorBox.text(_msg);
  }

  setTimeout(function(){
    $('#errorBox').remove();
  }, 3000);
}
//}}}

//{{{ TODO  Error with callBack
var errorHandleWithCallBack = function(_msg, _code, _callBack) {
  var _errBox;
  var _body = $('body');
  var _errMsgArr = new Object();
  if (_body.find('#errorBox').length == 0) {
    $('body').append(errorBox);
  }

  _errorBox = $('#errorBox');
  if (_code in _errMsgArr) {
    _errorBox.text(_errMsgArr[_code]);
  } else {
    _errorBox.text(_msg);
  }

  setTimeout(function(){
    $('#errorBox').remove();
  }, 3000);

  _callBack();
}
//}}}

//{{{ TODO  Logout
var logout = function(_token) {
  var _rstObj;
  memberObj.id = randNum();
  memberObj.method = apiMethod.logout;
  memberObj.params = new Object();
  memberObj.params.sessionId = _token;
  _ajaxPostFunc(memberObj, apiPath, 'json', function(_data){}, function(e){}, false);
}
//}}}

//{{{  TODO  Page function
var pageTation = function(_currentPage, _totalPage) {
  var _pageObj = {
    'pageArr': [1],
    'disableR': false,
    'disableL': false
  }
  if (!isNaN(_currentPage) || !isNaN(_totalPage)) {
    _pageObj.pageArr = new Array();
    if (_totalPage > 10) {
      var _minNum = (_currentPage % 10) == 0 ? _currentPage - 9 : _currentPage - (_currentPage % 10) + 1;
      var _maxNum = ((_minNum + 9) > _totalPage) ? _totalPage : (_minNum + 9);
    } else {
      var _minNum = 1;
      var _maxNum = _totalPage;
    }
    if (_currentPage == _minNum) {
      _pageObj.disableL = true;
    }
    if (_currentPage == _maxNum) {
      _pageObj.disableR = true;
    }
    for (var _i = _minNum; _i <= _maxNum; _i++) {
      _pageObj.pageArr.push(_i);
    }
  }
  return _pageObj;
}
//}}}

//{{{ TODO  Change page
var changePage = function(_ev) {
  var _vm = this;
  var _targetEl = $(_ev.target);
  if ($(_targetEl).parents('li').data('page') == undefined) {
    if ($(_targetEl).parents('li').hasClass('prev') && !$(_targetEl).parents('li').hasClass('disabled')) {
      _vm.currentPage -= 1;
    } else if ($(_targetEl).parents('li').hasClass('next') && !$(_targetEl).parents('li').hasClass('disabled')) {
      _vm.currentPage += 1;
    }
  } else {
    _vm.currentPage = $(_targetEl).parents('li').data('page');
  }
  if (!$(_targetEl).parents('li').hasClass('disabled')) {
  	if ($('.form-box button.submit').length > 0) {
  		$('.form-box button.submit').trigger('click');
  	}
  }
}
//}}}

//{{{ TODO  Third party balance list
var modifyThirdPartyInfo = function(__thirdPartyList) {
  var _modifyArr;
  var _rstArr = new Array();

  $.each(_thirdPartyList, function(_key, _index) {
    var _tmpObj = new Object();
    var _thirdPartyObj;

    if (_key % 2 == 0) {
      if (_key != 0) {
        _rstArr.push(_modifyArr);
      }
      _modifyArr = new Array();
    }

    _tmpObj.partyId = _index.module_id;
    _tmpObj.partyName = _index.module_name;
    if (_thirdPartyObj != undefined) {
      if (_thirdPartyObj.error != null) {
        _tmpObj.bets = _index.bets;
      } else {
        _tmpObj.bets = 0;
      }
    } else {
      _tmpObj.bets = 0;
    }
    _modifyArr.push(_tmpObj);
  });

  return _rstArr;
}
//}}}

//{{{ TODO  Third party balance list modify
var modifyBalanceInfo = function(_data) {
  var _modifyArr;
  var _tmpArr = new Array();
  var _rstArr = new Array();

  $.each(_data, function(_key, _item) {
    if (_item.thirdpartyName != null) {
      _tmpArr.push(_item);
    }
  });

  $.each(_tmpArr, function(_key, _item){
    var _tmpObj = new Object();
    if (_key % 2 != 0) {
      _rstArr.push(_modifyArr);
    } else {
      _modifyArr = new Array();
    }
    _tmpObj.partyId = _item.thirdpartyId;
    _tmpObj.partyName = _item.thirdpartyName;
    _tmpObj.balance = _item.balance;

    _modifyArr.push(_tmpObj);
  });
  return _rstArr;
}
//}}}

//{{{ TODO  Get user information
var getUserProfile = function(_token) {
  var _rstObj;

  callApi({
    sessionId: _token,
    withVipData: 1,
    withBank: 1
  }, apiMethod.getUserProfile, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get user balance
var getUserBalance = function(_token) {
  var _rstObj;

  callApi({
    sessionId: _token
  }, apiMethod.getUserBalance, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get user balance from third party.
var getThirdPartyBalanceById = function(_token, _partyId) {
  var _rstObj;

  callApi({
    sessionId: cms.getToken(),
    thirdpartyId: _partyId
  }, apiMethod.thirdPartyRefresh, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Exchange balance
var exchangeBl = function(_token, _from, _to, _amount) {
  var _rstObj;

  callApi({
    sessionId: cms.getToken(),
    from: _from,
    to: _to,
    amount: _amount
  }, apiMethod.balanceExchange, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Collect all balance from thirdparty
var collectAllBalance = function(_token) {
  var _rstObj;

  callApi({
    sessionId: _token
  }, apiMethod.collectAllBalance, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get charge order no
var getChargeNo = function() {
  var _rstObj;

  callApi({}, apiMethod.getChargeNo, false, function(_data) {
    _rstObj = _data;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get charge option
var getChargeOption = function(_token, _amt, _type){
  var _rstObj;

  callApi({
    sessionId: _token,
    amount: _amt,
    chargeType: _type
  }, apiMethod.getChargeInfo, false, function(_data) {
    _rstObj = _data;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get cahrge merchant
var getChargeMerchant = function(_tokenId, _chargeNo, _bankId, _amount) {
  var _rstObj;

  callApi({
    sessionId: _tokenId,
    amount: _amount,
    bankId: _bankId,
    chargeNo: _chargeNo
  }, apiMethod.getPaymentCharge, false, function(_data) {
    _rstObj = _data;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get cahrge apply
var getChargeApply = function(_tokenId, _chargeNo, _bankId, _payId, _amount, _memo, _digest, _couponMode, _chargeFrom) {
  var _rstObj;

  callApi({
    sessionId: _tokenId,
    chargeNo: _chargeNo,
    fromBankId: _bankId,
    toPayId: _payId,
    amount: _amount,
    memo: _memo,
    couponMode: _couponMode,
    digest: _digest,
    chargeFrom: _chargeFrom
  }, apiMethod.chargeApply, false, function(_data) {
    _rstObj = _data;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get layer bank list
var getLayerBankList = function(_tokenId) {
  var _rtnObj;

  callApi({
    sessionId: _tokenId
  }, apiMethod.getLayerDepositAcct, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get deposit setting
var getDepositSetting = function(_tokenId) {
  var _rtnObj;

  callApi({
    sessionId: _tokenId
  }, apiMethod.getAmt, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get charge option
var getWithdrawInfo = function(_token, _amt){
  var _rstObj;

  callApi({
    sessionId: _token,
    amount: _amt
  }, apiMethod.getWithdrawOption, false, function(_data) {
    _rstObj = _data;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Get withdraw info
var getWithdrawAcct = function(_tokenId, _defaultOnly) {
  var _rtnObj;

  callApi({
    sessionId: _tokenId,
    defaultOnly: _defaultOnly
  }, apiMethod.userWithdrawAcct, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  User transfer apply
var transferApply = function(_tokenId, _chargeNo, _fromId, _toId, _amount, _transferTime, _fromAcctOwner, _couponMode, _memo, _fromChannel) {
  var _rtnObj;

  callApi({
    sessionId: _tokenId,
    chargeNo: _chargeNo,
    fromBankId: _fromId,
    toAccountId: _toId,
    amount: _amount,
    transferTime: _transferTime,
    fromAccountOwner: _fromAcctOwner,
    fromChannel: _fromChannel,
    chargeFrom: 1,
    couponMode: _couponMode,
    memo: _memo
  }, apiMethod.userChargeTransferApply, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{   TODO  Reset pay password.
var setPayPassword = function(uid, oldPayPwd, newPayPwd) {
  var encode = new Encode();
  var oldpwd = encode.encodeSha1(uid + encode.encodeSha1(oldPayPwd));
  var newpwd = encode.encodeSha1(uid + encode.encodeSha1(newPayPwd));

  callApi({
    sessionId: cms.getToken(),
    oldPayPwd: oldpwd,
    newPayPwd: newpwd
  }, apiMethod.set_payPassword, false, function(_data) {
    if (_data.result == "1") {
      sweetAlert('取款密码修改成功!', '', 'success');
    } else {
      sweetAlert('取款密码修改失败!', '', 'error');
    }
  }, function(_errMsg, _errCode, _errReason) {
    sweetAlert(_errMsg, '', 'error');
  }, function(_e){});
}
//}}}

//{{{ TODO  Update user profile
var updateProfile = function(_profile){
  callApi({
    sessionId: cms.getToken(),
    mobile: _profile.mobile,
    email: _profile.email,
    wechat: _profile.wechat,
    birthday: _profile.birthday,
    qq: _profile.qq
  }, apiMethod.update_userProfile, false, function(_data){}, function(_errMsg, _errCode, _errReason){}, function(_e){});
}
//}}}

//{{{ TODO  Set bank information
var setBank = function(obj){
  var _rstObj;
  callApi({
    sessionId: cms.getToken(),
    name: obj.name,
    bankId: obj.bankId,
    bankBranch: obj.bankBranch,
    bankAccount: obj.bankAccount
  }, apiMethod.bankUpdate, false, function(_data){
    if (_data.result == '1') {
      swal({
        title: '银行帐户设定成功',
        type: 'success'
      }, function(){
        location.reload();
      });
    }
  }, function(_errMsg, _errCode, _errReason){}, function(_e){});

  return _rstObj;
}
//}}}

//{{{ TODO  Set user password
var setUserPassword = function(_token, _salt, _newPassword){
  callApi({
    sessionId: cms.getToken(),
    saltedPassword: _token,
    salt: _salt,
    newPassword: _newPassword
  }, apiMethod.set_userPassword, false, function(_data){
    if (_data.error == null && _data.result != null) {
      if (_data.result == '1') {
        swal({
          title: '密码修改成功,请重新登录!',
          type: 'success'
        }, function() {
          timeout();
        });
      }
    }
  }, function(_errMsg, _errCode, _errReason){}, function(_e){});
}
//}}}

//{{{  TODO  get charge record
var getThPwdInfo = function(_token) {
  var _rstObj;

  callApi({
    sessionId: _token
  }, apiMethod.getThPwdList, false, function(_data) {
    _rstObj = _data.result;
  }, function(_errMsg, _errCode, _errReason) {
  }, function(_e){});

  return _rstObj;
}
//}}}

//{{{  FIXME  Hodfix for withdraw process.
var preCheckPayPwd = function(uid, oldPayPwd, newPayPwd) {
  var _encode = new Encode();
  var _oldpwd = _encode.encodeSha1(uid + _encode.encodeSha1(oldPayPwd));
  var _newpwd = _encode.encodeSha1(uid + _encode.encodeSha1(newPayPwd));
  var _rtnCode;

  memberObj.id = randNum();
  memberObj.method = apiMethod.set_payPassword;
  memberObj.params = new Object();
  memberObj.params.sessionId = cms.getToken();
  memberObj.params.oldPayPwd = _oldpwd;
  memberObj.params.newPayPwd = _newpwd;

  _ajaxPostFunc(memberObj, apiPath, 'json', function(_data){
    if (_data.error != null) {
      _rtnCode = _data.error.code;
    }
  }, function(e){}, false);

  return _rtnCode;
}
//}}}

//  TODO  template
//{{{ Side menSide menuu
var sidemenu = [
  '<nav id="primary-nav">',
  '<ul>',
  '<li>',
  '<a class="active">会员专区</a>',
  '</li>',
  '<li>',
  '<a href="member-new-myaccnt.html"><i class="fa fa-user-circle-o"></i>我的帐户</a>',
  '</li>',
  '<li>',
  '<a href="member-new-conversion.html"><i class="fa fa-jpy"></i>额度转换</a>',
  '</li>',
  '<li>',
  '<a href="member-new-deposit.html" id="depositPage"><i class="fa fa-sign-in"></i>会员存款</a>',
  '</li>',
  '<li>',
  '<a href="member-new-withdrawal.html"><i class="fa fa-upload"></i>会员取款</a>',
  '</li>',
  '<li>',
  '<a class="active">记录查询</a>',
  '</li>',
  '<li>',
  '<a href="member-new-transaction.html"><i class="fa fa-university"></i>交易记录</a>',
  '</li>',
  '<li>',
  '<a href="member-new-chargeRec.html"><i class="fa fa-credit-card"></i>充值记录</a>',
  '</li>',
  '<li>',
  '<a href="member-new-withdrawalRec.html"><i class="fa fa-line-chart"></i>提款记录</a>',
  '</li>',
  '<li>',
  '<a href="member-new-bet.html"><i class="fa fa-ticket"></i>注单查询</a>',
  '</li>',
  '<li>',
  '<a href="member-new-available.html"><i class="fa fa-money"></i>有效投注</a>',
  '</li>',
  '<li>',
  '<a class="active">消息公告</a>',
  '</li>',
  '<li>',
  '<a href="member-new-personalMsg.html"><i class="fa fa-id-card-o"></i>个人消息</a>',
  '</li>',
  '<li>',
  '<a href="member-new-systemMsg.html"><i class="fa fa-laptop"></i>网站消息</a>',
  '</li>',
  '<li>',
  '<a href="member-new-announcement.html"><i class="fa fa-gamepad"></i>游戏公告</a>',
  '</li>',
  '</ul>',
  '</nav>'
].join(' ');
//}}}
//{{{ Top title
var toptitle = [
  '<header class="navbar navbar-inverse">',
  '<div class="pull-right ae-time" v-cloak><i class="fa fa-clock-o"></i> 美东时间 {{ currenttime }}</div>',
  '<span class="navbar-title">{{ titlename }}</span>',
  '</header>'
].join(' ');
//}}}
//{{{ Close box
var closeBox = [
  '<div id="closeBox" class="dash-tile clearfix animation-pullDown text-center">',
  '您的连线已过期，请重新登入',
  '</div>'
].join(' ');
//}}}
//{{{ Error Box
var errorBox = [
  '<div id="errorBox" class="dash-tile clearfix animation-pullDown text-center"></div>'
].join(' ');
//}}}
//{{{ User info
var userInfo = [
  '<div class="user-info">',
  '<div class="row">',
  '<div class="col-md-12 nember-img text-center">',
  '<a href="member.html"><img src="../images/img-nember.png"></a>',
  '<div class="mail-icon">',
  '<a href="member-new-personalMsg.html">',
  '<span class="badge mail-badge">0</span>',
  '<i class="fa fa-envelope-o fa-2x" aria-hidden="true"></i>',
  '</a>',
  '</div>',
  '<div class="row">',
  '<div class="col-md-12 text-center">',
  '<span class="account-n" :title="userid" v-cloak>{{ userid }}</span>',
  '</div>',
  '</div>',
  '<div class="row">',
  '<div class="col-md-12 text-center">',
  '<span class="account-c" v-cloak>{{ userbalance }} {{ currencycode }}</span>',
  '</div>',
  '</div>',
  '</div>',
  '</div>'
].join(' ');
//}}}
//{{{ Loading icon
var loadingTpl = [
  '<div class="preloader">',
  '<div class="loader-image">',
  '<div></div>',
  '<div></div>',
  '<div></div>',
  '</div>',
  '</div>'
].join(' ');
//}}}

var getBankList = function(){
  var array = [];
  memberObj.id = randNum();
  memberObj.method = apiMethod.bankList;
  memberObj.params = new Object();
  memberObj.params.sn = cms.getWebSn();
  _ajaxPostFunc(memberObj, apiPath, 'json', function(_data){
    array = _data.result;
  }, function(e){}, false);
  return array;
}

$(document).ready(function() {

});
