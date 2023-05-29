import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import useMarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './CharSearchForm.scss'

const CharSearchForm = () => {
    const [prename, setPrename] = useState('');
    const [char, setChar] = useState(null);
    const [charList, setCharList] = useState([]);
    const [focus, setFocus] = useState(false);

    const { loading, error, clearError, getCharacterByName, getCharacterByPrename } = useMarvelService();

    useEffect(() => {
        clearError();

        if(prename.length < 2) {
            setCharList([])
            return;
        }

        getCharacterByPrename(prename)
            .then(res => setCharList(res));
    }, [prename])

    const handleChange = (e) => {
        // console.log(e.target.value);
        setPrename(e.target.value);
    };

    const handleFocus = (e) => {
        if(e.target.name === 'name') {
            setFocus(true);
        }
    };

    const handleBlur = (e) => {
        if(e.target.name === 'name') {
            setTimeout(() => setFocus(false), 1000);
        }
    }

    const updateChar = (name) => {
        clearError();
        getCharacterByName(name)
            .then(res => { setChar(res) });
    };

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;

    const resultList = (charList.length && focus) ? (
        <>
            <TransitionGroup className="result-list">
                {charList.map((item, i) => (
                    <CSSTransition key={item.id} classNames="char-wrapper1" timeout={500} appear>
                        <Link to={`/characters/${item.id}`} className="result-list__item" style={{transitionDuration: `${i * 100}ms`}}>
                            <img src={item.thumbnail} alt={item.name} />
                            <p>{item.name}</p>
                        </Link>
                    </CSSTransition>
                ))}
            </TransitionGroup>
            <div className="overlay"></div>
        </>
    ) : null;

    const result = char ?
        (<div className="char__search-wrapper">
            <div className="char__search-success">There is! Visit {char.name} page?</div>
            <Link to={`/characters/${char.id}`} className="button button__secondary">
                <div className="inner">To page</div>
            </Link>
        </div>)
        : (char === undefined) ? (
            <div className="char__search-error">
                The character was not found. Check the name and try again
            </div>
        ) : null;

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    name: ''
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('Character name is required..'),
                })}
                onSubmit={values => {
                    updateChar(values.name);
                }}>
                <Form onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}>
                    <label className="char__search-label" htmlFor="name">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <div id="input__wrapper" className="input__wrapper">
                            <Field id="name" name="name" placeholder="Enter more than 2 letters.." />
                            {resultList}
                        </div>
                        <button type="submit" className="button button__main" disabled={loading}>
                            <div className="inner">Find one</div>
                        </button>
                    </div>

                    <FormikErrorMessage name="name" className="char__search-error" component="div" />
                    {errorMessage}
                    {result}
                </Form>
            </Formik>
        </div>
    )
}

export default CharSearchForm;