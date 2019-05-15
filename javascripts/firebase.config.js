const config = {
  apiKey: 'AIzaSyDcKIKDUbd9ScJPzHdqHrzx8n_olLfCXLk',
  authDomain: 'colormapsinnetwork.firebaseapp.com',
  databaseURL: 'https://colormapsinnetwork.firebaseio.com',
  projectId: 'colormapsinnetwork',
  storageBucket: 'colormapsinnetwork.appspot.com',
  messagingSenderId: '403183799865'
};

// Initialize Firebase
firebase.initializeApp(config);

const FirebaseAuth = firebase.auth();
const database = firebase.database();

// Set Login Persistence
firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.NONE)
  .then(function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithRedirect(provider);
  })
  .catch(function(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

console.log('fb config on');
