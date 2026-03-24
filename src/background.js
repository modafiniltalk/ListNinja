// background.js — ListNinja Service Worker

function buildContextMenu(lists) {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'listninja-root',
      title: 'Save to ListNinja',
      contexts: ['selection'],
    })

    if (Array.isArray(lists)) {
      lists.forEach((list) => {
        chrome.contextMenus.create({
          id: `list-${list.id}`,
          parentId: 'listninja-root',
          title: list.name,
          contexts: ['selection'],
        })
      })
    }

    chrome.contextMenus.create({
      id: 'create-new',
      parentId: 'listninja-root',
      title: '➕ Create New List',
      contexts: ['selection'],
    })
  })
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('lists', (result) => {
    buildContextMenu(result.lists || [])
  })
})

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.lists) {
    buildContextMenu(changes.lists.newValue || [])
  }
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'create-new') {
    chrome.storage.local.set(
      {
        pendingCapture: {
          selectionText: info.selectionText,
          pageUrl: tab.url,
          pageTitle: tab.title,
          timestamp: Date.now(),
        },
      },
      () => {
        chrome.action.openPopup()
      }
    )
    return
  }

  if (info.menuItemId.startsWith('list-')) {
    const listId = info.menuItemId.replace('list-', '')
    chrome.storage.local.get('lists', (result) => {
      const lists = result.lists || []
      const idx = lists.findIndex((l) => l.id === listId)
      if (idx === -1) return

      const list = lists[idx]
      const newItem = {
        id: crypto.randomUUID(),
        text: info.selectionText,
        checked: false,
        url: tab.url,
        title: tab.title,
        timestamp: Date.now(),
      }

      const updatedList = {
        ...list,
        items: [...(list.items || []), newItem],
      }

      const updatedLists = [...lists]
      updatedLists[idx] = updatedList

      chrome.storage.local.set({ lists: updatedLists })
    })
  }
})
