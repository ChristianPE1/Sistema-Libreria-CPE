import { useState,useEffect,useCallback } from 'react';
import api from '../../api/api';

export default function RequestPage() {

   const [requests, setRequests] = useState([]);
   const [loading, setLoading] = useState(true);
   const [pagination, setPagination] = useState({
      count: 0,
      next: null,
      previous: null,
      currentPage: 1
   });

   const fetchRequests = useCallback(async (url = '/api/requests/') => {
      if (!url) return ;
      
      try{
         const response = await api.get(url);
         setRequests(response.data.results);
         setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            currentPage: getPageNumberFromUrl(url) || 1
         })
         setLoading(false);
         console.log('Requests:', response.data.results);
      } catch(error) {
         console.error('Error fetching requests:', error);
      }
   },[]);

   const getPageNumberFromUrl = (url) => {
      if (!url) return 1;
      const match = url.match(/page=(\d+)/);
      return match ? parseInt(match[1]) : 1;
   }

   const handlePageChange = (url)=>{
      if(!url) return;
      try {
         const parsedUrl = new URL(url);
         fetchRequests(parsedUrl.pathname + parsedUrl.search);
      } catch(error) {
         console.error('Error parsing pagination URL:', error);
      }
   }

   useEffect(() => {
      fetchRequests();
   },[fetchRequests]);

   if (loading && requests.length === 0) {
      return <div>Loading...</div>
   }

   const acceptRequest = async (requestId, requestStatus) => {
      try {
         const response = await api.patch(`/api/requests/${requestId}/update/`, { status: requestStatus });
         console.log('Request updated:', response.data);
         fetchRequests();
      } catch (error) {
         console.error("error in the request:", error)
      }
   }

   return (
      <div className='text-white'>
         <h1 className='text-6xl'>Request Page</h1>
         {requests.map((request)=>(
            <div key={request.id} className='border border-gray-600 py-4 my-6'>
               <h2 className='text-3xl'>{request.book.title}</h2>
               <p className='text-xl'>Status: {request.status}</p>
               <p className='text-xl'>Requested by: {request.user.username}</p>
               <p className='text-xl'>Request Date: {new Date(request.request_date).toLocaleDateString()}</p>
               <p className='text-xl'>Days requested: {request.days_requested}</p>
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
               className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl mr-2'
            >
               Previous
            </button>

            <span>Page {pagination.currentPage} of {Math.ceil(pagination.count / 3)}</span>

            <button
               onClick={() => handlePageChange(pagination.next)}
               disabled={!pagination.next}
               className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl ml-2'
            >
               Next
            </button>
         </div>
      </div>
   );
}