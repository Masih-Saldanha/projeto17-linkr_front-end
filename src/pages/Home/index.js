import { useContext } from 'react';
import styled from 'styled-components';

import PublishPost from '../../components/PublishPost';
import PostContext from '../../contexts/postContext';
import Header from './../../components/Header';
import disliked from './../../assets/heart-outline.png'
import liked from './../../assets/heart.png';

function Home() {
  const { postList, setPostList, getPosts, loadingPosts } = useContext(PostContext);

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

  return (
    <>
      <Header />
      <Main>
        <Timeline>
          <TimelineTitle
            onClick={() => {
              // AQUI É PARA TESTES FÁCEIS:

              getPosts();
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
position: relative;
width: 100%;
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