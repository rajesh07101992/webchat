import firebase from 'firebase'

 const config = {
    apiKey: "AIzaSyBtEQxh46oYXf-O2wiwUzuLs_WGhINWiKA",
    authDomain: "webappchat-12faa.firebaseapp.com",
    databaseURL: "https://webappchat-12faa.firebaseio.com",
    projectId: "webappchat-12faa",
    storageBucket: "webappchat-12faa.appspot.com",
    messagingSenderId: "233988158606",
    appId: "1:233988158606:web:46e44345644771c5cac5df"
  };
firebase.initializeApp(config)
firebase.firestore().settings({
    timestampsInSnapshots: true
})

export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
