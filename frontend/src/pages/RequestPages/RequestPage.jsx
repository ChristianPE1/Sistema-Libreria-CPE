import { useState,useEffect,useCallback } from 'react';
import api from '../../api/api';

export default function RequestPage() {

   const [requests, setRequests] = useState([]);
   const [loading, setLoading] = useState(true);
   const [copiesRequested, setCopiesRequested] = useState({});
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
      return (
         <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
               <p className="text-neutral-400">Cargando solicitudes...</p>
            </div>
         </div>
      );
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

   const requestCopies = async (id) =>{
      try{
         console.log('Request copies:', copiesRequested[id]);
         const response = await api.post(`/api/books/${id}/request-copies/`, {
            copies_requested: copiesRequested[id],
         });

         console.log('Book requested successfully:', response.data);
      }
      catch (error) {
         console.error('Error requesting book:', error);
      }
   }

   return (
      <div className="space-y-8">
         {/* Header */}
         <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
               Gestión de <span className="text-purple-500">Solicitudes</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl mx-auto">
               Administra las solicitudes de préstamo de libros de los usuarios
            </p>
         </header>

         {/* Requests List */}
         <section className="space-y-6">
            {requests.map((request) => (
               <div key={request.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-purple-600/50 transition-all duration-200">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                     {/* Book Info */}
                     <div className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white">{request.book.title}</h2>
                        <div className="space-y-2 text-sm">
                           <div className="flex items-center gap-2">
                              <span className="text-neutral-400">Estado:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 request.status === 'approved' 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                                    : request.status === 'rejected'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                              }`}>
                                 {request.status === 'approved' ? 'Aprobado' : 
                                  request.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                              </span>
                           </div>
                           <p><span className="text-neutral-400">Usuario:</span> <span className="text-neutral-200">{request.user.username}</span></p>
                           <p><span className="text-neutral-400">Fecha:</span> <span className="text-neutral-200">{new Date(request.request_date).toLocaleDateString()}</span></p>
                        </div>
                     </div>

                     {/* Request Details */}
                     <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                           <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
                              <span className="text-neutral-400 block text-xs">Copias disponibles</span>
                              <span className="text-white font-medium text-lg">{request.book.available_copies}</span>
                           </div>
                           <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
                              <span className="text-neutral-400 block text-xs">Días solicitados</span>
                              <span className="text-white font-medium text-lg">{request.days_requested}</span>
                           </div>
                        </div>
                        
                        {request.status === 'pending' && (
                           <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-white mb-3">Solicitar más copias</h4>
                              <div className="flex gap-2">
                                 <input 
                                    type="number"
                                    value={copiesRequested[request.book.id] || ''}
                                    onChange={(e) => setCopiesRequested(prev => ({
                                       ...prev,
                                       [request.book.id]: e.target.value
                                    }))}
                                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 text-sm"
                                    placeholder="N° copias"
                                    min="1"
                                 />
                                 <button
                                    onClick={() => requestCopies(request.book.id)}
                                    className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                                 >
                                    Solicitar
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Actions */}
                     <div className="flex flex-col gap-3">
                        {request.status === 'pending' && (
                           <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Acciones</h4>
                              <div className="flex flex-col gap-2">
                                 <button 
                                    className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-md"
                                    onClick={() => acceptRequest(request.id, 'approved')}
                                 >
                                    Aprobar
                                 </button>
                                 <button
                                    className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors text-md"
                                    onClick={() => acceptRequest(request.id, 'rejected')}
                                 >
                                    Rechazar
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            ))}
         </section>

         {/* Empty State */}
         {requests.length === 0 && !loading && (
            <div className="text-center py-16">
               <div className="text-6xl text-neutral-700 mb-4">📋</div>
               <h3 className="text-xl font-semibold text-neutral-300 mb-2">No hay solicitudes</h3>
               <p className="text-neutral-500">No se encontraron solicitudes de préstamo</p>
            </div>
         )}

         {/* Pagination */}
         {requests.length > 0 && (
            <footer className="flex items-center justify-center gap-4 pt-8">
               <button
                  onClick={() => handlePageChange(pagination.previous)}
                  disabled={!pagination.previous}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Anterior
               </button>

               <span className="text-neutral-400 font-medium">
                  Página {pagination.currentPage} de {Math.ceil(pagination.count / 3)}
               </span>

               <button
                  onClick={() => handlePageChange(pagination.next)}
                  disabled={!pagination.next}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Siguiente
               </button>
            </footer>
         )}
      </div>
   );
}