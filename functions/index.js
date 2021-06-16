const axios = require('axios')
const cors = require('cors')({ origin: true })
const qrcode = require('qrcode')
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp()

const BaseUrl = 'https://us-central1-qr-payment-c672a.cloudfunctions.net'

exports.create_invoice = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        const db = admin.firestore()
        const invoice = await db.collection(`invoices`).add({
            name: 'some name',
        })

        // qr axios postoor uusgeh
        qrcode.toDataURL(`${BaseUrl}/qr_generate?invoiceId=${invoice.id}/`, (err, code) => {
            if (err) return console.log('error occurred')

            response.send({
                qr: code,
                invoiceId: invoice.id,
            })
        })
    })

});

exports.qr_generate = functions.https.onRequest(async (request, response) => {
    const db = admin.firestore()
    const { invoiceId } = request.query

    await db.doc(`invoices/${invoiceId}`).set({
        status: 'paid',
    }, {
        merge: true,
    })

})

