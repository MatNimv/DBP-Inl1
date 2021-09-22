"use strict";

const mainUser = { 
    id: 12, 
    alias: "MatildaN", 
    favs: []
    };

getSameTasteUsers();
//få ut alla users från SameTaste DB
async function getSameTasteUsers(){
    document.querySelector("#listOfUsers").innerHTML = "";
    const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    const data = await response.json();
    data.message.sort((a,b) => a.alias > b.alias);

    data.message.forEach(element => {
    let nameDiv = document.createElement("div");
    let listan = document.getElementById("listOfUsers");
    nameDiv.innerHTML = `<span>${element.alias}</span>, <span>[${element.favs.length}] ()</span>`;
    nameDiv.classList.add("oneUser");
    listan.append(nameDiv);
    });

    document.querySelector("#listOfUsers").append(loadingScreen("#listOfUsers"));

    //här väljer man vilken user som ska visas. Den ska hämta users från DB 
    //och jämför med localStoragens objID
    //ska hämta showPaintings() och skicka in array av den user som är valds paintings
    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));

    document.querySelector("#listOfUsers").addEventListener("click", (e) => {
        document.querySelector("#listOfPaintings").innerHTML = "";
            let clickedUser = e.target.firstChild.innerHTML;

            //jag måste koppla mina favoriter med deras.
            //samtidigt 

            let specificUser = data.message.find(user => user.alias == `${clickedUser}`);
            console.log(specificUser);

            let filteredUserFavs = paintingArr.filter((ID) => specificUser.favs.includes(ID.objectID));

    console.log(filteredUserFavs);
    showPaintings(filteredUserFavs);
});
return data;
}

//var trettionde sekund hämtas alla users.
setInterval(getSameTasteUsers, 30000);
//skapar en "laddningsskärm", beroende på vilket element som skickas in
//som argument

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

//parametern är 
function whichUser(){

    showPaintings(JSON.parse(localStorage.getItem("Paintings")));
}
whichUser();

function showPaintings(arrayOfObjectPaintings){
    arrayOfObjectPaintings.forEach(element => {
        let paintingDiv = document.createElement("div");
        let listOfPaintings = document.getElementById("listOfPaintings");
        paintingDiv.classList.add("onePainting");

        paintingDiv.innerHTML = `
            <img class="image" src ="${element.primaryImageSmall}">
            <div class="paintingText">
                <p>${element.artistDisplayName}</p>
                <p>${element.title}</p>
            </div>
        `;
        paintingDiv.prepend(yourHandler());
        listOfPaintings.append(paintingDiv);
    });
}

function yourHandler(){
    let button = document.createElement("button");

    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));

    button.innerHTML = "ADD";
    button.classList.add("add");

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
            body: JSON.stringify({id: mainUser.id, addFav: `${findObjectID.objectID}`}),
            headers:  {"Content-type": "application/json; charset=UTF-8"},
        }))
        .then( response =>{
            if (response.status == 409){
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



