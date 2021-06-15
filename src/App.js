import { firestore } from './firebase'
import axios from 'axios'
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [qrImg, setQrImg] = useState();

  const onButtonClicked = async () => {
    const { qr, invoiceId } = await axios.post('https://us-central1-qr-payment-demo-6a1fe.cloudfunctions.net/create_invoice', {
      price: 5000,
    }).data

    setQrImg(qr)

    firestore.doc(`invoice/${invoiceId}`).onSnapshot((doc) => {
      console.log(doc);
    })

  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={qrImg ? qrImg : logo} className="App-logo" alt="logo" />
        <button onClick={onButtonClicked}>Payment</button>
      </header>
    </div>
  );
}

export default App;
