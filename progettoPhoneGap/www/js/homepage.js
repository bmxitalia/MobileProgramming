var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");
var host = "http://18.225.31.222:8080/webService";
var empty = false;

function setHist(){
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
        self.close();
    };
}

function placeLoader() {
    document.getElementById("loading").style.display = "block";
}

function removeLoader() {
    document.getElementById("loading").style.display = "none";
}

function scanner() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(result.cancelled == true) {
                alert("Scansione cancellata");
                location.replace("homepage.html?username="+username+"&codiceAzienda="+codiceAzienda);
            }else{
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST",host+"/PrelievoInfoArticolo",true);
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var resp = JSON.parse(this.responseText);
                        if(resp.ok == "0"){
                            removeLoader();
                            alert("Scansione errata o codice a barre non corrispondente ad un articolo del fornitore.");
                            location.replace("homepage.html?username="+username+"&codiceAzienda="+codiceAzienda);
                        }else{
                            var xhttp1 = new XMLHttpRequest();
                            xhttp1.open("POST",host+"/PrelievoInfoArticoli",true);
                            xhttp1.onreadystatechange = function() {
                                if (this.readyState == 4 && this.status == 200) {
                                    var resp = JSON.parse(this.responseText);
                                    var presente = false;
                                    for(i = 0; i < resp.articoli.length; i++){
                                        if(resp.articoli[i]["codice"] == result.text){
                                            presente = true;
                                        }
                                    }
                                    if(presente){
                                        removeLoader();
                                        var ok = confirm("Articolo già presente in carrello, vuoi modificare l'articolo?");
                                        if(ok){
                                            location.replace("article.html?username="+username+"&codiceAzienda="+
                                                codiceAzienda+"&codiceArticolo="+result.text+"&mode=update&source=homepage");
                                        }
                                    }else{
                                        removeLoader();
                                        location.replace("article.html?username="+username+"&codiceAzienda="+
                                            codiceAzienda+"&codiceArticolo="+result.text+"&mode=add&source=homepage");
                                    }
                                }
                            };
                            xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                            xhttp1.send("username="+username+"&codiceAzienda="+codiceAzienda);
                        }
                    }
                };
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                xhttp.send("codice="+result.text+"&codiceAzienda="+codiceAzienda);
            }
        },
        function (error) {
            alert("Scanzione fallita: " + error);
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : false, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Centra il codice a barre o il QR dentro l'area di rilevamento.", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "all", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );
}

function deleteArticle(code) {
    var xhttp = new XMLHttpRequest();
    var ok = confirm("Vuoi eliminare l'articolo selezionato?");
    if(ok){
        xhttp.open("POST",host+"/EliminazioneArticoli",true);
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200){
                var risp = JSON.parse(this.responseText);
                if(risp.ok == "1"){
                    location.replace("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username);
                }
                removeLoader();
            }
        };
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhttp.send("username="+username+"&codiceAzienda="+codiceAzienda+"&codici="+code);
        placeLoader();
    }
}

function editArticle(code) {
    location.replace("article.html?codiceAzienda=" + codiceAzienda + "&username=" + username + "&codiceArticolo=" + code + "&mode=update&source=homepage");
}

function deleteAll() {
    if(!empty){
        var ok = confirm("Sicuro di voler rimuovere tutti gli articoli?");
        var xhttp = new XMLHttpRequest();
        if(ok) {
            xhttp.open("POST",host+"/EliminazioneArticoli",true);
            xhttp.onreadystatechange = function () {
                if(this.readyState == 4 && this.status == 200){
                    var risp = JSON.parse(this.responseText);
                    if(risp.ok == "1"){
                        location.replace("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username);
                    }
                    removeLoader();
                }
            };
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhttp.send("username="+username+"&codiceAzienda="+codiceAzienda+"&codici=all");
            placeLoader();
        }
    }else{
        alert("Nessun articolo in carrello!");
    }
}

function sendOrder() {
    if(!empty){
        var ok = confirm("Vuoi inviare l'ordine?");
        var xhttp = new XMLHttpRequest();
        var totale = document.getElementById("totale").innerHTML;
        if(ok) {
            xhttp.open("POST",host+"/InvioOrdine",true);
            xhttp.onreadystatechange = function () {
                if(this.readyState == 4 && this.status == 200){
                    var risp = JSON.parse(this.responseText);
                    if(risp.ok == "1"){
                        removeLoader();
                        alert("Ordine inviato con successo");
                        location.replace("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username);
                    }else{
                        removeLoader();
                        alert("Problemi nell'invio dell'ordine");
                    }
                }
            };
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhttp.send("username="+username+"&codiceAzienda="+codiceAzienda+"&totale="+totale);
            placeLoader();
        }
    }else{
        alert("Nessun articolo in carrello!");
    }
}

function compute(xhttp) {
    var risp = JSON.parse(xhttp.responseText);
    var div = document.getElementById("articleList");
    var total = 0.0;
    document.getElementById("h4price").innerHTML = "Totale: <span id='totale'></span> EUR";
    if(risp.articoli.length == 0){
        var p = document.createElement("p");
        p.setAttribute("class","cart-empty");
        var text = document.createTextNode("Nessun articolo in carrello");
        p.appendChild(text);
        div.appendChild(p);
        document.getElementById("totale").innerHTML = total;
        empty = true;
    }else {
        empty = false;
        var article = null;
        var descr = null;
        var buttons = null;
        var editButton = null;
        var deleteButton = null;
        var h4 = null;
        var textH4 = null;
        var prezzo = null;
        var textPrezzo = null;
        var both = null;
        for (i = 0; i < risp.articoli.length; i++) {
            article = document.createElement("div");
            article.setAttribute("class", "article");
            descr = document.createElement("div");
            descr.setAttribute("class", "info-article");
            buttons = document.createElement("div");
            buttons.setAttribute("class", "button-article");
            editButton = document.createElement("button");
            deleteButton = document.createElement("button");
            editButton.setAttribute("class", "btn-edit");
            editButton.innerHTML = "MODIFICA";
            deleteButton.setAttribute("class", "btn-delete");
            deleteButton.innerHTML = "ELIMINA";
            deleteButton.setAttribute("onclick", "deleteArticle(" + risp.articoli[i]["codice"] + ")");
            editButton.setAttribute("onclick", "editArticle(" + risp.articoli[i]["codice"] + ")");
            buttons.appendChild(editButton);
            buttons.appendChild(document.createElement("br"));
            buttons.appendChild(deleteButton);
            article.appendChild(descr);
            article.appendChild(buttons);
            h4 = document.createElement("h4");
            textH4 = document.createTextNode(risp.articoli[i]["nome"] + " (Qta: x" + risp.articoli[i]["quantita"] + ")");
            h4.appendChild(textH4);
            prezzo = document.createElement("span");
            textPrezzo = document.createTextNode("P. parziale: " + (risp.articoli[i]["prezzo"] * risp.articoli[i]["quantita"]) + "EUR");
            total += risp.articoli[i]["prezzo"] * risp.articoli[i]["quantita"];
            prezzo.appendChild(textPrezzo);
            both = document.createElement("div");
            both.setAttribute("style", "clear:both;");
            article.appendChild(both);
            descr.appendChild(h4);
            descr.appendChild(prezzo);
            div.appendChild(article);
        }
        document.getElementById("totale").innerHTML = total;
    }
}

function loadCart() {
    setHist();
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",host+"/PrelievoInfoArticoli",true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            compute(this);
            removeLoader();
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhttp.send("username="+username+"&codiceAzienda="+codiceAzienda);
}