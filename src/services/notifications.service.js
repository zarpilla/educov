const fb = require("../firebaseConfig.js");

function createNotification(type, boxId, from, to) {
    let now = new Date()
    fb.notificationsCollection.add({
        createdOn: now,
        type: type,        
        from: from,
        to: to,
        boxId: boxId,
        environment: process.env.BOX_ENV,
        sent: false,
        readed: false
    })
}



export { createNotification }