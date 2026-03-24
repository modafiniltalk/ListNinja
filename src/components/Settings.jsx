import React, { useRef } from 'react'
import { X } from 'lucide-react'
import { exportJson, importJson } from '../utils/exportJson'

const THEMES = [
  { id: 'light', label: 'Light', description: 'Frosted white glass' },
  { id: 'medium', label: 'Medium', description: 'Smoked grey/blue glass' },
  { id: 'dark', label: 'Dark', description: 'Deep obsidian glass' },
]

export default function Settings({
  settings,
  lists,
  onUpdateSettings,
  onImport,
  onClose,
}) {
  const fileInputRef = useRef(null)

  const handleExport = () => {
    exportJson({ lists, settings })
  }

  const handleImportChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const data = await importJson(file)
      onImport(data)
    } catch {
      alert('Failed to import: invalid JSON file.')
    }
    e.target.value = ''
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="glass-panel p-6 w-80 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Theme selector */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2 opacity-70">Theme</p>
          <div className="flex flex-col gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() =>
                  onUpdateSettings({ ...settings, theme: theme.id })
                }
                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-sm ${
                  settings.theme === theme.id
                    ? 'border-white/60 bg-white/15 font-semibold'
                    : 'border-white/20 hover:bg-white/10'
                }`}
              >
                <span>{theme.label}</span>
                <span className="opacity-50 text-xs">{theme.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data management */}
        <div>
          <p className="text-sm font-medium mb-2 opacity-70">Data Management</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleExport}
              className="w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Export All Data (.json)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Import Data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
