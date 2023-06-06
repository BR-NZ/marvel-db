import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelServices';
import setContent from '../../utils/setContent';

import mjolnir from '../../resources/img/mjolnir.png';
import './randomChar.scss';

const RandomChar = () => {
    const [char, setChar] = useState({});
    const {process, setProcess, getCharacterByID, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        const intervalID = setInterval(updateChar, 60000);
        return () => {
            clearInterval(intervalID);
        }
    }, [])

    const onCharLoaded = (char) => setChar(char)

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacterByID(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    return (
        <div className="randomchar">
            { setContent(process, View, char) }

            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">Try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )
}

const View = ({ data }) => {
    const isValidString = (prop, maxLength) => {
        return (!prop || typeof prop != 'string') ?
            'no data' : (prop.length < maxLength) ?
                prop : (prop.slice(0, maxLength) + '...');
    }

    const { id, name, description, thumbnail, wiki } = data;
    const desc_v = isValidString(description, 200);

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {desc_v}
                </p>
                <div className="randomchar__btns">
                    <Link to={`/characters/${id}`} className="button button__main">
                        <div className="inner">Homepage</div>
                    </Link>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;