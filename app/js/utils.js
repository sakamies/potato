//Crazy stuff to make life easier
//TODO: clean up any unused functions

Array.prototype.clone = function() {
  return this.slice(0);
};
Array.prototype.move = function (old_index, new_index) {
  if (new_index >= this.length) {
    var k = new_index - this.length;
    while ((k--) + 1) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};
if (!Array.prototype.fill) {
  Array.prototype.fill = function(value) {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    var start = arguments[1];
    var relativeStart = start >> 0;
    var k = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);
    var end = arguments[2];
    var relativeEnd = end === undefined ?
      len : end >> 0;
    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);
    while (k < final) {
      O[k] = value;
      k++;
    }
    return O;
  };
}
Number.prototype.inRange  = function (a, b) {
  var min = Math.min.apply(Math, [a,b]),
    max = Math.max.apply(Math, [a,b]);
  return this >= min && this <= max;
};
Number.prototype.isEven = function () {
  return this % 2 == 0;
}
Number.prototype.isOdd = function  () {
  return Math.abs(this) % 2 == 1;
}
