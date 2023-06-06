import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMarvelService from '../../services/MarvelServices';
import setContent from '../../utils/setContent';

import AppBanner from '../appBanner/AppBanner';

const SingleItemPage = ({Component, type}) => {
    const [item, setItem] = useState(null);
    
    // получили ID (URL-параметр от ROUTER)
    const { id } = useParams();
    const { process, setProcess, getComics, getCharacterByID, clearError } = useMarvelService();

    const fetchMethod = (type === 'comics') ? getComics 
                      : (type === 'character') ? getCharacterByID : null;

    useEffect(() => {
        console.log(id);
        updateItem(id);
    }, [id])

    const updateItem = async (id) => {
        clearError();
        const result = await fetchMethod(id);
        setItem(result);
        setProcess('confirmed');
    }
    
    return (
        <>
            <AppBanner />
            { setContent(process, Component, item) }
        </>
    )
}

export default SingleItemPage;