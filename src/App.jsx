import React, { useReducer, useState } from 'react'
import emptyCart from './assets/images/illustration-empty-cart.svg'
import removeIcon from './assets/images/icon-remove-item.svg'
import carbonNeutral from './assets/images/icon-carbon-neutral.svg'
import addCart from './assets/images/icon-add-to-cart.svg'
import data from './data'
import ConfirmationModal from './components/ConfirmationModal'

const initialState = {
  cart: [],
  totalItem: 0
}

const reducer = (state,action)=>{
  switch (action.type) {
    case 'AddToCart':
        return {...state,totalItem:state.totalItem + 1,cart:[{...action.payload,quantity:1},...state.cart]};  
    case 'IncreaseQuantity':
        const cartWithIncreaseQuantity = state?.cart?.map((item)=>item?.id === action.payload ? {...item,quantity:item.quantity + 1} : item)
        return {...state,totalItem:state.totalItem + 1,cart:cartWithIncreaseQuantity};
    case 'DecreaseQuantity':
      console.log(state?.cart?.find((item)=>item?.id === action.payload))
        if (state?.cart?.find((item)=>item?.id === action.payload)?.quantity <= 1) {
          const cartWithDefaultQuantity = state?.cart?.map((item)=>item?.id === action.payload ? {...item,quantity: 1} : item)
        return {...state,cart:cartWithDefaultQuantity};
        } else {
          const cartWithDecreaseQuantity = state?.cart?.map((item)=>item?.id === action.payload ? {...item,quantity:item.quantity - 1} : item)
        return {...state,totalItem:state.totalItem - 1,cart:cartWithDecreaseQuantity};
        }
    case 'RemoveFromCart':
      const cartWithoutItem = state?.cart.filter((item)=>item?.id !== action.payload)
      return {...state,totalItem: state.totalItem - state?.cart?.find((item)=>item?.id === action.payload)?.quantity,cart: cartWithoutItem};
    case 'ResetCart':
      return {...state,cart: [],totalItem: 0}
    default:
      break;
  }
}

const App = () => {
  const [updatingState,dispatch] = useReducer(reducer,initialState)
  const [onHover,setOnHover] = useState(0)
  const [showModal,setShowModal] = useState(false)
  return (
    <>
      <div className='app'>
      <div className="app-firstlayer">
        <h2>Desserts</h2>
        <div className="app-cardHolder">
          {
            data?.map((item,index)=>(
              <div className="app-cardHolderMain" key={index} onMouseEnter={()=>setOnHover(item?.id)} onMouseLeave={()=>setOnHover(0)}>
            <nav>
              <img src={item?.image?.thumbnail} />
              {
                onHover === item?.id ? <>
                {
                  updatingState?.cart?.find((items)=>items.id === item.id) ?
                  <section>
                  <div className="app-buttonHolder">
                    <div onClick={()=>dispatch({type:'DecreaseQuantity',payload:item?.id})}>-</div>
                    <p>{updatingState?.cart?.find((items)=>items.id === item.id)?.quantity}</p>
                    <div onClick={()=>dispatch({type:'IncreaseQuantity',payload:item?.id})}>+</div>
                  </div>
                </section>
                  :
                  <aside>
                  <div>
                    <img src={addCart} />
                  </div>
                  <p onClick={()=>dispatch({type:'AddToCart',payload:item})}>Add to Cart</p>
                </aside>
                }
                </> : null
              }
              
            </nav>
            <article>
              <h6>{item?.category}</h6>
              <h5>{item?.name}</h5>
              <h4>$ {item?.price}</h4>
            </article>
          </div>
            ))
          }
        </div>
      </div>
      <div className="app-secondLayer">
        {
          updatingState?.cart?.length <= 0 ? 
          <div className="app-emptyCart">
          <h3>Your Cart (0)</h3>
          <nav>
            <img src={emptyCart} alt="" />
          </nav>
          <p>Your added items will appear here</p>
        </div> : 
        <div className="app-cartItems">
        <h3>Your Cart ({updatingState?.totalItem})</h3>
        <main>
          {
            updatingState?.cart.map((item,index)=>(
              <article key={index}>
            <section>
              <h4>{item?.name}</h4>
              <nav>
                <h5>{item?.quantity}x</h5>
                <p>@ ${item?.price} <span>${item?.quantity * item?.price}</span></p>
              </nav>
            </section>
            <aside onClick={()=>dispatch({type:'RemoveFromCart',payload:item?.id})}>
              <img src={removeIcon} alt="" />
            </aside>
          </article>
            ))
          }
        </main>
        <div className="app-orderTotal">
          <p>Order Total</p>
          <h6>${updatingState?.cart?.reduce((acc,item)=>{
            acc += item.quantity * item.price
            return acc
          },0)}</h6>
        </div>
        <div className="app-carbonNeutral">
          <div>
            <img src={carbonNeutral} />
          </div>
          <p>This is a <span>carbon-neutral</span> delivery</p>
        </div>
        <button onClick={()=>setShowModal(true)}>Confirm Order</button>
      </div>
        }
        
      </div>
    </div>
        {
          showModal && <ConfirmationModal cart={updatingState?.cart} dispatch={dispatch} setShowModal={setShowModal} />
        }
    </>
  )
}

export default App
