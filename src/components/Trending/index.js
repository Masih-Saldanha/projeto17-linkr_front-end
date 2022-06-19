import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { AuthContext } from "../../contexts/AuthContext";
import Hashtag from "./../Hashtag";


function Trending() {
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
    <Section>
      <Title>trending</Title>
      {console.log(hashtags)}
      {hashtags?.map((tag, index) => {
        return(
            <Hashtag key={index} hashtag={tag.hashtag} />
        )
      }
      )}
    </Section>
  );
}

const Section = styled.section`
  min-width: 300px;
  height: 100%;
  color: #fff;
  margin-left: 25px;
  background-color: #171717;
  border-radius: 16px;
  position: sticky;
  top: 160px;

  @media (max-width: 611px) {
    display: none;
  }
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

export default Trending;
