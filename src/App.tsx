import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRouter } from './routes/index';

export default function App() {
  return (
    <div className='m-0 mx-40'>
      <AppRouter />
      <ToastContainer />
    </div>
  );
};
