var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");
var host = "http://18.225.31.222:8080/webService";
var articoli = [];
var carrello = [];

function placeLoader() {
    document.getElementById("loading").style.display = "block";
}

function removeLoader() {
    document.getElementById("loading").style.display = "none";
}

function addArticle(code) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",host+"/PrelievoInfoArticoli",true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var resp = JSON.parse(this.responseText);
            var presente = false;
            for(i = 0; i < resp.articoli.length; i++){
                if(resp.articoli[i]["codice"] == code){
                    presente = true;
                }
            }
            if(presente){
                removeLoader();
                var ok = confirm("Articolo già presente in carrello, vuoi modificare l'articolo?");
                if(ok){
                    location.replace("article.html?username="+username+"&codiceAzienda="+
                        codiceAzienda+"&codiceArticolo="+code+"&mode=update&source=inventory");
                }
            }else{
                removeLoader();
                location.replace("article.html?username="+username+"&codiceAzienda="+
                    codiceAzienda+"&codiceArticolo="+code+"&mode=add&source=inventory");
            }
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhttp.send("username="+username+"&codiceAzienda="+codiceAzienda);
    placeLoader();
}

function changeList() {
    var tempList = articoli.slice();
    document.getElementById("list-article").innerHTML = "";
    var choice = document.getElementById("searchArticle").value;
    var articolo = null;
    var h4 = null;
    var descr = null;
    var buttons = null;
    var addButton = null;
    var afterDiv = null;
    var enter = false;
    var container = document.getElementById("list-article");
    for (i = 0; i < tempList.length; i++) {
        if(tempList[i]["nome"].toLowerCase().includes(choice.toLowerCase()) || tempList[i]["barCode"].includes(choice.toLowerCase()) || choice == ""){
            enter = true;
            articolo = document.createElement("div");
            articolo.setAttribute("class", "article");
            descr = document.createElement("div");
            descr.setAttribute("class", "info-article");
            h4 = document.createElement("h4");
            h4.appendChild(document.createTextNode(tempList[i]["barCode"] + " - " + tempList[i]["nome"] + " - " + tempList[i]["prezzo"] + "EUR"));
            descr.appendChild(h4);
            buttons = document.createElement("div");
            buttons.setAttribute("class", "button-article");
            addButton = document.createElement("button");
            addButton.setAttribute("class", "btn btn-open");
            addButton.innerHTML = "APRI";
            addButton.setAttribute("onclick", "addArticle(" + tempList[i]["barCode"] + ")");
            buttons.appendChild(addButton);
            articolo.appendChild(descr);
            articolo.appendChild(buttons);
            afterDiv = document.createElement("div");
            afterDiv.setAttribute("class", "after-div");
            articolo.appendChild(afterDiv);
            container.appendChild(articolo);
        }
    }
    if(!enter){
        var p = document.createElement("p");
        p.setAttribute("class","order-empty");
        var text = document.createTextNode("Nessun articolo corrisponde alla ricerca...");
        p.appendChild(text);
        container.appendChild(p);
    }
}

function compute(xhttp) {
    var risp = JSON.parse(xhttp.responseText);
    if(risp.ok == "0"){
        alert("Errore di sistema");
    }else {
        articoli = risp.articoli;
        changeList();
    }
}

function loadArticles() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",host+"/PrelevaArticoliAzienda",true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            compute(this);
            removeLoader();
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhttp.send("codiceAzienda="+codiceAzienda);
}