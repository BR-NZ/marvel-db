import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './comicsList.scss';

const setContent = (process, Component, loadingNew) => {
    switch(process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return loadingNew ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state.')
    }
}

const ComicsList = () => {
    const [itemsList, setList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(8);
    const [loadingNew, setLoadingNew] = useState(false);
    const [ended, setEnded] = useState(false);

    const itemsRefs = useRef([]);

    const { loading, error, process, setProcess, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequest(offset, limit);
        setOffset(offset => offset + limit);
    }, [])

    const onRequest = async (offset, limit) => {
        console.log(`Грузим с ${offset}, элементов ${limit} шт`);
        const newList = await getAllComics(offset, limit);
        onLoaded(newList);
        setProcess('confirmed');
    }

    const onLoadNew = () => {
        setLoadingNew(true);
        setOffset(offset => offset + limit);
        onRequest(offset, limit);
    }

    const onLoaded = (list) => {
        setEnded(list.length < limit);
        setLoadingNew(false);

        setList(itemsList => [...itemsList, ...list]);
    }

    const onItemClick = (id) => {
        setList(itemsList => itemsList.map(item => ({ ...item, active: id === item.id })));
    }

    const onItemFocus = (i) => {
        itemsRefs.current.map(item => item.classList.remove('comics__item_selected'));
        itemsRefs.current[i].focus();
        itemsRefs.current[i].classList.add('comics__item_selected');
    }

    function renderItems(items) {
        const comics = items.map((item, i) => {
            const clazz = item.active ? 'comics__item_selected' : '';
            return (
                <li className={"comics__item " + clazz} onClick={() => onItemClick(item.id)} onFocus={() => onItemFocus(i)} ref={el => itemsRefs.current[i] = el} key={i}>
                    <Link to={`${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {comics}
            </ul>
        )
    }

    return (
        <div className="comics__list">
            { setContent(process, () => renderItems(itemsList), loadingNew) }
            <button className="button button__main button__long" style={{ 'display': ended ? 'none' : 'block' }} onClick={onLoadNew} disabled={loadingNew}>
                <div className="inner">Load more</div>
            </button>
        </div>
    )
}

export default ComicsList;