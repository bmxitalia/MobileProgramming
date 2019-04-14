var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");
var host = "http://18.225.31.222:8080/webService";
var ordini = [];

function removeLoader() {
    document.getElementById("loading").style.display = "none";
}

function openOrder(code,total) {
    location.replace("articles.html?codiceAzienda="+codiceAzienda+"&username="+username+"&codiceOrdine="+code+"&totale="+total);
}

function changeOrder() {
    document.getElementById("orders").innerHTML = "";
    var e = document.getElementById("sort");
    var choice = e.options[e.selectedIndex].value;
    if(choice == "data"){
        ordini.sort(function (a, b) {
            var d1 = Date.parse(a.data);
            var d2 = Date.parse(b.data);
            return d1>d2 ? -1 : d1<d2 ? 1 : 0;
        });
    }else{
        ordini.sort(function(a, b) {
            return parseFloat(a.totale) - parseFloat(b.totale);
        });
    }
    var order = null;
    var codice = null;
    var data = null;
    var totale = null;
    var descr = null;
    var buttons = null;
    var detailsButton = null;
    var afterDiv = null;
    var container = document.getElementById("orders");
    for (i = 0; i < ordini.length; i++) {
        order = document.createElement("div");
        order.setAttribute("class", "order");
        descr = document.createElement("div");
        descr.setAttribute("class", "order-info");
        codice = document.createElement("span");
        data = document.createElement("span");
        totale = document.createElement("span");
        codice.appendChild(document.createTextNode("Codice: "+ordini[i]["codice"]));
        data.appendChild(document.createTextNode("Data: "+ordini[i]["data"]));
        totale.appendChild(document.createTextNode("Totale: "+ordini[i]["totale"]+" EUR"));
        codice.setAttribute("class","order-code");
        data.setAttribute("class","order-data");
        totale.setAttribute("class","order-data");
        descr.appendChild(codice);
        descr.appendChild(data);
        descr.appendChild(totale);
        buttons = document.createElement("div");
        buttons.setAttribute("class", "order-button");
        detailsButton = document.createElement("button");
        detailsButton.setAttribute("class", "btn-details");
        detailsButton.innerHTML = "DETTAGLI";
        detailsButton.setAttribute("onclick", "openOrder(" + ordini[i]["codice"] + ","+ordini[i]["totale"]+")");
        buttons.appendChild(detailsButton);
        order.appendChild(descr);
        order.appendChild(buttons);
        afterDiv = document.createElement("div");
        afterDiv.setAttribute("class", "after-div");
        order.appendChild(afterDiv);
        container.appendChild(order);
    }
}

function compute(xhttp) {
    var risp = JSON.parse(xhttp.responseText);
    if(risp.ok == "0"){
        var container = document.getElementById("orders");
        var p = document.createElement("p");
        p.setAttribute("class","order-empty");
        var text = document.createTextNode("Nessun ordine effettuato");
        p.appendChild(text);
        container.appendChild(p);
    }else {
        ordini = risp.ordini;
        changeOrder();
    }
}

function loadOrders() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",host+"/PrelevaOrdini",true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            compute(this);
            removeLoader();
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhttp.send("username="+username+"&codiceAzienda="+codiceAzienda);
}
