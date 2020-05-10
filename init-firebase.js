// Initialize Firebase
var config = {
    apiKey: "AIzaSyBL6LDmX6fuIy5d35iq15jz9fW-AnwtwDI",
    authDomain: "community-updates.firebaseapp.com",
    databaseURL: "https://community-updates.firebaseio.com",
    projectId: "community-updates",
    storageBucket: "community-updates.appspot.com",
    messagingSenderId: "38226611639",
    appId: "1:38226611639:web:f4eb0e1549522cc9"
};
firebase.initializeApp(config);

// Firebase Messaging Code
const messaging = firebase.messaging();
messaging.usePublicVapidKey('BMXXuXuiGgtBPLsOlj9O8Xeg-D53bZ4xc38saTUWGCQfFnBxhEyhwU3SWxAYxp9KB_Ck8MHMeBPvb5HE9fVfuqg');

requestPermission();

// [START refresh_token]
// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
        console.log('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        setTokenSentToServer(false);
        // Send Instance ID token to app server.
        console.log('Token', refreshedToken);

    }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
        showToken('Unable to retrieve refreshed token ', err);
    });
});
// [END refresh_token]


// [START get_token]
// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then((currentToken) => {
    if (currentToken) {
        console.log(currentToken);
    } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        setTokenSentToServer(false);
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    setTokenSentToServer(false);
});
// [END get_token]

// [START receive_message]
// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage(function (payload) {
    console.log('Message received. ', payload);

});
// [END receive_message]

function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            console.log('Token :', messaging.getToken());
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
}

function deleteToken() {
    // Delete Instance ID token.
    messaging.getToken().then((currentToken) => {
    messaging.deleteToken(currentToken).then(() => {
        console.log('Token deleted.');
        setTokenSentToServer(false);
    }).catch((err) => {
        console.log('Unable to delete token. ', err);
    });
    // [END delete_token]
    }).catch((err) => {
    console.log('Error retrieving Instance ID token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    });
}