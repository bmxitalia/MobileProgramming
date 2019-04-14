var username = "";
var codiceAzienda = "";
function setPage() {
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