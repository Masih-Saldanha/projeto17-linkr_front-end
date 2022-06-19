import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Header from '../../components/Header'
import Trending from '../../components/Trending'

function PostsByHashTag(){

  const { hashtag } = useParams();

  const [posts, setPosts] = useState ([]);

   //TODO: persistir token
   const token = '';

  useEffect(() => {
    const URL = `https://projeto17-linkr.herokuapp.com/hashtag/hashtag/${hashtag}`;
    const CONFIG = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const promise = axios.get(URL,CONFIG);

    promise.then((promise) => setPosts([...promise.data]));
    promise.catch((err)=> console.log(err));

  },[]);

  return(
    <>
      <Header />
      <Section>            
        <Title># {hashtag}</Title>
        <Div>
          <Posts>
            { posts.length === 0 ? 
              <NotFound>Não existem posts com #{hashtag}</NotFound> :
              posts?.map( (post,index) => <Post key={index} post={post} /> )
            } 
          </Posts>
          <SideBar><Trending /></SideBar>
        </Div>
      </Section>
    </>
  );
}

const Section = styled.section`
  width: 940px;
  height: 100%;
  margin: 0 auto;
  margin-top: 125px;

  @media (max-width: 620px)  {
    width: 100%;
  }
  
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 620px)  {
    justify-content: center;
  }
`;

const Posts = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Post = styled.div`
  width: 611px;
  height: 276px;
  background-color: #000;
  margin-bottom: 16px;

  @media (max-width: 620px)  {
    width: 100%;
  }

`;

const SideBar = styled.div`

  @media (max-width: 620px)  {
    display: none;
  }
`;

const Title = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 43px;
  color: #fff;
  margin-bottom: 41px;
  cursor: pointer;
`;

const NotFound = styled.span`
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 25px;
  color: #fff;
  
`;

export default PostsByHashTag;