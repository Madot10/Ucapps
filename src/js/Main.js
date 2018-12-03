/**VARIABLES**** */
let linkApp, idApp;
let apps = [];

/**FUNCIONES*** */
function popError(msg){
    document.getElementById("errText").innerHTML = msg;
    $('#errModal').modal('show');
}


function changeScreen(nameScr){
    console.log("changing to ", nameScr);
    let screens = document.getElementsByClassName("screen");
    //Ocultamos todo
    for (let elem of screens) {
        elem.setAttribute("style", "display: none !important");
    }

    if(nameScr == "catalogo"){
        document.getElementById("list").innerHTML = "";
        toggleLoader();
        getAllApps();
    }else if(nameScr == "menu"){
        document.getElementById("menu").innerHTML = ""; 
        toggleLoader();
        getAllLocalApps();
    }
    
    //Mostramos especifico
    screens[nameScr].style.display = "block";  
}

function genHTMLlist(name, icon, url, description, id){
    let mainA = document.createElement('a');
    mainA.setAttribute("onclick", ` popApp('${url}', ${id})`)
    mainA.classList.add("clicker","list-group-item", "list-group-item-action", "flex-column", "align-items-start");

    let mDiv = document.createElement('div');
    mDiv.classList.add("media");

    //icono
    let ic = document.createElement('img');
    ic.classList.add("align-self-center","mr-3");
    ic.src = icon;
    ic.setAttribute("width", "15%");

    //mediaBody
    let mBody = document.createElement("div");
    mBody.classList.add("media-body");

        //titulo
        let htitle = document.createElement('h5');
        htitle.classList.add("mb-1","mt-0");
        htitle.innerHTML = name;

    mBody.appendChild(htitle);
    mBody.innerText = description;
    mBody.style.wordWrap = "break-word";

    
    mDiv.appendChild(ic);
    mDiv.appendChild(mBody);


    mainA.appendChild(mDiv);

    document.getElementById("list").appendChild(mainA);
}

function toggleLoader(){
    let loader = document.getElementById("loader");
    let overl = document.getElementById("overlay");

    overl.style.display = overl.style.display=="none" ? "block" : "none";
    loader.style.display = loader.style.display=="none" ? "block" : "none";
    
}

function popApp(url, id){
    linkApp = url;
    idApp = id;
    document.getElementById("lkBtton").href = url;
    $('#appModal').modal("show");
}

function genHTMLApps(name,icon, url){
    let aMain = document.createElement("a");
    aMain.href = url;

        let divMain = document.createElement('div');
        divMain.classList.add("card", "text-center", "m-1");
        divMain.style.width = "11rem";

        //icon
        let ic = document.createElement("img");
        ic.classList.add("card-img-top");
        ic.src = icon;

        divMain.appendChild(ic);

        //body
        let cBody = document.createElement("div");
        cBody.classList.add("card-body");

            let title = document.createElement("h5");
            title.classList.add("card-title");
            title.innerText = name;
        
        cBody.appendChild(title);

    divMain.appendChild(cBody);

    aMain.appendChild(divMain);

    document.getElementById("menu").appendChild(aMain);

}

function finMosaico(){
    
    if(!document.getElementById("menu").innerHTML){
        document.getElementById("menu").innerHTML += '<div class="alert alert-success" role="alert">No tienes ninguna app agregada! <br> Dirigite a la seccion "Catalogo" y con un simple click agrega! </div>';
    } 
}

if (navigator.serviceWorker.controller) {
    console.log('[PWA Builder] active service worker found, no need to register')
  } else {
    //Register the ServiceWorker
    navigator.serviceWorker.register('ucapps-sw.js', {
      scope: './'
    }).then(function(reg) {
      console.log('Service worker has been registered for scope:'+ reg.scope);
    });
  }