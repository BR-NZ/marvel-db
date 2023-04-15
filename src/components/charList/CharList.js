import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

class CharList extends Component {
    constructor(props) {
        super(props);
        this.limit = 9;
        this.current = 210;
    }

    state = {
        charList: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.loadCharList(this.limit, this.current);
    }

    loadCharList = async (offset, limit) => {
        this.marvelService.getAllCharacters(offset, limit)
            .then(res => {
                this.setState({
                    charList: res
                });
            })
            .catch(this.onError);
    }

    loadNextPage = () => {
        this.current += this.limit;
        this.loadCharList(this.limit, this.current);
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
                <li className={`char__item ${clazz}`} onClick={()=>this.props.onCharSelected(item.id)} key={item.id}>
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
        const { charList, loading, error } = this.state;

        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;

        return (
            <div className="char__list">
                { items || spinner || errorMessage }
                <button className="button button__main button__long" onClick={this.loadNextPage}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;