import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoMdCreate, IoMdTrash } from 'react-icons/io';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { Oval } from "react-loader-spinner";
import useInterval from 'use-interval';

import PublishPost from '../../components/PublishPost';
import PostContext from '../../contexts/postContext';
import Header from './../../components/Header';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { BiRefresh } from 'react-icons/bi';
import { AuthContext } from '../../contexts/AuthContext';
import PostComponent from './PostComponent';
import Trending from '../../components/Trending';

const URL_API = `https://projeto17-linkr.herokuapp.com`;

function Home() {
  const [toggle, setToggle] = useState(false);
  // const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();
  const { postList, setPostList, getPosts, loadingPosts, page, setPage } = useContext(PostContext);
  const { token } = useContext(AuthContext);

  useInterval(() => {
    const URL = `https://projeto17-linkr.herokuapp.com/posts/${page}`;
    // const URL = `http://localhost:4000/posts/0`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    console.log("entrou req 15 segundos");
    const promise = axios.get(URL, config);
    promise.then(response => {
      const { data } = response;
      if (data[0].postId !== postList[0].postId && postList.length !== 0) {
        setHasNewPosts(true);
        setCount(data[0].postId - postList[0].postId);
        console.log("count: ", count)
      }
      console.log("igual? ", data[0].postId === postList[0].postId)
      console.log("saiu req 15 segundos", hasNewPosts);
    });
    promise.catch(error => {
      const { response } = error;
      const { data } = response;
      alert("An error ocurred while trying to fetch the posts, please refresh the page");
    });
  }, (15 * 1000));

  function renderPosts() {
    if
      // (loadingPosts) {
      //   return (
      //     <NoPosts>Loading Posts</NoPosts>
      //   )
      // } else if 
      (postList.length === 0 && !hasMore) {
      return (
        <NoPosts>There are no posts yet</NoPosts>
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
    console.log("entrou")
    console.log(pageNumber);
    // console.log([...postList]);
    const promise = axios.get(URL, config);
    promise.then(response => {
      const { data } = response;
      if (data.length === 0) return setHasMore(false);
      setPostList([...postList, ...data]);
      setPage(pageNumber + 1);
      console.log("saiu")
      console.log(pageNumber);
      // console.log([...postList])
      // console.log([...data]);
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

// const Post = styled.article`
// display: flex;
// justify-content: space-between;
// width: 100%;
// background-color: #171717;
// padding: 15px;
// margin-bottom: 16px;
// border-radius: 16px;
// @media (max-width: 375px) {
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   background-color: #171717;
//   padding: 15px;
//   margin-bottom: 16px;
//   border-radius: 0;
// }
// `

// const PostLeftSide = styled.section`
// display: flex;
// flex-direction: column;
// align-items: center;
// margin-right: 15px;
// p {
//   font-family: Lato;
//   font-style: normal;
//   font-weight: 400;
//   font-size: 9px;
//   line-height: 11px;
//   color: #FFFFFF;
// }

// svg {
//     font-size: 17px;
//     margin-bottom: 12px;

//     &:hover {
//         cursor: pointer;
//     }
// }

// .liked {
//     color: #AC0000;
// }

// .not-liked{
//     color: white;
// }
// `

// const PostRightSide = styled.section`
// position: relative;
// width: 100%;
// display: flex;
// flex-direction: column;
// h1 {
//   font-family: Lato;
//   font-style: normal;
//   font-weight: 400;
//   font-size: 17px;
//   line-height: 20px;
//   color: #FFFFFF;
//   margin-bottom: 7px;
// }
// h2 {
//   font-family: Lato;
//   font-style: normal;
//   font-weight: 400;
//   font-size: 15px;
//   line-height: 18px;
//   color: #B7B7B7;
//   margin-bottom: 13px;
// }

// strong{
//   color: #B7B7B7;
// }

// a {
//   color: #B7B7B7;
// }
// `

// const EditIcon = styled.div`
// position: absolute;
// right: 25px;
// color: #FFFFFF;
// `

// const DeleteIcon = styled.div`
// position: absolute;
// right: 0;
// color: #FFFFFF;
// `

// const Link = styled.div`
// width: 100%;
// border: 1px solid #4D4D4D;
// border-radius: 11px;
// display: flex;
// justify-content: space-between;
// div {
//   padding: 8px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
//   h3 {
//   font-family: Lato;
//   font-style: normal;
//   font-weight: 400;
//   font-size: 11px;
//   line-height: 13px;
//   color: #CECECE;
//   }
//   h4 {
//   font-family: Lato;
//   font-style: normal;
//   font-weight: 400;
//   font-size: 9px;
//   line-height: 11px;
//   color: #9B9595;
//   margin-top: 4px;
//   margin-bottom: 4px;
//   }
//   h5 {
//   font-family: Lato;
//   font-style: normal;
//   font-weight: 400;
//   font-size: 9px;
//   line-height: 11px;
//   color: #CECECE;
//   }
// }
// img {
//   width: 153px;
//   height: 115px;
//   border-radius: 0px 12px 12px 0px;
// }
// @media (max-width: 375px) {
//   width: 100%;
//   border: 1px solid #4D4D4D;
//   border-radius: 11px;
//   display: flex;
//   justify-content: space-between;
//   div {
//     padding: 8px;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     h3 {
//     font-family: Lato;
//     font-style: normal;
//     font-weight: 400;
//     font-size: 11px;
//     line-height: 13px;
//     color: #CECECE;
//     }
//     h4 {
//     font-family: Lato;
//     font-style: normal;
//     font-weight: 400;
//     font-size: 9px;
//     line-height: 11px;
//     color: #9B9595;
//     margin-top: 4px;
//     margin-bottom: 4px;
//     }
//     h5 {
//     font-family: Lato;
//     font-style: normal;
//     font-weight: 400;
//     font-size: 9px;
//     line-height: 11px;
//     color: #CECECE;
//     }
//   }
//   img {
//     width: 95px;
//     height: 115px;
//     border-radius: 0px 12px 12px 0px;
//   }
// }
// `

// const UserPicture = styled.img`
// width: 40px;
// height: 40px;
// border-radius: 50%;
// margin-bottom: 17px;
// `

export default Home;