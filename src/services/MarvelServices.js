class MarvelService {
    _apiBase = 'https://gateway.marvel.com/';
    _apiKey = '01f15876ae27789f7db0371fd64cb559';

    getResource = async (url) => {
        let res = await fetch(url);
        if (!res.ok) throw new Error(`Coulnd't fetch ${url}, status: ${res.status}`);
        return await res.json();
    }

    getAllCharacters = async (limit = 9, offset = 210) => {
        const res = await this.getResource(`${this._apiBase}v1/public/characters?limit=${limit}&offset=${offset}&apikey=${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}v1/public/characters/${id}?apikey=${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (person) => {
        return {
            name: person.name,
            description: person.description,
            thumbnail: person.thumbnail.path + '.' + person.thumbnail.extension,
            homepage: person.homepage,
            wiki: person.wiki,
            id: person.id,
            comics: person.comics.items
        }
    }
}

export default MarvelService;