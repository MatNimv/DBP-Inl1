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