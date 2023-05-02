import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './singleComicPage.scss';

const SingleComicPage = () => {
    const { comicsId } = useParams();

    const [comics, setComics] = useState(null);
    const { loading, error, getComics, clearError } = useMarvelService();

    useEffect(() => {
        updateComic(comicsId);
    }, [comicsId])

    const updateComic = async (id) => {
        clearError();
        const result = await getComics(id);
        await setComics(result);
    }
    
    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || errorMessage) ? <View comics={comics} /> : null;

    return (
        <>
            {errorMessage || spinner || content}
        </>
    )
}

const View = ({ comics }) => {
    const { title, description, pageCount, language, price } = comics;
    return (
        <div className="single-comic">
            <img src={comics.thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">Pgs: {pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;