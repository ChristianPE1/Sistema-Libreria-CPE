import { useState,useEffect,useCallback } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';

export default function MyRequests() {
   const [requests, setRequests] = useState([]);
   const [loading, setLoading] = useState(true);
   const [pagination, setPagination] = useState({
      count: 0,
      next: null,
      previous: null,
      currentPage: 1
   });

   const fetchRequests = useCallback(async (url = '/api/my-requests/') => {
      if (!url) return; 

      setLoading(true);
      
      try {
         const response = await api.get(url);
         setRequests(response.data.results);
         setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            currentPage: getPageNumberFromUrl(url) || 1
         })
         console.log('Requests:', response.data.results);
      } catch (error) {
         console.error('Error fetching requests:', error);
      }
   },[]);

   const getPageNumberFromUrl = (url) =>{
      if(!url) return 1;
      const match = url.match(/page=(\d+)/);
      return match ? parseInt(match[1]) : 1;
   }

   const handlePageChange = (url) => {
      if (!url) return;
      try {
         const parsedUrl = new URL(url);
         fetchRequests(parsedUrl.pathname + parsedUrl.search);
      } catch (error) {
         console.error('Error parsing pagination URL:', error);
      }
   };

   useEffect(() => {
      fetchRequests();
   },[fetchRequests]);

   if (loading && requests.length === 0) {
      return <div>Loading...</div>
   }

   return (
      <div className='text-white'>
         <h1 className='text-6xl'>My Request</h1>
         <div className='flex flex-col gap-4'>
            {requests.map((request) => (
               <div key={request.id} className='bg-gray-800 p-4 rounded-lg'>
                  <h2 className='text-2xl'>{request.book.title}</h2>
                  <p>Request date: {new Date(request.created_at).toLocaleDateString()}</p>
                  <p>Return date: {request.return_date}</p>
                  <p>Status: {request.status}</p>
                  <p>Request Type: {request.request_type}</p>
                  <p>User email: {request.user.email}</p> 
                  <p>{request.description}</p>
                  <Link to={`/requests/${request.id}`} className='text-blue-500'>View Details</Link>
               </div>
            ))}
            </div>
         <div className="pagination-controls">
            <button
               onClick={() => handlePageChange(pagination.previous)}
               disabled={!pagination.previous}
               className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl ml-2'
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