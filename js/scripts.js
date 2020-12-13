var searchByLocation = false;

//TODO: AUXILIARY FUNCTIONS
function toggleLocationSearch() {
    var checkBox = document.getElementById("myCheck");
    if (checkBox.checked == true){
        searchByLocation = true;
    } else {
        searchByLocation = false;
    }
}

$('#search_term').keyup(function(event){
    if(event.keyCode == 13){
        $('#search_location').focus();
    }
});

$('#search_location').keyup(function(event){
    if(event.keyCode == 13){
        generalSearch();
    }
});

function displayMap(lat, lon) {
    var modal = document.getElementById("myModal");
    console.log(lat + " " + lon);
    modal.style.display = "block";
    
    initMap(lat, lon);
}

function initMap(lat, lon) { //This function should be used to build the map in the content element
    let mapWorkspace = document.getElementById("map");
    mapWorkspace.innerHTML = "";

    let maps = document.createElement('div');
    maps.setAttribute("id", "maps");
    maps.setAttribute("class", "map-image");
    mapWorkspace.appendChild(maps);

    //TODO : ADD MAP CONTENT
    
     var mapProp =  {
        center: new google.maps.LatLng(lat, lon),
        zoom: 50,
    };

    var map = new google.maps.Map(document.getElementById("maps"), mapProp);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map
    });

}

//TODO: AJAX, CORS, AND SEARCHBAR FUNCTIONALITY
function getData(myurl) {
    $.ajax({
        url: myurl,
        headers: {
            'Authorization':'Bearer ' + config.BEARER_TOKEN,
        },
        method: 'GET',
        dataType: 'json',
        success: function(data){
            // Grab the results from the API JSON return
            console.log(data);
            
            //creates workspace out of div called "results" (check html) and clear it
            var workspace = document.getElementById("results");
            workspace.innerHTML = "";
            
            //var saving number of results
            var totalresults = data.total;
            
            //if total results is greater than zero, create divs for each
            if(totalresults>0)
            {
                //for each result
                $.each(data.businesses, function(i, item) {
                        
                    //saving variables from JSON response
                    var id = item.id;
                    var name = item.name;
                    var price = item.price;
                    var rating = item.rating;
                    var reviewcount = item.review_count;
                    var address = item.location.address1;
                    var city = item.location.city;
                    var state = item.location.state;
                    var zipcode = item.location.zip_code;
                    var lat = item.coordinates.latitude;
                    var lon = item.coordinates.longitude;
                    var cat1 = item.categories[0].title;
                    
                    //create a new div for every result (appears as a gray block on app)
                    var resulttab = document.createElement('div');
                    resulttab.setAttribute("id",id);
                    resulttab.setAttribute("class","resultstab");
                    
                    //title for each div
                    var title = document.createElement('p');
                    title.setAttribute("class","title");
                    title.append(name);
                    resulttab.append(title);
                    
                    //compound description for each div (adds a dot if there is additional content to be added)
                    var description = document.createElement('p');
                    description.setAttribute("class","textfill");
                    if(price != undefined) {
                        var temp = price;
                        if(cat1 != undefined) {
                            var temp = price + "  \u2022  " + cat1  + "  \u2022  Rating: " + rating + "/5 (" + reviewcount + ")";
                        }
                        description.append(temp);
                        resulttab.append(description);
                    }
                    else if(cat1 != undefined) {
                        description.append(cat1 + "  \u2022  Rating: " + rating + "/5 (" + reviewcount + ")");
                        resulttab.append(description);
                    }
                    
                    //address description for each div
                    var loc = document.createElement('p');
                    loc.setAttribute("class","textfill");
                    var temp = address + " " + city + ", " + state + " " + zipcode;
                    loc.append(temp);
                    resulttab.append(loc);
                    
                    //location button
                    let locbtn = document.createElement('button');
                    locbtn.setAttribute("class","button3");
                    locbtn.setAttribute("type","submit");
                    locbtn.innerHTML = 'Directions';
                    resulttab.append(locbtn);
                    
                    locbtn.onclick = function() {displayMap(lat, lon);}
                    
                    //append entire workspace after every div is made
                    workspace.append(resulttab);
                    
                });
                    
            }
            
            else
            {
                
            }
            
            
        }
    });  

}

function generalSearch() {
    //get input values from input boxes 'term' and 'location'
    var term = document.getElementById("search_term").value;
    var location = document.getElementById("search_location").value;
    
    if(term.length != 0 && location.length != 0) //if both input fields have value, create URL and send to getData()
    {
        console.log(term + " " + location);
        var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + term + "&location=" + location;
        getData(myurl);
    }
    else if(term.length != 0 && searchByLocation) //if the Use My Location box is checked off
    {
        
        console.log("Searching by location");
        
        gpsSearch();
    }
    else //else if nothing in either input fields
    {
        
    }
    
}

function gpsSearch() {
    
}




//TODO: FIREBASE FUNCTIONS
function login() {
    
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pass_field").value;
    
    //window.alert(email + " " + password);
    
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        // Signed in 
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        
        //window.alert("Error : " + errorMessage);
      });
    
}

function logout() {
    
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
      document.getElementById("logindiv").style.display = "none";
      document.getElementById("userdiv").style.display = "block";
      changeBackground("white");
      
      var user = firebase.auth().currentUser;

      document.getElementById("puser").innerHTML = "User : " + user.email;
      display_profile();
      
  } else {
    // No user is signed in.
      document.getElementById("logindiv").style.display = "block";
      document.getElementById("userdiv").style.display = "none";
      changeBackground("#da1500");
      
  }
});



//TODO: DISPLAY FUNCTIONS
function display_profile() { //hide everything but user profile page
      document.getElementById("favorites-tab").style.display = "none";
      document.getElementById("user-profile").style.display = "block";
      document.getElementById("search-tab").style.display = "none";
}

function main_menu_search() { //hide everything but search page
      document.getElementById("favorites-tab").style.display = "none";
      document.getElementById("user-profile").style.display = "none";
      document.getElementById("search-tab").style.display = "block";
}

function main_menu_favorites() { //hide everything but favorites page
      document.getElementById("favorites-tab").style.display = "block";
      document.getElementById("user-profile").style.display = "none";
      document.getElementById("search-tab").style.display = "none";
}

function changeBackground(color) {
   document.body.style.background = color;
}

function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}