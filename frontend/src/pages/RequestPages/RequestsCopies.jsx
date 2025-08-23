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

   const fetchRequests = useCallback( async (url = '/api/requests-copies/') =>{
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
         console.log("Requests:",response.data.results);
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
         fetchRequests(parsedUrl.pathname + parsedUrl.search);
      } catch (error) {
         console.error("Error parsing pagination URL:",error);
      }
   }

   useEffect(()=>{
      fetchRequests();
   }, [fetchRequests]);

   const acceptRequest = async (requestId, requestStatus) => {
      try {
         const response = await api.patch(`/api/requests-copies/${requestId}/update/`, { status: requestStatus });
         console.log('Request updated:', response.data);
         fetchRequests();
      } catch (error) {
         console.error("error in the request:", error)
      }
   }

   if (loading && requests.length === 0) {
      return <div>Loading...</div>;
   }

   return (
      <div className='text-white'>
         <h1 className='text-6xl'>Requests Copies</h1>
         {requests.map((request) =>(
            <div key={request.id} className='border border-gray-600 bg-slate-800 p-6 my-6 rounded-lg'>
               <h2 className='text-3xl'>{request.book.title}</h2>
               <p className='text-xl'>Status: {request.status}</p>
               <p className='text-xl'>Copies available: {request.book.available_copies}</p>
               <p className='text-xl'>Copies requested: {request.copies_requested}</p>
               {request.status === 'pending' && (
                  <div>
                     <button
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2'
                        onClick={() => acceptRequest(request.id, 'approved')}
                     >
                        Aprobar
                     </button>
                     <button
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() => acceptRequest(request.id, 'rejected')}
                     >
                        Rechazar
                     </button>
                  </div>
               )
               }
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