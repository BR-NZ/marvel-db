import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import mjolnir from '../../resources/img/mjolnir.png';
import './randomChar.scss';

class RandomChar extends Component {
    componentDidMount() {
        this.updateChar();
        this.intervalID = setInterval(this.updateChar, 6000000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    state = {
        char: {},
        error: false,
        loading: true
    }

    marvelService = new MarvelService()

    onCharLoaded = (char) => {
        this.setState({
            char: char,
            error: false,
            loading: false
        });
    }

    updateChar = () => {
        this.setState({ loading: true });
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService.getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    render() {
        const { char, error, loading } = this.state;

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(error || loading) ? <View char={char} /> : null;

        return (
            <div className="randomchar">
                {errorMessage || spinner || content}

                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

const View = ({ char }) => {
    const isValidString = (prop, maxLength) => {
        return (!prop || typeof prop != 'string') ?
            'no data' : (prop.length < maxLength) ?
                prop : (prop.slice(0, maxLength) + '...');
    }

    const { name, description, thumbnail, homepage, wiki } = char;
    const desc_v = isValidString(description, 200);

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {desc_v}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;