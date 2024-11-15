import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRouter } from './routes/index';

export default function App() {
  return (
    <div className='m-auto px-20 h-full w-full '>
      <AppRouter />
      <ToastContainer />
    </div>
  );
};
