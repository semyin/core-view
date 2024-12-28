import { Outlet } from 'react-router';

export default function DefaultLayout() {
    return <div className="__defaultLayout__">{<Outlet />}</div>
}
