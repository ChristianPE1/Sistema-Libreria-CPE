import {useParams} from 'react-router-dom';
import { useEffect,useState } from 'react';
import api from '../../api/api';

export default function BookPage() {

   const {id} = useParams();
   const [book, setBook] = useState(null);
   const [loading, setLoading] = useState(true);

   const fetchBook = async (id) => {
      setLoading(true);
      try {
         const response = await api.get(`/api/books/${id}/`);
         setBook(response.data);
         setLoading(false);
      } catch (error) {
         console.error('Error fetching book:',error);
      }
   }

   useEffect(() => {
      fetchBook(id);
   }, [id]);

   if(loading){
      return <div>Loading book...</div>
   }


   return (
      <div className='text-white'>
         <h1 className='text-4xl font-bold'>{book.title}</h1>
         <p>This is the book page.</p>
      </div>
   );
}