import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

class CharList extends Component {
    marvelService = new MarvelService()

    state = {
        charList: [],
        loading: true,
        loadingNew: false,
        error: false,
        offset: this.marvelService._baseOffset, // 1550 - end
        offsetNew: localStorage.getItem('offsetNew') ? +localStorage.getItem('offsetNew') : this.marvelService._baseOffset,
        limit: 9,
        ended: false
    }

    componentDidMount() {
        const { offset, limit } = this.state;

        const offsetNew = localStorage.getItem('offsetNew') ? +localStorage.getItem('offsetNew') : offset;
        const limitNew = (offsetNew - offset) ? (offsetNew - offset) : limit;
        
        console.log('Грузим с ' + this.state.offset);
        console.log('Грузим элементов ' + limitNew + ' ' + typeof limitNew);

        this.onRequest(this.state.offset, limitNew);
        window.addEventListener('scroll', this.onScrollEnd);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollEnd);
    }

    onRequest = async (offset, limit) => {
        this.loadingList();
        console.log('Грузим с ' + offset);
        console.log('Грузим элементов ' + limit);
        this.marvelService.getAllCharacters(offset, limit)
            .then(this.loadedList)
            .catch(this.onError);
    }
    loadingList = () => {
        this.setState({
            loadingNew: true
        });
    }

    loadedList = (newChars) => {
        let ended = false;
        if (newChars.length < this.state.limit) ended = true;

        this.setState(({ charList, offsetNew, limit }) => {
            localStorage.setItem('offsetNew', offsetNew + limit);

            return {
                charList: [...charList, ...newChars],
                loading: false,
                loadingNew: false,
                offsetNew: +localStorage.getItem('offsetNew'),
                ended: ended
            }
        });
    }

    onLoadNew = () => {
        this.setState({ loadingNew: true });
        this.onRequest(this.state.offsetNew);
    }

    onScrollEnd = () => {
        if (document.documentElement.scrollHeight === document.documentElement.clientHeight + window.pageYOffset) {
            this.onLoadNew();
        }
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        });
    }

    renderItems(arr) {
        const items = arr.map(item => {
            const clazz = item.active ? 'char__item_selected' : '';
            return (
                <li className={`char__item ${clazz}`} onClick={() => this.props.onCharSelected(item.id)} key={item.id}>
                    <img src={item.thumbnail} alt={item.name} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, loadingNew, error, ended } = this.state;

        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;

        return (
            <div className="char__list">
                {items || spinner || errorMessage}
                <button className="button button__main button__long" style={{ 'display': ended ? 'none' : 'block' }} disabled={loadingNew} onClick={this.onLoadNew}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;