import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, onSubmit, placeholder = "Search groceries..." }) => {
  return (
    <form className="relative w-full" onSubmit={onSubmit}>
      <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
      <input
        className="input pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </form>
  );
};

export default SearchBar;
