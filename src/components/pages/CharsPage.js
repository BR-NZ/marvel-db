import { useState } from 'react';
import { Helmet } from 'react-helmet';
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearchForm from '../charSearchForm/CharSearchForm';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [selectedChar, setChar] = useState(undefined);

    const onCharSelected = (id) => {
        setChar(id);
    }

    return (
    <>
        <Helmet>
            <title>Heroes / Marvel-portal</title>
            <meta name="description" content="List of heroes from the Marvel Universe.." />
        </Helmet>
        <ErrorBoundary>
            <RandomChar />
        </ErrorBoundary>
        <ErrorBoundary>
            <CharSearchForm />
        </ErrorBoundary>
        <div className="char__content">
            <ErrorBoundary>
                <CharList onCharSelected={onCharSelected} />
            </ErrorBoundary>
            <ErrorBoundary>
                <CharInfo charId={selectedChar} />
            </ErrorBoundary>
        </div>
        <img className="bg-decoration" src={decoration} alt="vision" />
    </>
    )
}

export default MainPage;