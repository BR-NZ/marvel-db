import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

const CharList = (props) => {
    const marvelService = new MarvelService()

    const [charList, setCharList] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingNew, setLoadingNew] = useState(false)
    const [error, setError] = useState(false)
    const [offset] = useState(marvelService._baseOffset) // 1550 - end
    const [offsetNew, setOffsetNew] = useState(localStorage.getItem('offsetNew') ? +localStorage.getItem('offsetNew') : marvelService._baseOffset)
    const [limit] = useState(9)
    const [ended, setEnded] = useState(false)

    useEffect(() => {
        setOffsetNew(localStorage.getItem('offsetNew') ? +localStorage.getItem('offsetNew') : offset);
        const limitNew = (offsetNew - offset) ? (offsetNew - offset) : limit;

        console.log('Грузим с ' + offset);
        console.log('Грузим элементов ' + limitNew + ' ' + typeof limitNew);

        onRequest(offset, limitNew);
        window.addEventListener('scroll', onScrollEnd);

        return () => {
            window.removeEventListener('scroll', onScrollEnd);
        }
    }, [])

    const onRequest = async (offset, limit) => {
        loadingList();
        console.log('Грузим с ' + offset);
        console.log('Грузим элементов ' + limit);
        marvelService.getAllCharacters(offset, limit)
            .then(loadedList)
            .catch(onError);
    }

    const loadingList = () => {
        setLoadingNew(true);
    }

    const loadedList = (newChars) => {
        let ended = false;
        if (newChars.length < limit) ended = true;

        setCharList(charList => [...charList, ...newChars]);
        setLoading(false);
        setLoadingNew(false);
        setEnded(ended);
        setOffsetNew(offsetNew => {
            localStorage.setItem('offsetNew', offsetNew + limit);
            return +localStorage.getItem('offsetNew');
        });
    }

    const onLoadNew = () => {
        setLoadingNew(true);
        onRequest(offsetNew);
    }

    const onScrollEnd = () => {
        if (document.documentElement.scrollHeight === document.documentElement.clientHeight + window.pageYOffset) {
            onLoadNew();
        }
    }

    const onItemClick = (id) => {
        props.onCharSelected(id);
        setCharList(charList => {
            const inactiveList = [...charList].map(item => ({ ...item, active: false }));
            return inactiveList.map(item => ({ ...item, active: (item.id === id) }));
        });
    }

    const onItemFocus = (i) => {
        console.log('Фокус на: ');
        console.log(itemsRefs.current[i]);
        itemsRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRefs.current[i].classList.add('char__item_selected');
        itemsRefs.current[i].focus();
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    // Создаем реф с пустым массивом - массив попадет в реф.каррент
    const itemsRefs = useRef([]);

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            const clazz = item.active ? 'char__item_selected' : '';
            return (
                <li id={item.id} 
                    className={`char__item ${clazz}`} 
                    onClick={() => onItemClick(item.id)} 
                    onFocus={() => onItemFocus(i)} 
                    key={item.id} 
                    tabIndex={i} 
                    ref={el => itemsRefs.current[i] = el}>
                    <img src={item.thumbnail} alt={item.name} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        })

        console.log(itemsRefs);

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {errorMessage || spinner || items}
            <button className="button button__main button__long" style={{ 'display': ended ? 'none' : 'block' }} disabled={loadingNew} onClick={onLoadNew}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;