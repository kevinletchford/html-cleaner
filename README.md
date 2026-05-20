# HTML Cleaner

A web-based tool for cleaning and formatting HTML content. Perfect for cleaning up messy HTML from Word documents, Google Docs, or other sources.

## Features

- **Three Cleaning Intensity Levels**
  - **Light**: Removes Word/Google Docs metadata and comments. Preserves all styles, classes, and formatting.
  - **Medium**: Removes styles, classes, IDs, empty tags, and span wrappers. Cleans tables and lists. Converts `<b>` to `<strong>`.
  - **Aggressive**: Same as Medium, but also strips HTML5 semantic tags (article, section, nav, aside, etc.) leaving only core elements.

- **Advanced Options**
  - Remove inline styles
  - Remove classes and IDs
  - Remove empty tags
  - Remove comments
  - Convert `<b>` to `<strong>`, `<i>` to `<em>`
  - Remove `<span>` wrappers
  - Normalize whitespace
  - Clean tables (remove widths/borders)
  - Clean lists (fix nested structures)
  - Remove or convert images to alt text

- **Three-Panel Layout**
  - **Input Panel**: Paste your HTML content
  - **Code Panel**: View raw or cleaned HTML with syntax highlighting
  - **Preview Panel**: See rendered output

- **Additional Features**
  - Dark/Light theme support
  - Resizable panels
  - Copy cleaned HTML to clipboard
  - Settings persisted to localStorage

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Monaco Editor for code display
- DOMPurify + sanitize-html for cleaning
- Prettier for formatting

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. Paste HTML content into the Input panel (Cmd/Ctrl+V)
2. Adjust the intensity slider or click the settings icon for advanced options
3. View the cleaned code in the Code panel
4. Preview the rendered output in the Preview panel
5. Click the copy icon in the Preview panel to copy the cleaned HTML

## License

MIT
