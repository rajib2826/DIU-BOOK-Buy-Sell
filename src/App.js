import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './page/Home';
import './App.css';
import Login from './page/Login';
import NotFound from './page/NotFound';
import Registration from './page/Registration';
import Books from './page/Books';
import BookDetails from './page/BookDetails';
import Listing from './page/Listing';
import Profile from './page/Profile';
import AuthContextProvider from './components/Auth/AuthContext';
import withPublicRoute from './components/Auth/PublicRoute';
import withPrivateRoute from './components/Auth/PrivateRoute';
import Orders from './page/Orders';

// Wrap components with the HOCs
const PublicLogin = withPublicRoute(Login);
const PublicRegistration = withPublicRoute(Registration);
const PrivateBooks = withPrivateRoute(Books);
const PrivateBookDetails = withPrivateRoute(BookDetails);
const PrivateListing = withPrivateRoute(Listing);
const PrivateOrders = withPrivateRoute(Orders);
const PrivateProfile = withPrivateRoute(Profile);

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        {/* Toast Notification */}
        <Toaster
          toastOptions={{
            duration: 3000,
          }}
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<PublicLogin />} />
          <Route path='/signup' element={<PublicRegistration />} />
          <Route path='/books' element={<PrivateBooks />} />
          <Route
            path='/book-details/:listingId'
            element={<PrivateBookDetails />}
          />
          <Route path='/listing' element={<PrivateListing />} />
          <Route path='/orders' element={<PrivateOrders />} />
          <Route path='/profile' element={<PrivateProfile />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
