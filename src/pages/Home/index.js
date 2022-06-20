import { useContext, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoMdCreate, IoMdTrash } from 'react-icons/io';
import axios from 'axios';

import PublishPost from '../../components/PublishPost';
import PostContext from '../../contexts/postContext';
import Header from './../../components/Header';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { AuthContext } from '../../contexts/AuthContext';
import PostComponent from './PostComponent';
import Trending from '../../components/Trending';

const URL_API = `https://projeto17-linkr.herokuapp.com`;

function Home() {
  const [toggle, setToggle] = useState(false);

  const navigate = useNavigate();
  const { postList, setPostList, getPosts, loadingPosts } = useContext(PostContext);
  const { token } = useContext(AuthContext);

  function renderPosts() {
    if (loadingPosts) {
      return (
        <NoPosts>Loading Posts</NoPosts>
      )
    } else if (postList.length === 0) {
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
      // return (
      //   postList.map((post, index) => {
      //     return (
      //       <Post key={index}>
      //         <PostLeftSide>
      //           <UserPicture src={post.userPicture} />
      //           {post.link.likedByUser === false ? <IoHeartOutline onClick={() => insertLike(post.postId)} className='not-liked'/>
      //           : <IoHeart onClick={() => deleteLike(post.postId)} className='liked' />}
      //           <p>{post.likes} likes</p>
      //         </PostLeftSide>
      //         <PostRightSide>
      //           <EditIcon><IoMdCreate /></EditIcon>
      //           <DeleteIcon><IoMdTrash /></DeleteIcon>
      //           <h1 onClick={() => navigate(`/user/${post.userId}`)}>{post.username}</h1>
      //           <h2>{post.description}</h2>
      //           <a href={post.link.linkUrl} target="_blank" rel="noopener noreferrer">
      //             <Link>
      //               <div>
      //                 <h3>{post.link.linkTitle}</h3>
      //                 <h4>{post.link.linkDescription}</h4>
      //                 <h5>{post.link.linkUrl}</h5>
      //               </div>
      //               <img src={`${post.link.linkImage}`} />
      //             </Link>
      //           </a>
      //         </PostRightSide>
      //       </Post>
      //     )
      //   })
      // )
    }
  }

  return (
    <>
      <Header toggle={toggle} setToggle={setToggle} />
      <Main>
        {/* FIXME: AQUI ENTRAR A SIDE COM HASHTAGS */}
        <Timeline>
          <TimelineTitle
            onClick={() => {
              // AQUI É PARA TESTES FÁCEIS:
              getPosts(token);
            }}
          >timeline</TimelineTitle>
          <PublishPost></PublishPost>
          {renderPosts()}
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

const NoPosts = styled.h1`
text-align: center;
font-family: Oswald;
font-weight: 700;
font-size: 33px;
line-height: 49px;
color: #FFFFFF;
`

const Post = styled.article`
display: flex;
justify-content: space-between;
width: 100%;
background-color: #171717;
padding: 15px;
margin-bottom: 16px;
border-radius: 16px;
@media (max-width: 375px) {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #171717;
  padding: 15px;
  margin-bottom: 16px;
  border-radius: 0;
}
`

const PostLeftSide = styled.section`
display: flex;
flex-direction: column;
align-items: center;
margin-right: 15px;
p {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
  line-height: 11px;
  color: #FFFFFF;
}

svg {
    font-size: 17px;
    margin-bottom: 12px;

    &:hover {
        cursor: pointer;
    }
}

.liked {
    color: #AC0000;
}

.not-liked{
    color: white;
}
`

const PostRightSide = styled.section`
position: relative;
width: 100%;
display: flex;
flex-direction: column;
h1 {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 20px;
  color: #FFFFFF;
  margin-bottom: 7px;
}
h2 {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: #B7B7B7;
  margin-bottom: 13px;
}
`

const EditIcon = styled.div`
position: absolute;
right: 25px;
color: #FFFFFF;
`

const DeleteIcon = styled.div`
position: absolute;
right: 0;
color: #FFFFFF;
`

const Link = styled.div`
width: 100%;
border: 1px solid #4D4D4D;
border-radius: 11px;
display: flex;
justify-content: space-between;
div {
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  h3 {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #CECECE;
  }
  h4 {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
  line-height: 11px;
  color: #9B9595;
  margin-top: 4px;
  margin-bottom: 4px;
  }
  h5 {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
  line-height: 11px;
  color: #CECECE;
  }
}
img {
  width: 153px;
  height: 115px;
  border-radius: 0px 12px 12px 0px;
}
@media (max-width: 375px) {
  width: 100%;
  border: 1px solid #4D4D4D;
  border-radius: 11px;
  display: flex;
  justify-content: space-between;
  div {
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    h3 {
    font-family: Lato;
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    color: #CECECE;
    }
    h4 {
    font-family: Lato;
    font-style: normal;
    font-weight: 400;
    font-size: 9px;
    line-height: 11px;
    color: #9B9595;
    margin-top: 4px;
    margin-bottom: 4px;
    }
    h5 {
    font-family: Lato;
    font-style: normal;
    font-weight: 400;
    font-size: 9px;
    line-height: 11px;
    color: #CECECE;
    }
  }
  img {
    width: 95px;
    height: 115px;
    border-radius: 0px 12px 12px 0px;
  }
}
`

const UserPicture = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
margin-bottom: 17px;
`

export default Home;