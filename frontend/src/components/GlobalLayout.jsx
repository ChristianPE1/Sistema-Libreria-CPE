import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
   return (
      <div className="flex flex-col min-h-screen bg-red-300">
         <NavBar />
         <main className="flex-1 p-6 bg-slate-500">
            <Outlet />
         </main>
      </div>
   );
}