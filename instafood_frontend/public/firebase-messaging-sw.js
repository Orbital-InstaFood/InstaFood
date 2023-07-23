importScripts("https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js")

const firebaseConfig = {
    apiKey: "AIzaSyDDq1uxsca3kc3KVSO41I6MxaERqe9F2YM",
    authDomain: "orbital-386a9.firebaseapp.com",
    projectId: "orbital-386a9",
    storageBucket: "orbital-386a9.appspot.com",
    messagingSenderId: "970918918366",
    appId: "1:970918918366:web:3fa7c701c44893cf406a4f",
    measurementId: "G-NNHB2PVBZE",
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        image: payload.notification.image,
        data: payload.notification.data,
        click_action: payload.notification.click_action,
    };

    return self.registration.showNotification(
        notificationTitle, 
        notificationOptions
        );
});