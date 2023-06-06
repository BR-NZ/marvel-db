import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelServices';
import setContent from '../../utils/setContent';
import './charInfo.scss';


const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {clearError, process, setProcess, getCharacterByID} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        if (!props.charId) return;

        clearError();
        getCharacterByID(props.charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}



const View = ({ data }) => {
    const { id, name, description, thumbnail, wiki, comics } = data;

    const _tranformURL = (url) => {
        const _urlBase = '../comics/';
        const id = url.match(/(-?\d+(\.\d+)?)/g).reverse()[0];
        return _urlBase + id;
    }
    
    const comicsList = comics.map((item, i) => {
        // eslint-disable-next-line
        if (i > 10) return;
        return (
            <li className="char__comics-item" key={i}>
                <Link to={`../${_tranformURL(item.resourceURI)}`}>{ item.name }</Link>
            </li>
        )
    })

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{`${name} #${id}`}</div>
                    <div className="char__btns">
                        <Link to={`/characters/${id}`} className="button button__main">
                            <div className="inner">Homepage</div>
                        </Link>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {comicsList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number,
}

// CharInfo.defaultProps = {
//     charId: 1010338,
// }

export default CharInfo;