"use strict";

const mainUser = { 
    id: 12, 
    alias: "MatildaN", 
    favs: []
    };

//mainUser är annorlunda från de andra users. kräver annorlunda parametrar till showPaintings
async function showMainFirst(dataInfo){
    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));
    
    let main = dataInfo.message.filter(main => main.id == mainUser.id);

    let mainFavs = dataInfo.message.find(user => user.id == mainUser.id).favs;

    let mainFavsInt = mainFavs.map(function(item) {return parseInt(item, 10);});

    document.querySelector("#listOfPaintings").append(loadingScreen("#listOfPaintings"));

    return showPaintings(paintingArr, main, paintingArr, mainFavsInt, mainFavsInt);
}

getSameTasteUsers();
//få ut alla users från SameTaste API
async function getSameTasteUsers(){
    const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    const data = await response.json();

    document.querySelector("#listOfUsers").append(loadingScreen("#listOfUsers"));

    return data;
};

//kör showMainFirst direkt efter datan har hämtats från getSameTasteUsers
//när man laddar om sidan
getSameTasteUsers()
    .then(data => showMainFirst(data));

showUsers();
async function showUsers(){
    document.querySelector("#listOfUsers").innerHTML = "";
    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));
    const data = await getSameTasteUsers();

    data.message.sort((a,b) => a.alias > b.alias);

    //flyttar mainUser längst upp
    let main = data.message.filter(main => main.id == mainUser.id);
    data.message.unshift(...main);
    data.message.splice(16,1);

    let mainFavs = data.message.find(user => user.id == mainUser.id).favs;
    let mainFavsInt = mainFavs.map(function(item) {return parseInt(item, 10);});

    data.message.forEach(num => {
        let oneUser = document.createElement("div");
        oneUser.classList.add("oneUser");
        document.querySelector("#listOfUsers").append(oneUser);

        //cmon varför lade du in dina favoriter som strängar. man.
        let numFavInt = num.favs.map(function(item) {return parseInt(item, 10);});
        let commonFavs = numFavInt.filter(fav => mainFavsInt.includes(fav));
        let commonFavsInt = commonFavs.map(function(item) {return parseInt(item, 10);});

        let common  = commonFavsInt.filter(fav => mainFavsInt.includes(fav))

        oneUser.innerHTML = `<span>${num.alias}</span>, <span>[${num.favs.length}]</span> <span class="commonFav">(${commonFavsInt.length})</span>`;

        oneUser.addEventListener("click", (e) => {
            document.querySelector("#listOfPaintings").innerHTML = "";
            document.querySelector("#listOfPaintings").append(loadingScreen("#listOfPaintings"));

            var active = document.querySelector(".userSelected");
            active.classList.remove("userSelected");
            e.target.classList.add("userSelected");

            let clickedUser = num.id;
            let specificUser = data.message.find(user => user.id == `${clickedUser}`);

            let mainFavPaintings = mainFavs.map(function(item) {return parseInt(item, 10);});
            let specificUserFavs = specificUser.favs.map(fave => parseInt(fave, 10));

            let filteredUserFavs = paintingArr.filter((id) => {
                let specificClickUser = specificUser.favs.map(fave => parseInt(fave, 10));

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
    //mainUser är selectad först.
    let allUsers = document.querySelectorAll(".oneUser");
    allUsers[0].classList.add("userSelected");

    //tar bort mainUsers common favorit <span>.
    allUsers[0].lastElementChild.remove();
}


//var trettionde sekund hämtas alla users.
setInterval(showUsers, 30000);

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
    }, 2500);
    return loadingDiv;
}


//vill endast hämta ut från APIn om det inte finns i localStorage.
//if(localStorage.length === 0){

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


//denna funktionen visar alla målningar, beroende på vem det klickas på.
//den skickar med 
//arrayOfObjectPaintings = användarens array
//user = användaren - hela objektet
//allPaintings = ALLA målningar. från localStorage
//commonfavs = alla gemensamma favvisar med mainUser.
//userFavs = endast användarens favvisar.
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
                    //ful lösning. men. innan hamnade .favorited under .sameFavorite
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
        
        //uppdaterar APIn.
        document.querySelector("#listOfUsers").append(loadingScreen("#listOfUsers"));
        showUsers();
        
        //får informationen om bilden, som kopplas till localStorage
        let click = e.target.nextElementSibling.currentSrc;

        //märker hela divven som har målningsinformation som favorit
        let buttonParent = e.target.parentElement;

        buttonParent.style.border = "10px solid rgb(141, 174, 235)";

        let findObjectID = paintingArr.find(pain => click == pain.primaryImageSmall);

        button.innerHTML = "REMOVE";
        button.classList.add("remove");
        button.classList.remove("add");

        buttonParent.append(loadingScreen(".onePainting"));

        fetch(new Request("http://mpp.erikpineiro.se/dbp/sameTaste/users.php",
        {
            method: "PATCH",
            body: JSON.stringify({id: mainUser.id, addFav: findObjectID.objectID}),
            headers:  {"Content-type": "application/json; charset=UTF-8"},
        }))
        .then( response =>{
            if (response.status == 409){
                window.alert("Max antal favoriter uppnådd!");
                buttonParent.style.border = "none";
                button.innerHTML = "ADD";
            }else if (response.status == 404){
                console.log("user_ID finns inte i DB");
                window.alert("Användaren finns inte i databasen.");
                buttonParent.style.border = "10px solid rgb(141, 174, 235)";
            }else if (response.status == 400){
                window.alert("Bad request.");
                buttonParent.style.border = "10px solid rgb(141, 174, 235)";
            }else if (response.status == 415){
                window.alert("Databasen kräver en JSON.");
                buttonParent.style.border = "10px solid rgb(141, 174, 235)";
            }else if (response.status == 200){
                window.alert("Favorit tillagd.")
            }else {
                return response.json();
            }});

            } else if (button.classList.contains("remove")){
                
                document.querySelector("#listOfUsers").append(loadingScreen("#listOfUsers"));
                showUsers();
                let click = e.target.nextElementSibling.currentSrc;

                let findObjectID = paintingArr.find(pain => click == pain.primaryImageSmall);

                button.innerHTML = "ADD";
                button.classList.add("add");
                button.classList.remove("remove");
                let buttonParent = e.target.parentElement;

                buttonParent.style.border ="none";

                buttonParent.append(loadingScreen(".onePainting"));

            fetch(new Request("http://mpp.erikpineiro.se/dbp/sameTaste/users.php",
            {
                method: "PATCH",
                body: JSON.stringify({id: mainUser.id, removeFav: findObjectID.objectID}),
                headers:  {"Content-type": "application/json; charset=UTF-8"}, 
            }))
            .then( response =>{
                if (response.status == 404){
                    window.alert("Användaren finns inte i databasen.");
                }else if (response.status == 400){
                    window.alert("Bad request.");
                }else if (response.status == 415){
                    window.alert("Databasen kräver en JSON.");
                }else if (response.status == 200){
                    window.alert("Favorit borttagen.")
                }
                else {
                    return response.json();
                }
            });
        }
    });
    return button;
};
}