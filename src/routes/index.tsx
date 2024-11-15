import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Products from '../pages/products';
import { ProductsPrint } from '../pages/productsPrint';
import Sells from '../pages/sells';
import SellsPrint from '../pages/sellsPrint';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/products/:n" element={<Products />} />
        <Route path="/sells/:n" element={<Sells />} />
        <Route path="/sellsPrint" element={<SellsPrint />} />
        <Route path="/productPrint" element={<ProductsPrint />} />
        <Route path="*" element={<Navigate to={'/products/1'}/>} />
      </Routes>
    </Router>
  );
};
