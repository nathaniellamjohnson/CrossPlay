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
    url += "&scope=user-read-private playlist-read-private playlist-read-collaborative"
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


