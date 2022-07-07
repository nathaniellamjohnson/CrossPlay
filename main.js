function requestSpotifyAuthorization()
{
    const redirect_uri = "http://localhost:63342/CrossPlay/spotifyget.html"
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