import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ContactList from './components/ContactList';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from "./components/ForgotPassword";




const App = () => {

  // useEffect(() => {
  //   // fetchData();
  //   axios.get('api/v1/users/users')
  //   .then((response) => {
  //     console.log("this is response for all user", response.data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })
  // }, []);

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/contacts" element={
                    <ProtectedRoute>
                        <ContactList />
                        </ProtectedRoute>
                    } />
            </Routes>
        </Router>
    );
}

export default App;
