import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";


import Header from "../../components/Header";
import Trending from "../../components/Trending";

function PostsByHashTag() {
  const { hashtag } = useParams();

  const [posts, setPosts] = useState([]);

  const [hashtags, setHashtags] = useState([]);
  const [hashtagPositions, setHashtagPositions] = useState([]);
  const [text, setText] = useState("");
  const [finalSentence, setFinalSentence] = useState("");

  //TODO: persistir token
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJNYXNpaCIsImlhdCI6MTY1NTQ5MDM5NX0.XeWyPACGH3ygylWVkJA-pdIcepRSjk7qISI7a_oqiXo";

  const teste = "abc #de#fg #hi eg#hkj #sdf#dsfg sdf abcf";

  function getHashtags(description) {
    let palavra = "";
    let aux = 0;
    const hashtagsRender = [];
    hashtagsRender.push(hashtags);
    hashtagsRender.shift();

    const positionsRender = [];
    positionsRender.push(hashtagPositions);
    positionsRender.shift();

    for (let i = 0; i < description.length; i++) {
      palavra = "";
      for (let j = i + 1; j < description.length; j++) {
        if (
          description[i] === "#" &&
          description[j] !== "#" &&
          description[j] !== " "
        ) {
          palavra += description[j];
        } else {
          break;
        }
        aux = j;
      }
      if (palavra !== "") {
        positionsRender.push(i);
        setHashtagPositions([...positionsRender]);
        hashtagsRender.push(palavra);
        setHashtags([...hashtagsRender]);
      }
      i === aux;
    }

    let frase = teste;

    let frase_final = '';

    for (let i = 0; i < hashtagPositions.length; i++) {

      if (i === 0) {
 
        if (frase.substring(0, hashtagPositions[i])[0] === "#") {
          frase_final += createLink(frase.substring(0, hashtagPositions[i]) )
        } else {
          frase_final += frase.substring(0, hashtagPositions[i])
        }

        if ( frase.substring(hashtagPositions[i], hashtagPositions[i + 1])[0] === "#" ) {
          frase_final += createLink ( frase.substring(hashtagPositions[i], hashtagPositions[i + 1]) )
        } else {
          frase_final += frase.substring( hashtagPositions[i], hashtagPositions[i + 1] );
        }

      } else if (i === hashtagPositions.length - 1) {
        frase_final +=  '<strong>'+ frase.substring(hashtagPositions[i], hashtagPositions[i + 1]) +'</strong> '
      } else {
        if ( frase.substring(hashtagPositions[i], hashtagPositions[i + 1])[0] === "#" ) {
          frase_final += '<strong>'+ frase.substring(hashtagPositions[i], hashtagPositions[i + 1]) +'</strong> '
        } else {
          frase_final += frase.substring( hashtagPositions[i],  hashtagPositions[i + 1] )
        }

        if ( frase.substring( hashtagPositions[i + 1], hashtagPositions[i + 2]  )[0] === "#"  ) {
          frase_final += '<strong>'+ frase.substring(hashtagPositions[i + 1], hashtagPositions[i + 2]) +'</strong>'
        } else {
          frase_final += frase.substring( hashtagPositions[i + 1], hashtagPositions[i + 2] );
        }

        i++;
      }

    }

    setFinalSentence(frase_final);
  }

  function createLink(hash){
    let hashtag = hash.replace('#','').trim();
    console.log(hashtag);
    return  '<a href="/hashtag/'+hashtag+'"> <strong>' + hash +'</strong> </Link>'
  }

  function createMarkup() { return { __html: finalSentence }} 
 
  useEffect(() => {
    getHashtags(teste);
  }, [finalSentence]); 

  useEffect(() => {
    const URL = `https://projeto17-linkr.herokuapp.com/hashtag/hashtag/${hashtag}`;
    const CONFIG = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const promise = axios.get(URL, CONFIG);

    promise.then((promise) => setPosts([...promise.data]));
    promise.catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Header />
      <Section>
        <Title># {hashtag}</Title>
        <Div>
          <Posts>
            <Post> abc #de#fg #hi eg#hkj #sdf#dsfg sdf abcfg</Post>
            <Post>
              <PostHashtag dangerouslySetInnerHTML={createMarkup()}></PostHashtag>
            </Post>
          </Posts>
          <SideBar>
            <Trending />
          </SideBar>
        </Div>
      </Section>
    </>
  );

  /*return(
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
  );*/
}

const Section = styled.section`
  width: 940px;
  height: 100%;
  margin: 0 auto;
  margin-top: 125px;

  @media (max-width: 620px) {
    width: 100%;
  }
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 620px) {
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

  color: #fff;

  @media (max-width: 620px) {
    width: 100%;
  }
`;

const PostHashtag = styled.div`
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 20px;
  color: #b7b7b7;

  strong{
    color: red;
  }

  @media (max-width: 620px) {
    font-size: 15px;
    line-height: 18px;
  }

`;

const SideBar = styled.div`
  @media (max-width: 620px) {
    display: none;
  }
`;

const Title = styled.h1`
  font-family: "Oswald", sans-serif;
  font-weight: 700;
  font-size: 43px;
  color: #fff;
  margin-bottom: 41px;
  cursor: pointer;
`;

const NotFound = styled.span`
  font-family: "Oswald", sans-serif;
  font-weight: 700;
  font-size: 25px;
  color: #fff;
`;

export default PostsByHashTag;
