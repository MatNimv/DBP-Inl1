"use strict";

const mainUser = { 
    id: 12, 
    alias: "MatildaN", 
    favs: []
    };

let paintingObj = [];
//få ut alla users från SameTaste DB
async function getSameTasteUsers(){
    const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    const data = await response.json();
    data.message.sort((a,b) => a.alias > b.alias)

    data.message.forEach(element => {
    let nameDiv = document.createElement("div");
    let listan = document.getElementById("listOfUsers");
    nameDiv.innerHTML = `${element.alias}, [${element.favs.length}] ()`;
    nameDiv.classList.add("oneUser");
    listan.append(nameDiv);
    });

    return data;
}
getSameTasteUsers();

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
    paintingArr = arrayOfJSONData.map(pain => { return {
        objectID: pain.objectID,
        primaryImageSmall: pain.primaryImageSmall,
        title: pain.title,
        artistDisplayName: pain.artistDisplayName
    }});
    paintingArr.sort((a,b) => a.artistDisplayName > b.artistDisplayName);

    //gör en string av hela arrayen , som sätts in i en localStorage
    let stringyObj = JSON.stringify(paintingArr);
    localStorage.setItem(`Paintings`,`${stringyObj}`);


    //localStorage.setItem(push(paintingObj));
    //varje målning sätts in i localStorage.
    //paintingObj.forEach(element => {
    //    localStorage.setItem(`${element.objectID}`, `${element.title}`);
    //})

    paintingObj.forEach(element => {
        let paintingDiv = document.createElement("div");
        let listOfPaintings = document.getElementById("listOfPaintings");
        paintingDiv.classList.add("onePainting")

        paintingDiv.innerHTML = `
            <img src="${element.primaryImageSmall}">
            <div class="paintingText">
                <p>${element.artistDisplayName}</p>
                <p>${element.title}</p>
            </div>
        `;
        paintingDiv.prepend(yourHandler());
        listOfPaintings.append(paintingDiv);
    });
    console.log(paintingObj);
    return paintingObj;
}

//såhär ska jag skriva för att få ut alla objekt från localStorage
    let localParse = JSON.parse(localStorage.getItem("Paintings"));
    //specifikt detta i konsolloggen
    console.log(localParse);

function yourHandler(choice){
    let button = document.createElement("button");

    button.innerHTML = "ADD";
    button.classList.add("add");

    if (button.classList.contains("add")){
        button.addEventListener("click", function (e){
            
            let click = e.target.nextElementSibling.nextElementSibling.innerHTML;
            console.log(click);
            console.log(e.target);

        let request = new Request('http://mpp.erikpineiro.se/dbp/sameTaste/users.php');
        fetch(request), 
        {
        method: "PATCH",
        body: JSON.stringify({id: mainUser.id, addFav: []}),
        headers: {"Content-type": "application/json; charset=UTF-8"}, 
        }
        })
    }
    return button;
}