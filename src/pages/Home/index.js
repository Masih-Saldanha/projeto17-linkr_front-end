import { useContext } from 'react';
import styled from 'styled-components';

import PublishPost from '../../components/PublishPost';
import PostContext from '../../contexts/postContext';
import Header from './../../components/Header';
import disliked from './../../assets/heart-outline.png'
import liked from './../../assets/heart.png';

function Home() {
  const { postList, loadingPosts } = useContext(PostContext);

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
          return (
            <Post key={index}>
              <PostLeftSide>
                <UserPicture src={post.userPicture} />
                <LikeButton src={disliked} />
                <p>{post.likes} likes</p>
              </PostLeftSide>
              <PostRightSide>
                <h1>{post.username}</h1>
                <h2>{post.description}</h2>
                <href>{post.link}</href>
              </PostRightSide>
            </Post>
          )
        })
      )
    }
  }

  return (
    <>
      <Header />
      <TimelineTitle>timeline</TimelineTitle>
      <PublishPost></PublishPost>
      {renderPosts()}
    </>
  )
}

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
width: 100%;
background-color: #171717;
padding: 15px;
margin-bottom: 16px;
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
`

const PostRightSide = styled.section`
display: flex;
flex-direction: column;
padding-right: 15px;
h1 {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 20px;
  color: #FFFFFF;
}
h2 {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: #B7B7B7;
}
`

const UserPicture = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
margin-bottom: 17px;
`

const LikeButton = styled.img`
width: 17px;
height: 15px;
margin-bottom: 12px;
`

export default Home;