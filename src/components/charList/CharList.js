import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        loadingNew: false,
        error: false,
        offset: 210, // 1550 - end
        offsetTo: localStorage.getItem('offsetTo') ? +localStorage.getItem('offsetTo') : this.state.offset,
        limit: 9,
        ended: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.onRequest(this.state.offset, +this.state.offsetTo);
        window.addEventListener('scroll', this.onScrollEnd);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollEnd);
    }

    onRequest = async (offset, limit) => {
        this.loadingList();
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

        this.setState(({ charList, offset, limit }) => {
            let offsetTo = localStorage.getItem('offsetTo') ? +localStorage.getItem('offsetTo') : offset;
            localStorage.setItem('offsetTo', offsetTo + limit);

            return {
                charList: [...charList, ...newChars],
                loading: false,
                loadingNew: false,
                offset: offset + limit,
                offsetTo: localStorage.getItem('offsetTo'),
                ended: ended
            }
        });
    }

    onLoad = () => {
        this.setState({ loadingNew: true });
        this.onRequest(this.state.offset);
    }

    onScrollEnd = () => {
        if (document.documentElement.scrollHeight === document.documentElement.clientHeight + window.pageYOffset) {
            this.onRequest(this.state.offset);
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
                <button className="button button__main button__long" style={{ 'display': ended ? 'none' : 'block' }} disabled={loadingNew} onClick={this.onLoad}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;