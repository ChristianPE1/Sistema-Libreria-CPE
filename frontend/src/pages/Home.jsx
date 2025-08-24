import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import EditBookModal from '../components/books/EditBookModal';
import CreateBookModal from '../components/books/CreateBookModal';
import { useAuth } from '../hooks/useAuth';

export default function Books() {
   const { role } = useAuth();

   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [pagination, setPagination] = useState({
      count: 0,
      next: null,
      previous: null,
      currentPage: 1
   });
   
   // Modal states
   const [editModal, setEditModal] = useState({ isOpen: false, book: null });
   const [createModal, setCreateModal] = useState(false);
   const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, book: null });

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
      } finally {
         setLoading(false);
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

   // CRUD 
   const handleCreateBook = async (bookData) => {
      try {
         await api.post('/api/books/', bookData);
         fetchBooks();
      } catch (error) {
         console.error('Error creating book:', error);
         throw error;
      }
   };

   const handleUpdateBook = async (bookId, bookData) => {
      try {
         await api.put(`/api/books/${bookId}/`, bookData);
         fetchBooks();
      } catch (error) {
         console.error('Error updating book:', error);
         throw error;
      }
   };

   const handleDeleteBook = async (bookId) => {
      try {
         await api.delete(`/api/books/${bookId}/`);
         fetchBooks();
         setDeleteConfirm({ isOpen: false, book: null });
      } catch (error) {
         console.error('Error deleting book:', error);
         alert('Error al eliminar el libro');
      }
   };

   const openEditModal = (book) => {
      setEditModal({ isOpen: true, book });
   };

   const closeEditModal = () => {
      setEditModal({ isOpen: false, book: null });
   };

   const openDeleteConfirm = (book) => {
      setDeleteConfirm({ isOpen: true, book });
   };

   const closeDeleteConfirm = () => {
      setDeleteConfirm({ isOpen: false, book: null });
   };

   if (loading && books.length === 0) {
      return (
         <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
               <p className="text-neutral-400">Cargando libros...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         {/* Header */}
         <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
               Catálogo de <span className="text-purple-500">Libros</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl mx-auto">
               Explora nuestra colección de libros disponibles para préstamo
            </p>
            
            {role === 'admin' && (
               <div className="pt-4">
                  <button
                     onClick={() => setCreateModal(true)}
                     className="cursor-pointer inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                     <MdAdd size={20} />
                     Crear Libro
                  </button>
               </div>
            )}
         </header>

         {/* Search Form */}
         <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
               <input
                  type="search"
                  className="w-full pl-10 pr-24 py-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Buscar por título o autor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
               <button 
                  type="submit" 
                  className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
               >
                  Buscar
               </button>
            </div>
         </form>

         {/* Books Grid */}
         <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
               <div key={book.id} className="group bg-neutral-900 border border-neutral-800 rounded-lg p-6 transition-all duration-200 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-600/10 overflow-hidden">
                  

                  {role === 'admin' && (
                     <div className="flex justify-end gap-2 mb-4">
                        <button
                           onClick={() => openEditModal(book)}
                           className="cursor-pointer text-neutral-400 hover:text-purple-400 transition-colors p-1"
                           title="Editar libro"
                        >
                           <MdEdit size={18} />
                        </button>
                        <button
                           onClick={() => openDeleteConfirm(book)}
                           className="cursor-pointer text-neutral-400 hover:text-red-400 transition-colors p-1"
                           title="Eliminar libro"
                        >
                           <MdDelete size={18} />
                        </button>
                     </div>
                  )}
                  
                  {/* Book Cover */}
                  <aside className="relative h-64 mb-4 overflow-hidden rounded-lg">
                     <img 
                        src="/harry_potter_1.jpg" 
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </aside>
                  
                  {/* Book Info */}
                  <main className="space-y-3">
                     <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
                        {book.title}
                     </h3>
                     
                     <div className="space-y-2 text-sm">
                        <p className="text-neutral-300">
                           <span className="font-medium">Autor:</span> {book.author}
                        </p>
                        <p className="text-neutral-300">
                           <span className="font-medium">Género:</span> {book.genre}
                        </p>
                        <div className="flex items-center justify-between">
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              book.available_copies > 0 
                                 ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                                 : 'bg-red-500/20 text-red-400 border border-red-500/20'
                           }`}>
                              {book.available_copies > 0 ? 'Disponible' : 'No disponible'}
                           </span>
                           <span className="text-neutral-400 text-xs">
                              {book.available_copies} copias
                           </span>
                        </div>
                     </div>
                     
                     <Link 
                        to={`/books/${book.id}`} 
                        className="inline-block w-full text-center border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 "
                     >
                        Ver Detalles
                     </Link>
                  </main>
               </div>
            ))}
         </section>

         {books.length === 0 && !loading && (
            <div className="text-center py-16">
               <div className="text-6xl text-neutral-700 mb-4">📚</div>
               <h3 className="text-xl font-semibold text-neutral-300 mb-2">No se encontraron libros</h3>
               <p className="text-neutral-500">Intenta con una búsqueda diferente</p>
            </div>
         )}

         {books.length > 0 && (
            <footer className="flex items-center justify-center gap-4 pt-8">
               <button
                  onClick={() => handlePageChange(pagination.previous)}
                  disabled={!pagination.previous}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200  bg-neutral-700 hover:bg-neutral-600 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Anterior
               </button>
               
               <span className="text-neutral-400 font-medium">
                  Página {pagination.currentPage} de {Math.ceil(pagination.count / 3)}
               </span>
               
               <button
                  onClick={() => handlePageChange(pagination.next)}
                  disabled={!pagination.next}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200  bg-neutral-700 hover:bg-neutral-600 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Siguiente
               </button>
            </footer>
         )}
         

         <CreateBookModal
            isOpen={createModal}
            onClose={() => setCreateModal(false)}
            onCreate={handleCreateBook}
         />
         
         <EditBookModal
            isOpen={editModal.isOpen}
            onClose={closeEditModal}
            book={editModal.book}
            onSave={handleUpdateBook}
         />

         {deleteConfirm.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
               <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={closeDeleteConfirm}
               />
               <div className="relative bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-md mx-4">
                  <h3 className="text-xl font-bold text-white mb-4">Confirmar Eliminación</h3>
                  <p className="text-neutral-300 mb-6">
                     ¿Estás seguro de que deseas eliminar el libro &quot;{deleteConfirm.book?.title}&quot;? 
                     Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-4">
                     <button
                        onClick={closeDeleteConfirm}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-neutral-700 hover:bg-neutral-600 text-neutral-100"
                     >
                        Cancelar
                     </button>
                     <button
                        onClick={() => handleDeleteBook(deleteConfirm.book.id)}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-red-600 hover:bg-red-700 text-white"
                     >
                        Eliminar
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}