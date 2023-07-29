import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './page/Home';
import './App.css';
import Login from './page/Login';
import NotFound from './page/NotFound';
import Registration from './page/Registration';
import Books from './page/Books';
import BookDetails from './page/BookDetails';
import Checkout from './page/Checkout';
import AuthContextProvider from './components/Auth/AuthContext';
import withPublicRoute from './components/Auth/PublicRoute';
import withPrivateRoute from './components/Auth/PrivateRoute';
import StoreContextProvider from './components/Context/StoreContext';
import Dashboard from './page/Dashboard';
import Verification from './page/Verification';

// Wrap components with the HOCs
const PublicLogin = withPublicRoute(Login);
const PublicRegistration = withPublicRoute(Registration);
const PrivateBooks = withPrivateRoute(Books);
const PrivateBookDetails = withPrivateRoute(BookDetails);
const PrivateCheckout = withPrivateRoute(Checkout);
const PrivateDashboard = withPrivateRoute(Dashboard);
const PrivateVerification = withPrivateRoute(Verification);

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <StoreContextProvider>
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
            <Route path='/verification' element={<PrivateVerification />} />
            <Route path='/books' element={<PrivateBooks />} />
            <Route
              path='/book-details/:listingId'
              element={<PrivateBookDetails />}
            />
            <Route path='/checkout' element={<PrivateCheckout />} />
            <Route path='/:page' element={<PrivateDashboard />} />

            <Route path='*' element={<NotFound />} />
          </Routes>
        </StoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
