import React, { useState } from 'react'
import { List, CheckSquare } from 'lucide-react'
import ListItem from './ListItem'
import GymLogRow from './GymLogRow'
import DownloadButton from './DownloadButton'

export default function Workspace({ list, onUpdateList }) {
  const [editingTitle, setEditingTitle] = useState(false)

  if (!list) {
    return (
      <div className="flex-1 flex items-center justify-center opacity-40 text-sm">
        Select a list or create one to get started
      </div>
    )
  }

  const updateField = (field, value) => {
    onUpdateList({ ...list, [field]: value })
  }

  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      text: '',
      checked: false,
      url: '',
    }
    onUpdateList({ ...list, items: [...(list.items || []), newItem] })
  }

  const updateItem = (updatedItem) => {
    onUpdateList({
      ...list,
      items: (list.items || []).map((i) =>
        i.id === updatedItem.id ? updatedItem : i
      ),
    })
  }

  const deleteItem = (itemId) => {
    onUpdateList({
      ...list,
      items: (list.items || []).filter((i) => i.id !== itemId),
    })
  }

  const addRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      exercise: '',
      setsWeight: '',
      date: new Date().toLocaleDateString(),
      source: '',
    }
    onUpdateList({ ...list, rows: [...(list.rows || []), newRow] })
  }

  const updateRow = (updatedRow) => {
    onUpdateList({
      ...list,
      rows: (list.rows || []).map((r) =>
        r.id === updatedRow.id ? updatedRow : r
      ),
    })
  }

  const deleteRow = (rowId) => {
    onUpdateList({
      ...list,
      rows: (list.rows || []).filter((r) => r.id !== rowId),
    })
  }

  const copyAll = () => {
    const text = (list.items || []).map((i) => i.text).join('\n')
    navigator.clipboard.writeText(text).catch(() => {})
  }

  const toggleBulletMode = () => {
    onUpdateList({ ...list, bulletMode: !list.bulletMode })
  }

  const itemType = list.bulletMode ? 'bullet' : 'checkbox'

  return (
    <div className="flex-1 flex flex-col glass-panel min-h-0 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 flex-shrink-0">
        {editingTitle ? (
          <input
            autoFocus
            type="text"
            value={list.name}
            onChange={(e) => updateField('name', e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
            className="flex-1 bg-transparent outline-none text-lg font-semibold border-b border-white/40"
          />
        ) : (
          <h2
            className="flex-1 text-lg font-semibold cursor-pointer hover:opacity-80 truncate"
            onClick={() => setEditingTitle(true)}
            title="Click to edit title"
          >
            {list.name}
          </h2>
        )}

        {list.type !== 'blank' && list.type !== 'note' && list.type !== 'gym' && (
          <button
            onClick={toggleBulletMode}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title={list.bulletMode ? 'Switch to checkboxes' : 'Switch to bullets'}
          >
            {list.bulletMode ? <CheckSquare size={16} /> : <List size={16} />}
          </button>
        )}

        <DownloadButton list={list} />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        {list.type === 'blank' && (
          <textarea
            value={list.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            className="w-full h-full bg-transparent outline-none resize-none text-sm leading-relaxed"
            placeholder="Start typing..."
          />
        )}

        {list.type === 'note' && (
          <textarea
            value={list.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            className="w-full h-full bg-transparent outline-none resize-none text-sm note-paper"
            placeholder="Write your note..."
          />
        )}

        {list.type === 'todo' && (
          <div className="flex flex-col gap-1">
            {(list.items || []).map((item) => (
              <ListItem
                key={item.id}
                item={item}
                type={itemType}
                onChange={updateItem}
                onDelete={deleteItem}
              />
            ))}
            <button
              onClick={addItem}
              className="mt-2 text-sm opacity-60 hover:opacity-100 text-left px-2 py-1 hover:bg-white/5 rounded"
            >
              + Add Item
            </button>
          </div>
        )}

        {list.type === 'clipboard' && (
          <div className="flex flex-col gap-1">
            {(list.items || []).map((item) => (
              <ListItem
                key={item.id}
                item={item}
                type="bullet"
                onChange={updateItem}
                onDelete={deleteItem}
              />
            ))}
            <div className="flex gap-2 mt-2">
              <button
                onClick={addItem}
                className="text-sm opacity-60 hover:opacity-100 px-2 py-1 hover:bg-white/5 rounded"
              >
                + Add Item
              </button>
              <button
                onClick={copyAll}
                className="text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                Copy All
              </button>
            </div>
          </div>
        )}

        {list.type === 'gym' && (
          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-2 px-2 pb-1 mb-1 border-b border-white/20 text-xs font-semibold opacity-60">
              <span>Exercise</span>
              <span>Sets / Weight</span>
            </div>
            {(list.rows || []).map((row) => (
              <GymLogRow
                key={row.id}
                row={row}
                onChange={updateRow}
                onDelete={deleteRow}
              />
            ))}
            <button
              onClick={addRow}
              className="mt-2 text-sm opacity-60 hover:opacity-100 text-left px-2 py-1 hover:bg-white/5 rounded"
            >
              + Add Row
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
