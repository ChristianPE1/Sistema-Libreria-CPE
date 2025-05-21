import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function Books() {

   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
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
         const response = await api.get(url, { withCredentials: false });
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
   }, []);

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

   const handleSearch = async (e) => {
      e.preventDefault();
      if (search.trim() === '') {
         fetchBooks();
         return;
      }
      const url = `/api/books/search/?search=${search}`;

      fetchBooks(url);
   };

   if (loading && books.length === 0) {
      return <div>Loading books...</div>;
   }
   return (
      <div className="text-white">
         <h1 className='text-5xl font-bold'>Virtual Library</h1>
         <form className="max-w-md mx-auto" onSubmit={handleSearch}>
            <label htmlFor="default-search" className="font-medium text-gray-900">Search</label>
            <div className="relative">
               <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
               </div>
               <div className='w-full flex justify-end items-center' id='test'>
                  <input
                     type="search"
                     id="default-search"
                     className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                     placeholder="Search Mockups, Logos..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     required
                  />
                  <button type="submit" className="py-2 px-3 cursor-pointer rounded-xl text-white absolute bg-blue-700">Search</button>
               </div>
            </div>
         </form>
         <div className="flex items-center justify-center flex-wrap gap-6">
            {books.map(book => (
               <div key={book.id} className="flex flex-col  border-2 border-gray-300/20 rounded-lg gap-6 m-6 bg-gray-800/50 text-white max-h-[500px] max-w-[300px] p-4">
                  <header className='flex justify-center items-center'>
                     <img src="/harry_potter_1.jpg" alt="harry potter" className='max-w-1/2' />
                  </header>
                  <section>
                     <h3 className='text-xl my-2 font-bold '>{book.title}</h3>
                     <p><strong>Author:</strong> {book.author}</p>
                     <p className="availability">
                        <strong>Available Copies:</strong> {book.available_copies}
                     </p>
                     <Link to={`/books/${book.id}`} className="text-blue-600 ">
                        View Details
                     </Link>
                  </section>
               </div>
            ))}
         </div>

         {/* Pagination Controls */}
         <div className="pagination-controls">
            <button
               onClick={() => handlePageChange(pagination.previous)}
               disabled={!pagination.previous}
               className='cursor-pointer bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl ml-2'
            >
               Previous
            </button>

            <span>Page {pagination.currentPage} of {Math.ceil(pagination.count / 3)}</span>

            <button
               onClick={() => handlePageChange(pagination.next)}
               disabled={!pagination.next}
               className='cursor-pointer bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl ml-2'
            >
               Next
            </button>
         </div>
      </div>
   );
}