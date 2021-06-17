import { firestore } from './firebase'
import axios from 'axios'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import './App.css';
import { useState } from 'react';

const BaseUrl = 'https://us-central1-qr-payment-c672a.cloudfunctions.net'

function App() {
  const [qrImg, setQrImg] = useState()
  const [isPaid, setIsPaid] = useState(false)
  const [totalAmount, setTotalAmount] = useState(50000)
  const [products, setProducts] = useState({ apple: 1000, milk: 4000, })

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
              <p>QR PAYMENT</p>
            )
          )
        }
        <a href='#' onClick={onButtonClicked} className="waves-effect waves-light btn-large">Click to pay</a>
      </header>
    </div>
  );
}

export default App;
