export function exportTxt(list) {
  const lines = []

  if (list.type === 'todo') {
    ;(list.items || []).forEach((item) => {
      lines.push(item.checked ? `[x] ${item.text}` : `[ ] ${item.text}`)
    })
  } else if (list.type === 'blank' || list.type === 'note') {
    lines.push(list.content || '')
  } else {
    ;(list.items || []).forEach((item) => {
      lines.push(item.text || '')
    })
  }

  // Append source URLs as footnotes
  const items = list.items || []
  const urls = [...new Set(items.filter((i) => i.url).map((i) => i.url))]
  if (urls.length > 0) {
    lines.push('')
    lines.push('--- Sources ---')
    urls.forEach((url) => lines.push(url))
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${list.name || 'list'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
