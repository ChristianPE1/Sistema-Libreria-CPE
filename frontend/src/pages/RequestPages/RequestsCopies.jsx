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
      return (
         <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
               <p className="text-neutral-400">Cargando solicitudes de copias...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         {/* Header */}
         <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
               Solicitudes de <span className="text-purple-500">Copias</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl mx-auto">
               Gestiona las solicitudes para agregar más copias de libros al inventario
            </p>
         </header>

         {/* Form */}
         <section className="flex flex-col gap-y-6">
            {requests.map((request) => (
               <div key={request.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-purple-600/50 transition-all duration-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                     {/* Book Info */}
                     <div className="flex flex-col gap-y-4">
                        <header>
                           <h2 className="text-2xl font-semibold text-white mb-2">{request.book.title}</h2>
                           <div className="flex items-center gap-2 mb-4">
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
                        </header>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
                              <span className="text-neutral-400 block text-sm mb-1">Copias Actuales</span>
                              <span className="text-white font-bold text-2xl">{request.book.available_copies}</span>
                           </div>
                           <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-4 text-center">
                              <span className="text-purple-400 block text-sm mb-1">Copias Solicitadas</span>
                              <span className="text-purple-300 font-bold text-2xl">+{request.copies_requested}</span>
                           </div>
                        </div>

                        {/* Total */}
                        <aside className="bg-blue-600/20 border border-gray-500/30 rounded-lg p-4">
                           <div className="text-center">
                              <span className="text-neutral-300 text-sm block mb-1">Total después de aprobación</span>
                              <span className="text-white font-bold text-xl">
                                 {request.book.available_copies + parseInt(request.copies_requested)} copias
                              </span>
                           </div>
                        </aside>
                     </div>

                     {/* Actions */}
                     <div className="flex flex-col gap-4">
                        {request.status === 'pending' && (
                           <div className="space-y-4">
                              <h4 className="text-lg font-medium text-white border-b border-neutral-700 pb-2">Acciones</h4>
                              <div className="space-y-3">
                                 <button
                                    className="cursor-pointer w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                    onClick={() => acceptRequest(request.id, 'approved')}
                                 >
                                    <span className="text-lg">✓</span>
                                    Aprobar Solicitud
                                 </button>
                                 <button
                                    className="cursor-pointer w-full px-6 py-3 bg-red-600 hover:bg-red-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                    onClick={() => acceptRequest(request.id, 'rejected')}
                                 >
                                    <span className="text-lg">✗</span>
                                    Rechazar Solicitud
                                 </button>
                              </div>
                           </div>
                        )}

                        {request.status !== 'pending' && (
                           <div className="space-y-2">
                              <h4 className="text-sm font-medium text-neutral-400">Solicitud procesada</h4>
                              <p className="text-sm text-neutral-300">
                                 {request.status === 'approved' 
                                    ? 'Las copias han sido agregadas al inventario' 
                                    : 'La solicitud fue rechazada'
                                 }
                              </p>
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
               <div className="text-6xl text-neutral-700 mb-4">📚</div>
               <h3 className="text-xl font-semibold text-neutral-300 mb-2">No hay solicitudes de copias</h3>
               <p className="text-neutral-500">No se encontraron solicitudes para agregar copias</p>
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
                  Página {pagination.currentPage} de {Math.ceil(pagination.count / 10)}
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