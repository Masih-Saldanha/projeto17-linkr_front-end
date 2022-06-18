import {useNavigate, useParams} from 'react-router-dom';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { IoHeartOutline } from 'react-icons/io5';

import Header from './../../components/Header';
import PublishPost from '../../components/PublishPost';

const URL_API = `https://projeto17-linkr.herokuapp.com`;

export default function UserPage() {

    const navigate = useNavigate();
    const {id} = useParams();
    const [userInfos, setUserInfos] = useState({});
    const [render, setRender] = useState(false);
    const [loading, setLoading] = useState(true);

    const config = {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    };

    useEffect(() => {
        const promise = axios.get(`${URL_API}/user/${id}`);
        promise.then(response => {
            setUserInfos(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.log(error.response);
            navigate('/');
        })
    }, [render]);

    async function renderPosts() {
        return (
            userInfos.posts.map((post, index) => {
                return (
                    <Post key={index}>
                        <PostLeftSide>
                            <UserPicture src={userInfos.pictureUrl} />
                            <IoHeartOutline />
                            <p>{post.likes} likes</p>
                        </PostLeftSide>
                        <PostRightSide>
                        <h1>{userInfos.username}</h1>
                            <h2>{post.description}</h2>
                            <a href={post.link.linkUrl} target="_blank" rel="noopener noreferrer">
                                <Link>
                                    <div>
                                        <h3>{post.link.linkTitle}</h3>
                                        <h4>{post.link.linkDescription}</h4>
                                        <h5>{post.link.linkUrl}</h5>
                                    </div>
                                    <img src={`${post.link.linkImage}`} />
                                </Link>
                            </a>
                        </PostRightSide>
                    </Post>
                )
            })
        )
    }

    return loading === true ? (
        <>
          <NoPosts>Posts are loading</NoPosts>
        </>
        )
    :
    (
    <>
      <Header />
      <HeadlineContainer>
        <img src={userInfos.pictureUrl} />
        <TimelineTitle>{userInfos.username}'s Posts</TimelineTitle>
      </HeadlineContainer>
      {1 === 2 ? <PublishPost></PublishPost> : <></>}
      {userInfos.posts.length > 0 ? renderPosts() : <NoPosts>There are no posts yet</NoPosts>}
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
margin-top: 30vh;
line-height: 49px;
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
`

const HeadlineContainer = styled.div`
display: flex;
justify-content: flex-start;
align-items: center;
position: relative;

img {
    width: 50px;
    margin-top: 91px;
    margin-left: 17px;
    margin-bottom: 19px;
    border-radius: 50%;
}
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
/* margin-bottom: 17px; */
`

const LikeButton = styled.img`
width: 17px;
height: 15px;
margin-bottom: 12px;
`