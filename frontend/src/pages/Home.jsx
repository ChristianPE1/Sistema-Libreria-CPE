import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function Books() {

   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [pagination, setPagination] = useState({
      count: 0,
      next: null,
      previous: null,
      currentPage: 1
   });

   const fetchBooks = useCallback(async (url = '/api/books/') => {
      if (!url) return; 

      setLoading(true);
      try {
         const response = await api.get(url,{withCredentials: false});
         setBooks(response.data.results);
         setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            currentPage: getPageNumberFromUrl(url) || 1
         });
      } catch (err) {
         console.error('Error fetching books:', err);
      }
   },[]);

   const getPageNumberFromUrl = (url) => {
      if (!url) return 1;
      const match = url.match(/page=(\d+)/);
      return match ? parseInt(match[1]) : 1;
   };

   const handlePageChange = (url) => {
      if (!url) return;
      try {
         const parsedUrl = new URL(url);
         fetchBooks(parsedUrl.pathname + parsedUrl.search);
      } catch (err) {
         console.error('Error parsing pagination URL:', err);
      }
   };


   useEffect(() => {
      fetchBooks();
   }, [fetchBooks]);


   if (loading && books.length === 0) {
      return <div>Loading books...</div>;
   }
   return (
      <div className="text-white">
         <h1 className='text-5xl font-bold'>Virtual Library</h1>
         <header className='my-6 flex justify-center items-center gap-5'>
            <Link to="/login" className="p-3 border rounded-md border-gray-200">Login</Link>
            <Link to="/register" className="p-3 border rounded-md border-gray-200">Register</Link>
         </header>
         <div className="flex">
            {books.map(book => (
               <div key={book.id} className="border-2 border-gray-300 rounded-lg p-4 m-4 bg-gray-800 text-white">
                  
                  <h3 className='text-3xl my-2'>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                  <p><strong>Year:</strong> {book.year}</p>
                  <p className="availability">
                     <strong>Available Copies:</strong> {book.available_copies}
                  </p>
                  <Link to={`/book/${book.id}`} className="view-button">
                     View Details
                  </Link>
               </div>
            ))}
         </div>

         {/* Pagination Controls */}
         <div className="pagination-controls">
            <button
               onClick={() => handlePageChange(pagination.previous)}
               disabled={!pagination.previous}
            >
               Previous
            </button>

            <span>Page {pagination.currentPage} of {Math.ceil(pagination.count / 3)}</span>

            <button
               onClick={() => handlePageChange(pagination.next)}
               disabled={!pagination.next}
            >
               Next
            </button>
         </div>
      </div>
   );
}