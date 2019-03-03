import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';




// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

    exports.createTeamMember = functions.firestore
    .document(`teamProfile/{teamId}/teamMemberList/{newUserId}`)
    .onCreate(async (snapshot, context) => {
        const id: string = snapshot.data().id;
        const email: string = snapshot.data().email;
        const teamId: string = snapshot.data().teamId;
        const newUser: admin.auth.UserRecord = await admin.auth().createUser({
            uid: id,
            email: email,
            password: 'password',
        });
        await admin
        .firestore()
        .doc(`userProfile/${id}`)
        .set({
            email: email,
            id: id,
            teamId: teamId,
            teamAdmin: false,
        });
        return newUser;
    });