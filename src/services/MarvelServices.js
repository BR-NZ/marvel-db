import useHttp from "../hooks/http.hook";

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com/v1/public';
    const _apiKey = '01f15876ae27789f7db0371fd64cb559';
    const _baseOffset = 210;

    const { loading, setLoading, error, request, clearError } = useHttp();

    const getAllComics = async (offset = 0, limit = 8) => {
        const res = await request(`${_apiBase}/comics?orderBy=issueNumber&offset=${offset}&limit=${limit}&apikey=${_apiKey}`)
        return res.data.results.map(_transformComics);
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBase}/comics/${id}?apikey=${_apiKey}`)
        return _transformComics(res.data.results[0]);
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
            price: (comics.prices[0]?.price || comics.prices[1]?.price || '0') + '$',
        }
    }

    const getAllCharacters = async (offset = _baseOffset, limit = 9) => {
        const res = await request(`${_apiBase}/characters?offset=${offset}&limit=${limit}&apikey=${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacterByID = async (id) => {
        const res = await request(`${_apiBase}/characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        // https://gateway.marvel.com:443/v1/public/characters?name=thor&apikey=01f15876ae27789f7db0371fd64cb559
        const res = await request(`${_apiBase}/characters?name=${name}&apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByPrename = async (prename, limit = 7) => {
        // https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=th&apikey=01f15876ae27789f7db0371fd64cb559
        if(prename) {
            console.log(`${_apiBase}/characters?nameStartsWith=${prename}&limit=${limit}&apikey=${_apiKey}`);
            const res = await request(`${_apiBase}/characters?nameStartsWith=${prename}&limit=${limit}&apikey=${_apiKey}`);
            return res.data.results.map(_transformCharacter);
        } else return [];
    }

    const _transformCharacter = (person) => {
        return !person ? undefined : {
            name: person.name,
            description: person.description,
            thumbnail: person.thumbnail.path + '.' + person.thumbnail.extension,
            homepage: person.homepage,
            wiki: person.wiki,
            id: person.id,
            comics: person.comics.items
        }
    }

    return { _baseOffset, loading, setLoading, error, clearError, getAllCharacters, getCharacterByID, getCharacterByName, getCharacterByPrename, getAllComics, getComics }
}

export default useMarvelService;