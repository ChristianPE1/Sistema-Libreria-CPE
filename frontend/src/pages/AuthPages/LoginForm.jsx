import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

const route = '/api/users/login/';

export default function Login() {

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const clearExistingTokens = () => {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      clearExistingTokens();

      try {
         const response = await api.post(route, {
            email,
            password
         });
         console.log('Success:', response.data);
         const { access, refresh } = response.data.tokens;

         localStorage.setItem(ACCESS_TOKEN, access);
         localStorage.setItem(REFRESH_TOKEN, refresh);
         window.dispatchEvent(new Event('authChanged'));

         navigate('/');
      }
      catch (error) {
         console.error('Error details:', error.response?.data || error.message);
         setLoading(false);
         alert('Error: ' + error.message);
      }
   }
   const demoCredentials = (typeUser) => {
      if (typeUser === "user") {
         setEmail('user@example.com');
         setPassword('123');
      } else if (typeUser === "bibliotecario") {
         setEmail('bib@example.com')
         setPassword('123');
      } else if (typeUser === "admin") {
         setEmail('admin@example.com')
         setPassword('123');
      }
   };

   return (
      <div className='min-h-screen flex items-center justify-center p-4'>
         <div className='w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center'>
            
            {/* Info */}
            <aside className='text-center lg:text-left space-y-6'>
               <header className='space-y-4'>
                  <h1 className='text-5xl lg:text-6xl font-bold text-white'>
                     Bienvenido a <br/>
                     <span className='text-purple-500'>Biblioteca Virtual</span>
                  </h1>
                  <p className='text-xl text-neutral-400 max-w-lg'>
                     Accede a miles de libros y gestiona tus préstamos de manera digital
                  </p>
               </header>

               {/* Demo credentials */}
               <section className='space-y-3'>
                  <p className='text-sm text-neutral-500 font-medium'>Cuentas de prueba:</p>
                  <div className='grid gap-2'>
                     <button
                        type="button"
                        onClick={() => demoCredentials("user")}
                        className="cursor-pointer border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200  text-left justify-start"
                     >
                        <span className='font-medium'>Usuario:</span> user@example.com
                     </button>
                     <button
                        type="button"
                        onClick={() => demoCredentials("bibliotecario")}
                        className="cursor-pointer border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200  text-left justify-start"
                     >
                        <span className='font-medium'>Bibliotecario:</span> bib@example.com
                     </button>
                     <button
                        type="button"
                        onClick={() => demoCredentials("admin")}
                        className="cursor-pointer border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200  text-left justify-start"
                     >
                        <span className='font-medium'>Administrador:</span> admin@example.com
                     </button>
                  </div>
               </section>
            </aside>
            
            {/* Login form */}
            <main className='bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md mx-auto w-full'>
               <div className='text-center mb-8'>
                  <h2 className='text-3xl font-bold text-white mb-2'>Iniciar Sesión</h2>
                  <p className='text-neutral-400'>Ingresa tus credenciales para continuar</p>
               </div>
               
               <form onSubmit={handleSubmit} className='space-y-6'>
                  <div>
                     <label htmlFor="email" className='block text-sm font-medium text-neutral-300 mb-2'>
                        Correo Electrónico
                     </label>
                     <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className='w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors'
                     />
                  </div>
                  
                  <div>
                     <label htmlFor="password" className='block text-sm font-medium text-neutral-300 mb-2'>
                        Contraseña
                     </label>
                     <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className='w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors'
                     />
                  </div>
                  
                  <button
                     type="submit"
                     disabled={loading}
                     className='w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
                  >
                     {loading ? (
                        <div className="flex items-center justify-center gap-2">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                           Iniciando sesión...
                        </div>
                     ) : (
                        'Iniciar Sesión'
                     )}
                  </button>
               </form>
               
               <div className='mt-6 text-center'>
                  <span className='text-neutral-400'>¿No tienes cuenta? </span>
                  <a href="/register" className='text-purple-400 hover:text-purple-300 font-medium transition-colors'>
                     Regístrate aquí
                  </a>
               </div>
            </main>
         </div>
      </div>
   );
}