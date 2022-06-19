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
  const [loadingPosts, setLoadingPosts] = useState(false);

  function getPosts(token) {
    setLoadingPosts(true);
    const URL = "https://projeto17-linkr.herokuapp.com/posts";
    const config = {
      headers: {
        // FIXME: ADICIONAR TOKEN AQUI
        Authorization: `Bearer ${token}`
      }
    };
    const promise = axios.get(URL, config);
    promise.then(response => {
      const { data } = response;
      setPostList(data);
      console.log(postList);
      setLoadingPosts(false);
    });
    promise.catch(error => {
      const { response } = error;
      const { data } = response;
      console.log(postList);
      alert("An error ocurred while trying to fetch the posts, please refresh the page");
      setLoadingPosts(false);
    });
  }

  return (
    <AuthProvider>
    <PostContext.Provider
      value={{
        postList,
        setPostList,
        getPosts,
        loadingPosts
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path='/hashtag/:hashtag' element={<PostsByHashtag />} />
          <Route path='/' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/timeline' element={<Home />} />
          <Route path='/user/:id' element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </PostContext.Provider>
    </AuthProvider>
  )
}

export default App;