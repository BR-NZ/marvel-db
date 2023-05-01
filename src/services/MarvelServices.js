import useHttp from "../hooks/http.hook";

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com/';
    const _apiKey = '01f15876ae27789f7db0371fd64cb559';
    const _baseOffset = 210;

    const { loading, error, request, clearError } = useHttp();

    const getAllComics = async (offset = 0, limit = 8) => {
        const res = await request(`${_apiBase}v1/public/comics?orderBy=issueNumber&offset=${offset}&limit=${limit}&apikey=${_apiKey}`)
        return res.data.results.map(_transformComics);
    }

    const _transformComics = (comics) => {
        const price = (comics.prices[0]?.price || comics.prices[1]?.price || '0') + '$';
        return {
            id: comics.id,
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            title: comics.title,
            desc: comics.description,
            price: price,
        }
    }

    const getAllCharacters = async (offset = _baseOffset, limit = 9) => {
        const res = await request(`${_apiBase}v1/public/characters?offset=${offset}&limit=${limit}&apikey=${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}v1/public/characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (person) => {
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

    return { loading, error, _baseOffset, getAllCharacters, getCharacter, getAllComics, clearError }
}

export default useMarvelService;