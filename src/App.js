import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import PostContext from './contexts/postContext';

function App() {
  const [postList, setPostList] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  function getPosts() {
    setLoadingPosts(true);
    const URL = "https://projeto17-linkr.herokuapp.com/posts";
    const config = {
      headers: {
        // FIXME: ADICIONAR TOKEN AQUI
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJNYXNpaCIsImlhdCI6MTY1NTQ5MDM5NX0.XeWyPACGH3ygylWVkJA-pdIcepRSjk7qISI7a_oqiXo`
      }
    };
    const promise = axios.get(URL, config);
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
        </Routes>
      </BrowserRouter>
    </PostContext.Provider>
  )
}

export default App;