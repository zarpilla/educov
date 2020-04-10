import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {    
    if (user) {
        store.commit('setCurrentUser', user)
        store.dispatch('fetchUserProfile')

        fb.usersCollection.doc(user.uid).onSnapshot(doc => {
            if (doc.exists) {
                store.dispatch('fetchUserProfile')
                store.commit('setUserProfile', doc.data())
                store.dispatch('fetchBoxes')
                store.dispatch('fetchUserBoxes')
                store.dispatch('fetchUserIntents')                
                store.dispatch('fetchDownloadedBoxes')
                //store.dispatch('fetchNotifications')
            }
        })

    }
    else {
        store.dispatch('fetchBoxes')
    }
})

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        posts: [],
        hiddenPosts: [],
        boxes: [],
        userBoxes: [],
        userIntents: [],
        downloadedBoxes: [],
        notifications: [],
        boxesContent: []
    },
    actions: {
        clearData({ commit }) {
            commit('setCurrentUser', null)
            commit('setUserProfile', {})
            commit('setPosts', null)
            commit('setHiddenPosts', null)
            commit('setBoxes', null)
            commit('setUserBoxes', null)
            commit('setDownloadedBoxes', null)
            commit('setNotifications', null)
            commit('setBoxesContent', null)
        },
        fetchUserProfile({ commit, state }) {            
            fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
                if (res.exists) {
                    commit('setUserProfile', res.data())
                }                
            }).catch(err => {
                console.log(err)
            })
        },
        fetchUserBoxes({ commit, state }) {

            //console.log('state.currentUser.uid', state.currentUser.uid)
            fb.boxesCollection.where("environment", "==", process.env.BOX_ENV).where("userId", "==", state.currentUser.uid).where('state', 'in', ['new','active','draft']).orderBy('createdOn', 'desc')
            .onSnapshot(querySnapshot => {
                            
                let userBoxes = []
                querySnapshot.forEach(doc => {
                    let box = doc.data()
                    box.id = doc.id
                    userBoxes.push(box)
                })

                commit('setUserBoxes', userBoxes)            

            });
        },
        fetchUserIntents({ commit, state }) {

            //console.log('state.currentUser.uid', state.currentUser.uid)
            fb.intentsCollection.where("ended", "==", true).where("userId", "==", state.currentUser.uid).orderBy('endedOn', 'desc')
            .onSnapshot(querySnapshot => {
                            
                let intents = []
                querySnapshot.forEach(doc => {
                    let intent = doc.data()
                    intent.id = doc.id
                    intents.push(intent)
                })

                commit('setUserIntents', intents)            

            });
        },
        fetchDownloadedBoxes({ commit, state }) {

            fb.downloadsCollection.where("userId", "==", state.currentUser.uid)
            //.where("environment", "==", process.env.BOX_ENV).where('state', 'in', ['new','active']).orderBy('createdOn', 'desc')
            .onSnapshot(querySnapshot => {
                            
                let downloadedBoxes = []
                let downloadedBoxesPromises = []
                querySnapshot.forEach(doc => {
                    let box = doc.data()
                    box.id = doc.id
                    downloadedBoxes.push(box)
                })

                let promises = downloadedBoxes.map(d => fb.boxesCollection.doc(d.boxId).get())

                Promise.all(promises).then(boxes => {                    
                    let downloadedBoxes = []
                    boxes.forEach(doc => {
                        let box = doc.data()
                        box.id = doc.id
                        downloadedBoxes.push(box)
                    })
                    commit('setDownloadedBoxes', downloadedBoxes)
                })
            });
        },
        fetchBoxes({ commit, state }) {

            let states = ['active', 'new']
            if (state.userProfile.role != 'user') {
                //states.push('new')
                states.push('draft')                
            }

            fb.boxesCollection.where("environment", "==", process.env.BOX_ENV).where('state', 'in', states).orderBy('createdOn', 'desc')
            .onSnapshot(querySnapshot => { // realtime
            // .get().then(querySnapshot => { // not realtime
                            
                let boxes = []
                querySnapshot.forEach(doc => {
                    let box = doc.data()
                    box.id = doc.id
                    boxes.push(box)
                })

                commit('setBoxes', boxes)            

            });
        },
        fetchNotifications({ commit, state }) {

            //console.log('state.currentUser.uid', state.currentUser.uid)

            if (state.userProfile.role != 'user') {

                fb.notificationsCollection.where("environment", "==", process.env.BOX_ENV).where("to.role", "==", 'admin').where('readed', '==', false).orderBy('createdOn', 'desc')
                    .onSnapshot(querySnapshot => {
                            
                    let userNotifications = []
                    querySnapshot.forEach(doc => {
                        let notification = doc.data()
                        notification.id = doc.id
                        userNotifications.push(notification)
                    })

                    commit('setNotifications', userNotifications)            
                });
            }
            else {
                fb.notificationsCollection.where("environment", "==", process.env.BOX_ENV).where("to.userId", "==", state.currentUser.uid).where('readed', '==', false).orderBy('createdOn', 'desc')
                    .onSnapshot(querySnapshot => {
                            
                    let userNotifications = []
                    querySnapshot.forEach(doc => {
                        let notification = doc.data()
                        notification.id = doc.id
                        userNotifications.push(notification)
                    })

                    commit('setNotifications', userNotifications)            
                });
            }

            
        },
        updateProfile({ commit, state }, data) {
            let name = data.name
            let email = data.email
            let description = data.description ? data.description : null
            let photo = data.photo ? data.photo : null

            fb.usersCollection.doc(state.currentUser.uid).update({ name, email, description, photo }).then(user => {
                // update all posts by user to reflect new name
                fb.boxesCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {

                        fb.boxesCollection.doc(doc.id).update({
                            user: {
                                name: name,
                                email: email
                            }                            
                        })
                    })
                })
                // update all comments by user to reflect new name
                fb.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.commentsCollection.doc(doc.id).update({
                            user: {
                                name: name,
                                email: email
                            }
                        })
                    })
                })
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val
        },
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setPosts(state, val) {
            if (val) {
                state.posts = val
            } else {
                state.posts = []
            }
        },
        setBoxes(state, val) {
            if (val) {
                state.boxes = val
            } else {
                state.boxes = []
            }
        },        
        setDownloadedBoxes(state, val) {
            if (val) {
                state.downloadedBoxes = val
            } else {
                state.downloadedBoxes = []
            }
        },
        setUserBoxes(state, val) {
            if (val) {
                state.userBoxes = val
            } else {
                state.userBoxes = []
            }
        },
        setUserIntents(state, val) {
            if (val) {
                state.userIntents = val
            } else {
                state.userIntents = []
            }
        },
        setNotifications(state, val) {
            if (val) {
                state.notifications = val
            } else {
                state.notifications = []
            }
        },        
        setHiddenPosts(state, val) {
            if (val) {
                // make sure not to add duplicates
                if (!state.hiddenPosts.some(x => x.id === val.id)) {
                    state.hiddenPosts.unshift(val)
                }
            } else {
                state.hiddenPosts = []
            }
        },
        setBoxesContent(state, val) {
            if (val) {
                let box = state.boxesContent.find(b => b.id = val.id)
                if (box) {
                    box.content = val.content
                }
                else {
                    state.boxesContent.push({ id: val.id, content: val.content })
                }
            }
            else {
                state.boxesContent = []
            }
        }
    }
})
