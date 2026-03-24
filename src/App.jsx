import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Workspace from './components/Workspace'
import Settings from './components/Settings'
import { useStorage } from './hooks/useStorage'
import { LIST_TYPES, LIST_TYPE_META } from './utils/listTypes'

const LIST_TYPE_KEYS = Object.values(LIST_TYPES)

function NewListModal({ pendingText, onConfirm, onCancel }) {
  const [name, setName] = useState('')
  const [type, setType] = useState(LIST_TYPES.BLANK)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onConfirm({ name: name.trim(), type, initialText: pendingText })
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="glass-panel p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">Create New List</h2>
        {pendingText && (
          <div className="mb-3 p-2 rounded bg-white/10 text-xs opacity-80">
            <p className="font-medium mb-1">Captured text:</p>
            <p className="truncate">{pendingText}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="List name..."
            className="bg-white/10 outline-none rounded-lg px-3 py-2 text-sm border border-white/20 focus:border-white/40"
          />
          <div className="grid grid-cols-3 gap-1">
            {LIST_TYPE_KEYS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-2 py-1.5 rounded-lg text-xs transition-colors border ${
                  type === t
                    ? 'border-white/60 bg-white/20 font-semibold'
                    : 'border-white/20 hover:bg-white/10'
                }`}
              >
                {LIST_TYPE_META[t].label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-3 py-2 rounded-lg bg-blue-500/40 hover:bg-blue-500/60 text-sm transition-colors disabled:opacity-40"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [lists, setLists] = useStorage('lists', [], 'local')
  const [settings, setSettings] = useStorage('settings', { theme: 'medium' }, 'sync')
  const [activeListId, setActiveListId] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNewListModal, setShowNewListModal] = useState(false)
  const [pendingCaptureText, setPendingCaptureText] = useState(null)

  // Check for pending capture on mount
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) return

    chrome.storage.local.get('pendingCapture', (result) => {
      if (result.pendingCapture) {
        setPendingCaptureText(result.pendingCapture.selectionText || '')
        setShowNewListModal(true)
        chrome.storage.local.remove('pendingCapture')
      }
    })
  }, [])

  const activeList = lists.find((l) => l.id === activeListId) || null

  const createList = ({ name, type, initialText }) => {
    const meta = LIST_TYPE_META[type]
    const newList = {
      id: crypto.randomUUID(),
      name,
      type,
      iconName: meta.icon,
      content: '',
      items: [],
      rows: [],
      bulletMode: false,
      createdAt: Date.now(),
    }

    if (initialText) {
      if (type === LIST_TYPES.BLANK || type === LIST_TYPES.NOTE) {
        newList.content = initialText
      } else if (type === LIST_TYPES.GYM) {
        newList.rows = [
          {
            id: crypto.randomUUID(),
            exercise: initialText,
            setsWeight: '',
            date: new Date().toLocaleDateString(),
            source: '',
          },
        ]
      } else {
        newList.items = [
          {
            id: crypto.randomUUID(),
            text: initialText,
            checked: false,
            url: '',
          },
        ]
      }
    }

    const updatedLists = [...lists, newList]
    setLists(updatedLists)
    setActiveListId(newList.id)
  }

  const updateList = (updatedList) => {
    setLists(lists.map((l) => (l.id === updatedList.id ? updatedList : l)))
  }

  const handleImport = (data) => {
    if (data.lists) setLists(data.lists)
    if (data.settings) setSettings(data.settings)
    setShowSettings(false)
  }

  const handleNewListConfirm = ({ name, type, initialText }) => {
    createList({ name, type, initialText })
    setShowNewListModal(false)
    setPendingCaptureText(null)
  }

  const handleNewListCancel = () => {
    setShowNewListModal(false)
    setPendingCaptureText(null)
  }

  return (
    <div className={`theme-${settings.theme} h-full flex relative overflow-hidden`}>
      <Sidebar
        lists={lists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onCreateList={() => setShowNewListModal(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      <div className="flex-1 flex flex-col min-w-0 p-2">
        <Workspace list={activeList} onUpdateList={updateList} />
      </div>

      {/* Settings gear button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-2 right-2 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
        title="Settings"
      >
        <SettingsIcon size={16} />
      </button>

      {/* Modals */}
      {showSettings && (
        <Settings
          settings={settings}
          lists={lists}
          onUpdateSettings={setSettings}
          onImport={handleImport}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showNewListModal && (
        <NewListModal
          pendingText={pendingCaptureText}
          onConfirm={handleNewListConfirm}
          onCancel={handleNewListCancel}
        />
      )}
    </div>
  )
}
