"use strict";

const mainUser = { 
    id: 12, 
    alias: "MatildaN", 
    favs: []
    };

//kalla på mainUser direkt
showMainFirst();
async function showMainFirst(){
    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));
    const data = await getSameTasteUsers();
    
    let main = data.message.filter(main => main.id == mainUser.id);

    let mainFavs = data.message.find(user => user.id == mainUser.id).favs;

    let mainFavsInt = mainFavs.map(function(item) {return parseInt(item, 10);});

    document.querySelector("#listOfPaintings").append(loadingScreen("#listOfPaintings"));
    document.querySelector("#listOfUsers").append(loadingScreen("#listOfUsers"));

    return showPaintings(paintingArr, main, paintingArr, mainFavsInt, mainFavsInt);
}

//få ut alla users från SameTaste DB
async function getSameTasteUsers(){
    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));

    document.querySelector("#listOfUsers").innerHTML = "";
    const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    const data = await response.json();
    data.message.sort((a,b) => a.alias > b.alias);

    console.log(data);

    //flyttar mainUser längst upp
    let main = data.message.filter(main => main.id == mainUser.id);
    data.message.unshift(...main);
    data.message.splice(16,1);

    let mainFavs = data.message.find(user => user.id == mainUser.id).favs;
    let mainFavsInt = mainFavs.map(function(item) {return parseInt(item, 10);});

    document.querySelector("#listOfUsers").append(loadingScreen("#listOfUsers"));

    data.message.forEach(num => {
        let oneUser = document.createElement("div");
        oneUser.classList.add("oneUser");
        document.querySelector("#listOfUsers").append(oneUser);
        document.querySelector("#listOfUsers").firstChild.classList.add("selected");

        //cmon varför lade du in dina favoriter som strängar. man.
        let numFavInt = num.favs.map(function(item) {return parseInt(item, 10);});
        let commonFavs = numFavInt.filter(fav => mainFavsInt.includes(fav));
        let commonFavsInt = commonFavs.map(function(item) {return parseInt(item, 10);});

        let common  = commonFavsInt.filter(fav => mainFavsInt.includes(fav))

        oneUser.innerHTML = `<span>${num.alias}</span>, <span>[${num.favs.length}]</span> <span class="commonFav">(${commonFavsInt.length})</span>`;

        oneUser.addEventListener("click", (e) => {
            document.querySelector("#listOfPaintings").innerHTML = "";

            var active = document.querySelector(".selected");
            active.classList.remove("selected");
            e.target.classList.add("selected");

            let clickedUser = num.id;
            let specificUser = data.message.find(user => user.id == `${clickedUser}`);

            let mainFavPaintings = mainFavs.map(function(item) {return parseInt(item, 10);});
            let specificUserFavs = specificUser.favs.map(fave => parseInt(fave, 10));

            let filteredUserFavs = paintingArr.filter((id) => {
                let specificClickUser = specificUser.favs.map(fave => parseInt(fave, 10));
                console.log(specificClickUser);

                //om mainUser är klickad så skicka dens favoriter
                if (specificUser.id == mainUser.id){
                    return mainFavPaintings;
                } else {
                    return specificClickUser.includes((id.objectID));
                }
            });
            showPaintings(filteredUserFavs, specificUser, paintingArr, common, specificUserFavs);
        });
    });

    //tar bort mainUsers common favorit <span>.
    let allUsers = document.querySelectorAll(".oneUser");
    allUsers[0].lastElementChild.remove();
    return data;
};



//var trettionde sekund hämtas alla users.
setInterval(getSameTasteUsers, 30000);

//skapar en "laddningsskärm", beroende på vilket element som 
//skickas in som argument
function loadingScreen(whichElement){
    let loadingDiv = document.createElement("div");
    let theList = document.querySelector(`${whichElement}`);
    let darkDiv = document.createElement("div");
    loadingDiv.innerHTML = `
        <div class="lds-dual-ring"></div>
    `;

    darkDiv.classList.add("darkDiv");
    theList.append(darkDiv);
    darkDiv.append(loadingDiv);

    setInterval(() => {
        loadingDiv.remove();
        darkDiv.remove();
    }, 3000);
    return loadingDiv;
}

