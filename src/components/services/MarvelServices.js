class MarvelService {
    _apiBase = 'https://gateway.marvel.com/';
    _apiKey = '01f15876ae27789f7db0371fd64cb559';

    getResource = async (url) => {
        let res = await fetch(url);
        if(!res.ok) throw new Error(`Coulnd't fetch ${url}, status: ${res.status}`);
        return await res.json();
    }
    getAllCharacteries = () => {
        return this.getResource(`${this._apiBase}v1/public/characters?limit=9&offset=210&apikey=${this._apiKey}`);
    }
    getCharacter = (id) => {
       return this.getResource(`${this._apiBase}v1/public/characters/${id}?apikey=${this._apiKey}`); 
    }
}

export default MarvelService;