var spotifyApi = new SpotifyWebApi();

function onPageLoad()
{
    // Should check if you were redirected by Spotify
    console.log("Page Loaded");
    // Checks if redirected or fresh load based on if hash exists
    // !!!!!DOES NOT WORK IF USER DOESN'T AUTHORIZE -- MUST EVENTUALLY PARSE IF USER DOESN'T DO IT!!!!!!!
    if (window.location.hash != "")
    {
        if ( checkHash() )
        {
            console.log("Redirected from Spotify, handling access tokens.");
            handleAccessToken();
            document.getElementById('firstLoad').style.display = 'none';
            document.getElementById('spotifyRedirect').style.display = 'block';
        }
        else
        {
            alert("Please try signing in again. Redirected URL is not correct");
        }
    }
}

function requestAuthorization()
{
    const redirect_uri = "http://localhost:63342/CrossPlay/index.html"
    const AUTHORIZE = "https://accounts.spotify.com/authorize"
    const clientID = "f48e5425439b40c0bbf64391c03cf4f5";

    let url = AUTHORIZE;
    url += "?client_id="+clientID;
    url += "&response_type=token";
    url += "&redirect_uri=" + encodeURI(redirect_uri)
    url += "&scope=user-read-private user-read-email playlist-read-private playlist-read-collaborative"
    url += "&show_dialog=true"
    url +=
        window.location.href = url; // Go to Spotify Authorization Screen with added
}

function checkHash()
{
    // Checks if a valid access_token hash is present
    // Returns true if present, returns false if not
    // (does not check if it works, only if present)
    var urlString = window.location.href;
    var url = new URL(urlString);
    return url.hash.includes("access_token=")
}

function handleAccessToken()
{
    // gets string
    var urlString = window.location.href;
    var url = new URL(urlString);
    // find access_token= and adds 13 to index to get to end of "="
    // and also gets index of the next ampersand and uses end of string if can't find
    var a = url.hash.indexOf("access_token=") + 13;
    if (url.hash.indexOf("&",a) != -1)
    {
        var b = url.hash.indexOf("&",a);
    }
    else
    {
        var b = url.hash.length;
    }
    var accessToken = url.hash.substring(a,b);
    console.log(accessToken);
    spotifyApi.setAccessToken(accessToken);
}


function getUserInfo()
{
    var c = spotifyApi.getMe();
    c.then(gotMe, gotMeError);
}
function gotMe(value)
{

    console.log(value);
    document.getElementById("username").innerHTML = value.display_name;
    document.getElementById("username").style.display = 'block';
    document.getElementById("profileImage").src = value.images[0].url;
    document.getElementById("profileImage").style.display = 'block';
}
function gotMeError(value)
{
    console.log(value);
    alert(value);
}

function getUserPlaylists()
{
    var d = spotifyApi.getUserPlaylists();
    d.then(gotPlaylist, gotPlaylistError)
}
function gotPlaylist(value)
{
    var a = "";
    let tab = document.getElementById('playlistTable');
    console.log(value);
    for (var i = 0; i<value.items.length; i++)
    {
        var newRow = tab.insertRow(-1)
        var firstCell = newRow.insertCell(0)
        var newText = document.createTextNode(i+1);
        firstCell.appendChild(newText);
        var secondCell = newRow.insertCell(1);
        newText = document.createTextNode(value.items[i].name);
        secondCell.appendChild(newText);
        var thirdCell = newRow.insertCell(2);
        var btn = document.createElement('input');
        btn.type = 'button';
        btn.value = "Click Me!";
        btn.id = value.items[i].id;
        btn.onclick = function () {getPlaylistItems(this.id);};
        thirdCell.appendChild(btn);
    }
    document.getElementById("playlistTable").style.display = 'block';
}
function gotPlaylistError (value)
{
    console.log(value);
    alert(value);
}


function getPlaylistItems(id)
{
    console.log(id);
    var e = spotifyApi.getPlaylistTracks(id);
    e.then(gotPlaylistItems, gotPlaylistItemsError);
}
function gotPlaylistItems(value)
{
    console.log(value);
    var arr = [];
    for (var i = 0; i < value.items.length; i++)
    {
        if(value.items[i].track.type === "track")
        {
            console.log(value.items[i].track.type);
            var f = "";
            for (var j = 0; j < value.items[i].track.artists.length; j++)
            {
                f += value.items[i].track.artists[j].name;
                f += " ";
            }
            var g = {songName:value.items[i].track.name, artistsName:f, externalID:value.items[i].track.external_ids.isrc };
            arr.push(g);
        }
    }
    console.log(arr);
    localStorage.songs = JSON.stringify(arr);
}
function gotPlaylistItemsError(value)
{
    console.log(value);
}
