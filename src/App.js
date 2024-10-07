import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MasterLayout from './layouts/MasterLayout'
import LoginPage from './pages/authentication/LoginPage';
import ForgetPasswordPage from './pages/authentication/ForgetPasswordPage';
import OTPPage from './pages/authentication/OTPPage';
import ResetPasswordPage from './pages/authentication/ResetPasswordPage';
// import Header from './Banner_Pages/components/header/Header';
// import Community from './Banner_Pages/body/Community';
// import Home from './Banner_Pages/body/Home';
// import BlogPage from './Banner_Pages/body/BlogPage';
// import Features from './Banner_Pages/body/Features';
// import history from './history';

function App() {
  return (
    <div>

      {/* <Router history={history}> */}
      <Router basename="/development">
        <Routes>


          <Route path="/admin/*" element={<MasterLayout />} />


          {/* -----Authendication pages----- */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgetpasswordpage" element={<ForgetPasswordPage />} />
          <Route path="/otppage" element={<OTPPage />} />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />
          {/* -----Authendication pages----- */}


          {/* -----   Banner_Pages      ----- */}
          {/* <Route path="/header" element={<Header />} />
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/blogpage" element={<BlogPage />} />
          <Route path="/features" element={<Features />} /> */}

          {/* -----   Banner_Pages      ----- */}

        </Routes>

      </Router>
    </div>
  )
}

export default App