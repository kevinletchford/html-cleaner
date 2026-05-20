import DOMPurify from 'dompurify'
import sanitizeHtml from 'sanitize-html'
import { format } from 'prettier/standalone'
import * as htmlParser from 'prettier/plugins/html'
import { CleaningOptions, PresetName, presets } from './presets'
import { cleanWordMarkup, cleanTables, cleanLists, removeEmptyParagraphs } from './wordCleaner'

// Allowed tags for aggressive mode
const semanticTags = [
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'b', 'i', 'u', 's', 'strike', 'sub', 'sup',
  'a',
  'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'blockquote', 'pre', 'code',
  'img',
  'div', 'span',
]

// All common tags for non-aggressive modes
const allTags = [
  ...semanticTags,
  'article', 'section', 'header', 'footer', 'nav', 'aside', 'main',
  'figure', 'figcaption',
  'address', 'cite', 'abbr', 'time', 'mark', 'small',
  'dl', 'dt', 'dd',
  'caption', 'colgroup', 'col',
]

export async function cleanHtml(
  html: string,
  options: CleaningOptions,
  preset: PresetName = 'medium'
): Promise<string> {
  if (!html.trim()) return ''

  let cleaned = html

  // Step 1: Sanitize with DOMPurify first (XSS protection)
  // Always keep style attribute initially so we can convert styled spans to semantic tags
  cleaned = DOMPurify.sanitize(cleaned, {
    ALLOWED_TAGS: preset === 'aggressive' ? semanticTags : allTags,
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'colspan', 'rowspan', 'style', 'class', 'id'],
    KEEP_CONTENT: true,
  })

  // Step 2: Remove Word/Google Docs specific markup
  cleaned = cleanWordMarkup(cleaned)

  // Step 2.5: Convert styled spans to semantic tags BEFORE stripping styles
  // Word/Google Docs use <span style="font-weight: bold"> instead of <strong>
  cleaned = convertStyledSpansToSemanticTags(cleaned)

  // Build global attributes based on options
  const globalAttrs: string[] = []
  if (!options.removeStyles) globalAttrs.push('style')
  if (!options.removeClasses) globalAttrs.push('class')
  if (!options.removeIds) globalAttrs.push('id')

  // Step 3: Apply sanitize-html with options
  const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: preset === 'aggressive' ? semanticTags : allTags,
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      table: options.cleanTables ? [] : ['border', 'cellpadding', 'cellspacing'],
      td: options.cleanTables ? ['colspan', 'rowspan'] : ['colspan', 'rowspan', 'width', 'height'],
      th: options.cleanTables ? ['colspan', 'rowspan'] : ['colspan', 'rowspan', 'width', 'height'],
      '*': globalAttrs,
    },
    transformTags: options.convertBoldItalic
      ? { b: 'strong', i: 'em' }
      : {},
  }

  cleaned = sanitizeHtml(cleaned, sanitizeOptions)

  // Step 4: Post-process with DOM manipulation
  if (options.cleanTables) {
    cleaned = cleanTables(cleaned)
  }

  if (options.cleanLists) {
    cleaned = cleanLists(cleaned)
  }

  if (options.removeEmptyTags) {
    cleaned = removeEmptyParagraphs(cleaned)
    cleaned = removeEmptyElements(cleaned)
  }

  if (options.removeSpanWrappers) {
    cleaned = unwrapSpans(cleaned)
  }

  // Handle images (convertImagesToAlt takes precedence over removeImages)
  if (options.convertImagesToAlt) {
    cleaned = convertImagesToAltText(cleaned)
  } else if (options.removeImages) {
    cleaned = removeImages(cleaned)
  }

  // Run removeEmptyTags again after image removal to clean up empty containers
  if ((options.removeImages || options.convertImagesToAlt) && options.removeEmptyTags) {
    cleaned = removeEmptyParagraphs(cleaned)
    cleaned = removeEmptyElements(cleaned)
  }

  if (options.normalizeWhitespace) {
    cleaned = normalizeWhitespace(cleaned)
  }

  // Step 5: Format with Prettier
  try {
    cleaned = await format(cleaned, {
      parser: 'html',
      plugins: [htmlParser],
      printWidth: 100,
      tabWidth: 2,
      htmlWhitespaceSensitivity: 'ignore',
    })
  } catch (error) {
    console.warn('Prettier formatting failed:', error)
  }

  return cleaned.trim()
}

