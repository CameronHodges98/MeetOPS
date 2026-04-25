const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// When a manager deletes a CT, a revokedUsers/{uid} doc is written by the client.
// This function triggers on that write and permanently removes the CT's Firebase
// Authentication account — something only the Admin SDK can do server-side.
exports.deleteRevokedCTAuth = functions.firestore
    .document("revokedUsers/{uid}")
    .onCreate(async (snap, context) => {
        const uid = context.params.uid;
        try {
            await admin.auth().deleteUser(uid);
            console.log(`Deleted Firebase Auth account for revoked CT: ${uid}`);
        } catch (e) {
            // auth/user-not-found is fine — account may have already been removed
            if (e.code !== "auth/user-not-found") {
                console.error(`Failed to delete Auth account for ${uid}:`, e.message);
            }
        }
    });
