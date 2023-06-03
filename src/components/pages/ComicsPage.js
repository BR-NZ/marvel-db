import { Helmet } from 'react-helmet';
import AppBanner from "../appBanner/AppBanner";
import ComicsList from '../comicsList/ComicsList';

const ComicsPage = () => {
    return (
        <>
            <Helmet>
                <title>Comics / Marvel-portal</title>
                <meta name="description" content="List of comics from the Marvel Universe." />
            </Helmet>
            <AppBanner />
            <ComicsList />
        </>
    )
}

export default ComicsPage;