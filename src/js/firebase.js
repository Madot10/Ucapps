// Initialize Firebase
var config = {
    apiKey: "AIzaSyCTdxs3OlcgJouSxdapNBRuir6cRtl7KuM",
    authDomain: "u-bicalo.firebaseapp.com",
    databaseURL: "https://u-bicalo.firebaseio.com",
    projectId: "u-bicalo",
    storageBucket: "u-bicalo.appspot.com",
    messagingSenderId: "534432514058"
};
firebase.initializeApp(config);

let provider = new firebase.auth.GoogleAuthProvider();
let db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

let functions = firebase.functions();
let modRegistro = firebase.functions().httpsCallable('modRegistro');
let delRegistro = firebase.functions().httpsCallable('delRegistro');

let userData;

function isAuth(){
    return !(firebase.auth().currentUser == null)
    //return true;
}

function isAdmin(email){
    if(email){
        return db.collection('adminUsers')
            .doc(email).get()
            .then(doc => {
                if (!doc.exists) {
                    //No existe usuario => no autorizado 
                    console.log('No encontrado', email);
                    return false;
                } else {
                    //Existe
                    console.log('Encontrado => ', doc.data().auth);
                    return doc.data().auth            
                }
            }).catch(err => {
                //ERROR 
                console.log('ERROR ',email, err);
                return false;
              });
          
    }
}

function LogInPopup(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      changeScreen("main"); 
        
        
       firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function() {
            console.log("ok");
        })
        .catch(function(error) {
        // Handle Errors here.
            popError(`Ocurrio un error al iniciar con la cuenta ${error.email} <br> ${error.message} <br> Codigo: ${error.code}`);
        });           
  
    }).catch(function(error) {
      // Handle Errors here.
        popError(`Ocurrio un error al iniciar con la cuenta ${error.email} <br> ${error.message} <br> Codigo: ${error.code}`);
    });
  }

function LogOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        userData = null;
        changeScreen("start");
      }).catch(function(error) {
        // An error happened.
        popError(`Ocurrio un error al intentar cerrar con la cuenta ${error.email} <br> ${error.message} <br> Codigo: ${error.code}`);
      });
}

function addRegistro(dnd, hr, sts, catg, descri){
    toggleLoader();
    db.collection("objPerdidos").add({
        description: descri,
        catg: catg,
        hrs: hr,
        where: dnd,
        status: sts,
        timeAdd: new Date()
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        clearForm();
        toggleLoader();
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        popError(error);
        toggleLoader();
    });

}

function getAllReg(){
    db.collection("objPerdidos").orderBy("timeAdd", "desc").get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                genHTMLobj(`${doc.data().catg.toUpperCase()}: ${doc.data().status}`, doc.data().description, doc.data().timeAdd.seconds, objArr.length, doc.id);
                objArr[objArr.length] = doc.data();
                console.log(doc.id, " => ", doc.data());
            });
            toggleLoader();
    });
}

window.onload = ()=>{
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
		  // User is signed in.
		  console.log("ok1",user);
		  userData = { 
                email: user.email,
			    name: user.displayName
           };

           //guardar admin autentification
           isAdmin(user.email).then(function(result){
                if(result){
                    //Con privilegios
                    userData['admin'] = true;
                }
            }).catch(err =>{
                console.error('Error', err);
                return err;
            })

		  changeScreen("main");
		} else {
		  // No user is signed in.
		  console.log("no1");
		  //changeScreen("start");
		}
	  });
}
