import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import PropTypes from 'prop-types';

export default function CreateBookModal({ isOpen, onClose, onCreate }) {
   const [formData, setFormData] = useState({
      title: '',
      author: '',
      genre: '',
      year: '',
      description: '',
      available_copies: '',
   });
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
         await onCreate(formData);
         setFormData({
            title: '',
            author: '',
            genre: '',
            year: '',
            description: '',
            available_copies: '',
         });
         onClose();
      } catch (error) {
         console.error('Error creating book:', error);
         alert('Error al crear el libro');
      } finally {
         setLoading(false);
      }
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
         />
         
         <main className="relative bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <header className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-white">Crear Nuevo Libro</h2>
               <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white transition-colors"
               >
                  <MdClose size={24} />
               </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">
                        Título *
                     </label>
                     <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors"
                     />
                  </div>

                  <div>
                     <label htmlFor="author" className="block text-sm font-medium text-neutral-300 mb-2">
                        Autor *
                     </label>
                     <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors"
                     />
                  </div>

                  <div>
                     <label htmlFor="genre" className="block text-sm font-medium text-neutral-300 mb-2">
                        Género *
                     </label>
                     <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors"
                     />
                  </div>

                  <div>
                     <label htmlFor="year" className="block text-sm font-medium text-neutral-300 mb-2">
                        Año *
                     </label>
                     <input
                        type="number"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        min="1000"
                        max="2030"
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors"
                     />
                  </div>

                  <div>
                     <label htmlFor="available_copies" className="block text-sm font-medium text-neutral-300 mb-2">
                        Copias Disponibles *
                     </label>
                     <input
                        type="number"
                        id="available_copies"
                        name="available_copies"
                        value={formData.available_copies}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors"
                     />
                  </div>
               </div>

               <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-2">
                     Descripción
                  </label>
                  <textarea
                     id="description"
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     rows="4"
                     placeholder="Descripción del libro (opcional)"
                     className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 transition-colors resize-none"
                  />
               </div>

               <footer className="flex gap-4 pt-4">
                  <button
                     type="button"
                     onClick={onClose}
                     className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-neutral-700 hover:bg-neutral-600 text-neutral-100"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     disabled={loading}
                     className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {loading ? (
                        <div className="flex items-center gap-2">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                           Creando...
                        </div>
                     ) : (
                        'Crear Libro'
                     )}
                  </button>
               </footer>
            </form>
         </main>
      </div>
   );
}

CreateBookModal.propTypes = {
   isOpen: PropTypes.bool.isRequired,
   onClose: PropTypes.func.isRequired,
   onCreate: PropTypes.func.isRequired,
};
