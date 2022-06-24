import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { Oval } from "react-loader-spinner";
import { BiRefresh } from 'react-icons/bi';
import useInterval from 'use-interval';

import PublishPost from '../../components/PublishPost';
import PostContext from '../../contexts/postContext';
import Header from './../../components/Header';
import { AuthContext } from '../../contexts/AuthContext';
import PostComponent from './PostComponent';
import Trending from '../../components/Trending';

const URL_API = `https://projeto17-linkr.herokuapp.com`;
// const URL_API = `http://localhost:4000`;

function Home() {
  const [toggle, setToggle] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const [count, setCount] = useState(0);
  const [noPostsMessage, setNoPostsMessage] = useState("");

  const navigate = useNavigate();
  const { postList, setPostList, getPosts, loadingPosts, page, setPage } = useContext(PostContext);
  const { token } = useContext(AuthContext);

  useInterval(() => {
    const URL = `https://projeto17-linkr.herokuapp.com/posts/0`;
    // const URL = `http://localhost:4000/posts/0`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const promise = axios.get(URL, config);
    promise.then(response => {
      const { data } = response;
      if (typeof(data) === "string") {
        setNoPostsMessage(data);
        setHasNewPosts(false);
        setHasMore(false);
        setPostList([]);
        setCount(0);
      }
      if (data[0].postId !== postList[0].postId && postList.length !== 0) {
        setHasNewPosts(true);
        setCount(data[0].postId - postList[0].postId);
      }
    });
    promise.catch(error => {
      const { response } = error;
      const { data } = response;
      alert("An error ocurred while trying to fetch the posts, please refresh the page");
    });
  }, (15 * 1000));

  function renderPosts() {
    if (postList.length === 0 && !hasMore) {
      return (
        <NoPosts>{noPostsMessage}</NoPosts>
      )
    } else {
      return (
        postList.map((post, index) => {
          const userInfos = { pictureUrl: post.userPicture, username: post.username };
          return (
            <>
              <PostComponent post={post} index={index} userInfos={userInfos} />
            </>
          )
        })
      )
    }
  }

  function fetchMoreData(pageNumber) {
    pageNumber = page;
    const URL = `https://projeto17-linkr.herokuapp.com/posts/${pageNumber}`;
    // const URL = `http://localhost:4000/posts/${pageNumber}`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const promise = axios.get(URL, config);
    promise.then(response => {
      const { data } = response;
      if (typeof(data) !== "object") {
        setNoPostsMessage(data);
        setHasMore(false);
        return
      }
      if (data.length === 0) return setHasMore(false);
      setPostList([...postList, ...data]);
      setPage(pageNumber + 1);
    });
    promise.catch(error => {
      const { response } = error;
      const { data } = response;
      alert("An error ocurred while trying to fetch the posts, please refresh the page");
    });
  };

  return (
    <>
      <Header toggle={toggle} setToggle={setToggle} />
      <Main>
        <Timeline>
          <TimelineTitle>timeline</TimelineTitle>
          <PublishPost></PublishPost>
          {
            !hasNewPosts ? <></> : 
            <NewPostsNotification onClick={() => {
              setPage(0);
              setPostList([]);
              setCount(0);
              setHasNewPosts(false);
            }}>{count} new posts, load more! <BiRefresh /></NewPostsNotification>
          }
          <InfiniteScroll
            dataLength={postList.length}
            loader={
              <Load>
                <Oval color="#333333" secondaryColor='#6D6D6D' height={36} width={36} />
                <NoPosts>Loading more posts...</NoPosts>
              </Load>
            }
            loadMore={() => fetchMoreData(page)}
            hasMore={hasMore}
          >
            {renderPosts()}
          </InfiniteScroll>
        </Timeline>
        <Trending />
      </Main>
    </>
  )
}

const Main = styled.main`
position: relative;
display: flex;
justify-content: center;
width: 100vw;
`

const Timeline = styled.div`
width: 611px;
@media (max-width: 375px) {
  position: relative;
  width: 100%;
}
`

const TimelineTitle = styled.h1`
margin-top: 91px;
margin-left: 17px;
margin-bottom: 19px;
font-family: Oswald;
font-weight: 700;
font-size: 33px;
line-height: 49px;
color: #FFFFFF;
`

const NewPostsNotification = styled.button`
display: flex;
justify-content: center;
align-items: center;
background: #1877F2;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 16px;
border: none;
width: 100%;
height: 61px;
margin-bottom: 17px;

font-family: 'Lato';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 19px;

color: #FFFFFF;
svg {
  margin-left: 14px;
  width: 22px;
  height: 22px;
}
`

const Load = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin-top: 52px;
`

const NoPosts = styled.h1`
margin-top: 16px;
text-align: center;
font-family: Lato;
font-style: normal;
font-weight: 400;
font-size: 22px;
line-height: 26px;
color: #6D6D6D;
`

export default Home;