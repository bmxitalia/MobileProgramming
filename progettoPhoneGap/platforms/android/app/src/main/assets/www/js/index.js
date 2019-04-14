function onDeviceReady() {
    var username = "";
    var codiceAzienda = "";
    if(window.localStorage["username"] != null){
        username = window.localStorage["username"];
    }
    if(window.localStorage["codiceAzienda"] != null){
        codiceAzienda = window.localStorage["codiceAzienda"];
    }
    if(window.localStorage["loggedIn"] == null || window.localStorage["loggedIn"] == "false"){
        location.replace("login.html");
    }else{
        location.replace("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username)
    }
}

function setPage() {
    document.addEventListener("deviceready", onDeviceReady, false);
}