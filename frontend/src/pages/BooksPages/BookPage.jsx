import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api';

export default function BookPage() {

   const { id } = useParams();
   const [book, setBook] = useState(null);
   const [loading, setLoading] = useState(true);
   const [daysRequested, setDaysRequested] = useState(0);


   const fetchBook = async (id) => {
      setLoading(true);
      try {
         const response = await api.get(`/api/books/${id}/`);
         setBook(response.data);
         setLoading(false);
         console.log(response.data);
      } catch (error) {
         console.error('Error fetching book:', error);
      }
   }

   const requestBook = async (id) => {
      if (daysRequested <= 0) {
         console.error('Days requested must be greater than 0');
         return;
      }
      try {
         const response = await api.post(`/api/books/${id}/request/`, {
            days_requested: daysRequested,
         });
         console.log('Book requested successfully:', response.data);

      } catch (error) {
         console.error('Error requesting book:', error);

      }
   }


   useEffect(() => {
      fetchBook(id);
   }, [id]);

   if (loading) {
      return <div>Loading book...</div>
   }


   return (
      <div className='max-w-6xl mx-auto'>
         <section className='grid lg:grid-cols-2 gap-12 items-start'>

            <aside className='flex justify-center'>
               <div className='relative group'>
                  <img 
                     src="/harry_potter_1.jpg" 
                     alt={book.title}
                     className='w-full max-w-md h-auto rounded-lg shadow-2xl shadow-purple-500/20 transition-transform duration-300 group-hover:scale-105' 
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
               </div>
            </aside>


            <main className='flex flex-col gap-y-6'>
               <header className='flex flex-col gap-2'>
                  <h1 className='text-4xl font-bold text-white'>{book.title}</h1>
                  <p className='text-xl text-purple-400 font-medium'>{book.author} • {book.year}</p>
               </header>

               <section className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4'>
                     <span className='text-neutral-400 block'>Género</span>
                     <span className='text-white font-medium'>{book.genre}</span>
                  </div>
                  <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4'>
                     <span className='text-neutral-400 block'>Disponibilidad</span>
                     <div className='flex items-center gap-2'>
                        <span className={`w-2 h-2 rounded-full ${book.available_copies > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        <span className='text-white font-medium'>{book.available_copies} copias</span>
                     </div>
                  </div>
               </section>
               
               <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-white mb-3'>Descripción</h3>
                  <p className='text-neutral-300'>{book.description}</p>
               </div>

               {/* Request Form */}
               <div className='bg-purple-900/20 border border-purple-600/30 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-white mb-4'>Solicitar Préstamo</h3>
                  
                  <div className='flex flex-col gap-y-4'>
                     <div>
                        <label htmlFor="days" className='block text-sm font-medium text-neutral-300 mb-2'>
                           Días de préstamo
                        </label>
                        <input
                           id="days"
                           type='number'
                           value={daysRequested}
                           onChange={(e) => setDaysRequested(e.target.value)}
                           min="1"
                           max="30"
                           className='w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400  transition-colors'
                           placeholder='Número de días (1-30)'
                        />
                        <p className='text-xs text-neutral-500 mt-1'>
                           Máximo 30 días de préstamo
                        </p>
                     </div>
                     
                     <button
                        onClick={() => requestBook(id)}
                        disabled={book.available_copies === 0 || !daysRequested}
                        className='w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600'
                     >
                        {book.available_copies === 0 
                           ? 'No disponible' 
                           : 'Solicitar Libro'
                        }
                     </button>
                  </div>
               </div>
               
               <button
                  onClick={() => window.history.back()}
                  className='px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 '
               >
                  ← Volver al catálogo
               </button>
            </main>
         </section>
      </div>
   );
}