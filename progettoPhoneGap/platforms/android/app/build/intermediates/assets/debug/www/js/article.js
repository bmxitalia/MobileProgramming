var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");
var barCode = url.searchParams.get("codiceArticolo");
var mode = url.searchParams.get("mode");
var host = "http://18.225.31.222:8080/webService";
var prezzo = 0.0;
var source = url.searchParams.get("source");

function onBackKeyDown() {
    window.plugins.nativepagetransitions.slide({
        "direction" : "right",
        "href" : source+".html?codiceAzienda="+codiceAzienda+"&username="+username
    });
    //location.replace(source+".html?codiceAzienda="+codiceAzienda+"&username="+username);
}

function removeLoader() {
    document.getElementById("loading").style.display = "none";
}

function placeLoader() {
    document.getElementById("loading").style.display = "block";
}

function confirmOperation() {
    if(document.getElementById("quantity").value == "0"){
        navigator.notification.alert("Non è possibile inserire una quantità 0", alert, "Attenzione", "OK");
    }else{
        var query = "";
        if(mode == "update"){
            query = "update contenutoCarrelli set quantita="+document.getElementById("quantity").value+"where username='"+username+"' and barCode='"+ barCode +"'";
        }else{
            query = "insert into contenutoCarrelli(barCode,quantita,username) values('"+barCode+"',"+document.getElementById("quantity").value+",'"+username+"')";
        }
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST",host+"/AggiuntaModificaArticolo",true);
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var resp = JSON.parse(this.responseText);
                if (resp.ok == "1") {
                    removeLoader();
                    window.plugins.nativepagetransitions.slide({
                        "direction" : "right",
                        "href" : source+".html?codiceAzienda="+codiceAzienda+"&username="+username
                    });
                    //location.replace(source+".html?codiceAzienda="+codiceAzienda+"&username="+username);
                }else{
                    removeLoader();
                    navigator.notification.alert("Errore nell'esecuzione dell'operazione", alert, "Attenzione", "OK");
                }
            }
        };
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhttp.send("codiceAzienda="+codiceAzienda+"&query="+query);
        placeLoader();
        }
}

function deleteOperation() {
    window.plugins.nativepagetransitions.slide({
        "direction" : "right",
        "href" : source+".html?codiceAzienda="+codiceAzienda+"&username="+username
    });
    //location.replace(source+".html?codiceAzienda="+codiceAzienda+"&username="+username);
}

function minusPressed() {
    var q = parseInt(document.getElementById("quantity").value,10);
    if(q > 0) {
        q = q - 1;
        document.getElementById("quantity").value = q;
        document.getElementById("price").innerHTML = Number((q*prezzo).toFixed(2));
    }
}

function plusPressed() {
    var q = parseInt(document.getElementById("quantity").value,10);
    q += 1;
    document.getElementById("quantity").value = q;
    document.getElementById("price").innerHTML = Number((q*prezzo).toFixed(2));
}

function loadArticleInfo() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    var field = document.getElementById("field-container");
    var textBox = document.createElement("input");
    textBox.setAttribute("id","name");
    textBox.setAttribute("type","text");
    textBox.readOnly = true;
    var textArea = document.createElement("div");
    textArea.setAttribute("id","description");
    var quantity = document.getElementById("quantity-container");
    var label = document.createElement("label");
    label.setAttribute("for","quantity");
    label.setAttribute("class","label-field");
    label.appendChild(document.createTextNode("Quantità"));
    var button1 = document.createElement("button");
    button1.setAttribute("class","button-minus");
    button1.setAttribute("onclick","minusPressed()");
    button1.appendChild(document.createTextNode("-"));
    var button2 = document.createElement("button");
    button2.setAttribute("id","button-plus");
    button2.setAttribute("onclick","plusPressed()");
    button2.appendChild(document.createTextNode("+"));
    var input = document.createElement("input");
    input.setAttribute("type","number");
    input.setAttribute("name","quantita");
    input.setAttribute("id","quantity");
    var nome = "";
    var quantita = 1;
    var descrizione = "";
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",host+"/PrelievoInfoArticolo",true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var resp = JSON.parse(this.responseText);
            if(resp.ok == "1"){
                nome = resp.nome;
                descrizione = resp.descrizione;
                prezzo = resp.prezzo;
                field.appendChild(textBox);
                field.appendChild(textArea);
                quantity.appendChild(label);
                quantity.appendChild(button1);
                quantity.appendChild(input);
                quantity.appendChild(button2);
                document.getElementById("name").value = nome;
                document.getElementById("description").innerHTML = descrizione;
                document.getElementById("h4price").innerHTML = "Prezzo: <span id='price'></span> €";
                document.getElementById("quantity").addEventListener("keypress", function () {
                    if (event.keyCode === 13) {
                        confirmOperation();
                    }
                });
                if(mode == "update"){
                    document.getElementById("bannerTitle").innerHTML = "Modifica";
                    var xhttp = new XMLHttpRequest();
                    xhttp.open("POST",host+"/PrelievoInfoArticoli",true);
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var resp = JSON.parse(this.responseText);
                            if (resp.articoli.length != 0) {
                                for (var i = 0; i < resp.articoli.length; i++) {
                                    if (resp.articoli[i]["codice"] == barCode) {
                                        quantita = resp.articoli[i]["quantita"];
                                        document.getElementById("quantity").value = quantita;
                                        document.getElementById("price").innerHTML = quantita*prezzo;
                                    }
                                }
                            }
                        }
                        removeLoader();
                    };
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                    xhttp.send("username="+username+"&codiceAzienda="+codiceAzienda);
                }else{
                    document.getElementById("bannerTitle").innerHTML = "Aggiunta";
                    document.getElementById("quantity").value = 1;
                    document.getElementById("price").innerHTML = resp.prezzo;
                    removeLoader();
                }
            }
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhttp.send("codice="+barCode+"&codiceAzienda="+codiceAzienda);
}

function alert() {

}