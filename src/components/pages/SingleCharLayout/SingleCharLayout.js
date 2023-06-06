import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './SingleCharLayout.scss';

const SingleCharLayout = ({ data }) => {
    const { name, description, thumbnail } = data;
    return (
        <>
            <Helmet>
                <title>{name} / Marvel-portal</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="single-item">
                <img src={thumbnail} alt={name} className="single-item__img" />
                <div className="single-item__info">
                    <h2 className="single-item__name">{name}</h2>
                    <p className="single-item__descr">{description}</p>
                </div>
                <Link to="/" className="single-item__back">Back to all</Link>
            </div>
        </> 
    )
}

export default SingleCharLayout;