import React from 'react'
import { Trash2 } from 'lucide-react'

export default function ListItem({ item, type, onChange, onDelete }) {
  return (
    <div className="group flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5">
      {type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={!!item.checked}
          onChange={(e) => onChange({ ...item, checked: e.target.checked })}
          className="flex-shrink-0 w-4 h-4 accent-blue-400 cursor-pointer"
        />
      ) : (
        <span className="flex-shrink-0 text-current opacity-60">•</span>
      )}

      <input
        type="text"
        value={item.text || ''}
        onChange={(e) => onChange({ ...item, text: e.target.value })}
        className={`flex-1 bg-transparent outline-none text-sm ${
          type === 'checkbox' && item.checked ? 'line-through opacity-50' : ''
        }`}
        placeholder="Item text..."
      />

      <button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-red-400"
        title="Delete item"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
