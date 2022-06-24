import styled from 'styled-components';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import jwtDecode from 'jwt-decode';

import { IoMdCreate, IoMdTrash } from 'react-icons/io';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { BiRepost } from 'react-icons/bi';
import { FiSend } from 'react-icons/fi';
import { AiOutlineComment } from 'react-icons/ai';
import { AuthContext } from '../../contexts/AuthContext';

const URL_API = `https://projeto17-linkr.herokuapp.com`;
// const URL_API = `http://localhost:4000`;

export default function PostComponent(props) {
  const { post, index, userInfos } = props;

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const decoded = jwtDecode(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const inputRef = useRef();
  Modal.setAppElement("#root");

  // States:

  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [enableEdit, setEnableEdit] = useState(true);
  const [originalDescription, setOriginalDescription] = useState(post.description);
  const [newDescription, setNewDescription] = useState(post.description);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isOpenRepost, setIsOpenRepost] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post.reposts);
  const [reposting, setReposting] = useState(false);

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [text, setText] = useState(null);

  const [inputComment, setInputComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [userPicture, setUserPicture] = useState('');
  const [qtyPosts, setQtyPosts] = useState(0);


  let countNotState = '';

  function getHashtags(description) {

    if (description === null || description === undefined) return '';

    let palavra = "";
    let aux = 0;
    const hashtagPositions = [];

    for (let i = 0; i < description.length; i++) {
      palavra = '';
      for (let j = i + 1; j < description.length; j++) {
        if (description[i] === '#' && description[j] !== '#' && description[j] !== ' ') {
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
          frase_final += createLink(description.substring(0, hashtagPositions[i]))
        } else {
          frase_final += description.substring(0, hashtagPositions[i])
        }

        if (description.substring(hashtagPositions[i], hashtagPositions[i + 1])[0] === "#") {
          frase_final += createLink(description.substring(hashtagPositions[i], hashtagPositions[i + 1]))
        } else {
          frase_final += description.substring(hashtagPositions[i], hashtagPositions[i + 1]);
        }

      } else if (i === hashtagPositions.length - 1) {
        frase_final += createLink(description.substring(hashtagPositions[i], hashtagPositions[i + 1]))

      } else {
        if (description.substring(hashtagPositions[i], hashtagPositions[i + 1])[0] === "#") {
          frase_final += createLink(description.substring(hashtagPositions[i], hashtagPositions[i + 1]))
        } else {
          frase_final += description.substring(hashtagPositions[i], hashtagPositions[i + 1])
        }

        if (frase.substring(hashtagPositions[i + 1], hashtagPositions[i + 2])[0] === "#") {
          frase_final += createLink(frase.substring(hashtagPositions[i + 1], hashtagPositions[i + 2]))
        } else {
          frase_final += frase.substring(hashtagPositions[i + 1], hashtagPositions[i + 2]);
        }

        i++;
      }
    }
    return frase_final;
  }

  function createLink(hash) {
    let hashtag = hash.replace('#', '').trim();
    return '<a href="/hashtag/' + hashtag + '"> <strong>' + hash + '</strong> </a>'
  }

  function countLikes(likes, countNotState) {
    if (countNotState == '') return likes;
    if (countNotState == 1) return (Number(likes) + 1);
    if (countNotState == -1) return (Number(likes) === 0 ? 0 : (Number(likes) - 1));
  }

  async function insertLike(postId) {
    await axios.post(`${URL_API}/like/${postId}`, {}, config)
      .then(response => {
        setCount(count + 1);
        setLiked(true);
      }).catch(err => {
        console.log('Erro', err);
      })
  }

  async function deleteLike(postId) {
    await axios.delete(`${URL_API}/like/${postId}`, config)
      .then(response => {
        setCount(count + 1);
        setLiked(false);
      }).catch(err => {
        console.log('Erro', err);
      })
  }

  async function getLikesOnHover(postId) {
    await axios.get(`${URL_API}/like/${postId}`, config)
      .then(async (response) => {
        const { likes, userLiked } = response.data;
        const arrOfLikes = likes.map(like => like.username);
        setText(hoverControl(arrOfLikes, userLiked));
      }).catch(err => {
        console.log('Erro', err);
      })
  }

  function defineParametersForLikeButton(likedByUser, postId) {

    if (likedByUser && count === 0) return <IoHeart onClick={() => deleteLike(postId)} className='liked' />;
    if (!likedByUser && count === 0) return <IoHeartOutline onClick={() => insertLike(postId)} className='not-liked' />;

    if (count > 0) {
      if (liked) {
        countNotState = 1;
        return <IoHeart onClick={() => deleteLike(postId)} className='liked' />;
      }
      else {
        countNotState = -1;
        return <IoHeartOutline onClick={() => insertLike(postId)} className='not-liked' />;
      }
    }
  };

  function hoverControl(arr, bool) {
    const users = arr.length;

    if (users === 0) return 'Seja o primeiro a dar like!';

    if (users === 1) {
      if (bool) {
        return 'Você gostou disso';
      } else {
        return `${arr.join(' ')} gostou disso`;
      }
    }

    if (users <= 3) {
      if (bool) {
        return `Você, ${arr.join(', ')} gostaram disso`;
      } else {
        return `${arr.join(', ')} gostaram disso`;
      }
    }

    if (users > 3) {
      if (bool) {
        return `Você, ${arr.splice(0, 1).join(', ')} e mais ${users - 2} pessoas gostaram disso`;
      } else {
        return `${arr.splice(0, 2).join(', ')} e mais ${users - 2} pessoas gostaram disso`;
      }
    }
  }

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function toggleModalRepost() {
    setIsOpenRepost(!isOpenRepost);
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();

      const keyDownHandler = event => {

        if (event.key === 'Escape') {
          event.preventDefault();

          escPressed();
        }
      };

      document.addEventListener('keydown', keyDownHandler);

      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    };
  }, [editing])

  const escPressed = () => {
    setEditing(false);
    setNewDescription(originalDescription);
  };

  function editPost(postId) {

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
    const promise = axios.put(`${URL_API}/posts/${post.postId}`, metaNewDescription, config);
    promise.then(response => {
      setOriginalDescription(metaNewDescription.description);
      setEditing(false);
      setEnableEdit(true);
    });
    promise.catch(error => {
      console.log(error.response.data);
      alert("Não foi possível alterar o comentário");
      setEnableEdit(true);
    });
  }

  function sendDeletePost() {
    setDeleting(true);
    const promise = axios.delete(`${URL_API}/posts/${post.postId}`, config);
    promise.then(response => {
      setDeleting(false);
      toggleModal();
      setDeleted(true);
    });
    promise.catch(error => {
      setDeleting(false);
      toggleModal();
      alert("Não foi possível excluir o post");
    });
  }

  function handleCommentClick() {

    const URL = `${URL_API}/comment`;
    const CONFIG = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const BODY = {
      userId: decoded.id,
      postId: post.postId,
      comment: inputComment
    };
    const promise = axios.post(URL, BODY, CONFIG);
    promise.then((promise) => {
      setShowComment(false);
      setInputComment('');
      getQtdPosts();
    });
    promise.catch((err) => console.log(err.response));
  }

  function toggleShowComment() {
    setShowComment(!showComment);
  }

  function getQtdPosts(){
    const URL = `${URL_API}/comment/qty/${post.postId}`;
    const CONFIG = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const promise = axios.get(URL, config);
    promise.then(response => {
      console.log(response.data);
      setQtyPosts(response.data.quantity)
    });
    promise.catch(err => console.log(err.response));
  }

  function getPicture(){
    const CONFIG = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const URL = `${URL_API}/picture/user`;
    const promise = axios.get(URL, config);
    promise.then(response => setUserPicture(response.data.pictureUrl));
    promise.catch(err => console.log(err.response));
  }

  useEffect(() => {
    getPicture();
  },[showComment]);

  function sendRepost() {
    setReposting(true);
    const promise = axios.post(`${URL_API}/reposts`, { postId: post.postId }, config);
    promise.then(response => {
      setReposting(false);
      toggleModalRepost();
      setRepostsCount(repostsCount + 1);
    });
    promise.catch(error => {
      setReposting(false);
      toggleModalRepost();
      alert("Não foi repostar o post");
    });
  }

  return (

    deleted ?
      <></>
      :
      <ColorComment>
        <Post key={index}>
          <PostLeftSide>
            <UserPicture src={userInfos ? userInfos.pictureUrl : post.pictureUrl} />
            {defineParametersForLikeButton(post.link.likedByUser, post.postId)}
            <p data-tip="" data-for={`${post.postId}`} onMouseOver={() => getLikesOnHover(post.postId)}>{countLikes(post.likes, countNotState)} likes</p>
            {text ?
              <ReactTooltip id={`${post.postId}`} place="bottom">
                {text}
              </ReactTooltip> :
              <></>}
            <IconRightComment>
              <AiOutlineComment onClick={toggleShowComment} />
              <p>{qtyPosts} comments</p>
            </IconRightComment>
            <IconRightComment>
              <BiRepost onClick={() => {
                toggleModalRepost();
              }} />
              <p onClick={toggleModalRepost}>{parseInt(repostsCount)} re-posts</p>
              <Modal
                isOpen={isOpenRepost}
                onRequestClose={toggleModalRepost}
                className="_"
                overlayClassName="_"
                contentElement={(props, children) => (
                  <ModalStyle {...props}>{children}</ModalStyle>
                )}
                overlayElement={(props, contentElement) => (
                  <OverlayStyle {...props}>{contentElement}</OverlayStyle>
                )}
              >
                {
                  !reposting ?
                    <>
                      <h1>Do you want do re-post this link?</h1>
                      <div>
                        <CancelDelete onClick={toggleModalRepost}>No, cancel</CancelDelete>
                        <ConfirmDelete onClick={sendRepost}>Yes, share!</ConfirmDelete>
                      </div>
                    </>
                    :
                    <h1>LOADING</h1>
                }
              </Modal>
            </IconRightComment>
          </PostLeftSide>
          <PostRightSide>
            {
              post.userId === decoded.id ?
                <>
                  <EditIcon onClick={() => editPost(post.postId)}><IoMdCreate /></EditIcon>
                  <DeleteIcon onClick={toggleModal}><IoMdTrash /></DeleteIcon>
                  <Modal
                    isOpen={isOpen}
                    onRequestClose={toggleModal}
                    className="_"
                    overlayClassName="_"
                    contentElement={(props, children) => (
                      <ModalStyle {...props}>{children}</ModalStyle>
                    )}
                    overlayElement={(props, contentElement) => (
                      <OverlayStyle {...props}>{contentElement}</OverlayStyle>
                    )}
                  >
                    {
                      !deleting ?
                        <>
                          <h1>Are you sure you want to delete this post?</h1>
                          <div>
                            <CancelDelete onClick={toggleModal}>No, go back</CancelDelete>
                            <ConfirmDelete onClick={sendDeletePost}>Yes, delete it</ConfirmDelete>
                          </div>
                        </>
                        :
                        <h1>LOADING</h1>
                    }
                  </Modal>
                </>
                :
                <></>
            }
            <h1 onClick={() => navigate(`/user/${post.userId}`)}>{userInfos ? userInfos.username : post.username}</h1>
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
        {showComment &&
          <Comment>
            <AvatarComment src={userPicture} alt='Avatar' />
            <InputComment placeholder='write a comment...' onChange={(e) => setInputComment(e.target.value)} />
            <IconComment onClick={handleCommentClick}><FiSend /></IconComment>
          </Comment>
        }
      </ColorComment>
  )
}

