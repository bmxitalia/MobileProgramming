var urlString = window.location.href;
var url = new URL(urlString);
var codiceAzienda = url.searchParams.get("codiceAzienda");
var username = url.searchParams.get("username");

function logout() {
    navigator.notification.confirm("Sicuro di voler effettuare il logout?", function (index) {
        if(index == 1){
            window.localStorage["loggedIn"] = "false";
            window.plugins.nativepagetransitions.slide({
                "direction" : "right",
                "href" : "login.html"
            });
            //location.replace("login.html");
        }
    },
    "Conferma", ["OK","Annulla"]);
}

function go(url) {
    window.plugins.nativepagetransitions.slide({
        "href" : url
    });
}

if(url.href.includes("homepage.html")){
    document.getElementById("menu-cart").addEventListener("click",deleteMenu);
    document.getElementById("menu-shop").addEventListener("click",function(){
        go("inventory.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("menu-order").addEventListener("click",function(){
        go("order.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("logout").addEventListener("click",logout);
    document.getElementById("tuto").addEventListener("click",function(){
        go("newpage.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
}else if(url.href.includes("inventory.html")){
    document.getElementById("menu-cart").addEventListener("click",function(){
        go("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("menu-shop").addEventListener("click",deleteMenu);
    document.getElementById("menu-order").addEventListener("click",function(){
        go("order.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("logout").addEventListener("click",logout);
    document.getElementById("tuto").addEventListener("click",function(){
        go("newpage.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
}else if(url.href.includes("order.html")){
    document.getElementById("menu-cart").addEventListener("click",function(){
         go("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("menu-shop").addEventListener("click",function(){
         go("inventory.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("menu-order").addEventListener("click",deleteMenu);
    document.getElementById("logout").addEventListener("click",logout);
    document.getElementById("tuto").addEventListener("click",function(){
        go("newpage.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
}else{
    document.getElementById("menu-cart").addEventListener("click",function(){
         go("homepage.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("menu-shop").addEventListener("click",function(){
         go("inventory.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("menu-order").addEventListener("click",function(){
          go("order.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
    document.getElementById("logout").addEventListener("click",logout);
    document.getElementById("tuto").addEventListener("click",function(){
        go("newpage.html?codiceAzienda="+codiceAzienda+"&username="+username);
    });
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