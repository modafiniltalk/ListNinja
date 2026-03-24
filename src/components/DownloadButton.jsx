import React from 'react'
import { Download } from 'lucide-react'
import { exportTxt } from '../utils/exportTxt'
import { exportCsv } from '../utils/exportCsv'

export default function DownloadButton({ list }) {
  const isGym = list.type === 'gym'

  const handleClick = () => {
    if (isGym) {
      exportCsv(list)
    } else {
      exportTxt(list)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
      title={isGym ? 'Download .csv' : 'Download .txt'}
    >
      <Download size={14} />
      <span>{isGym ? '.csv' : '.txt'}</span>
    </button>
  )
}
