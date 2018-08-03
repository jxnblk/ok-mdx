const { generateJSReferences } = require('mini-html-webpack-plugin')

module.exports = ({
  html = '',
  css = '',
  js,
  publicPath,
}) => `<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<meta name='viewport' content='width=device-width,initial-scale=1'>
<meta name='generator' content='ok-mdx'>
<title>ok-mdx</title>
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}</style>
${css}
</head>
<body>
<div id=root>${html}</div>
${generateJSReferences(js, publicPath)}
</body>
</html>
`
