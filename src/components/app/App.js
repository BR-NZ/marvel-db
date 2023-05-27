import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';

const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleItemPage = lazy(() => import('../pages/SingleItemPage'));
const SingleCharLayout = lazy(() => import('../pages/SingleCharLayout/SingleCharLayout'));
const SingleComicsLayout = lazy(() => import('../pages/SingleComicsLayout/SingleComicsLayout'));
const Page404 = lazy(() => import('../pages/404'));

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader />
                <main>
                    <Suspense fallback={ <Spinner /> }>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/characters/:charId" element={<SingleItemPage Component={<SingleCharLayout />} type="character" />} />
                            <Route path="/comics" element={<ComicsPage />} />
                            <Route path="/comics/:comicsId" element={<SingleItemPage Component={<SingleComicsLayout />} type="comics" />} />
                            <Route qpath="*" element={<Page404 />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;