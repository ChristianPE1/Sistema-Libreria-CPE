import PropTypes from 'prop-types';


export default function PaginationFooter({ pagination, onPageChange }) {
   return (
      <footer className="flex items-center justify-center gap-4 pt-8">
         <button
            onClick={() => onPageChange(pagination.previous)}
            disabled={!pagination.previous}
            className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200  bg-neutral-700 hover:bg-neutral-600 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
         >
            Anterior
         </button>

         <span className="text-neutral-400 font-medium">
            Página {pagination.currentPage} de {Math.ceil(pagination.count / 3)}
         </span>

         <button
            onClick={() => onPageChange(pagination.next)}
            disabled={!pagination.next}
            className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200  bg-neutral-700 hover:bg-neutral-600 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
         >
            Siguiente
         </button>
      </footer>
   )
}

PaginationFooter.propTypes = {
   onPageChange: PropTypes.func.isRequired,
   pagination: PropTypes.shape({
      count: PropTypes.number.isRequired,
      next: PropTypes.string,
      previous: PropTypes.string,
      currentPage: PropTypes.number.isRequired,
   }).isRequired,
};
