import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

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
        getCharacterByPrename(prename)
            .then(res => setCharList(res));
    }, [prename])

    const handleChange = (e) => {
        setPrename(e.target.value);
    };

    const handleFocus = (e) => {
        if(e.target.name === 'name' || e.target.id === 'result-list') {
            setFocus(true);
            console.log(e.target);
        }
    };

    const handleBlur = (e) => {
        if(e.target.name === 'name') {
            setFocus(false);
        }
    }

    const handleClick = (e) => {
        if(e.target.id === 'result-list') {
            setFocus(true);
            console.log(e.target)
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
            <div id="result-list" className="result-list">
                {charList.map(item => (
                    <Link to={`/characters/${item.id}`} className="result-list__item" key={item.id}>
                        <img src={item.thumbnail} alt={item.name} />
                        <p>{item.name}</p>
                    </Link>
                ))}
            </div>
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
                <Form onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} onClick={handleClick}>
                    <label className="char__search-label" htmlFor="name">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <div id="input__wrapper" className="input__wrapper">
                            <Field id="name" name="name" />
                            {resultList}
                        </div>
                        <button type="submit" className="button button__main" disabled={loading}>
                            <div className="inner">Find</div>
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