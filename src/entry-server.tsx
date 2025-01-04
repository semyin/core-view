import { StrictMode } from 'react'
import { StaticRouter, matchRoutes } from 'react-router-dom';
import { renderToString } from 'react-dom/server'
import { routes, routeConfigs } from "./router/routes";

import App from './App'

export async function render(_url: string) {
  // 使用 routes 来匹配 _url
  const matches = matchRoutes(routes, _url);
  let initialProps = {};

  if (matches) {
    const matchedRoute = matches[matches.length - 1]; // 获取最深的匹配路由
    const { route, params } = matchedRoute;

    // 使用 matchedRoute 的 route 来在 routeConfigs 中查找对应的配置
    const matchingConfig = findRouteConfig(route.path);

    // 如果找到 matchingConfig 且该路由有 getServerSideProps 方法
    if (matchingConfig && matchingConfig.component?.getServerSideProps) {
      const getServerSideProps = matchingConfig.component.getServerSideProps;
      const result = await getServerSideProps({ params });
      initialProps = result?.props || {};
    }
  }
  const html = renderToString(
    <StrictMode>
        <StaticRouter location={_url}>
            <App initialProps={initialProps} />
        </StaticRouter>
    </StrictMode>,
  )
  return { html, initialProps }
}

// 查找对应的 routeConfig
function findRouteConfig(path: string | undefined) {
  return routeConfigs.flatMap(route => route.children || []).find(route => route.path === path);
}
