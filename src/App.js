import { firestore } from './firebase'
import axios from 'axios'
import logo from './logo.svg';
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import './App.css';
import { useState } from 'react';

const BaseUrl = 'https://us-central1-qr-payment-c672a.cloudfunctions.net'

function App() {
  const [qrImg, setQrImg] = useState()
  const [isPaid, setIsPaid] = useState(false)
  const [totalAmount, setTotalAmount] = useState(5000)
  const [products, setProducts] = useState({ apple: 1000, milk: 4000, })
  // const [isLoading, setIsLoading] = useState(true)

  const onButtonClicked = async () => {
    // setIsLoading(true)
    const response = await axios.post(`${BaseUrl}/createInvoice`, {
      products: products,
      amount: totalAmount,
    })

    console.log(response);
    const { qr, invoiceId } = response.data;

    setQrImg(qr)

    firestore.doc(`invoices/${invoiceId}`).onSnapshot((doc) => {
      if (doc.data().status === 'paid') {
        setIsPaid(true)
      }
    })
  }

  return (
    <div className="App container">
      <header className="App-header">

        {
          isPaid ? (
            <h2>Order successfully paid!</h2>
          ) : (
            qrImg ? (
              <img src={qrImg} className="App-logo" alt="logo" />
            ) : (
              <div class="row" >
                {/* <div class="input-field col s12">
                  <textarea id="textarea1" class="materialize-textarea"></textarea>
                  <textarea id="textarea1" class="materialize-textarea"></textarea>
                </div> */}
                <input className='white-text materialize-textarea'></input>
                <input className='white-text materialize-textarea'></input>
              </div>
            )
          )
        }
        <a onClick={onButtonClicked} className="waves-effect waves-light light-blue accent-2 btn-large">Qpay</a>
      </header > s
    </div >
  );
}

export default App;
