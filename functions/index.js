const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  // Only an authenticated admin user should be able to trigger this
  if (!context.auth || !context.auth.token.admin) {
    return { error: 'You must be an admin to add other admins.' };
  }

  const email = data.email;

  return admin.auth().getUserByEmail(email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });
    })
    .then(() => {
      return { message: `Success! ${email} has been made an admin.` };
    })
    .catch(err => {
      return { error: err.message };
    });
});
