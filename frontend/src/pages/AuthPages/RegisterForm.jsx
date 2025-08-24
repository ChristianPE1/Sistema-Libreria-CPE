import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN,REFRESH_TOKEN } from '../../constants';

const route = '/api/users/register/';

export default function Form(){
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [email, setEmail] = useState('');
   const [age, setAge] = useState('');
   const [role, setRole] = useState('usuario');
   const [Loading, setLoading] = useState(false);

   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const response = await api.post(route, {
            username,
            email,
            password,
            age,
            role
         });
         console.log('Success:', response.data);
         const { access, refresh } = response.data;
         localStorage.setItem(ACCESS_TOKEN, access);
         localStorage.setItem(REFRESH_TOKEN, refresh);
         navigate('/');
      }
      catch (error) {
         console.error(error);
         setLoading(false);

         alert('Error: ' + error.message);
      }
   }

   return(
      <div className='min-h-screen flex items-center justify-center p-4'>
         <section className='w-full max-w-4xl grid lg:grid-cols-2 gap-x-30 gap-y-12 items-center'>
            
            {/* Info */}
            <aside className='flex flex-col gap-6 text-center lg:text-left justify-center items-center lg:items-start'>
               <div className='flex flex-col gap-4'>
                  <h1 className='text-4xl lg:text-5xl font-bold text-white'>
                     Únete a <br/>
                     <span className='text-purple-500'>Biblioteca Virtual</span>
                  </h1>
                  <p className='text-lg text-neutral-400 max-w-lg'>
                     Crea tu cuenta y comienza a explorar nuestra colección digital de libros
                  </p>
               </div>
               
               <div className='space-y-3 text-sm text-neutral-500'>
                  <p className='flex items-center gap-2'>
                     <span className='text-purple-400'>✨</span>
                     Acceso a miles de libros digitales
                  </p>
                  <p className='flex items-center gap-2'>
                     <span className='text-purple-400'>📚</span>
                     Gestión fácil de préstamos
                  </p>

               </div>
            </aside>

            {/* Register form */}
            <main className='bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md mx-auto w-full'>
               <header className='text-center mb-6'>
                  <h2 className='text-2xl font-bold text-white mb-2'>Crear Cuenta</h2>
                  <p className='text-neutral-400'>Completa tus datos para registrarte</p>
               </header>

               <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                     <label htmlFor="username" className='block text-sm font-medium text-neutral-300 mb-1'>
                        Nombre de usuario
                     </label>
                     <input 
                        id="username"
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tu nombre de usuario"
                        required
                        className='w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors'
                     />
                  </div>
                  
                  <div>
                     <label htmlFor="email" className='block text-sm font-medium text-neutral-300 mb-1'>
                        Correo electrónico
                     </label>
                     <input 
                        id="email"
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className='w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors'
                     />
                  </div>
                  
                  <div>
                     <label htmlFor="password" className='block text-sm font-medium text-neutral-300 mb-1'>
                        Contraseña
                     </label>
                     <input 
                        id="password"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className='w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors'
                     />
                  </div>
                  
                  <div>
                     <label htmlFor="age" className='block text-sm font-medium text-neutral-300 mb-1'>
                        Edad
                     </label>
                     <input 
                        id="age"
                        type="number" 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Tu edad"
                        min="13"
                        max="120"
                        required
                        className='w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors'
                     />
                  </div>
                  
                  <div>
                     <label htmlFor="role" className='block text-sm font-medium text-neutral-300 mb-1'>
                        Tipo de usuario
                     </label>
                     <select 
                        id="role"
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        required 
                        className='w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors'
                     >
                        <option value="usuario">Usuario</option>
                        <option value="bibliotecario">Bibliotecario</option>
                        <option value="admin">Administrador</option>
                     </select>
                  </div>

                  <button 
                     type="submit" 
                     disabled={Loading}
                     className='w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-purple-600 hover:bg-purple-700 text-white mt-6'
                  >
                     {Loading ? (
                        <div className="flex items-center justify-center gap-2">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                           Creando cuenta...
                        </div>
                     ) : (
                        'Crear Cuenta'
                     )}
                  </button>
               </form>
               
               <footer className='mt-6 text-center'>
                  <span className='text-neutral-400'>¿Ya tienes cuenta? </span>
                  <a href="/login" className='text-purple-400 hover:text-purple-300 font-medium transition-colors'>
                     Inicia sesión aquí
                  </a>
               </footer>
            </main>
         </section>
      </div>
   )

}
