/*
 *  Topic - Two Sum
 *  Level - Easy
 *
 *  Given an array of integers, return indices of the two numbers such that they add up to a specific target.
 *  You may assume that each input would have exactly one solution, and you may not use the same element twice.
 *
 *  @param  {number[]}  _nums
 *  @param  {number}    _target
 *  @return {number{}}
 * */
//{{{
var twoSum = function(_nums, _target) {
  var _result;
  for (var _key = 0; _key < _nums.length; _key++) {
    var _num = _target - _nums[_key];
    var _indexOf = _nums.indexOf(_num);
    if (_indexOf > -1 && _indexOf != _key) {
      _result = [_key, _nums.indexOf(_num)];
      break;
    }
  }
  return _result.sort();
};
//}}}

/*
 *  Topic - Reverse integer
 *  Level - Easy
 *
 *  Reverse digits of an integer.
 *  @param  {number} x
 *  @return {number}
 *
 * */
//{{{
var reverse = function(_x) {

};
//}}}

