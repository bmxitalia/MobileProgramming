var host = "http://18.225.31.222:8080/webService";

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
                        location.replace("homepage.html?codiceAzienda="+risp.codiceAzienda+"&username="+
                            risp.username);
                    }else{
                        users.users.push(risp.username);
                        window.localStorage["users"] = JSON.stringify(users);
                        location.replace("newpage.html?codiceAzienda="+risp.codiceAzienda+"&username="+risp.username);
                    }
                }else{
                    if(risp.codice == "1"){
                        alert("Password errata");
                        document.getElementById("input-password").value = "";
                    }else{
                        alert("Username insesistente");
                        document.getElementById("input-user").value = "";
                        document.getElementById("input-password").value = "";
                    }
                }
            }
        };
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhttp.send("username="+user+"&password="+password);
    }else{
        alert("Inserire username e password");
    }
}