var host = "http://18.225.31.222:8080/webService";

document.addEventListener("deviceready",checkConnection,false);

function checkConnection(){ //funzione di verifica connettività
	if(navigator.connection.type == Connection.NONE) { //caso assenza connettività
		navigator.notification.alert("Non sei connesso ad Internet. L'applicazione è inutilizzabile.",
			function(){
		    	navigator.app.exitApp(); //chiusura applicazione
			},"Errore");
	}
}

function onBackKeyDown() {
    window.plugins.appMinimize.minimize();
}

function charge() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

document.getElementById("input-user").addEventListener("keypress", function () {
    if (event.keyCode === 13) {
        document.getElementById("input-password").focus();
    }
});

document.getElementById("input-password").addEventListener("keypress", function () {
    if (event.keyCode === 13) {
        tryLogin();
    }
});

function tryLogin() {
    var user = document.getElementById("input-user").value;
    var password = document.getElementById("input-password").value;
    var xhttp = new XMLHttpRequest();

    if(user!="" && password!=""){
        xhttp.open("POST",host+"/Autenticazione",true);
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200){
                var risp = JSON.parse(this.responseText);
                if(risp.codice == "0"){
                    if(document.getElementById("login-box").checked == true){
                        window.localStorage["loggedIn"] = "true";
                    }
                    var trovato = false;
                    window.localStorage["username"] = risp.username;
                    window.localStorage["codiceAzienda"] = risp.codiceAzienda;
                    if(window.localStorage["users"] == null){
                        window.localStorage["users"] = "{\"users\":[]}";
                    }
                    var users = JSON.parse(window.localStorage["users"]);
                    for(i=0;i<users.users.length;i++){
                        if(risp.username == users.users[i]){
                            trovato = true;
                        }
                    }
                    if(trovato){
                        window.plugins.nativepagetransitions.slide({
                            "href" : "homepage.html?codiceAzienda="+risp.codiceAzienda+"&username="+risp.username
                        });
                        //location.replace("homepage.html?codiceAzienda="+risp.codiceAzienda+"&username="+
                        //    risp.username);
                    }else{
                        users.users.push(risp.username);
                        window.localStorage["users"] = JSON.stringify(users);
                        window.plugins.nativepagetransitions.slide({
                            "href" : "newpage.html?codiceAzienda="+risp.codiceAzienda+"&username="+risp.username
                        });
                        //location.replace("newpage.html?codiceAzienda="+risp.codiceAzienda+"&username="+risp.username);
                    }
                }else{
                    if(risp.codice == "1"){
                        navigator.notification.alert("Password errata", alert, "Attenzione", "OK");
                        document.getElementById("input-password").value = "";
                    }else{
                        navigator.notification.alert("Username inesistente", alert, "Attenzione", "OK");
                        document.getElementById("input-user").value = "";
                        document.getElementById("input-password").value = "";
                        document.getElementById("input-user").focus();
                    }
                }
            }
        };
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhttp.send("username="+user+"&password="+password);
    }else{
        navigator.notification.alert("Inserire username e password",alert,"Attenzione","OK");
    }
}

function alert() {

}