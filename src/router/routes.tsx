import { RouteObject } from 'react-router-dom';
import DefaultLayout from '../layout/Deafult';
import Home from '../views/Home/Home';
import About from '../views/About/About';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <Home />,

            },
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
        ]
    },

];

export default routes;
