import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {useState, useContext} from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import ReactTooltip from 'react-tooltip';

// const URL_API = `https://projeto17-linkr.herokuapp.com`;
const URL_API = `http://localhost:4000`;

export default function PostComponent(props) {

    const { token } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(0);
    const [likesHover, setLikesHover] = useState([]);
    const [userLikedState, setUserLikedState] = useState(null);
    const {post, index, userInfos} = props;
    const [text, setText] = useState(null);
    const navigate = useNavigate();

    let countNotState = '';

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    function defineParametersForLikeButton(likedByUser, postId) {

        if (likedByUser && count === 0) return <IoHeart onClick={() => deleteLike(postId)} className='liked' />;
        if (!likedByUser && count === 0) return <IoHeartOutline onClick={() => insertLike(postId)} className='not-liked'/>;

        if (count > 0) {
            if (liked) {
                countNotState = 1;
                return <IoHeart onClick={() => deleteLike(postId)} className='liked' />;
            }
            else {
                countNotState = -1;
                return <IoHeartOutline onClick={() => insertLike(postId)} className='not-liked'/>;
            }
        }
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
            const {likes, userLiked} = response.data;
            const arrOfLikes = likes.map(like => like.username);
            // await setLikesHover([...arrOfLikes]);
            // await setUserLikedState(userLiked ? true : false);
            // setText(hoverControl(likesHover, userLiked));
            setText(hoverControl(arrOfLikes, userLiked));
        }).catch(err => {
            console.log('Erro', err);
        })
    }

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

    return (
        <Post key={index}>
            <PostLeftSide>
                <UserPicture src={userInfos.pictureUrl} />
                {defineParametersForLikeButton(post.link.likedByUser, post.postId)}  
                <p data-tip="" data-for={`${post.postId}`} onMouseOver={() => getLikesOnHover(post.postId)}>{countLikes(post.likes, countNotState)} likes</p>
                {text ? 
                <ReactTooltip id={`${post.postId}`} place="bottom">
                    {text}
                </ReactTooltip> :
                <></>}
            </PostLeftSide>
            <PostRightSide>
            <h1 onClick={() => navigate(`/user/${post.userId}`)}>{userInfos.username}</h1>
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
