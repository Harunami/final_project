// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: "fir-yelp-hybrid-app.firebaseapp.com",
    projectId: "fir-yelp-hybrid-app",
    storageBucket: "fir-yelp-hybrid-app.appspot.com",
    messagingSenderId: "448620923801",
    appId: config.FIREBASE_APP_ID,
    measurementId: config.FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
console.log(firebase);

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=' + config.GOOGLE_API_KEY + '&callback=initMap';
script.defer = true;

document.head.appendChild(script);