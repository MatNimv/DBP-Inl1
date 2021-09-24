"use strict";

const mainUser = { 
    id: 12, 
    alias: "MatildaN", 
    favs: []
    };

showPaintings(JSON.parse(localStorage.getItem("Paintings")));

getSameTasteUsers();
//få ut alla users från SameTaste DB
async function getSameTasteUsers(){
    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));
    document.querySelector("#listOfUsers").innerHTML = "";
    const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    const data = await response.json();
    data.message.sort((a,b) => a.alias > b.alias);

    //flyttar mainUser längst upp
    let main = data.message.filter(main => main.id == mainUser.id);
    data.message.unshift(...main);
    data.message.splice(16,1);

    //let userName = document.createElement("div");
    //userName.innerHTML = "MatildaNs målningar"
    //document.querySelector("#userName").prepend(userName);


    data.message.forEach(element => {
        let commonFavsArr = [];

        //commonFavsArr jämför favoritmålningar mellan användare
        let userFavs = element.favs.map(function(item) {return parseInt(item, 10);});
        let main = data.message.find(user => user.id == mainUser.id).favs;
        let mainFavs = main.map(function(item) {return parseInt(item, 10);});
        let checkDifference = userFavs.filter((fav) => mainFavs.includes(fav));
        commonFavsArr.push(...checkDifference);

        let nameDiv = document.createElement("div");
        let listan = document.getElementById("listOfUsers");

        if(element.id == mainUser.id){nameDiv.classList.add("selected")};

        nameDiv.innerHTML = `<span>${element.alias}</span>, <span>[${element.favs.length}] (${commonFavsArr.length})</span>`;
        nameDiv.classList.add("oneUser");
        listan.append(nameDiv);
    });

        //när jag klickar på en specifik användare hämtar jag dens
        //information och jämför med mainUser.
        document.querySelector("#listOfUsers").append(loadingScreen("#listOfUsers"));

        document.querySelector("#listOfUsers").addEventListener("click", function(e){
            document.querySelector("#listOfPaintings").innerHTML = "";
            let clickedUser = e.target.firstChild.innerHTML;

            var active = document.querySelector(".selected");
            active.classList.remove("selected");

            //userName.innerHTML = `${clickedUser}s`;

            e.target.classList.add("selected");

            //jag måste koppla mina favoriter med deras.
            //samtidigt få fram alla deras favvosar. 
            let specificClickUser = data.message.find(user => user.alias == `${clickedUser}`);

            //skapar om eventuella strings i favs till int
            let specificClickUserFAVS = specificClickUser.favs.map(function(item) {return parseInt(item, 10);});

            //byter ut den gamla sträng favs till int favs
            specificClickUser.favs = [];
            specificClickUser.favs.push(...specificClickUserFAVS);

            //mainUsers favoriter.
            let myFavIDs = data.message.find(user => user.id == mainUser.id).favs;

            if (specificClickUser.id == mainUser.id){
                //mainUsers favvomålningar
                let mainUserFavs = paintingArr.filter((ID) => specificClickUser.favs.includes(ID.objectID));
                showPaintings(mainUserFavs);
                //resterande målningar
                let otherPaintings = paintingArr.filter((ID) => !specificClickUser.favs.includes(ID.objectID));
                showPaintings(otherPaintings);
            } else {

            //jämför mainUsers favoriter med den specifika användarens favoriter
            //om de som är samma, läggs till i arrayen.
            let comparableFavIDs = myFavIDs.filter((ID) => specificClickUser.favs.includes(ID));

            let commonFavs = paintingArr.filter(pain => pain.objectID == comparableFavIDs)
            console.log(commonFavs);
            //commonFavsArr.push(commonFavsArr);
            showPaintings(commonFavs, "remove");

            //jämför målningar mellan localStorage och den specifika 
            //användarens favoriter. visar bara dennes.
            let specificUserFavs = paintingArr.filter((ID) => specificClickUser.favs.includes(ID.objectID));
            console.log(specificUserFavs);

            loadingScreen("#listOfPaintings");
            showPaintings(specificUserFavs);
        }
    });
    return data;
}

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
    .then(data => getPaintingInfo(data))


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

function showPaintings(arrayOfObjectPaintings, klass){

    arrayOfObjectPaintings.sort((a,b) => a.artistDisplayName > b.artistDisplayName);

    arrayOfObjectPaintings.forEach(element => {
        let paintingDiv = document.createElement("div");
        let listOfPaintings = document.getElementById("listOfPaintings");
        paintingDiv.classList.add("onePainting");
        paintingDiv.classList.add(`${klass}`);

        paintingDiv.innerHTML = `
            <img src="${element.primaryImageSmall}">
            <div class="paintingText">
                <p>${element.artistDisplayName}</p>
                <p>${element.title}</p>
            </div>
        `;
        paintingDiv.prepend(yourHandler(klass));
        listOfPaintings.append(paintingDiv);
    });
}

function yourHandler(klass){

    //här behövs en jämförelse göras då jag 
    //kallar på datan från getUserSameTaste
    let button = document.createElement("button");
//
    //document.querySelector("#listOfUsers").innerHTML = "";
    //const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    //const data = await response.json();

    //om objectID är inom mainUser favorit - ge knappen denna innerHMTL. REMOVE
    

    //om objectID är gemensam med mainUser och specifikUser favorit - ge knappen denna innerHMTL. REMOVE

    //om objectID är ingetdera - ge knappen denna innerHMTL. ADD

    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));

    button.innerHTML = `add`;
    button.classList.add(`add`);

    button.addEventListener("click", function (e){
        if (button.classList.contains("add")){
        console.log("add");
        
        let click = e.target.nextElementSibling.currentSrc;

        let findObjectID = paintingArr.find(pain => click == pain.primaryImageSmall);
        console.log(findObjectID.objectID);

        button.innerHTML = "REMOVE";
        button.classList.add("remove");
        button.classList.remove("add");

        document.querySelector("#listOfPaintings").append(loadingScreen("#listOfPaintings"));

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
            }else if (response.status == 400){
                console.log("bad request: various");
            }else if (response.status == 415){
                console.log("skicka en JSON TACK.");
            }else if (response.status == 200){
                console.log("tillagning gick bra");
            }else {
                return response.json();
            }});

            } else if (button.classList.contains("remove")){
                let click = e.target.nextElementSibling.currentSrc;

                let findObjectID = paintingArr.find(pain => click == pain.primaryImageSmall);
                console.log(findObjectID.objectID);

                button.innerHTML = "ADD";
                button.classList.add("add");
                button.classList.remove("remove");

                document.querySelector("#listOfPaintings").append(loadingScreen("#listOfPaintings"));

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

