import React from 'react'

export default function Cart({ cart, onRemove, onQtyChange, delivery, setDelivery, address, setAddress, subtotal, deliveryFee, total, clearCart, studentDiscount, setStudentDiscount, studentId, setStudentId, discount }){
  const items = Object.values(cart)

  return (
    <aside className="cart-panel">
      <h2>Your Order</h2>
      {items.length === 0 ? (
        <div className="empty">Your cart is empty.</div>
      ) : (
        <div className="cart-list">
          {items.map(it => (
            <div className="cart-item" key={it.id}>
              <div className="meta">
                <div className="name">{it.name}</div>
                <div className="price">₹{it.price}</div>
              </div>
              <div className="controls">
                <input type="number" min="1" value={it.qty} onChange={e=>onQtyChange(it.id, Number(e.target.value)||1)} />
                <button className="remove" onClick={()=>onRemove(it.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="delivery">
        <label><input type="radio" name="delivery" checked={delivery==='pickup'} onChange={()=>setDelivery('pickup')} /> Pickup</label>
        <label style={{marginLeft:12}}><input type="radio" name="delivery" checked={delivery==='delivery'} onChange={()=>setDelivery('delivery')} /> Delivery</label>
        {delivery==='delivery' && (
          <input className="address" placeholder="Delivery address" value={address} onChange={e=>setAddress(e.target.value)} />
        )}
      </div>

      <div className="student" style={{marginTop:12}}>
        <label>
          <input type="checkbox" checked={!!studentDiscount} onChange={e=>setStudentDiscount(e.target.checked)} /> Student discount (10%)
        </label>
        {studentDiscount && (
          <input className="student-id" placeholder="Student ID (optional)" value={studentId} onChange={e=>setStudentId(e.target.value)} style={{marginLeft:12}} />
        )}
      </div>

      <div className="summary">
        <div className="row"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="row"><span>Delivery</span><span>₹{deliveryFee}</span></div>
        {discount > 0 && <div className="row"><span>Student Discount</span><span>-₹{discount}</span></div>}
        <div className="row total"><strong>Total</strong><strong>₹{total}</strong></div>
      </div>

      <div style={{display:'flex',gap:8,marginTop:12}}>
        <button className="checkout" disabled={items.length===0}>Place Order</button>
        <button className="clear" onClick={clearCart} disabled={items.length===0}>Clear</button>
      </div>
    </aside>
  )
}