const ModalStyle = styled.div`
  /* min-height: 18rem; */
  /* margin: 2rem; */
  /* padding: 2.5rem; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #333333;
  border-radius: 50px;
  border: none;
  width: 597px;
  height: 262px;
  align-items: center;
  h1 {
    width: 370px;
    margin-top: 38px;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: 700;
    font-size: 34px;
    line-height: 41px;
    color: #FFFFFF;
  }
  div {
    margin-bottom: 66px;
    width: 295px;
    display: flex;
    justify-content: space-between;
    button {
      width: 134px;
      height: 37px;
      border-radius: 5px;
      border: none;
      
      font-family: Lato;
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 22px;
    }
  }
`;

const ConfirmDelete = styled.button`
background-color: #1877F2;
color: #FFFFFF;
`

const CancelDelete = styled.button`
background-color: #FFFFFF;
color: #1877F2;
`

const OverlayStyle = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3500;
  background: rgba(255, 255, 255, 0.9);
`;

const Post = styled.article`
display: flex;
justify-content: space-between;
width: 100%;
background-color: #171717;
padding: 15px;
margin-top: 16px;
border-radius: 16px;
@media (max-width: 375px) {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #171717;
  padding: 15px;
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

  &:hover {
    cursor: pointer;
  }
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

const ColorComment = styled.div`
  background-color: #1E1E1E;
  border-radius: 16px;
  border-radius: 16px;
`

const Comment = styled.div`
  width: 100%;
  height: 83px;
  background-color: #1E1E1E;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  //border-top: 1px solid #353535;
`

const InputComment = styled.input`
  background-color: #252525;
  color: #ACACAC;
  font-family: 'Lato';
  font-weight: 400;
  font-size: 14px;
  border: none;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  width: 100%;
  height: 39px;
  padding: 15px;
  
  ::placeholder {
    font-family: 'Lato';
    font-style: italic;
    font-size: 14px;
    color: #575757;
  }
`

const AvatarComment = styled.img`
  width: 39px;
  height: 39px;
  border-radius: 50%;
  margin-right: 14px;
`

const IconComment = styled.div`
  width: 39px;
  height: 39px;
  cursor: pointer;
  color: #F3F3F3;
  background-color: #252525;
  display: flex;
  justify-content: right;
  align-items: center;
  font-size: 15px;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  padding-right: 15px;
`

const IconRightComment = styled.div`
  cursor: pointer;
  color: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  margin-top: 18px;
  flex-direction: column;

  p {
    font-family: 'Lato';
    font-weight: 400;
    font-size: 11px;
    text-align: center;
    color: #FFFFFF;
  }
`