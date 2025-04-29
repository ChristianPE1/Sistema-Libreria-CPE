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
      <section className='absolute w-full h-screen flex items-center justify-center top-0 left-0'>
         <main className='flex flex-row gap-20 border-2 border-gray-500 rounded-2xl p-4 shadow-lg bg-slate-700'>
            <div className='flex flex-col gap-4 items-center justify-center'>
               <h2 className='text-6xl font-bold'>Register</h2>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
               <input type="text" value={username} onChange={
                  (e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                  className='border-2 border-gray-300 rounded-md p-2'
                  />
               <input type="password" value={password} onChange={
                  (e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className='border-2 border-gray-300 rounded-md p-2'/>
               <input type="email" value={email} onChange={
                  (e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className='border-2 border-gray-300 rounded-md p-2'/>
               <input type="number" value={age} onChange={
                  (e) => setAge(e.target.value)}
                  placeholder="Age"
                  required
                  className='border-2 border-gray-300 rounded-md p-2'/>
               <select value={role} onChange={(e) => setRole(e.target.value)} required className='border-2 bg-slate-600 border-gray-300 rounded-md p-2'>
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
                  <option value="bibliotecario">Bibliotecario</option>
               </select>

               <button type="submit" disabled={Loading}>Register</button>
            </form>
         </main>
      </section>
   )

}
