import { KeyboardEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (searchTerm) queryParams.set('product', searchTerm);
      else queryParams.delete('product');

      navigate(`/productsTable/1?${queryParams.toString()}`);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search products"
      className="input input-bordered w-full max-w-xs"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleSearch}
    />
  );
}
