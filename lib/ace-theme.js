ace.define('ace/theme/zero',
  ['require','exports','module','ace/lib/dom'],
  function(acequire, exports, module) {

  exports.isDark = true // false
  exports.cssClass = 'ace-zero'

  exports.cssText = `.ace-zero {
  color: #fff;
  background-color: #000;
}
.ace-zero .ace_gutter {
  color: #666;
  background-color: rgba(255, 255, 255, .0625);
}
.ace-zero .ace_gutter-active-line {
  background-color: rgba(255, 255, 255, .125);
}
.ace-zero .ace_selection {
  background-color: rgba(255, 255, 255, .25);
}
.ace-zero .ace_cursor {
  border-color: #f0f;
  background-color: transparent;
}
.normal-mode .ace_cursor {
  background-color: #f0f !important;
}
`

  var dom = acequire('../lib/dom')
  dom.importCssString(exports.cssText, exports.cssClass)
})
