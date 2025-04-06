import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function BookDetail() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [book, setBook] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchBookDetails = async () => {
         setLoading(true);
         try {
            const response = await api.get(`/api/books/${id}/`);
            setBook(response.data);
         } catch (err) {
            console.error('Error fetching book:', err);
         }
      };

      fetchBookDetails();
   }, [id]);

   if (loading) {
      return <div>Loading book details...</div>;
   }

   if (!book) {
      return <div>Book not found</div>;
   }

   return (
      <div >
         <button onClick={() => navigate(-1)}>
            &larr; Back to Library
         </button>
         <div >
            <div>
               <h1>{book.title}</h1>
               <div >
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                  <p><strong>Year:</strong> {book.year}</p>
                  <p >
                     <strong>Available Copies:</strong> {book.available_copies}
                  </p>
               </div>

               <div >
                  <h3>Description</h3>
                  <p>{book.description}</p>
               </div>

               {book.available_copies > 0 && (
                  <button>
                     Request to Borrow
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}