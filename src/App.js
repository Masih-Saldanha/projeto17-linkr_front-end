import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import UserPage from './pages/Home/UserPage';
import PostContext from './contexts/postContext';

function App() {
  const [postList, setPostList] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  function getPosts() {
    setLoadingPosts(true);
    const URL = "https://projeto17-linkr.herokuapp.com/posts";
    const promise = axios.get(URL);
    promise.then(response => {
      const { data } = response;
      setPostList(data);
      setLoadingPosts(false);
    });
    promise.catch(error => {
      const { response } = error;
      const { data } = response;
      alert("An error ocurred while trying to fetch the posts, please refresh the page");
      setLoadingPosts(false);
    });
  }

  return (
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
          <Route path='/timeline' element={<Home />} />
          <Route path='/user/:id' element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </PostContext.Provider>
  )
}

export default App;