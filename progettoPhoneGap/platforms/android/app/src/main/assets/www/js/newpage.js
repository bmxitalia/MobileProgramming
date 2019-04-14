var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");

function onBackKeyDown() {
    window.plugins.nativepagetransitions.slide({
        "direction" : "right",
        "href" : "homepage.html?codiceAzienda="+codiceAzienda+"&username="+username
    });
}

function charge() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function goToApp() {
    window.plugins.nativepagetransitions.slide({
        "href" : "homepage.html?codiceAzienda="+codiceAzienda+"&username="+username
    });
    //location.replace("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username);
}