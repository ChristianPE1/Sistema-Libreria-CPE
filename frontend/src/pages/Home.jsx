import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { MdAdd } from 'react-icons/md';
import EditBookModal from '../components/books/EditBookModal';
import CreateBookModal from '../components/books/CreateBookModal';
import { useAuth } from '../hooks/useAuth';
import { ACCESS_TOKEN } from '../constants';
import PaginationFooter from '../components/PaginationFooter';
import BookCard from '../components/books/BookCard';
import SearchForm from '../components/books/SearchForm';

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
         const token = localStorage.getItem(ACCESS_TOKEN);
         console.log('Actualizando libro:', bookId, 'Token disponible:', !!token);
         console.log('Datos del libro:', bookData);
         
         if (!token) {
            throw new Error('No hay token de autenticación');
         }
         
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

   const openDeleteModal = (book) => {
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
      <div className="flex flex-col gap-y-8 max-w-6xl m-auto">
         {/* Header */}
         <header className="flex flex-col gap-y-4 text-center">
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
         <SearchForm 
            handleSearch={handleSearch}
            search={search}
            setSearch={setSearch}
            placeholderSearch="Buscar por título o autor..."
         />

         {/* Books Grid */}
         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
               <BookCard
                  key={book.id}
                  book={book}
                  role={role}
                  openEditModal={openEditModal}
                  openDeleteModal={openDeleteModal}
               />
            ))}
         </section>

         {books.length === 0 && !loading && (
            <div className="text-center py-16">
               <div className="text-6xl text-neutral-700 mb-4">📚</div>
               <h3 className="text-xl font-semibold text-neutral-300 mb-2">No se encontraron libros</h3>
               <p className="text-neutral-500">Intenta con una búsqueda diferente</p>
            </div>
         )}

         {/* Pagination */}
         {books.length > 0 && (
            <PaginationFooter
               pagination={pagination}
               onPageChange={handlePageChange}
            />
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