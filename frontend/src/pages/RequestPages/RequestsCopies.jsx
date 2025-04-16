import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';

export default function RequestsCopies() {

   const[requests,setRequests] = useState([]);
   const[loading,setLoading] = useState(true);
   const[pagination,setPagination] = useState({
      count: 0,
      next: null,
      previous: null,
      currentPage: 1
   });

   const fetchRequets = useCallback( async (url = '/api/requests-copies/') =>{
      if(!url) return;
      try {
         const response = await api.get(url);
         setRequests(response.data.results);
         setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            currentPage: getPageNumberFromUrl(url) || 1
         });
         setLoading(false);
      } catch (error) {
         console.error("Error fetching requests:",error);
      }
   },[])

   const getPageNumberFromUrl = (url) => {
      if (!url) return 1;
      const match = url.match(/page=(\d+)/);
      return match ? parseInt(match[1]) : 1;
   }

   const handlePageChange = (url) => {
      if (!url) return;
      try {
         const parsedUrl = new URL(url);
         fetchRequets(parsedUrl.pathname + parsedUrl.search);
      } catch (error) {
         console.error("Error parsing pagination URL:",error);
      }
   }

   useEffect(()=>{
      fetchRequets();
   }, [fetchRequets]);

   if (loading && requests.length === 0) {
      return <div>Loading...</div>;
   }

   return (
      <div className='text-white'>
         <h1 className='text-6xl'>Requests Copies</h1>
         {requests.map((request) =>(
            <div key={request.id} className='border border-gray-500 p-4 m-2 rounded-lg'>
               <h2 className='text-3xl'>{request.book.title}</h2>
            </div>
            ))}
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