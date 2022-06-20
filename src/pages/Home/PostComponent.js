import styled from 'styled-components';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { IoMdCreate, IoMdTrash } from 'react-icons/io';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { AuthContext } from '../../contexts/AuthContext';

const URL_API = `https://projeto17-linkr.herokuapp.com`;
const URL_LOCAL = `http://localhost:4000`

export default function PostComponent(props) {
  const { token } = useContext(AuthContext);
  const decoded = jwtDecode(token);
  const config = {
    headers: {
      // FIXME: ADICIONAR TOKEN AQUI
      Authorization: `Bearer ${token}`
    }
  };
  // console.log(decoded.id);

  const navigate = useNavigate();

  const inputRef = useRef();



  // console.log(inputRef)

  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [enableEdit, setEnableEdit] = useState(true);

  useEffect(() => {
    // console.log(inputRef.current)
    if (inputRef.current) {
      inputRef.current.focus();

      const keyDownHandler = event => {
        // console.log('User pressed: ', event.key);
  
        if (event.key === 'Escape') {
          event.preventDefault();
  
          // 👇️ your logic here
          escPressed();
        }
      };
  
      document.addEventListener('keydown', keyDownHandler);
  
      // 👇️ clean up event listener
      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    };
  }, [editing])

  // 

  const escPressed = () => {
    setEditing(false);
    setNewDescription(originalDescription);
    // console.log('pressed Esc ✅');
  };

  const [liked, setLiked] = useState(false);
  const { post, index, userInfos } = props;
  const [originalDescription, setOriginalDescription] = useState(post.description);
  const [newDescription, setNewDescription] = useState(post.description);

  function defineParametersForLikeButton(likedByUser, postId) {
    if (likedByUser) {
      return <IoHeart onClick={() => deleteLike(postId)} className='liked' />;
    } else {
      return <IoHeartOutline onClick={() => insertLike(postId)} className='not-liked' />;
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

  function editPost(postId) {
    // console.log(`Edit post: ${postId}`);

    if (!editing) {
      setEditing(true);
    } else {
      setEditing(false);
      setNewDescription(originalDescription);
    }
  }

  function sendEditPost(e) {
    e.preventDefault();
    setEnableEdit(false);
    const metaNewDescription = { description: newDescription };
    // console.log(`${URL_API}/posts/${post.postId}`, metaNewDescription, config)
    const promise = axios.put(`${URL_API}/posts/${post.postId}`, metaNewDescription, config);
    promise.then(response => {
      console.log(response.data);
      setOriginalDescription(metaNewDescription.description);
      // setEdited(true);
      setEditing(false);
      setEnableEdit(true);
    });
    promise.catch(error => {
      console.log(error.response.data);
      alert("Não foi possível alterar o comentário");
      setEnableEdit(true);
    });
  }

  function deletePost(postId) {
    console.log(`Delete post: ${postId}`);
    let input = window.confirm("Deseja apagar esse post?");
    if (input) {
      // setDeleting(true);
      sendDeletePost(postId);
    }
  }

  function sendDeletePost(postId) {
    const promise = axios.delete(`${URL_API}/posts/${postId}`, config);
    promise.then(response => {
      console.log(response.data);
      // setDeleting(false);
      setDeleted(true);
    });
    promise.catch(error => {
      console.log(error.response.data);
      // setDeleting(false);
    });
  }

  return (

    deleted ?
      <></>
      :
      <Post key={index}>
        <PostLeftSide>
          <UserPicture src={userInfos.pictureUrl} />
          {post.link.likedByUser === false ? <IoHeartOutline onClick={() => insertLike(post.postId)} className='not-liked' />
            : <IoHeart onClick={() => deleteLike(post.postId)} className='liked' />}
          <p>{post.likes} likes</p>
        </PostLeftSide>
        <PostRightSide>
          {
            post.userId === decoded.id ?
              <>
                <EditIcon onClick={() => editPost(post.postId)}><IoMdCreate /></EditIcon>
                <DeleteIcon onClick={() => deletePost(post.postId)}><IoMdTrash /></DeleteIcon>
              </>
              :
              <></>
          }
          <h1 onClick={() => navigate(`/user/${post.userId}`)}>{userInfos.username}</h1>
          {
            editing === false ?
              <h2>{originalDescription}</h2>
              :
              enableEdit ?
                <form onSubmit={sendEditPost}>
                  <input
                    ref={inputRef}
                    type="textarea"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </form>
              :
                <form onSubmit={sendEditPost}>
                  <input
                    ref={inputRef}
                    type="textarea"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    disabled
                  />
                </form>
          }

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
input {
  height: 44px;
  border-radius: 7px;
  border: none;
  margin-bottom: 13px;
  width: 100%;

  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #4C4C4C;
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
