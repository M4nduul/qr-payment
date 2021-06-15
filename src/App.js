import { firestore } from './firebase'
import axios from 'axios'
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
// import Shop from './components/Shop'

const BaseUrl = 'https://us-central1-qr-payment-c672a.cloudfunctions.net'

function App() {
  const [qrImg, setQrImg] = useState();
  const [isPaid, setIsPaid] = useState(false);

  const onButtonClicked = async () => {
    const response = await axios.post(`${BaseUrl}/create_invoice`, {
      price: 5000,
    })

    const { qr, invoiceId } = response.data;

    setQrImg(qr)


    firestore.doc(`invoices/${invoiceId}`).onSnapshot((doc) => {
      if (doc.data().status === 'paid') {
        setIsPaid(true)
      }
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        {
          isPaid ? (
            <h2>Order successfully paid!</h2>
          ) : (
            <img src={qrImg ? qrImg : logo} className="App-logo" alt="logo" />
          )
        }

        <button onClick={onButtonClicked}>Payment</button>
      </header>
    </div>
  );
}

export default App;
