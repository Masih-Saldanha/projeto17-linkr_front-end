import styled from 'styled-components';
import axios from 'axios';
import {useState} from 'react';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';

export default function PostComponent(props) {

    const [liked, setLiked] = useState(false);
    const {post, index, userInfos} = props;
    console.log('Entrou no postComponent');

    function defineParametersForLikeButton(likedByUser, postId) {
        console.log('Entrou nos parametros');
        if (likedByUser) {
            return <IoHeart onClick={() => deleteLike(postId)} className='liked' />;
        } else {
            return <IoHeartOutline onClick={() => insertLike(postId)} className='not-liked'/>;
        }
    }

//TODO: preciso terminar a lógica de inserir o like no front depois de ter feito a requisição
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

    return (
        <Post key={index}>
            <PostLeftSide>
                <UserPicture src={userInfos.pictureUrl} />
                {post.link.likedByUser === false ? <IoHeartOutline onClick={() => insertLike(post.postId)} className='not-liked'/>
                : <IoHeart onClick={() => deleteLike(post.postId)} className='liked' />}
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
}

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

const UserPicture = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
margin-bottom: 17px;
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
