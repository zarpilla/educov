import firebase from 'firebase'
import 'firebase/firestore'
const config = require('./firebaseSecret.js')

firebase.initializeApp(config.config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
    //timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const boxesCollection = db.collection('boxes')
const downloadsCollection = db.collection('downloads')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')
const reviewsCollection = db.collection('reviews')
const notificationsCollection = db.collection('notifications')
const intentsCollection = db.collection('intents')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    postsCollection,
    boxesCollection,
    downloadsCollection,
    commentsCollection,
    likesCollection,
    reviewsCollection,
    notificationsCollection,
    intentsCollection
}
