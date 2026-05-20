export interface CleaningOptions {
  removeStyles: boolean
  removeClasses: boolean
  removeIds: boolean
  removeEmptyTags: boolean
  removeComments: boolean
  convertBoldItalic: boolean
  removeSpanWrappers: boolean
  normalizeWhitespace: boolean
  cleanTables: boolean
  cleanLists: boolean
  removeImages: boolean
  convertImagesToAlt: boolean
}

export type PresetName = 'light' | 'medium' | 'aggressive'

export const presets: Record<PresetName, CleaningOptions> = {
  light: {
    removeStyles: false,
    removeClasses: false,
    removeIds: false,
    removeEmptyTags: false,
    removeComments: true,
    convertBoldItalic: false,
    removeSpanWrappers: false,
    normalizeWhitespace: true,
    cleanTables: false,
    cleanLists: false,
    removeImages: false,
    convertImagesToAlt: false,
  },
  medium: {
    removeStyles: true,
    removeClasses: true,
    removeIds: true,
    removeEmptyTags: true,
    removeComments: true,
    convertBoldItalic: true,
    removeSpanWrappers: true,
    normalizeWhitespace: true,
    cleanTables: true,
    cleanLists: true,
    removeImages: false,
    convertImagesToAlt: false,
  },
  aggressive: {
    removeStyles: true,
    removeClasses: true,
    removeIds: true,
    removeEmptyTags: true,
    removeComments: true,
    convertBoldItalic: true,
    removeSpanWrappers: true,
    normalizeWhitespace: true,
    cleanTables: true,
    cleanLists: true,
    removeImages: false,
    convertImagesToAlt: false,
  },
}

export const defaultOptions: CleaningOptions = presets.medium

export const optionLabels: Record<keyof CleaningOptions, string> = {
  removeStyles: 'Remove inline styles',
  removeClasses: 'Remove classes',
  removeIds: 'Remove IDs',
  removeEmptyTags: 'Remove empty tags',
  removeComments: 'Remove comments',
  convertBoldItalic: 'Convert <b> to <strong>, <i> to <em>',
  removeSpanWrappers: 'Remove <span> wrappers',
  normalizeWhitespace: 'Normalize whitespace',
  cleanTables: 'Clean tables (remove widths/borders)',
  cleanLists: 'Clean lists (fix nested structures)',
  removeImages: 'Remove images',
  convertImagesToAlt: 'Convert images to alt text',
}
