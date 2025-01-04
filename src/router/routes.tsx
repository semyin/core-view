import {Params, RouteObject} from 'react-router-dom';
import DefaultLayout from '../layout/Deafult';
import Home from '../views/Home/Home';
import About from '../views/About/About';
import React from "react";

// const Home = dynamic(() => import('../views/Home/Home'))

// 定义一个可以带有 getServerSideProps 方法的组件类型
export type ComponentWithServerSideProps<P = {}> = React.ComponentType<P> & {
    getServerSideProps?: (context: { params: Params<string>}) => Promise<{ props: Record<string, any> }>;
};

// 定义一个接口用于描述路由配置
interface RouteConfig {
    path?: string;
    index?: boolean;
    element: React.ReactNode;
    component?: ComponentWithServerSideProps;
    children?: RouteConfig[];
}
// 定义路由配置
const routeConfigs: RouteConfig[] = [
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <Home />,
                component: Home,
            },
            {
                path: 'home',
                element: <Home />,
                component: Home,
            },
            {
                path: 'about',
                element: <About />,
                component: About,
            },
        ],
    },
];

// 将自定义的路由配置转换为 `RouteObject`
function generateRoutes(configs: RouteConfig[]): RouteObject[] {
    return configs.map(({ index, component, ...route }) => {
        if (index) {
            return {
                index: true,
                element: route.element,
            } as RouteObject;
        }
        return {
            ...route,
            children: route.children ? generateRoutes(route.children) : undefined,
        };
    });
}

const routes: RouteObject[] = generateRoutes(routeConfigs);

export { routes, routeConfigs };
