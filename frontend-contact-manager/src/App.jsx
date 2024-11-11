// import { useEffect, useState } from 'react'
// import axios from "axios"
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   useEffect(() => {
//     axios.get()
//   },[])

//   return (
//     <>
//       <h1 className="text-5xl font-bold underline">
//       Contact Manager
//     </h1>
//     </>
//   )
// }

// export default App

import axios from "axios"
import { useEffect, useState } from 'react'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ContactList from './components/ContactList';
import ProtectedRoute from './components/ProtectedRoute';




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
