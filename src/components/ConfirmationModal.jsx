import React from 'react'
import '../styles/confirmationModal.css'
import markGood from '../assets/images/icon-order-confirmed.svg'

const ConfirmationModal = ({cart,dispatch,setShowModal}) => {
  return (
    <div className='confirmationModal'>
      <div className="confirmationModal-holder">
        <aside>
            <img src={markGood} />
        </aside>
        <h4>Order Confirmed</h4>
        <p>We hope you enjoy your food!</p>
        <main>
            {
                cart?.map((item,index)=>(
            <article key={index}>
                <div>
                    <img src={item?.image?.thumbnail} />
                </div>
                <nav>
                    <h6>{item?.name}</h6>
                    <section>{item?.quantity}x <span>@ ${item?.price}</span></section>
                </nav>
                <h5>${item?.quantity * item?.price}</h5>
            </article>
                ))
            }
        </main>
        <div className="modal-orderTotal">
            <h6>Order Total</h6>
            <h5>${cart?.reduce((acc,item)=>{
            acc += item.quantity * item.price
            return acc
          },0)}</h5>
        </div>
        <button onClick={()=>{dispatch({type:'ResetCart'}),setShowModal(false)}}>Start New Order</button>
      </div>
    </div>
  )
}

export default ConfirmationModal
