import React from 'react'
import { Trash2 } from 'lucide-react'

export default function GymLogRow({ row, onChange, onDelete }) {
  return (
    <div className="group grid grid-cols-2 gap-2 items-center py-1 px-2 rounded hover:bg-white/5">
      <input
        type="text"
        value={row.exercise || ''}
        onChange={(e) => onChange({ ...row, exercise: e.target.value })}
        className="bg-transparent outline-none text-sm border-b border-white/20 focus:border-white/40 pb-0.5"
        placeholder="Exercise..."
      />
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={row.setsWeight || ''}
          onChange={(e) => onChange({ ...row, setsWeight: e.target.value })}
          className="flex-1 bg-transparent outline-none text-sm border-b border-white/20 focus:border-white/40 pb-0.5"
          placeholder="Sets / Weight..."
        />
        <button
          onClick={() => onDelete(row.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-red-400"
          title="Delete row"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
