import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./Routes/Home";
import Signin from './Routes/Signin';
import Postjob from './Routes/Postjob';
import Signup from './Routes/Signup';
import Account from './Routes/Account';
import { Routes, Route } from 'react-router-dom';
import Footer from "./components/Footer";
import { AuthContextProvider } from "./context/AuthContext";
import AdminPanel from "./Routes/AdminPanel";
import EditPage from "./Routes/EditPage";

function App() {

  return <ThemeProvider>
    <AuthContextProvider>

      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/account' element={<Account />} />
        <Route path='/adminpanel' element={<AdminPanel />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path='/postjob' element={<Postjob />} />
      </Routes>
      <Footer />

    </AuthContextProvider>
  </ThemeProvider>
}

export default App;
