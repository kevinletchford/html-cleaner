/**
 * Specialized cleaning for Microsoft Word and Google Docs HTML
 */

// Word-specific patterns to remove
const wordPatterns = [
  // Word conditional comments
  /<!--\[if[^\]]*\][\s\S]*?<!\[endif\]-->/gi,
  // Word XML namespaced tags
  /<o:p[^>]*>[\s\S]*?<\/o:p>/gi,
  /<w:[^>]*>[\s\S]*?<\/w:[^>]*>/gi,
  /<m:[^>]*>[\s\S]*?<\/m:[^>]*>/gi,
  // Word specific attributes
  /\s*mso-[^:]+:[^;"']+;?/gi,
  // Word class names
  /class="?Mso[^">\s]+"?/gi,
]

// Google Docs specific patterns
const googleDocsPatterns = [
  // Google Docs internal IDs
  /\s*id="docs-internal-[^"]*"/gi,
  // Google Docs auto-generated classes (c0, c1, etc.)
  /\s*class="c\d+"/gi,
  // Google Docs specific data attributes
  /\s*data-[\w-]+="[^"]*"/gi,
  // dir attribute
  /\s*dir="[^"]*"/gi,
]

// Tags to completely remove (including content for some)
const tagsToRemove = [
  /<meta[^>]*>/gi,
  /<style[^>]*>[\s\S]*?<\/style>/gi,
]

export function cleanWordMarkup(html: string): string {
  let cleaned = html

  // Remove meta and style tags
  for (const pattern of tagsToRemove) {
    cleaned = cleaned.replace(pattern, '')
  }

  // Remove Word patterns
  for (const pattern of wordPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }

  // Remove Google Docs patterns
  for (const pattern of googleDocsPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }

  // Remove empty style attributes
  cleaned = cleaned.replace(/\s*style="\s*"/gi, '')

  // Remove empty class attributes
  cleaned = cleaned.replace(/\s*class="\s*"/gi, '')

  // Unwrap Google Docs wrapper b tag with font-weight:normal
  cleaned = unwrapGoogleDocsWrapper(cleaned)

  return cleaned
}

function unwrapGoogleDocsWrapper(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Find and unwrap the Google Docs wrapper <b style="font-weight:normal" id="docs-internal-...">
  const wrapperBs = doc.querySelectorAll('b[style*="font-weight:normal"], b[style*="font-weight: normal"]')
  wrapperBs.forEach(b => {
    const parent = b.parentNode
    while (b.firstChild) {
      parent?.insertBefore(b.firstChild, b)
    }
    b.remove()
  })

  return doc.body.innerHTML
}

export function cleanTables(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Clean table elements
  const tables = doc.querySelectorAll('table')
  tables.forEach(table => {
    table.removeAttribute('width')
    table.removeAttribute('height')
    table.removeAttribute('border')
    table.removeAttribute('cellpadding')
    table.removeAttribute('cellspacing')
    table.removeAttribute('bgcolor')
  })

  // Clean td/th elements
  const cells = doc.querySelectorAll('td, th')
  cells.forEach(cell => {
    cell.removeAttribute('width')
    cell.removeAttribute('height')
    cell.removeAttribute('bgcolor')
    cell.removeAttribute('valign')
    cell.removeAttribute('align')
  })

  // Clean tr elements
  const rows = doc.querySelectorAll('tr')
  rows.forEach(row => {
    row.removeAttribute('height')
    row.removeAttribute('bgcolor')
    row.removeAttribute('valign')
  })

  return doc.body.innerHTML
}

export function cleanLists(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Fix nested list structures - Word often creates invalid nesting
  const lists = doc.querySelectorAll('ul, ol')
  lists.forEach(list => {
    // Remove list-specific style attributes
    list.removeAttribute('type')
    list.removeAttribute('start')
  })

  // Clean list items
  const items = doc.querySelectorAll('li')
  items.forEach(item => {
    // Remove Word-specific list markers
    item.removeAttribute('value')
  })

  return doc.body.innerHTML
}

export function removeEmptyParagraphs(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Find and remove empty paragraphs (including those with only &nbsp;)
  const paragraphs = doc.querySelectorAll('p')
  paragraphs.forEach(p => {
    const text = p.textContent?.trim() || ''
    const innerHTML = p.innerHTML.trim()

    // Check if paragraph is effectively empty
    if (text === '' || innerHTML === '&nbsp;' || innerHTML === '\u00A0') {
      // Only remove if it has no meaningful children
      if (p.querySelectorAll('img, video, audio, iframe, object, embed').length === 0) {
        p.remove()
      }
    }
  })

  // Remove standalone <br> tags between block elements
  const brs = doc.querySelectorAll('br')
  brs.forEach(br => {
    const prev = br.previousSibling
    const next = br.nextSibling

    // If br is between block elements or at start/end, remove it
    const prevIsBlock = !prev || (prev.nodeType === 1 && isBlockElement(prev as Element))
    const nextIsBlock = !next || (next.nodeType === 1 && isBlockElement(next as Element))

    if (prevIsBlock && nextIsBlock) {
      br.remove()
    }
  })

  return doc.body.innerHTML
}

function isBlockElement(el: Element): boolean {
  const blockTags = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'blockquote', 'pre', 'hr', 'br']
  return blockTags.includes(el.tagName.toLowerCase())
}
