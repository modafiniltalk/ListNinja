import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  CheckSquare,
  Clipboard,
  BookOpen,
  Dumbbell,
} from 'lucide-react'

const ICON_MAP = {
  FileText,
  CheckSquare,
  Clipboard,
  BookOpen,
  Dumbbell,
}

function ListTypeIcon({ iconName, size = 16 }) {
  const Icon = ICON_MAP[iconName] || FileText
  return <Icon size={size} />
}

export default function Sidebar({
  lists,
  activeListId,
  onSelectList,
  onCreateList,
  collapsed,
  onToggleCollapse,
}) {
  return (
    <div
      className={`flex flex-col glass-panel transition-all duration-300 ${
        collapsed ? 'w-12' : 'w-56'
      } min-h-0 h-full`}
      style={{ flexShrink: 0 }}
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-end p-2">
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* List buttons */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {lists.map((list) => {
          const isActive = list.id === activeListId
          return (
            <button
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-white/10 ${
                isActive ? 'bg-white/20 font-semibold' : ''
              }`}
              title={list.name}
            >
              <span className="flex-shrink-0">
                <ListTypeIcon iconName={list.iconName} />
              </span>
              {!collapsed && (
                <span className="truncate text-sm">{list.name}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* New List button */}
      <div className="p-2">
        <button
          onClick={onCreateList}
          className="w-full flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
          title="New List"
        >
          <Plus size={16} />
          {!collapsed && <span>New List</span>}
        </button>
      </div>
    </div>
  )
}
