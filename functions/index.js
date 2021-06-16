const axios = require('axios')
const cors = require('cors')({ origin: true })
const qrcode = require('qrcode')
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp()

const BaseUrl = 'https://us-central1-qr-payment-c672a.cloudfunctions.net'

exports.createInvoice = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        const db = admin.firestore()
        const invoice = await db.collection(`invoices`).add({
            products: request.body.products,
            amount: request.body.amount,
        })

        const invoiceRequest = await axios.post(`${ BaseUrl }/qrRequestToBank`, {
            invoiceId: invoice.id,
            amount: request.body.amount,
            shopUrl: `${ BaseUrl }/shopPaymentReceived?invoiceId=${ invoice.id }/`,
          })      

        const { qr } = invoiceRequest.data
            
        response.send({ 
            qr,
            invoiceId: invoice.id,
            amount: request.body.amount,
        })
    })
});

exports.qrRequestToBank = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        const db = admin.firestore()
        const bankInvoice = await db.collection(`bank_invoices`).add({
            shopInvoiceId: request.body.invoiceId,
            amount: request.body.amount,
            shopUrl: request.body.shopUrl
        })

        qrcode.toDataURL(`${ BaseUrl }/qrPaidBank?bankInvoiceId=${ bankInvoice.id }/`, (err, code) => {
            if(err) return console.log('error occurred')
            
            response.send({ 
                qr: code,
                bankInvoiceId: bankInvoice.id,
                amount: request.body.amount
            })
        })

    })
})

exports.qrPaidBank = functions.https.onRequest(async (request, response) => {       
    const db = admin.firestore()
    const { bankInvoiceId } = request.query

    await db.doc(`bank_invoices/${ bankInvoiceId }`).set({
        status: 'paid',
    },{
        merge: true,
    })
    
    const callbackUrl = await db.collection(`bank_invoices/${ bankInvoiceId}`).get()
    await axios.post(callbackUrl.data().shopUrl)
    
}) 

exports.shopPaymentReceived = functions.https.onRequest(async (request, response) => {       
    const db = admin.firestore()
    const { invoiceId } = request.query

    await db.doc(`invoices/${ invoiceId }`).set({
        status: 'paid',
    },{
        merge: true,
    })
    
}) 
