(function ($) {
  //  Put json data into a select tag for options.
  $.fn.genSelectFromJson = function (_value, _option, _objData) {
    var _this = $(this);
    _this.children().each(function (i) {
      var _optionThis = $(this);
      if (i != 0) {
        _optionThis.remove();
      }
    });
    if (/select/i.test(_this[0].tagName)) {
      for (var i in _objData) {
        //  TODO    This is for IE8 or lower version browser.
        if (typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function () {
              return this.replace(/^\s+|\s+$/g, '');
          }
        }
        _this.append('<option value="' + _objData[i][_value] + '">' + _objData[i][_option].trim() + '</option>');
      }
    } else {
      alert('The input object is not a select tag');
    }
  }

  //  Get input value from form and return as key-value object
  $.fn.getValueFromForm = function () {
    var _countInt = 0;
    var _rtnData = new Object();
    var _this = $(this);
    _this.each(function () {
      var _tagThis = $(this);
      var _tagName = _tagThis[0].tagName;
      if (/input/i.test(_tagName) && _tagThis.attr('type') == 'checkbox') {
        _rtnData[_tagThis.attr('name')] = new Object();
      } else {
        _rtnData[_tagThis.attr('name')] = _tagThis.val();
      }
    });
    _this.each(function (i) {
      var _tagThis = $(this);
      var _tagName = _tagThis[0].tagName;
      if (/input/i.test(_tagName) && _tagThis.attr('type') == 'checkbox' && _tagThis.context.checked) {
        _rtnData[_tagThis.attr('name')][_countInt] = _tagThis.val();
          _countInt++;
      }
    });
    return _rtnData;
  }
})(jQuery);
