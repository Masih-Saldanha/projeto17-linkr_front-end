import { useState } from 'react';
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import UserPage from './pages/Home/UserPage';
import PostContext from './contexts/postContext';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import PostsByHashtag from './pages/PostsByHashtag';


function App() {
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingPosts, setLoadingPosts] = useState(false);

  return (
    <AuthProvider>
    <PostContext.Provider
      value={{
        postList,
        setPostList,
        loadingPosts,
        page,
        setPage
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route exact path='/hashtag/:hashtag' element={<PostsByHashtag />} />
          <Route exact path='/' element={<SignIn />} />
          <Route exact path='/signup' element={<SignUp />} />
          <Route exact path='/timeline' element={<Home />} />
          <Route exact path='/user/:id' element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </PostContext.Provider>
    </AuthProvider>
  )
}

export default App;