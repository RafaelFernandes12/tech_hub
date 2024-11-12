// src/AppRouter.tsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { NotFound } from '../pages/notFound';
import Products from '../pages/products';
import Sells from '../pages/sells';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/products/:n" element={<Products />} />
        <Route path="/sells/:n" element={<Sells />} />
        {/* <Route path="/products/:id" element={<ProductDetails />} /> */}
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
