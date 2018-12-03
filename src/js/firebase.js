var config = {
    apiKey: "AIzaSyC6_QlHHBnagQm2NGSlCe1touNZqNURP68",
    authDomain: "tucab-5321.firebaseapp.com",
    databaseURL: "https://tucab-5321.firebaseio.com",
    projectId: "tucab-5321",
    storageBucket: "tucab-5321.appspot.com",
    messagingSenderId: "747604126990"
};
firebase.initializeApp(config);

let db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

function getAllApps(){
    db.collection("Uapp").orderBy("name", "asc").get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                genHTMLlist(doc.data().name, doc.data().icon, doc.data().url, doc.data().description,apps.length);
                apps[apps.length] = doc.data();
                console.log(doc.id, " => ", doc.data());
            });
            toggleLoader();
    });
}