var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");

function goToApp() {
    location.replace("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username);
}