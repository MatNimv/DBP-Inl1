"use strict";

//få ut alla users från SameTaste DB

async function getSameTasteUsers(){
    const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
    const data = await response.json();

    data.message.forEach(element => {
    let nameDiv = document.createElement("div");
    let listan = document.getElementById("listOfUsers");
    nameDiv.innerHTML = `${element.alias}, ${element.favs.length}st favoriter`;
    nameDiv.classList.add("oneUser");
    listan.append(nameDiv);
    });
}
getSameTasteUsers();

//hämta ut alla målningar, 1 GÅNG!!!

async function getPaintingsIDs(){
    const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=11&q=snow");
    const data = await response.json();
    return data;
}
getPaintingsIDs()
    .then(data => getPaintingInfo(data))


//tar datan (IDs) från getPaintingIDs - och sätter in det i getPaintingInfo
async function getPaintingInfo(arrayOfIDs){
    const arrayOfFetchPromises = [];

    //går genom varje ID och får tillbaka en lista av promises
    arrayOfIDs.objectIDs.forEach(oneID => {
    const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${oneID}`;
    const rqst = new Request(url);
    arrayOfFetchPromises.push(fetch(rqst));
    });

    const arrayOfResponses = await Promise.all(arrayOfFetchPromises);

    const arrayOfJSONPromises = arrayOfResponses.map(response => response.json());
    const arrayOfJSONData = await Promise.all(arrayOfJSONPromises);

    //sorterar bort nycklarna från datan och skapar ny array av målningsobjekten
    let paintingObj = arrayOfJSONData.map(pain => { return {
        objectID: pain.objectID,
        primaryImageSmall: pain.primaryImageSmall,
        title: pain.title,
        artistDisplayName: pain.artistDisplayName
    }

    })
    console.log(paintingObj);
    paintingObj.forEach(element => {
        localStorage.setItem(`${element.objectID}`, `${element.title}`);
        //localStorage.setItem(`${JSON.parse(element.objectID)}, ${JSON.parse(element.title)}`);
    })

}
console.log(sessionStorage.getItem("436011"));
