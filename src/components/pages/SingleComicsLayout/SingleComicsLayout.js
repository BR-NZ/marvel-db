import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './SingleComicsLayout.scss';

const SingleComicsLayout = ({ item }) => {
    const { title, description, pageCount, language, price, thumbnail } = item;
    return (
        <>
            <Helmet>
                <title>{title} / Marvel-portal</title>
                <meta name="description" content={`${title} comic book`} />
            </Helmet>
            <div className="single-item">
                <img src={thumbnail} alt={title} className="single-item__img" />
                <div className="single-item__info">
                    <h2 className="single-item__name">{title}</h2>
                    <p className="single-item__descr">{description}</p>
                    <p className="single-item__descr">Pgs: {pageCount}</p>
                    <p className="single-item__descr">Language: {language}</p>
                    <div className="single-item__price">{price}</div>
                </div>
                <Link to="/comics" className="single-item__back">Back to all</Link>
            </div>
        </>
    )
}

export default SingleComicsLayout;