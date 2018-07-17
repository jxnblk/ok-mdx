// who even really knows how to even use this library?
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import css from 'raw-loader!prismjs/themes/prism-okaidia.css'

import styled from 'styled-components'

export const PrismCSS = styled.div([], {
  color: '#fff',
  backgroundColor: '#111'
}, css)
const prism = (code, language = 'jsx') => highlight(code, languages[language])

export default prism
