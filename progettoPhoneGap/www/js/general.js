var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");

function logout() {
    var ok = confirm("Sicuro di voler effettuare il logout?");
    if (ok){
        window.localStorage["loggedIn"] = "false";
        location.replace("login.html");
    }
}

if(url.href.includes("homepage.html")){
    document.getElementById("menu-cart").addEventListener("click",deleteMenu);
    document.getElementById("menu-shop").setAttribute("href","inventory.html?codiceAzienda="+codiceAzienda+"&username="+username);
    document.getElementById("menu-order").setAttribute("href","order.html?codiceAzienda="+codiceAzienda+"&username="+username);
    document.getElementById("logout").addEventListener("click",logout);
    document.getElementById("tuto").setAttribute("href","newpage.html?codiceAzienda="+codiceAzienda+"&username="+username);
}else if(url.href.includes("inventory.html")){
    document.getElementById("menu-cart").setAttribute("href","homepage.html?codiceAzienda="+codiceAzienda+"&username="+username)
    document.getElementById("menu-shop").addEventListener("click",deleteMenu);
    document.getElementById("menu-order").setAttribute("href","order.html?codiceAzienda="+codiceAzienda+"&username="+username);
    document.getElementById("logout").addEventListener("click",logout);
    document.getElementById("tuto").setAttribute("href","newpage.html?codiceAzienda="+codiceAzienda+"&username="+username);
}else if(url.href.includes("order.html")){
    document.getElementById("menu-cart").setAttribute("href","homepage.html?codiceAzienda="+codiceAzienda+"&username="+username)
    document.getElementById("menu-shop").setAttribute("href","inventory.html?codiceAzienda="+codiceAzienda+"&username="+username);
    document.getElementById("menu-order").addEventListener("click",deleteMenu);
    document.getElementById("logout").addEventListener("click",logout);
    document.getElementById("tuto").setAttribute("href","newpage.html?codiceAzienda="+codiceAzienda+"&username="+username);
}else{
    document.getElementById("menu-cart").setAttribute("href","homepage.html?codiceAzienda="+codiceAzienda+"&username="+username)
    document.getElementById("menu-shop").setAttribute("href","inventory.html?codiceAzienda="+codiceAzienda+"&username="+username);
    document.getElementById("menu-order").setAttribute("href","order.html?codiceAzienda="+codiceAzienda+"&username="+username);
    document.getElementById("logout").addEventListener("click",logout);
    document.getElementById("tuto").setAttribute("href","newpage.html?codiceAzienda="+codiceAzienda+"&username="+username);
}
var menuListener = document.getElementsByClassName("navbar-fostrap")[0];
var containerListener = document.getElementsByClassName("body-container")[0];
var footerListener = document.getElementsByClassName("banner-button")[0];
menuListener.addEventListener("click",openMenu);
containerListener.addEventListener("click",deleteMenu);
document.getElementById("user").innerHTML = username;
document.getElementById("company").innerHTML = codiceAzienda;
if(footerListener != null){
    footerListener.addEventListener("click",deleteMenu);
}


function openMenu() {
    var body = document.getElementsByTagName("BODY")[0].classList;
    var menu = document.getElementById("mobile-menu").classList;
    if(body.contains("cover-big") && menu.contains("visible")){
        deleteMenu();
    }else{
        body.add("cover-big");
        menu.add("visible");
    }
}

function deleteMenu() {
    var body = document.getElementsByTagName("BODY")[0].classList;
    var menu = document.getElementById("mobile-menu").classList;
    if(body.contains("cover-big") && menu.contains("visible")){
        body.remove("cover-big");
        menu.remove("visible");
    }
}