/***************VARIABLES************************* */
let isBg = true;
let lastUpd = 0;
const timeToUpdate = 2 * 60 * 1000; //mseg 2min
let objArr = [];
let idSelect;

/*******************FUNCIONES********************* */
function popError(msg){
    document.getElementById("errText").innerHTML = msg;
    $('#errModal').modal('show');
}

/*
$(document).ready(function(){
  $('[data-toggle="tab"').on('shown.bs.tab', function(event){
    $('#navbarNav').removeClass('show').addClass('collapse');
  });
});
*/


function getHr(value){
    return `${value - (value > 12 ? 12 : 0)}:00` + (value > 12 ? 'PM' : 'AM');
}

function rangeTime(ele){
    document.getElementById("timeToShow").innerHTML = getHr(ele.value);
}

function verificarFormP(){
    let inputs = document.getElementById("fpublicar").elements;
    let reqInp = ["obj_ubicacion","obj_ult_ubicacion","obj_tipo"];
    let st = true;

    reqInp.forEach(element => {
        if(inputs[element].value == "" || inputs[element].value == "select"){
            st = false;
        }    
    });
    
    return st;
}

function enviarObj(){
    let inputs = document.getElementById("fpublicar").elements;
    if(verificarFormP()){
        addRegistro(inputs["obj_ubicacion"].value, inputs["obj_hora"].value,inputs["obj_ult_ubicacion"].value,inputs["obj_tipo"].value,inputs["obj_descripcion"].value);
        console.log("sendit");
    }
}

function changeScreen(nameScr){
    //Ocultamos todo
    for (let elem of document.getElementsByClassName("screen")) {
        elem.style.display = "none";
    }

    //Condiciones especiales
    if(nameScr == "start" && !isBg){
        document.body.classList.add("bg-dark");
        isBg = true;

    }else if(nameScr != "start" && isBg){
        //No Screen start
        document.body.classList.remove("bg-dark");
        isBg = false;
    }

    if(nameScr == "buscar" && isAuth()){
        if(isNeededUpdate()){
            document.getElementById("objPer").innerHTML = "";
            toggleLoader();
            getAllReg();
        }
    }

    //Cambio de screen
    if(nameScr == "start" || isAuth() ){
        document.getElementsByClassName("screen")[nameScr].style.display = "block";
    }else{
        changeScreen("start");
        popError("Debes iniciar sesion para poder continuar");
    }
        
}

//Chequea tiempo que fue actualizado el feed para optimizar
function isNeededUpdate(){
    let act = new Date();
    act = act.getTime();
    
    if(act - lastUpd > timeToUpdate){
        lastUpd = act;
        return true;
    }
    return false;
}

function toggleLoader(){
    let loader = document.getElementById("loader");
    let overl = document.getElementById("overlay");

    overl.style.display = overl.style.display=="none" ? "block" : "none";
    loader.style.display = loader.style.display=="none" ? "block" : "none";
    
}

function clearForm(){
    let inputs = document.getElementById("fpublicar").elements;
    for (let elem of inputs) {
        //console.log("some",elem);
        elem.value = elem.type=="range" ? (1) : (elem.type=="select-one" ? "select" : "");
    }
}

function genHTMLobj(title, descp, time, iArr, idDB){
    let mainA = document.createElement('a');
    mainA.setAttribute('onclick',`popObj(${iArr},'${idDB}')`);
    //mainA.href = "#"
    mainA.classList.add("clicker","list-group-item", "list-group-item-action", "flex-column", "align-items-start");

    let mDiv = document.createElement('div');
    mDiv.classList.add("d-flex", "w-100", "justify-content-between");

        let htitle = document.createElement('h5');
        htitle.classList.add("mb-1");
        htitle.innerHTML = title;

        let smTime = document.createElement('small');
        smTime.innerHTML = timeAgoGen(time);

    mDiv.appendChild(htitle);
    mDiv.appendChild(smTime);

    let pDes = document.createElement('p');
    pDes.classList.add("mb-1");
    pDes.innerHTML = descp;
    pDes.style.wordWrap = "break-word";

    mainA.appendChild(mDiv);
    mainA.appendChild(pDes);

    document.getElementById("objPer").appendChild(mainA);
}

