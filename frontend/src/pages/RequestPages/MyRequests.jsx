import { useState,useEffect,useCallback } from 'react';
import api from '../../api/api';

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
      return (
         <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
               <p className="text-neutral-400">Cargando solicitudes...</p>
            </div>
         </div>
      );
   }

   return (
      <div className='flex flex-col gap-y-8 max-w-3xl m-auto'>
         <header className="flex flex-col gap-y-4 text-center">
            <h1 className='text-4xl font-bold text-white'>
               Mis <span className="text-purple-500">Solicitudes</span>
            </h1>
            <p className="text-neutral-400">
               Historial de libros solicitados y su estado actual
            </p>
         </header>

         <div className='grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-4 gap-4'>
            {requests.map((request) => (
               <div key={request.id} className='bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-purple-600/50 transition-all duration-200'>
                  <div className="flex flex-col justify-between items-center gap-4">
                     <main className="flex flex-col gap-y-3 justify-center items-center">
                        <h2 className='text-xl font-semibold text-white text-center'>{request.book.title}</h2>
                        <div className="flex flex-col items-center gap-3">
                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'approved'
                                 ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                                 : request.status === 'rejected'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                              }`}>
                              {request.status === 'approved' ? 'Aprobado' :
                                 request.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                           </span>
                        </div>
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                           <div>
                              <span className='text-neutral-400'>Fecha de solicitud:</span>
                              <p className='text-neutral-200'>{new Date(request.request_date).toLocaleDateString()}</p>
                           </div>
                           <div>
                              <span className='text-neutral-400'>Dias solicitados:</span>
                              <p className='text-neutral-200'>{request.days_requested || 'No asignada'}</p>
                           </div>
                           <div>
                              <span className='text-neutral-400'>Usuario:</span>
                              <p className='text-neutral-200'>{request.user.email}</p>
                           </div>
                        </section>
                     </main>
                     

                  </div>
               </div>
            ))}
         </div>


         {requests.length === 0 && !loading && (
            <div className="text-center py-16">
               <div className="text-6xl text-neutral-700 mb-4">📋</div>
               <h3 className="text-xl font-semibold text-neutral-300 mb-2">No tienes solicitudes</h3>
               <p className="text-neutral-500">Explora el catálogo y solicita tu primer libro</p>
            </div>
         )}

         {/** Pagination **/}
         {requests.length > 0 && pagination.count > 0 && (
            <footer className="flex items-center justify-center gap-4 pt-8">
               <button
                  onClick={() => handlePageChange(pagination.previous)}
                  disabled={!pagination.previous}
                  className='cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed'
               >
                  Anterior
               </button>
               
               <span className="text-neutral-400 font-medium">
                  Página {pagination.currentPage} de {Math.ceil(pagination.count / 3)}
               </span>
               
               <button
                  onClick={() => handlePageChange(pagination.next)}
                  disabled={!pagination.next}
                  className='cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed'
               >
                  Siguiente
               </button>
            </footer>
         )}
      </div>
   );
}