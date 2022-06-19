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
import Trending from "../../components/Trending";

const URL_API = `https://projeto17-linkr.herokuapp.com`;

function Home() {

  const navigate = useNavigate();
  const { postList, setPostList, getPosts, loadingPosts } = useContext(PostContext);
  const { token } = useContext(AuthContext);

  async function insertLike(postId) {
    //TODO: Não terminei a função
    await axios.post(`${URL_API}/like/${postId}`)
    .then(response => {
        console.log('Curitada dada');
    }).catch(err => {
        console.log('Erro', err);
    })
  }

  async function deleteLike(postId) {
    //TODO: Não terminei a função
    await axios.delete(`${URL_API}/like/${postId}`)
    .then(response => {
        console.log('Curitada dada');
    }).catch(err => {
        console.log('Erro', err);
    })
  }

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
                {post.link.likedByUser === false ? <IoHeartOutline onClick={() => insertLike(post.postId)} className='not-liked'/>
                : <IoHeart onClick={() => deleteLike(post.postId)} className='liked' />}
                <p>{post.likes} likes</p>
              </PostLeftSide>
              <PostRightSide>
                <EditIcon><IoMdCreate /></EditIcon>
                <DeleteIcon><IoMdTrash /></DeleteIcon>
                <h1 onClick={() => navigate(`/user/${post.userId}`)}>{post.username}</h1>
                <h2 dangerouslySetInnerHTML={{ __html: getHashtags(post.description) }}></h2>
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
  }

  function getHashtags(description) {

    if ( description === null || description === undefined ) return '';
    
    let palavra = "";
    let aux = 0;
    const hashtagPositions = [];

    for (let i = 0; i < description.length; i++) {
      palavra = '';
      for (let j = i + 1; j < description.length; j++) {
        if (description[i]==='#' && description[j]!=='#' && description[j]!==' ') {
          palavra += description[j];
        } else {
          break;
        }
        aux = j;
      }
      if (palavra !== '') {
        hashtagPositions.push(i);
      }
      i === aux;
    }

    let frase = description;

    let frase_final = '';

    for (let i = 0; i < hashtagPositions.length; i++) {

      if (i === 0) {
 
        if (description.substring(0, hashtagPositions[i])[0] === "#") {
          frase_final += createLink(description.substring(0, hashtagPositions[i]) )
        } else {
          frase_final += description.substring(0, hashtagPositions[i])
        }

        if ( description.substring(hashtagPositions[i], hashtagPositions[i + 1])[0] === "#" ) {
          frase_final += createLink ( description.substring(hashtagPositions[i], hashtagPositions[i + 1]) )
        } else {
          frase_final += description.substring( hashtagPositions[i], hashtagPositions[i + 1] );
        }

      } else if (i === hashtagPositions.length - 1) {
        frase_final +=  createLink( description.substring(hashtagPositions[i], hashtagPositions[i + 1]) )

      } else {
        if ( description.substring(hashtagPositions[i], hashtagPositions[i + 1])[0] === "#" ) {
          frase_final += createLink( description.substring(hashtagPositions[i], hashtagPositions[i + 1]) )
        } else {
          frase_final += description.substring( hashtagPositions[i],  hashtagPositions[i + 1] )
        }

        if ( frase.substring( hashtagPositions[i + 1], hashtagPositions[i + 2]  )[0] === "#"  ) {
          frase_final += createLink( frase.substring(hashtagPositions[i + 1], hashtagPositions[i + 2]) )
        } else {
          frase_final += frase.substring( hashtagPositions[i + 1], hashtagPositions[i + 2] );
        }

        i++;
      }
    }
    return frase_final;
  }

  function createLink(hash){
    let hashtag = hash.replace('#','').trim();
    console.log(hashtag);
    return  '<a href="/hashtag/'+hashtag+'"> <strong>' + hash +'</strong> </a>'
  }

  return (
    <>
      <Header />
      <Main>
        {/* FIXME: AQUI ENTRAR A SIDE COM HASHTAGS */}
        <Timeline>
          <TimelineTitle
            onClick={() => {
              // AQUI É PARA TESTES FÁCEIS:

              getPosts(token);
              // setPostList([
              //   {
              //     userPicture: "https://wallpapers.com/images/high/ashen-one-from-dark-souls-3-oja56fn40ay19u8u.jpg",
              //     likes: 3,
              //     username: "Masih",
              //     description: "Testando localmente",
              //     link: {
              //       linkUrl: "http://www.pudim.com.br",
              //       linkTitle: "Pudim",
              //       linkDescription: "",
              //       linkImage: ""
              //     }
              //   },
              //   {
              //     userPicture: "https://wallpapers.com/images/high/ashen-one-from-dark-souls-3-oja56fn40ay19u8u.jpg",
              //     likes: 3,
              //     username: "Masih",
              //     description: "Testando localmente",
              //     link: {
              //       linkUrl: "http://facebook.com.br",
              //       linkTitle: "Facebook &#x2013; entre ou cadastre-se",
              //       linkDescription: "Entre no Facebook para começar a compartilhar e se conectar com seus amigos, familiares e com as pessoas que você conhece.",
              //       linkImage: "https://www.facebook.com/images/fb_icon_325x325.png"
              //     }
              //   },
              //   {
              //     userPicture: "https://wallpapers.com/images/high/ashen-one-from-dark-souls-3-oja56fn40ay19u8u.jpg",
              //     likes: 3,
              //     username: "Masih",
              //     description: "Testando localmente",
              //     link: {
              //       linkUrl: "http://www.google.com.br",
              //       linkTitle: "Google",
              //       linkImage: "/images/branding/googleg/1x/googleg_standard_color_128dp.png"
              //     }
              //   }
              // ])
              // console.log(postList);
            }}
          >timeline</TimelineTitle>
          <PublishPost></PublishPost>
          {renderPosts()}
        </Timeline>
        <Trending/>
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

strong{
  color: #B7B7B7;
}

a {
  color: #B7B7B7;
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