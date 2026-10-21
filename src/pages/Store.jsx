import { useState } from 'react'
import { formatWhen, getProduct, products, rm } from '../data'
import { useApp } from '../context'
import { Icon } from '../components/Icons'
import { TopBar } from '../components/TopBar'
import Sheet from '../components/Sheet'

export default function Store() {
  const { cart, orders, addToCart, changeQty, checkoutCart } = useApp()
  const [active, setActive] = useState(null)
  const [bag, setBag] = useState(false)
  const count = cart.reduce((sum, item) => sum + item.qty, 0)
  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.productId)
    return sum + (product ? product.price * item.qty : 0)
  }, 0)

  return (
    <div className="page">
      <TopBar title="Store">
        <button type="button" className="icon-btn bell-wrap" aria-label="Shopping bag" onClick={() => setBag(true)}>
          <Icon name="cart" />
          {count > 0 && <span className="count">{count}</span>}
        </button>
      </TopBar>
      <p className="lede">Tour merch and show-day essentials.</p>
      <div className="grid">
        {products.map((product) => (
          <article key={product.id} className="product">
            <button type="button" className="product-open" onClick={() => setActive(product)}>
              <img src={product.image} alt="" />
              <span className="meta">
                <span className="tag">{product.tag}</span>
                <strong>{product.name}</strong>
              </span>
            </button>
            <div className="buyline">
              <span>{rm(product.price)}</span>
              <button
                type="button"
                className="add"
                aria-label={`Add ${product.name} to bag`}
                onClick={() => addToCart(product.id)}
              >
                +
              </button>
            </div>
          </article>
        ))}
      </div>

      {orders.length > 0 && (
        <section className="pad orders">
          <h2>Your orders</h2>
          {orders.map((order) => (
            <div key={order.id} className="order">
              <strong>{order.id}</strong>
              <span>
                {formatWhen(order.at)} · {order.items.reduce((sum, item) => sum + item.qty, 0)} items
              </span>
            </div>
          ))}
        </section>
      )}

      {active && (
        <Sheet title={active.name} onClose={() => setActive(null)}>
          <img className="sheet-photo" src={active.image} alt="" />
          <p className="sheet-lead">{active.blurb}</p>
          <p className="code">{rm(active.price)}</p>
          <button
            type="button"
            className="btn block"
            onClick={() => {
              addToCart(active.id)
              setActive(null)
              setBag(true)
            }}
          >
            Add to bag
          </button>
        </Sheet>
      )}

      {bag && (
        <Sheet title="Bag" onClose={() => setBag(false)}>
          {cart.length === 0 && <p className="hint">Your bag is empty.</p>}
          {cart.map((item) => {
            const product = getProduct(item.productId)
            if (!product) return null
            return (
              <div key={item.productId} className="bag-row">
                <img src={product.image} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <span>{rm(product.price)}</span>
                </div>
                <div className="stepper">
                  <button type="button" aria-label="Decrease" onClick={() => changeQty(item.productId, item.qty - 1)}>
                    −
                  </button>
                  <strong>{item.qty}</strong>
                  <button
                    type="button"
                    aria-label="Increase"
                    onClick={() => changeQty(item.productId, Math.min(8, item.qty + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
          <div className="bag-total">
            <span>Total</span>
            <strong>{rm(total)}</strong>
          </div>
          <button
            type="button"
            className="btn block"
            disabled={!cart.length}
            onClick={() => {
              checkoutCart()
              setBag(false)
            }}
          >
            Place order
          </button>
          <p className="hint">Demo checkout. Nothing is charged.</p>
        </Sheet>
      )}
    </div>
  )
}
