import React, { useState, useEffect } from 'react'

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cafe-items')) || [
        { id: 1, name: 'Espresso' },
        { id: 2, name: 'Cappuccino' }
      ]
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')

  useEffect(() => {
    localStorage.setItem('cafe-items', JSON.stringify(items))
  }, [items])

  function addItem(e) {
    e.preventDefault()
    const name = text.trim()
    if (!name) return
    setItems(prev => [...prev, { id: Date.now(), name }])
    setText('')
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="app">
      <h1>Cafe Menu</h1>
      <form onSubmit={addItem} className="form">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add menu item"
          aria-label="New menu item"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="list">
        {items.map(it => (
          <li key={it.id} className="item">
            <span>{it.name}</span>
            <button onClick={() => removeItem(it.id)} className="remove">Remove</button>
          </li>
        ))}
      </ul>
      <p>Total items: {items.length}</p>
    </div>
  )
}
