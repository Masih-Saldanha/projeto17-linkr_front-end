import {useNavigate, useParams} from 'react-router-dom';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import jwtDecode from 'jwt-decode';

import Header from './../../components/Header';
import { AuthContext } from '../../contexts/AuthContext';
import Trending from '../../components/Trending';
import PostComponent from './PostComponent';

const URL_API = `https://projeto17-linkr.herokuapp.com`;

export default function UserPage() {
    const [toggle, setToggle] = useState(false);
    const navigate = useNavigate(); 
    const {id} = useParams();
    const [userInfos, setUserInfos] = useState({});
    const [render, setRender] = useState(false);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);
    const [following, setFollowing] = useState(false);
    const decoded = jwtDecode(token);
    
     const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        const promise = axios.get(`${URL_API}/user/${id}`, config);
        promise.then(response => {
            setUserInfos(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            console.log('veio pro erro');
        })
    }, [render]);

    function renderPosts() {
        const {posts} = userInfos;
        return (
            posts.map((post, index) => {
                return (
                    <>
                        <PostComponent post={post} index={index} userInfos={userInfos} />
                    </>
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
      <Header toggle={toggle} setToggle={setToggle} />
      <Main>
        <Timeline>
            <HeadlineContainer>
                <img src={userInfos.pictureUrl} />
                <TimelineTitle>{userInfos.username}'s Posts</TimelineTitle>
                {id === decoded.id ? <></> : <ButtonFollow following={true}>{1 == 2 ? 'Unfollow' : 'Follow'}</ButtonFollow> }
            </HeadlineContainer>
            {userInfos.posts.length > 0 ? renderPosts() : <NoPosts>There are no posts yet</NoPosts>}
        </Timeline>
        <Trending isUserPage={id === decoded.id ? true : false} isFollower={false} />
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

const HeadlineContainer = styled.div`
display: flex;
align-items: center;
justify-content: flex-start;

img{
    margin-top: 91px;
    margin-left: 17px;
    margin-bottom: 19px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
}
`

const ButtonFollow = styled.button`
background-color: ${props => props.following === true ? 'white' : '#1877F2'};
padding: 10px;
border-radius: 5px;
width: 80px;
border: none;
margin-top: 80px;
margin-left: 30px;
font-family: Lato;
font-weight: 700;
font-size: 100%;
color: ${props => props.following === true ? '#1877F2' : 'white'};

&:hover {
    cursor: pointer;
}

@media (min-width: 750px) {
    display: none;
}
`
