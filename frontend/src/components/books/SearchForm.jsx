import PropTypes from 'prop-types';

export default function SearchForm({handleSearch, search, setSearch,placeholderSearch}){

   return (
   <form onSubmit={handleSearch} className="sm:w-sm md:w-md lg:w-xl xl:w-2xl mx-auto">
      <div className="relative">
         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
         </div>
         <input
            type="search"
            className="w-full pl-10 pr-24 py-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 transition-all duration-200"
            placeholder={placeholderSearch}
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
   );
}

SearchForm.propTypes = {
   handleSearch: PropTypes.func.isRequired,
   search: PropTypes.string.isRequired,
   setSearch: PropTypes.func.isRequired,
   placeholderSearch: PropTypes.string.isRequired,
};