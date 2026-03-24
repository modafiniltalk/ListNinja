import { useState, useEffect } from 'react'

export function useStorage(key, defaultValue, area = 'local') {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return
    }

    chrome.storage[area].get(key, (result) => {
      if (result[key] !== undefined) {
        setValue(result[key])
      }
    })

    const listener = (changes, changedArea) => {
      if (changedArea === area && changes[key] !== undefined) {
        setValue(changes[key].newValue)
      }
    }

    chrome.storage.onChanged.addListener(listener)
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, [key, area])

  const setStoredValue = (newValue) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage[area].set({ [key]: newValue })
    }
    setValue(newValue)
  }

  return [value, setStoredValue]
}
