//fetch(rqst) Vi ska främst använda async och await.
//    .then(resp => resp.json())
//    .then( data => {
        //console.log(data);

    //    data.message.forEach(element => {
    //    let nameDiv = document.createElement("div");
    //    let listan = document.getElementById("listOfUsers");
    //    nameDiv.innerHTML = `${element.alias}, ${element.favs.length}`;
    //    nameDiv.classList.add("oneUser");
    //    listan.append(nameDiv);
    //    })
    //});

    //inte mer än 2 specifika scrollbars på sidan. Men på punkt 10 grafiken
    //säger du att om viewern är mindre = scrollbars. EH??


    //genom datan från getPaintingInfo, sätts det in i showPaintings.
//getPaintingInfo()
//    .then(data => showPaintings(data))


//function showPaintings(paintingObjsArray){
//    
//    console.log(getPaintingInfo(paintingObjsArray));
//    getPaintingInfo(paintingObjsArray).forEach(element => {
//        let paintingDiv = document.createElement("div");
//        let listOfPaintings = document.getElementById("listOfPaintings");
//
//        paintingDiv.innerHTML = `
//        <div class="onePainting">
//            <img src="${element.primaryImageSmall}">
//            <div class="paintingText">
//                <p>${element.artistDisplayName}</p>
//                <p>${element.title}</p>
//            </div>
//        </div>
//        `;
//        listOfPaintings.append(paintingDiv);
//    });
//}

//addera en målning till favoritlistan. uH
//document.querySelector(".add").addEventListener("click", function(){
//    //koppla ihop .add knappens målning (titel på målning) med dess objectID
//    //som sedan sätts in i addFav.
//    let findTitle = 
//    fetch(new Request("http://mpp.erikpineiro.se/dbp/sameTaste/users.php",
//    {
//        method: "PATCH",
//        body: JSON.stringify({id: mainUser, addFav: objectID}),
//        headers:  {"Content-type": "application/json; charset=UTF-8"}, 
//    }))
//    .then( response =>{
//        if (response.status == 409){
//            console.log("no more favs");
//        }
//        else if (response.status == 404){
//            console.log("finns ej.");
//        }else if (response.status == 400){
//            console.log("nah");
//        }else if (response.status == 415){
//            console.log("skicka en JSON TACK.");
//        }else {
//            return response.json();
//        }
//    })
//});

//jag vet inte hur jag ska hantera flera klasser med samma klassnamn
//so yah
//if (document.body.addEventListener){
//    document.body.addEventListener('click',yourHandler,false);
//}
//else{
//    document.body.attachEvent('onclick',yourHandler);
//}
//
//function yourHandler(e){
//    e = e || window.event;
//    var target = e.target || e.srcElement;
//    if (target.className.match("add"))
//    {
//    //koppla ihop .add knappens målning (titel på målning) med dess objectID
//    //som sedan sätts in i addFav.
//
//    //let findImageID = paintingObj.find(painting => {
//    //    target.nextSibling.nextSibling.lastChild.innerHTML == painting.title;
//    //});
//
//    let click = target.nextSibling.nextSibling.innerHTML;
//    console.log(click);
//    fetch(new Request("http://mpp.erikpineiro.se/dbp/sameTaste/users.php",
//    {
//        method: "PATCH",
//        body: JSON.stringify({id: mainUser.id, addFav: objectID}),
//        headers:  {"Content-type": "application/json; charset=UTF-8"}, 
//    }))
//    .then( response =>{
//        if (response.status == 409){
//            console.log("no more favs");
//        }
//        else if (response.status == 404){
//            console.log("finns ej.");
//        }else if (response.status == 400){
//            console.log("nah");
//        }else if (response.status == 415){
//            console.log("skicka en JSON TACK.");
//        }else {
//            return response.json();
//
//        }console.log("hej");//an element with the keyword Class was clicked
//    })
//}}

//function findButton(e){
//
//    if(e.target.classList.includes("add")){
////addera en målning till favoritlistan. uH
//document.querySelector(".add").addEventListener("click", function(){
//    //koppla ihop .add knappens målning (titel på målning) med dess objectID
//    //som sedan sätts in i addFav.
//    let findTitle = 
//    fetch(new Request("http://mpp.erikpineiro.se/dbp/sameTaste/users.php",
//    {
//        method: "PATCH",
//        body: JSON.stringify({id: mainUser, addFav: objectID}),
//        headers:  {"Content-type": "application/json; charset=UTF-8"}, 
//    }))
//    .then( response =>{
//        if (response.status == 409){
//            console.log("no more favs");
//        }
//        else if (response.status == 404){
//            console.log("finns ej.");
//        }else if (response.status == 400){
//            console.log("nah");
//        }else if (response.status == 415){
//            console.log("skicka en JSON TACK.");
//        }else {
//            return response.json();
//        }
//        console.log("hej");
//    })
//});
//}
//}

    //localStorage.setItem(push(paintingObj));
    //varje målning sätts in i localStorage.
    //paintingObj.forEach(element => {
    //    localStorage.setItem(`${element.objectID}`, `${element.title}`);
    //})


    async function getSameTasteUsers(){
        document.querySelector("#listOfUsers").innerHTML = "";
        const response = await fetch("http://mpp.erikpineiro.se/dbp/sameTaste/users.php");
        const data = await response.json();
        data.message.sort((a,b) => a.alias > b.alias);
    
        //flyttar mainUser längst upp
        let main = data.message.filter(main => main.id == mainUser.id);
        data.message.unshift(...main);
        data.message.splice(16,1);
    
        data.message.forEach(element => {
        let nameDiv = document.createElement("div");
        let listan = document.getElementById("listOfUsers");
        nameDiv.innerHTML = `<span>${element.alias}</span>, <span>[${element.favs.length}] ()</span>`;
        nameDiv.classList.add("oneUser");
        listan.append(nameDiv);
        });
        document.querySelector("#listOfUsers").append(loadingScreen("#listOfUsers"));
    
            let paintingArr = JSON.parse(localStorage.getItem("Paintings"));
    
        document.querySelector("#listOfUsers").addEventListener("click", (e) => {
            document.querySelector("#listOfPaintings").innerHTML = "";
            let clickedUser = e.target.firstChild.innerHTML;
            console.log(clickedUser);
    
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
            showPaintings(commonFavs, "remove");
    
            //jämför målningar mellan localStorage och den specifika 
            //användarens favoriter. visar bara dennes.
            let specificUserFavs = paintingArr.filter((ID) => specificClickUser.favs.includes(ID.objectID));
            console.log(specificUserFavs);
    
            loadingScreen("#listOfPaintings");
            showPaintings(specificUserFavs);
        }
        //2. sätt samman gemensamma favoriter och deras. DONE. inte i ordning tho
        //3. return data ska vara ett objekt med data + en funktion.
        //4. laddsymbol när en användare trycks. DONE
        });
    return data;
    }

    //document.querySelector("#listOfUsers").addEventListener("click", specifikUserIsClicked(getSameTasteUsers));

//function specifikUserIsClicked(data){
//    //här väljer man vilken user som ska visas. Den ska hämta users från DB 
//    //och jämför med localStoragens objID
//    //ska hämta showPaintings() och skicka in array av den user som är valds paintings
//    let paintingArr = JSON.parse(localStorage.getItem("Paintings"));
//
//    document.querySelector("#listOfUsers").addEventListener("click", (e) => {
//        
//})