import './App.css'
import {useRoutes} from "react-router-dom";
import { routes } from './router/routes'
import React from "react";


// 定义 initialProps 的类型
interface AppProps {
  initialProps: Record<string, any>;
}

function App({ initialProps }: AppProps) {
  const element = useRoutes(
    routes.map(route => ({
      ...route,
      element: React.cloneElement(route.element as React.ReactElement,  { ...initialProps }), // 注入类型安全的 initialProps
    })),
  );
  return (
    <div className="App">{element}</div>
  )
}

export default App
