import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SingleItemPage = ({Component, type}) => {
    const [item, setItem] = useState(null);
    
    // получили ID (URL-параметр от ROUTER)
    const { itemId } = useParams();
    const { loading, error, getComics, getCharacterByID, clearError } = useMarvelService();

    const fetchMethod = (type === 'comics') ? getComics 
                      : (type === 'character') ? getCharacterByID : null;

    useEffect(() => {
        console.log(itemId);
        updateItem(itemId);
    }, [itemId])

    const updateItem = async (id) => {
        clearError();
        const result = await fetchMethod(id);
        console.log(result);
        setItem(result);
        console.log(item);
    }
    
    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || errorMessage) && item ? <Component item={item} /> : null;

    return (
        <>
            {errorMessage || spinner || content}
        </>
    )
}

export default SingleItemPage;