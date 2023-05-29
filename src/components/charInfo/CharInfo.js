import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';


const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {loading, error, getCharacterByID, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        if (!props.charId) return;

        clearError();
        getCharacterByID(props.charId)
            .then(onCharLoaded);
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    // const skeleton = (char || loading || error) ? null : <Skeleton />;
    const spinner = loading ? <Skeleton /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
            {content || spinner || errorMessage}
        </div>
    )
}

const View = ({ char }) => {
    const { id, name, description, thumbnail, wiki, comics } = char;

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
    charId: PropTypes.number.isRequired,
}

CharInfo.defaultProps = {
    charId: 1010338,
}

export default CharInfo;