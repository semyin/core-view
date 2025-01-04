import { Outlet } from 'react-router-dom';

export default function DefaultLayout(initialProps: Record<string, any>) {
    return (
      <div className="__defaultLayout__">
        {/* 将 initialProps 传递给 Outlet 渲染的子路由 */}
        <Outlet context={{ initialProps }} />
      </div>
    );
}
