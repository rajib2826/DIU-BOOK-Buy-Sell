import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext';
import { db } from '../../firebaseConfig';

export const StoreContext = createContext();

export default function StoreContextProvider({ children }) {
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [bookLoading, setBookLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderBooks, setOrderBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [userFavoriteBooks, setUserFavoriteBooks] = useState([]);
  const [favoriteBooksLoading, setFavoriteBooksLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const { loggedInUser } = useAuth();

  // get cart from local storage
  useEffect(() => {
    const getCart = localStorage.getItem('cart');
    if (getCart) {
      setCart(JSON.parse(getCart));
    }
  }, []);

  // set cart to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // get all books
  useEffect(() => {
    if (loggedInUser) {
      setBookLoading(true);
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'books'),
          where('sellerDepartment', '==', loggedInUser?.department)
        ),
        (snapshot) => {
          const allBooks = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            ?.sort((a, b) => b?.timestamp?.seconds - a?.timestamp?.seconds);
          setAllBooks(allBooks);
          setFilteredBooks(allBooks);
          setBookLoading(false);
        },
        (err) => {
          setBookLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  // get users books listing
  useEffect(() => {
    if (loggedInUser) {
      setListingLoading(true);
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'books'),
          where('sellerEmail', '==', loggedInUser?.email)
        ),
        (snapshot) => {
          const userBooks = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            ?.sort((a, b) => b?.timestamp?.seconds - a?.timestamp?.seconds);
          setUserBooks(userBooks);
          setListingLoading(false);
        },
        (err) => {
          setListingLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  // get users order books
  useEffect(() => {
    if (loggedInUser) {
      setOrderLoading(true);
      const unsubscribe = onSnapshot(
        query(collection(db, 'orders')),
        (snapshot) => {
          const orderBooks = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            ?.sort((a, b) => b?.timestamp?.seconds - a?.timestamp?.seconds);
          setOrderBooks(orderBooks);
          setOrderLoading(false);
        },
        (err) => {
          setOrderLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  // get users favorite books
  useEffect(() => {
    if (loggedInUser) {
      setFavoriteBooksLoading(true);
      const unsubscribe = onSnapshot(
        query(collection(db, 'favorite')),
        (snapshot) => {
          const favoriteBooks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const uniqueFavoriteBooks = Array?.from(
            new Set(favoriteBooks?.map((obj) => obj?.listingId))
          )
            .map((id) => {
              return favoriteBooks?.find((obj) => obj?.listingId === id);
            })
            ?.sort((a, b) => b?.timestamp?.seconds - a?.timestamp?.seconds);
          setFavoriteBooks(uniqueFavoriteBooks);
          setUserFavoriteBooks(
            uniqueFavoriteBooks?.filter(
              (obj) => obj?.userEmail === loggedInUser?.email
            )
          );
          setFavoriteBooksLoading(false);
        },
        (err) => {
          setFavoriteBooksLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  // get reviews
  useEffect(() => {
    if (loggedInUser) {
      setReviewLoading(true);
      const unsubscribe = onSnapshot(
        query(collection(db, 'reviews')),
        (snapshot) => {
          const reviews = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            ?.reverse();
          setReviews(reviews);
          setReviewLoading(false);
        },
        (err) => {
          setReviewLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  // get users
  useEffect(() => {
    if (loggedInUser) {
      setUserLoading(true);
      const unsubscribe = onSnapshot(
        query(collection(db, 'users')),
        (snapshot) => {
          const users = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            ?.sort((a, b) => b?.timestamp?.seconds - a?.timestamp?.seconds);
          setUser(users);
          setUserLoading(false);
        },
        (err) => {
          setUserLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  // get payments
  useEffect(() => {
    if (loggedInUser) {
      setPaymentsLoading(true);
      const unsubscribe = onSnapshot(
        query(collection(db, 'payments')),
        (snapshot) => {
          const payments = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            ?.sort((a, b) => b?.transitionDate - a?.transitionDate);
          setPayments(
            payments?.filter(
              (obj) => obj?.customer?.email === loggedInUser?.email
            )
          );
          setPaymentsLoading(false);
        },
        (err) => {
          setPaymentsLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  const bookingData = {
    allBooks,
    filteredBooks,
    setFilteredBooks,
    bookLoading,
    listingLoading,
    userBooks,
    orderLoading,
    orderBooks,
    cart,
    setCart,
    favoriteBooks,
    userFavoriteBooks,
    favoriteBooksLoading,
    reviewLoading,
    reviews,
    userLoading,
    user,
    paymentsLoading,
    payments,
  };

  return (
    <StoreContext.Provider value={bookingData}>
      {children}
    </StoreContext.Provider>
  );
}
