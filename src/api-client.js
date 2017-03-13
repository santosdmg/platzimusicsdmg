const URL = 'https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&api_key=5014f912df20248b73ede1f1d0a085ed&format=json'

function getArtist() {
    return fetch(URL)
        .then(response => response.json())
        .then(data => data.topartists.artist)
        .then(artists => artists.map(artist => {
            return {
                id: artist.mbid,
                name: artist.name,
                image: artist.image[3]['#text'],
                likes: 0,
                comments: 0,
            }
        }))
}

export default getArtist
