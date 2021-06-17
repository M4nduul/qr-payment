import { firestore } from './firebase'
import axios from 'axios'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

const BaseUrl = 'https://us-central1-qr-payment-c672a.cloudfunctions.net'

const BankFront = () => {

    const response = await axios.post(`${ BaseUrl }/qrPaidBank?bankInvoiceId`, {})
    
    
    return (
        <div>
            successfully paid
        </div>
    )
}

export default BankFront;