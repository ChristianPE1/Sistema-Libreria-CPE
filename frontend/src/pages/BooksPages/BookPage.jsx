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
      <div className='text-white flex flex-row'>
         <main className='flex flex-col items-center justify-center w-1/2'>
            <img src="/harry_potter_1.jpg" alt="harry potter" className='max-w-1/2' />
         </main>
         <section className='flex flex-col justify-center items-start m-4 w-1/2'>
            <h1 className='text-4xl font-bold'>{book.title}</h1>
            <p className='text-xl'>Autor: {book.author} - {book.year}</p>
            <p className='text-base'>Copies available: {book.available_copies}</p>
            <p className='text-base'>Description: {book.description}</p>
            <p className='text-base'>Genre: {book.genre}</p>

            <div className='my-4'>
               <label className='block mb-2'>Selecciona fecha de devolución:</label>
               <input
                  type='number'
                  value={daysRequested}
                  onChange={(e) => setDaysRequested(e.target.value)}
                  className='border border-gray-300 rounded px-4 py-2'
                  placeholder='Días solicitados'

               />
               <button
                  onClick={() => requestBook(id)}
                  className='ml-4 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded'
               >
                  Solicitar Libro
               </button>
            </div>
         </section>


      </div>
   );
}