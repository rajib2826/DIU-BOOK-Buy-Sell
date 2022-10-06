import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import './App.css';
import Login from './page/Login';
import NotFound from './page/NotFound';
import Registration from './page/Registration';
import Books from './page/Books';
import BookDetails from './page/BookDetails';
import Listing from './page/Listing';
import Profile from './page/Profile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/books' element={<Books />} />
        <Route path='/book-details' element={<BookDetails />} />
        <Route path='/listing' element={<Listing />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
