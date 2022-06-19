import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { AuthContext } from "../../contexts/AuthContext";
import Hashtag from "./../Hashtag";


function Trending() {
  const [hashtags, setHashtags] = useState([""]);
  const { token } = useContext(AuthContext);

  //TODO: persistir token
  // const token =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJNYXNpaCIsImlhdCI6MTY1NTQ5MDM5NX0.XeWyPACGH3ygylWVkJA-pdIcepRSjk7qISI7a_oqiXo";

  useEffect(() => {
    const URL = "https://projeto17-linkr.herokuapp.com/hashtag/trending";
    const CONFIG = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const promise = axios.get(URL, CONFIG);

    promise.then((promise) => setHashtags([...promise.data]));
    promise.catch((err) => console.log(err));
  }, []);

  return (
    <Section>
      <Title>trending</Title>
      {hashtags?.map((tag, index) => (
        <Hashtag key={index} hashtag={tag} />
      ))}
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
  top: 210px;

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
