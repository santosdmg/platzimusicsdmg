
const pais = "Guatemala"
const apiKey = '5014f912df20248b73ede1f1d0a085ed'
const URL = 'https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country='+pais+'&api_key='+apiKey+'&format=json'

function getArtist() {
    return fetch(URL)
        .then(response => response.json())
        .then(data => data.topartists.artist)
        .then(artists => artists.map(artist => {
            return {
                id: artist.mbid,
                name: artist.name,
                image: artist.image[3]['#text'],
                url: artist.url,
            }
        }))
}

export default getArtist
