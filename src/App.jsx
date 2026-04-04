import React, { useState, useEffect, useMemo } from 'react'
import Cart from './Cart.jsx'

export default function App() {
  const defaultItems = [
    { id: 1, name: 'House Espresso', price: 99 },
    { id: 2, name: 'Cortado', price: 129 },
    { id: 3, name: 'Pour Over', price: 149 },
    { id: 4, name: 'Butter Croissant', price: 269 },
    { id: 5, name: 'Avocado Toast', price: 239 },
    { id: 6, name: 'Cardamom Latte', price: 429 }
  ]

  const [items] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cafe-items')) || defaultItems } catch { return defaultItems }
  })

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cafe-cart')) || {} } catch { return {} }
  })
  const [delivery, setDelivery] = useState(() => localStorage.getItem('cafe-delivery') || 'pickup')
  const [address, setAddress] = useState(() => localStorage.getItem('cafe-address') || '')

  useEffect(() => { localStorage.setItem('cafe-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('cafe-delivery', delivery) }, [delivery])
  useEffect(() => { localStorage.setItem('cafe-address', address) }, [address])
  const [isStudent, setIsStudent] = useState(() => (localStorage.getItem('cafe-student') === '1') || false)
  const [studentId, setStudentId] = useState(() => localStorage.getItem('cafe-student-id') || '')
  useEffect(() => { localStorage.setItem('cafe-student', isStudent ? '1' : '0') }, [isStudent])
  useEffect(() => { localStorage.setItem('cafe-student-id', studentId) }, [studentId])

  function addToCart(item) {
    setCart(prev => {
      const next = { ...prev }
      if (next[item.id]) next[item.id].qty += 1
      else next[item.id] = { id: item.id, name: item.name, price: item.price, qty: 1 }
      return next
    })
  }

  function removeFromCart(id) {
    setCart(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function changeQty(id, qty) {
    setCart(prev => {
      const next = { ...prev }
      if (!next[id]) return prev
      next[id].qty = Math.max(1, qty)
      return next
    })
  }

  function clearCart() { setCart({}) }

  const subtotal = useMemo(() => Object.values(cart).reduce((s, it) => s + it.qty * it.price, 0), [cart])
  const deliveryFee = delivery === 'delivery' && subtotal > 0 ? 49 : 0

  function isValidStudentId(id){
    if (!id) return false
    return /^[A-Za-z0-9-]{4,}$/.test(id.trim())
  }

  const studentIdValid = isValidStudentId(studentId)
  const discount = (isStudent && studentIdValid) ? Math.round(subtotal * 0.10) : 0
  const total = subtotal - discount + deliveryFee

  return (
    <div className="app layout">
      <main className="catalog">
        <h1>Cafe Menu</h1>
        <div className="menu-grid" style={{marginTop:12}}>
          {items.map(it => (
            <article className="card" key={it.id}>
              <h3>{it.name}</h3>
              <div style={{marginTop:6, color:'#6b5a4a'}}>{/* description placeholder */}</div>
              <div style={{marginTop:'auto',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                <div style={{fontWeight:700,color:'var(--terracotta)'}}>₹{it.price}</div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={() => addToCart(it)} style={{padding:'6px 10px',borderRadius:8,background:'var(--accent)',color:'#fff',border:'none'}}>Add to cart</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Cart
        cart={cart}
        onRemove={removeFromCart}
        onQtyChange={changeQty}
        delivery={delivery}
        setDelivery={setDelivery}
        address={address}
        setAddress={setAddress}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        studentDiscount={isStudent}
        setStudentDiscount={setIsStudent}
        studentId={studentId}
        setStudentId={setStudentId}
        discount={discount}
        clearCart={clearCart}
      />
    </div>
  )
}
