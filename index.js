"use strict";

const mainUser = 12;

//få ut alla users från SameTaste DB
async function getSameTasteUsers(){
    const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    const data = await response.json();
    console.log(data);
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
    const objectsArray = [];

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
    let paintingObj = arrayOfJSONData.map(pain => { return {
        objectID: pain.objectID,
        primaryImageSmall: pain.primaryImageSmall,
        title: pain.title,
        artistDisplayName: pain.artistDisplayName
    }});
    paintingObj.sort((a,b) => a.artistDisplayName > b.artistDisplayName);

    //varje painting object sätts in till en array
    //arrayen blir ett returnvärde för nästa funktion
    objectsArray.push(paintingObj);
    //varje målning sätts in i localStorage.
    paintingObj.forEach(element => {
        localStorage.setItem(`${element.title}`, `${element.objectID}`);
    })

    //paintingObj.forEach(element => {
    //    let paintingDiv = document.createElement("div");
    //    let listOfPaintings = document.getElementById("listOfPaintings");
//
    //    paintingDiv.innerHTML = `
    //    <div class="onePainting">
    //    <button class="add">ADD</button>
    //        <img src="${element.primaryImageSmall}">
    //        <div class="paintingText">
    //            <p>${element.artistDisplayName}</p>
    //            <p>${element.title}</p>
    //        </div>
    //    </div>
    //    `;
    //    listOfPaintings.append(paintingDiv);
    //});
    console.log(objectsArray);
    return objectsArray;
}

function showPaintings(paintingObjsArray){
    
    console.log(getPaintingInfo(paintingObjsArray));
    getPaintingInfo(paintingObjsArray).forEach(element => {
        let paintingDiv = document.createElement("div");
        let listOfPaintings = document.getElementById("listOfPaintings");

        paintingDiv.innerHTML = `
        <div class="onePainting">
            <img src="${element.primaryImageSmall}">
            <div class="paintingText">
                <p>${element.artistDisplayName}</p>
                <p>${element.title}</p>
            </div>
        </div>
        `;
        listOfPaintings.append(paintingDiv);
    });
}
showPaintings();
//showPaintings(getPaintingInfo)

//addera en målning till favoritlistan. uH
document.querySelector("#listOfPaintings").addEventListener("click", function(){
    //koppla ihop .add knappens målning (titel på målning) med dess objectID
    //som sedan sätts in i addFav.
    let findTitle = 
    fetch(new Request("http://mpp.erikpineiro.se/dbp/sameTaste/users.php",
    {
        method: "PATCH",
        body: JSON.stringify({id: mainUser, addFav: objectID}),
        headers:  {"Content-type": "application/json; charset=UTF-8"}, 
    }))
    .then( response =>{
        if (response.status == 409){
            console.log("no more favs");
        }
        else if (response.status == 404){
            console.log("finns ej.");
        }else if (response.status == 400){
            console.log("nah");
        }else if (response.status == 415){
            console.log("skicka en JSON TACK.");
        }else {
            return response.json();
        }
    })
});


function deleteFav(){

}