//hämta ut alla målningar, 1 GÅNG!!! Bara IDn här.
async function getPaintingsIDs(){
    const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=11&q=snow");
    const data = await response.json();
    return data;
}
//tar datan (IDs) från getPaintingIDs - och sätter in det i getPaintingInfo
getPaintingsIDs()
    .then(data => getPaintingInfo(data));


async function getPaintingInfo(arrayOfIDs){
    const arrayOfFetchPromises = [];

    //går genom varje ID och får tillbaka en lista av promises
    arrayOfIDs.objectIDs.forEach(oneID => {
    const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${oneID}`;
    const rqst = new Request(url);
    arrayOfFetchPromises.push(fetch(rqst));
    });

    //skapar en array av responses, från de promisen vi nyss fetchat - i en array
    const arrayOfResponses = await Promise.all(arrayOfFetchPromises);

    //av responsen vill vi mapa ut dom till varsitt JSON-objekt.
    const arrayOfJSONPromises = arrayOfResponses.map(response => response.json());
    
    //med Promise.all väntar vi på att alla promises resolvas.
    const arrayOfJSONData = await Promise.all(arrayOfJSONPromises);

    //sorterar bort onödiga nycklar från datan och skapar ny array av målningsobjekten
    let paintingArr = arrayOfJSONData.map(pain => { return {
        objectID: pain.objectID,
        primaryImageSmall: pain.primaryImageSmall,
        title: pain.title,
        artistDisplayName: pain.artistDisplayName
    }});
    paintingArr.sort((a,b) => a.artistDisplayName > b.artistDisplayName);

    //gör en string av hela arrayen , som sätts in i localStorage
    let stringyObj = JSON.stringify(paintingArr);
    localStorage.setItem(`Paintings`,`${stringyObj}`);

    return paintingArr;
};

async function showPaintings(arrayOfObjectPaintings, user, allPaintings, commonFavs, userFavs){

    const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    const data = await response.json();

    let users = await data.message;

    let array;

    if(user.id == mainUser.id){
        array = allPaintings;
    } else {
        array = arrayOfObjectPaintings;
    }

    array.sort((a,b) => a.artistDisplayName > b.artistDisplayName);

    array.forEach(element => {
        let paintingDiv = document.createElement("div");
        let listOfPaintings = document.getElementById("listOfPaintings");
        listOfPaintings.append(paintingDiv);
        paintingDiv.classList.add("onePainting");

        paintingDiv.innerHTML = `
            <img src="${element.primaryImageSmall}">

            <div class="paintingText">
                <p>${element.artistDisplayName}</p>
                <p>${element.title}</p>
            </div>
        `;

        if(userFavs.includes(element.objectID)){
            paintingDiv.classList.add("favorited");
        }
        if (commonFavs.includes(element.objectID)){
            paintingDiv.classList.add("sameFavorite");
        }

        //main skickar in som objekt i array.
        //resterande users skickar in endast som objekt.
        if(user.length == 1){
            if(user[0].id == mainUser.id){
                paintingDiv.prepend(addFavoriteWork(element.objectID, user, arrayOfObjectPaintings, users))
                if(userFavs.includes(element.objectID)){
                    //krånglig lösning. but. innan hamnade .favorited under .sameFavorite
                    //krångliga problem kräver krångliga lösningar
                    let allFavorites = document.querySelectorAll(".favorited");
                    for (let i = 0; i < allFavorites.length; i++) {
                        allFavorites[i].style.border = "10px solid rgb(141, 174, 235)";
                    }
                }
            }
        } else if (user.id == mainUser.id){
            paintingDiv.prepend(addFavoriteWork(element.objectID, user, arrayOfObjectPaintings, users))
            if(userFavs.includes(element.objectID)){
                    let allFavorites = document.querySelectorAll(".favorited");
                    for (let i = 0; i < allFavorites.length; i++) {
                        allFavorites[i].style.border = "10px solid rgb(141, 174, 235)";
                }
            }
        }
    });
}

function addFavoriteWork(paintingID, user, favoritePaintings, users){
    let button = document.createElement("button");
    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));

    let favoriteArray;

    if (user){
        user = users.find(user => user.id === mainUser.id);
        favoriteArray = user.favs;
    } else {
        favoriteArray = favoritePaintings.map(obj => obj.objectID);
    }
    //himla strängar och ints. bleh, problemlösning at its finest
    let favoriteArrayint = favoriteArray.map(function(item) {return parseInt(item, 10);});


    if (favoriteArrayint.includes(paintingID)){
        button.innerHTML = "REMOVE";
        button.classList.add("remove");
    } else {
        button.innerHTML = "ADD";
        button.classList.add("add");
    }

    button.addEventListener("click", function (e){
        if (button.classList.contains("add")){
        
        let click = e.target.nextElementSibling.currentSrc;
        let loadingClick = e.target.nextElementSibling;

        //märker divven som favorit
        let buttonParent = e.target.parentElement;

        buttonParent.style.border = "10px solid rgb(141, 174, 235)";


        let findObjectID = paintingArr.find(pain => click == pain.primaryImageSmall);

        button.innerHTML = "REMOVE";
        button.classList.add("remove");
        button.classList.remove("add");

        document.querySelector("#listOfPaintings").append(loadingScreen(`#listOfPaintings`));
        loadingClick.classList.add("pending")

        loadingClick.append(loadingScreen(".pending"))

        fetch(new Request("http://mpp.erikpineiro.se/dbp/sameTaste/users.php",
        {
            method: "PATCH",
            body: JSON.stringify({id: mainUser.id, addFav: findObjectID.objectID}),
            headers:  {"Content-type": "application/json; charset=UTF-8"},
        }))
        .then( response =>{
            if (response.status == 409){
                showUpDiv("Max antal favoriter uppnådd!", "#listOfPaintings")
                console.log("maxinum favs uppnådd");
            }else if (response.status == 404){
                console.log("user_ID finns inte i DB");
                window.alert("Max antal favoriter uppnådd!");
            }else if (response.status == 400){
                console.log("bad request: various");
            }else if (response.status == 415){
                console.log("skicka en JSON TACK.");
            }else if (response.status == 200){
                console.log("tillagning gick bra");
                window.alert("Gick bra att lägga till.")
            }else {
                return response.json();
            }});

            loadingClick.classList.remove("pending");

            } else if (button.classList.contains("remove")){
                let click = e.target.nextElementSibling.currentSrc;

                let findObjectID = paintingArr.find(pain => click == pain.primaryImageSmall);

                button.innerHTML = "ADD";
                button.classList.add("add");
                button.classList.remove("remove");
                let buttonParent = e.target.parentElement;

                buttonParent.style.border ="none";

                document.querySelector("#listOfPaintings").append(loadingScreen("#listOfPaintings"));
                buttonParent.classList.add("pending");

                buttonParent.append(loadingScreen(".pending"));

            fetch(new Request("http://mpp.erikpineiro.se/dbp/sameTaste/users.php",
            {
                method: "PATCH",
                body: JSON.stringify({id: mainUser.id, removeFav: findObjectID.objectID}),
                headers:  {"Content-type": "application/json; charset=UTF-8"}, 
            }))
            .then( response =>{
                if (response.status == 404){
                    console.log("not found: user_ID ex");
                }else if (response.status == 400){
                    console.log("bad request, various");
                }else if (response.status == 415){
                    console.log("skicka en JSON TACK.");
                }else if (response.status == 200){
                    console.log("borttagning gick bra.");
                    window.alert("Gick bra att ta bort.")
                }
                else {
                    return response.json();
                }
            });
        }
    });
    return button;
};


function felMeddelande(message, whichElement){
    let showUpDiv = document.createElement("div");
    showUpDiv.innerHTML = `${message}`;
    showUpDiv.classList.add("showUpDiv");
    showUpDiv.append(whichElement)
    return showUpDiv;
};

