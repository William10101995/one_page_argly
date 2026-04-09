"use client"

import { useMemo } from "react"

type Language = "javascript" | "python" | "php" | "curl" | "json"

interface CodeHighlighterProps {
  code: string
  language: Language
}

interface Token {
  type: "keyword" | "string" | "comment" | "function" | "number" | "variable" | "property" | "operator" | "text"
  value: string
}

const tokenColors: Record<Token["type"], string> = {
  keyword: "text-purple-400",
  string: "text-emerald-400",
  comment: "text-gray-500 italic",
  function: "text-blue-400",
  number: "text-orange-400",
  variable: "text-red-400",
  property: "text-yellow-400",
  operator: "text-cyan-400",
  text: "text-gray-200",
}

export function CodeHighlighter({ code, language }: CodeHighlighterProps) {
  const elements = useMemo(() => {
    const tokens = tokenize(code, language)
    return tokens.map((token, index) => (
      <span key={index} className={tokenColors[token.type]}>
        {token.value}
      </span>
    ))
  }, [code, language])

  return (
    <pre className="overflow-x-auto text-sm">
      <code className="font-mono whitespace-pre">{elements}</code>
    </pre>
  )
}

function tokenize(code: string, language: Language): Token[] {
  const tokens: Token[] = []
  let remaining = code

  const patterns: Record<Language, Array<{ type: Token["type"]; regex: RegExp }>> = {
    javascript: [
      { type: "comment", regex: /^(\/\/.*?)(?=\n|$)/ },
      { type: "string", regex: /^('[^']*'|"[^"]*"|`[^`]*`)/ },
      {
        type: "keyword",
        regex:
          /^(const|let|var|function|return|if|else|for|while|async|await|try|catch|throw|new|class|import|export|from|default)\b/,
      },
      { type: "function", regex: /^(fetch|then|catch|finally|log|json|error|console|res|data)\b/ },
      { type: "number", regex: /^(\d+\.?\d*)/ },
      { type: "operator", regex: /^(=>|\.|$$|$$|{|}|\[|\]|,|;|:)/ },
    ],
    python: [
      { type: "comment", regex: /^(#.*?)(?=\n|$)/ },
      { type: "string", regex: /^('[^']*'|"[^"]*"|f'[^']*'|f"[^"]*")/ },
      {
        type: "keyword",
        regex:
          /^(import|from|def|return|if|elif|else|for|while|try|except|class|with|as|in|not|and|or|True|False|None|print)\b/,
      },
      { type: "function", regex: /^(requests|get|json|print|response)\b/ },
      { type: "number", regex: /^(\d+\.?\d*)/ },
      { type: "operator", regex: /^(\.|=|$$|$$|{|}|\[|\]|,|:)/ },
    ],
    php: [
      { type: "comment", regex: /^(\/\/.*?)(?=\n|$)/ },
      { type: "keyword", regex: /^(<\?php|\?>|true|false|null|CURLOPT_URL|CURLOPT_RETURNTRANSFER)\b/ },
      { type: "string", regex: /^('[^']*'|"[^"]*")/ },
      { type: "variable", regex: /^(\$\w+)/ },
      {
        type: "function",
        regex: /^(curl_init|curl_setopt|curl_exec|curl_close|json_decode|print_r|echo|file_get_contents)\b/,
      },
      { type: "number", regex: /^(\d+\.?\d*)/ },
      { type: "operator", regex: /^(\.|=|$$|$$|{|}|\[|\]|,|;|:)/ },
    ],
    curl: [
      { type: "comment", regex: /^(#.*?)(?=\n|$)/ },
      { type: "keyword", regex: /^(curl)\b/ },
      { type: "variable", regex: /^(\s-[A-Za-z]+)/ },
      { type: "string", regex: /^("[^"]*"|'[^']*')/ },
    ],
    json: [
      { type: "property", regex: /^("[^"]+")(\s*:)/ },
      { type: "string", regex: /^("[^"]*")/ },
      { type: "number", regex: /^(-?\d+\.?\d*)/ },
      { type: "keyword", regex: /^(true|false|null)\b/ },
      { type: "operator", regex: /^({|}|\[|\]|,|:)/ },
    ],
  }

  const langPatterns = patterns[language] || []

  while (remaining.length > 0) {
    let matched = false

    for (const pattern of langPatterns) {
      const match = remaining.match(pattern.regex)
      if (match) {
        // Handle JSON property special case (key + colon)
        if (language === "json" && pattern.type === "property" && match[1] && match[2]) {
          tokens.push({ type: "property", value: match[1] })
          tokens.push({ type: "text", value: match[2] })
          remaining = remaining.slice(match[0].length)
        } else {
          tokens.push({ type: pattern.type, value: match[0] })
          remaining = remaining.slice(match[0].length)
        }
        matched = true
        break
      }
    }

    if (!matched) {
      // Check for whitespace
      const wsMatch = remaining.match(/^(\s+)/)
      if (wsMatch) {
        tokens.push({ type: "text", value: wsMatch[0] })
        remaining = remaining.slice(wsMatch[0].length)
      } else {
        // Single character
        tokens.push({ type: "text", value: remaining[0] })
        remaining = remaining.slice(1)
      }
    }
  }

  return tokens
}
