var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");
var codiceOrdine = url.searchParams.get("codiceOrdine");
var totale = url.searchParams.get("totale")
var host = "http://18.225.31.222:8080/webService";

function onBackKeyDown() {
    window.plugins.nativepagetransitions.slide({
        "direction" : "right",
        "href" : "order.html?codiceAzienda="+codiceAzienda+"&username="+username
    });
    //location.replace("order.html?codiceAzienda="+codiceAzienda+"&username="+username);
}

function removeLoader() {
    document.getElementById("loading").style.display = "none";
}

function compute(xhttp) {
    document.getElementById("orderNumber").innerHTML = codiceOrdine;
    var risp = JSON.parse(xhttp.responseText);
    document.getElementById("h4price").innerHTML = "Totale: <span id='totale'></span> €";
    if(risp.ok == "0"){
        var container = document.getElementById("article-list");
        var p = document.createElement("p");
        p.setAttribute("class","order-empty");
        var text = document.createTextNode("Nessun articoli in inventario");
        p.appendChild(text);
        container.appendChild(p);
    }else {
        var articolo = null;
        var h41 = null;
        var h42 = null;
        var container = document.getElementById("article-list");
        for (i = 0; i < risp.articoli.length; i++) {
            articolo = document.createElement("div");
            h41 = document.createElement("h4");
            h42 = document.createElement("h4");
            articolo.setAttribute("class", "article");
            h41.appendChild(document.createTextNode(risp.articoli[i]["barCode"]+" - "+risp.articoli[i]["nome"]+"(x"+risp.articoli[i]["quantita"]+")"));
            h42.appendChild(document.createTextNode(risp.articoli[i]["prezzo"]+" € - "+risp.articoli[i]["parziale"] + " €"))
            articolo.appendChild(h41);
            articolo.appendChild(h42);
            container.appendChild(articolo);
        }
        document.getElementById("totale").innerHTML = totale;
    }
}


function loadArticles() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",host+"/PrelevaDatiOrdine",true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            compute(this);
            removeLoader();
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhttp.send("codiceAzienda="+codiceAzienda+"&codiceOrdine="+codiceOrdine);
}
