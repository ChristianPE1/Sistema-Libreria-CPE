import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MdEdit, MdDelete } from 'react-icons/md';


export default function BookCard({book,role,openEditModal,openDeleteModal}) {
   return (
      <div key={book.id} className=" group bg-neutral-900 border border-neutral-800 rounded-lg p-6 transition-all duration-200 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-600/10 overflow-hidden">


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
                  onClick={() => openDeleteModal(book)}
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
               src={book.image}
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.available_copies > 0
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
   )
}

BookCard.propTypes = {
   book: PropTypes.object.isRequired,
   role: PropTypes.string,
   openEditModal: PropTypes.func.isRequired,
   openDeleteModal: PropTypes.func.isRequired,
}