function timeAgoGen(sgOld){
    let sgNow = new Date().getTime() / 1000;
    let timeDif = Math.floor(sgNow - sgOld);
    let stResult = '';
    //console.log('TIme dif start', timeDif);
    //Seg de diferencia hasta 59sg
    if((timeDif >= 0) && (timeDif <= 59)){
        //seg
        if(timeDif <= 0){
            stResult = 'Hace instantes';
        }else{
            stResult = 'Hace ' + Math.floor(timeDif) + ' seg';
        }
        
    }else{
        timeDif = Math.floor(timeDif / 60);
        //console.log('TIme dif min', timeDif);
        //Min de diferencia hasta 59
        if((timeDif >= 1) && (timeDif <= 59)){
            //Min
            if(timeDif == 1){
                stResult = 'Hace 1 min';
            }else{
                stResult = 'Hace ' + Math.floor(timeDif) + ' mins';
            }
        }else{
            timeDif = Math.floor(timeDif / 60);
           // console.log('TIme dif hrs', timeDif);
            //Hr diferencia hasta 23
            if((timeDif >= 1) && (timeDif <= 23)){
                //hrs
                if(timeDif == 1){
                    stResult = 'Hace 1 hr';
                }else{
                    stResult = 'Hace ' + Math.floor(timeDif) + ' hrs';
                }
            }else{
                timeDif = Math.floor(timeDif / 24);
                //console.log('TIme dif days', timeDif);
                //Dias diferencia
                if((timeDif >= 1) && (timeDif <= 29)){
                    //dias
                    if(timeDif == 1){
                        stResult = 'Hace un dia';
                    }else{
                        stResult = 'Hace ' + Math.floor(timeDif) + ' dias';
                    }
                }else{
                    timeDif = Math.floor(timeDif / 30);
                    //console.log('TIme dif mes', timeDif);
                    //Meses de diferencia
                    if((timeDif >= 1) && (timeDif <= 11)){
                        //month
                        if(timeDif == 1){
                            stResult = 'Hace un mes';
                        }else{
                            stResult = 'Hace ' + Math.floor(timeDif) + ' meses';
                        }
                    }else{
                        //Anos diferencia
                        timeDif = Math.floor(timeDif / 12);
                        //console.log('TIme dif ano', timeDif);
                        if((timeDif >= 1) && (timeDif <= 11)){
                            //years
                            if(timeDif == 1){
                                stResult = 'Hace un año';
                            }else{
                                stResult = 'Hace ' + Math.floor(timeDif) + ' años';
                            }
                        }
                    }
                }
            }
        }
    }

    return stResult;
}

function popObj(index, id){
    console.log("OBJECTO CLICKER", objArr[index]);
    //Cargar datos a modal
    idSelect = id;
    let obj = objArr[index];
    let outputs = document.getElementById("fshow").elements;
    outputs[0].value = obj.where;
    outputs[1].value = obj.description;
    outputs[2].value = obj.status;
    outputs[3].value= obj.catg;

    if(userData.admin){
        turnAdminMode();
    }else{
        //poner readonly
        for (const felem of outputs) {
            felem.setAttribute('readonly','');
        }
        //ocultar botones
        document.getElementById('divButtons').style.display = "none";
    }
    
    $('#objModal').modal("show");
}

function turnAdminMode(){
    if(userData.admin){
        //Poner forms para editar
        let outputs = document.getElementById("fshow").elements;
        for (const felem of outputs) {
            felem.removeAttribute('readonly');
        }
        //Botones para borrar y guardar cambios
        document.getElementById('divButtons').style.display = "flex";
    }
}

function toDelete(){
    delRegistro({id: idSelect}).then(function(re){
        console.log("respuesta", re.data);
    }).catch(err =>{
        console.error('Error', err);
        popError(err);
    })
    $('#objModal').modal("hide");
}

function toSaveChange(){
    let daSend = {id: idSelect}
    let outputs = document.getElementById("fshow").elements;
    daSend['catg'] = outputs['obj_tipo'].value;
    daSend['description'] = outputs['obj_descripcion'].value;
    daSend['status'] = outputs['obj_ult_ubicacion'].value;
    daSend['where'] = outputs['obj_ubicacion'].value;
    $('#objModal').modal("hide");
    modRegistro(daSend).then(function(re){
        console.log("respuesta", re.data);
    })
}

if (navigator.serviceWorker.controller) {
    console.log('[PWA Builder] active service worker found, no need to register')
  } else {
    //Register the ServiceWorker
    navigator.serviceWorker.register('ubi-sw.js', {
      scope: './'
    }).then(function(reg) {
      console.log('Service worker has been registered for scope:'+ reg.scope);
    });
  }
  
