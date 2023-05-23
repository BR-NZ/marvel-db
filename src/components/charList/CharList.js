import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

const CharList = (props) => {
    const {loading, error, _baseOffset, getAllCharacters} = useMarvelService()

    const [charList, setCharList] = useState([])
    const [loadingNew, setLoadingNew] = useState(false)
    const [limit] = useState(9)
    const [offset] = useState(_baseOffset) // from service = 210 (1550 - end)
    const [offsetNew, setOffsetNew] = useState(localStorage.getItem('offsetNew') ? +localStorage.getItem('offsetNew') : offset + limit)
    const [ended, setEnded] = useState(false)

    localStorage.setItem('offsetNew', offsetNew)

    useEffect(() => {
        if(!localStorage.getItem('offsetNew')) {
            localStorage.setItem('offsetNew', offset + limit);
            setOffsetNew(+localStorage.getItem('offsetNew'));
        }
        const limitNew = offsetNew - offset;

        onRequest(offset, limitNew);
        
        window.addEventListener('scroll', onScrollEnd);
        return () => {
            window.removeEventListener('scroll', onScrollEnd);
        }
    }, [])

    const onRequest = async (offset, limit, isLoadNew) => {
        console.log(`Грузим с: ${offset} (${typeof offset})`);
        console.log(`Элементов: ${limit} (${typeof limit})`);
        console.log(`Этот вызов: ${isLoadNew ? 'последующий' : 'начальный'}`);

        isLoadNew ? setLoadingNew(true) : setLoadingNew(false);

        getAllCharacters(offset, limit)
            .then(res => loadedList(res, isLoadNew));
    }

    const loadedList = (newChars, isLoadNew) => {
        setLoadingNew(false);
        setEnded(newChars.length < limit);

        setCharList(charList => [...charList, ...newChars]);
        
        if (isLoadNew) setOffsetNew(offsetNew => {
            localStorage.setItem('offsetNew', offsetNew + limit);
            return +localStorage.getItem('offsetNew');
        });
    }

    const onLoadNew = () => {
        setLoadingNew(true);
        onRequest(+localStorage.getItem('offsetNew'), limit, true);
    }

    const onScrollEnd = () => {
        if (document.documentElement.scrollHeight === document.documentElement.clientHeight + window.pageYOffset) {
            onLoadNew();
        }
    }

    const onItemClick = (id) => {
        props.onCharSelected(id);
        setCharList(charList => charList.map(item => ({ ...item, active: (item.id === id) })));
    }

    const onItemFocus = (i) => {
        // console.log('Фокус на: ');
        // console.log(itemsRefs.current[i]);
        itemsRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRefs.current[i].classList.add('char__item_selected');
        itemsRefs.current[i].focus();
    }

    // Создаем реф с пустым массивом - массив попадет в реф.каррент
    const itemsRefs = useRef([]);

    function renderItems(arr) {
        const duration = 550;

        const items = arr.map((item, i) => {
            const clazz = item.active ? 'char__item_selected' : '';
            return (
                <CSSTransition key={item.id} classNames="char-wrapper" timeout={duration} appear>
                    <li id={item.id} 
                    className={`char__item ${clazz}`} 
                    onClick={() => onItemClick(item.id)} 
                    onFocus={() => onItemFocus(i)} 
                    key={item.id} 
                    tabIndex={i} 
                    ref={el => itemsRefs.current[i] = el}
                    style={ {transitionDelay: `${i % 9 * 100}ms`, transitionDuration: `${duration}ms`} }>
                        <img src={item.thumbnail} alt={item.name} />
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
                
            );
        })
        return (
            <ul className="char__grid">
                <TransitionGroup component={ null }>
                    { items }
                </TransitionGroup>
            </ul>
        )
    }

    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !loadingNew ? <Spinner /> : null;

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