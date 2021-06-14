import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCFxEK9wCebFHtLyQAooMZ1mNd7oF9E2OQ",
    authDomain: "qr-payment-c672a.firebaseapp.com",
    projectId: "qr-payment-c672a",
    storageBucket: "qr-payment-c672a.appspot.com",
    messagingSenderId: "716926444881",
    appId: "1:716926444881:web:ab5bd860e5692594c8df70"
};

firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore()
export default firebase;