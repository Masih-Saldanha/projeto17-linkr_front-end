import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { AuthContext } from "../../contexts/AuthContext";
import Hashtag from "./../Hashtag";


function Trending({isUserPage, isFollower}) {
  const [hashtags, setHashtags] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const URL = "https://projeto17-linkr.herokuapp.com/hashtag/trending";
    const CONFIG = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const promise = axios.get(URL, CONFIG);

    promise.then((promise) => {
      setHashtags([...promise.data]);
    });
    promise.catch((err) => console.log(err));
  }, []);

  return (
    <Container>
        {isUserPage === true ? <ButtonFollow >{isFollower === true ? 'Unfollow' : 'Follow'}</ButtonFollow> : <></>}
        <Section>
            <Title>trending</Title>
            {hashtags?.map((tag, index) => {
                return (
                    <Hashtag key={index} hashtag={tag.hashtag} />
                )
            }
            )}
        </Section>
    </Container>
  );
}

const Section = styled.section`
  min-width: 300px;
  height: auto;
  color: #fff;
  margin-left: 25px;
  background-color: #171717;
  border-radius: 16px;
`;

const Title = styled.div`
  font-family: "Oswald", sans-serif;
  font-weight: 700;
  font-size: 27px;
  background-color: #171717;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom: solid 1px #484848;
  padding: 16px;
`;

const ButtonFollow = styled.button`
background-color: ${1 === 2 ? '' : '#1877F2'};
padding: 10px;
border-radius: 5px;
width: 112px;
border: none;
margin-bottom: 60px;
margin-left: 200px;
font-family: Lato;
font-weight: 700;
font-size: 100%;
color: white; 

&:hover {
    cursor: pointer;
}
`;

const Container = styled.div`
display: flex;
flex-direction: column;
position: sticky;
align-self: flex-start;
top: 180px;
right: 0;

@media (max-width: 750px) {
    display: none;
}
`

export default Trending;
