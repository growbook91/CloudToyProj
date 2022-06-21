// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// //이걸 써야 every minutes이 되는 듯.
// const { PubSub } = require('@google-cloud/pubsub');
// const pubsub = new PubSub();


exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    console.log('This will be run every 1 minutes!');
    //이제 여기서 확인해서 시간 간격을 계산하고 boolean 값을 설계하는 코드를 적어야 겠다.
    //시간 확인
    //boolean 변경
    return null;
  });

//   exports.scheduledFunctionCrontab = functions.pubsub.schedule('50 14 * * *')
//   .timeZone('Asia/Seoul') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//   console.log('This will be run every day at 14:50 AM Eastern!');
//   return null;
// });

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });
  
// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);
      
      const uppercase = original.toUpperCase();
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });