window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

let req = indexedDB.open("dbApps", 1);
let dbI, objectStore;


req.onerror = function (event) {
    //Error
    //ToDo: Manejar
    console.warn("ERROR! ", event);
}

req.onupgradeneeded = function (event) {
    //FIRST TIME OK

    dbI = event.target.result;

    objectStore = dbI.createObjectStore("appLocal", { keyPath: "name" });

    objectStore.transaction.oncomplete = function (event) {
        console.log('create');
    }

}

req.onsuccess = function (event) {
    //OK OPEN DB
    dbI = event.target.result;
    console.log('abierto');
    changeScreen('menu');
}

function addApp() {
    let req = dbI.transaction(['appLocal'], "readwrite")
        .objectStore("appLocal")
        .add(apps[idApp]);

    req.onsuccess = function (event) {
        console.log("ADD exitosamente!");
        $('#appModal').modal('hide');
    }

    req.onerror = function (e) {
        $('#appModal').modal('hide');
        if(e.srcElement.error.code == 0){
            popError("App ya instalada!");
        }else{
            popError("Error al intentar agregar app");
        }
        
        
    }
}

function getAllLocalApps(){
    dbI.transaction("appLocal").objectStore("appLocal")
        .openCursor().onsuccess = function(ev){
            let cursor = ev.target.result;
            if(cursor){
                genHTMLApps(cursor.value.name, cursor.value.icon, cursor.value.url);
                cursor.continue();
            }else{
                console.log("No mas/ninguna entradas");
                finMosaico();
                //toggleLoader();
            }
        }

}

function deleteApp(nam){
    //console.log("Intento de borrar ", nam);
    let todel = dbI.transaction("appLocal", "readwrite")
    .objectStore("appLocal")
    .delete(nam)
    .onsuccess = function (event) {
        console.log("App eliminado", nam);
    }
    changeScreen("menu");
}