function sanitize(value) {
  return String(value || '').replace(/,/g, ';')
}

export function exportCsv(list) {
  const rows = list.rows || []
  const lines = ['Date,Exercise,Sets/Weight,Source']

  rows.forEach((row) => {
    const date = sanitize(row.date || new Date().toLocaleDateString())
    const exercise = sanitize(row.exercise)
    const setsWeight = sanitize(row.setsWeight)
    const source = sanitize(row.source)
    lines.push(`${date},${exercise},${setsWeight},${source}`)
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${list.name || 'gym-log'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
