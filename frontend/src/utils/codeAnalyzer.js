export function analyzeTemplateCode(template) {
  if (!template || !template.trim()) {
    return {
      links: [],
      textIssues: [],
      accessibility: [],
      thymeleafStats: [],
      textMetrics: { words: 0, sentences: 0, readingTimeSeconds: 0 }
    };
  }

  // 1. Extract Links & Assets
  const links = [];
  
  // <a href="..."> or th:href="..."
  const aRegex = /<(?:a|A)\s+[^>]*(?:href|th:href)=["']([^"']+)["'][^>]*>(.*?)<\/(?:a|A)>/gi;
  let match;
  while ((match = aRegex.exec(template)) !== null) {
    const rawUrl = match[1];
    const textContent = match[2].replace(/<[^>]+>/g, '').trim();
    let type = 'Local Path';
    if (rawUrl.startsWith('@{') || rawUrl.includes('th:href')) type = 'Thymeleaf Link';
    else if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) type = 'External URL';
    else if (rawUrl.startsWith('#')) type = 'Anchor';

    links.push({
      kind: 'Link',
      url: rawUrl,
      text: textContent || '(Empty Text)',
      type
    });
  }

  // <img src="..."> or th:src="..."
  const imgRegex = /<(?:img|IMG)\s+[^>]*(?:src|th:src)=["']([^"']+)["'][^>]*>/gi;
  while ((match = imgRegex.exec(template)) !== null) {
    const rawUrl = match[1];
    const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
    const altText = altMatch ? altMatch[1] : null;
    let type = 'Local Image';
    if (rawUrl.startsWith('@{')) type = 'Thymeleaf Asset';
    else if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) type = 'External Image';

    links.push({
      kind: 'Image',
      url: rawUrl,
      text: altText ? `Alt: "${altText}"` : 'No Alt Attribute',
      type
    });
  }

  // 2. Accessibility & Best Practices Audit
  const accessibility = [];
  
  // Img missing alt
  const imgTagRegex = /<(?:img|IMG)\s+[^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgTagRegex.exec(template)) !== null) {
    if (!/alt=["']([^"']*)["']/i.test(imgMatch[0])) {
      accessibility.push({
        severity: 'Warning',
        message: 'Image tag missing "alt" attribute for accessibility.',
        codeSnippet: imgMatch[0].substring(0, 60)
      });
    }
  }

  // Empty link anchor
  const emptyLinkRegex = /<(?:a|A)\s+[^>]*>(?:\s*|&nbsp;*)<\/(?:a|A)>/gi;
  let emptyLinkMatch;
  while ((emptyLinkMatch = emptyLinkRegex.exec(template)) !== null) {
    accessibility.push({
      severity: 'Warning',
      message: 'Link anchor <a> is empty or missing accessible text.',
      codeSnippet: emptyLinkMatch[0]
    });
  }

  // Input missing label
  const inputRegex = /<(?:input|INPUT)\s+[^>]*>/gi;
  let inputMatch;
  while ((inputMatch = inputRegex.exec(template)) !== null) {
    const tag = inputMatch[0];
    if (!/type=["'](hidden|submit|button|reset)["']/i.test(tag)) {
      if (!/aria-label=/i.test(tag) && !/id=/i.test(tag) && !/placeholder=/i.test(tag)) {
        accessibility.push({
          severity: 'Info',
          message: 'Form input field lacks "id", "aria-label", or "placeholder".',
          codeSnippet: tag.substring(0, 60)
        });
      }
    }
  }

  // 3. Text Inspector & Spellcheck Heuristics
  const textIssues = [];
  
  // Extract clean text
  let plainText = template
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$\{[^}]+\}/g, ' ')
    .replace(/@\{[^}]+\}/g, ' ')
    .replace(/#\{[^}]+\}/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Repeated words (e.g., "el el", "de de", "the the")
  const repeatedWordsRegex = /\b([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)\s+\1\b/gi;
  let repMatch;
  const seenRepeats = new Set();
  while ((repMatch = repeatedWordsRegex.exec(plainText)) !== null) {
    const word = repMatch[1];
    if (!seenRepeats.has(word.toLowerCase())) {
      seenRepeats.add(word.toLowerCase());
      textIssues.push({
        type: 'Repeated Word',
        message: `Repeated word found: "${word} ${word}"`,
        suggestion: `Remove one "${word}"`
      });
    }
  }

  // Double/Multiple spaces
  if (/ {3,}/.test(plainText)) {
    textIssues.push({
      type: 'Formatting',
      message: 'Multiple consecutive spaces detected in template text.',
      suggestion: 'Clean extra whitespace'
    });
  }

  // Common Spanish accent typos dictionary
  const accentTypos = [
    { typo: /\b(tambien)\b/i, correct: 'también' },
    { typo: /\b(paginas?)\b/i, correct: 'página' },
    { typo: /\b(codigo)\b/i, correct: 'código' },
    { typo: /\b(informacion)\b/i, correct: 'información' },
    { typo: /\b(seccion)\b/i, correct: 'sección' },
    { typo: /\b(numero)\b/i, correct: 'número' },
    { typo: /\b(telefono)\b/i, correct: 'teléfono' },
    { typo: /\b(electronico)\b/i, correct: 'electrónico' },
    { typo: /\b(direccion)\b/i, correct: 'dirección' }
  ];

  accentTypos.forEach(({ typo, correct }) => {
    const typoMatch = typo.exec(plainText);
    if (typoMatch) {
      textIssues.push({
        type: 'Spelling Suggestion',
        message: `Word "${typoMatch[0]}" may be missing an accent mark.`,
        suggestion: `Consider writing "${correct}"`
      });
    }
  });

  // Calculate Text Metrics
  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const readingTimeSeconds = Math.ceil((wordCount / 200) * 60);

  // 4. Thymeleaf Directives Breakdown
  const thymeleafStats = [];
  const directives = [
    { name: 'th:text / th:utext', regex: /th:u?text=/g },
    { name: 'th:if / th:unless', regex: /th:(?:if|unless)=/g },
    { name: 'th:each', regex: /th:each=/g },
    { name: 'th:href / th:src', regex: /th:(?:href|src)=/g },
    { name: 'th:object / th:field', regex: /th:(?:object|field)=/g },
    { name: 'th:fragment / th:replace', regex: /th:(?:fragment|replace|insert|include)=/g }
  ];

  directives.forEach(dir => {
    const matches = template.match(dir.regex);
    if (matches && matches.length > 0) {
      thymeleafStats.push({
        directive: dir.name,
        count: matches.length
      });
    }
  });

  return {
    links,
    textIssues,
    accessibility,
    thymeleafStats,
    textMetrics: {
      words: wordCount,
      sentences: Math.max(1, sentences),
      readingTimeSeconds: Math.max(1, readingTimeSeconds)
    }
  };
}