function removeEmptyElements(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Tags that can be empty
  const selfClosing = ['br', 'hr', 'img', 'input', 'meta', 'link']

  const removeEmpty = (element: Element) => {
    // Process children first (bottom-up)
    Array.from(element.children).forEach(removeEmpty)

    const tagName = element.tagName.toLowerCase()

    // Skip self-closing tags
    if (selfClosing.includes(tagName)) return

    // Check if element is empty
    const text = element.textContent?.trim() || ''
    const hasChildren = element.children.length > 0
    const hasMedia = element.querySelectorAll('img, video, audio, iframe').length > 0

    if (text === '' && !hasChildren && !hasMedia) {
      element.remove()
    }
  }

  removeEmpty(doc.body)
  return doc.body.innerHTML
}

function unwrapSpans(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Find all spans and unwrap them
  const spans = doc.querySelectorAll('span')
  spans.forEach(span => {
    // Only unwrap if span has no meaningful attributes
    const hasStyle = span.hasAttribute('style') && span.getAttribute('style')?.trim()
    const hasClass = span.hasAttribute('class') && span.getAttribute('class')?.trim()
    const hasId = span.hasAttribute('id') && span.getAttribute('id')?.trim()

    if (!hasStyle && !hasClass && !hasId) {
      const parent = span.parentNode
      while (span.firstChild) {
        parent?.insertBefore(span.firstChild, span)
      }
      span.remove()
    }
  })

  return doc.body.innerHTML
}

function normalizeWhitespace(html: string): string {
  // Normalize multiple spaces to single space
  let cleaned = html.replace(/[ \t]+/g, ' ')

  // Normalize multiple newlines to double newlines max
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  // Remove leading/trailing whitespace from lines
  cleaned = cleaned
    .split('\n')
    .map(line => line.trim())
    .join('\n')

  return cleaned
}

function removeImages(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove all img elements
  const images = doc.querySelectorAll('img')
  images.forEach(img => img.remove())

  return doc.body.innerHTML
}

function convertImagesToAltText(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Replace all img elements with a paragraph containing the alt text
  const images = doc.querySelectorAll('img')
  images.forEach(img => {
    const alt = img.getAttribute('alt')?.trim() || 'image'
    const placeholder = document.createElement('span')
    placeholder.textContent = `[img: ${alt}]`
    img.replaceWith(placeholder)
  })

  return doc.body.innerHTML
}

function convertStyledSpansToSemanticTags(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Process all elements with inline styles
  const elementsWithStyle = doc.querySelectorAll('[style]')

  elementsWithStyle.forEach(element => {
    const el = element as HTMLElement
    const style = el.getAttribute('style') || ''
    const computedStyle = el.style

    // Check for bold (Google Docs uses font-weight:700)
    const fontWeight = computedStyle.fontWeight || ''
    const isBold =
      fontWeight === 'bold' ||
      parseInt(fontWeight) >= 600 ||
      /font-weight\s*:\s*(bold|[6-9]00)/i.test(style)

    // Check for italic
    const isItalic =
      computedStyle.fontStyle === 'italic' ||
      /font-style\s*:\s*italic/i.test(style)

    // Check for underline
    const isUnderline =
      /text-decoration[^:]*:\s*[^;]*underline/i.test(style) ||
      (computedStyle.textDecoration && computedStyle.textDecoration.includes('underline'))

    if (isBold || isItalic || isUnderline) {
      let content = el.innerHTML

      // Wrap in semantic tags (innermost to outermost)
      if (isUnderline) {
        content = `<u>${content}</u>`
      }
      if (isItalic) {
        content = `<em>${content}</em>`
      }
      if (isBold) {
        content = `<strong>${content}</strong>`
      }

      // If the element is a span, replace it entirely
      if (el.tagName.toLowerCase() === 'span') {
        const template = document.createElement('template')
        template.innerHTML = content
        el.replaceWith(...Array.from(template.content.childNodes))
      } else {
        // For other elements, just update the innerHTML
        el.innerHTML = content
      }
    }
  })

  return doc.body.innerHTML
}

// Export a quick clean function using a preset
export async function quickClean(html: string, preset: PresetName = 'medium'): Promise<string> {
  return cleanHtml(html, presets[preset], preset)
}

// Format HTML with Prettier (for displaying raw HTML)
export async function formatHtml(html: string): Promise<string> {
  if (!html.trim()) return ''

  try {
    return await format(html, {
      parser: 'html',
      plugins: [htmlParser],
      printWidth: 100,
      tabWidth: 2,
      htmlWhitespaceSensitivity: 'ignore',
    })
  } catch {
    // If formatting fails, return as-is
    return html
  }
}
