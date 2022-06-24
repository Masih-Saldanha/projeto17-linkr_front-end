import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { IoSearchOutline } from 'react-icons/io5';

import useAuth from "../../hooks/useAuth";
import { AuthContext } from "../../contexts/AuthContext";
import SearchBar from "../SearchBar";

const URL_API = `https://projeto17-linkr.herokuapp.com`;
// const URL_API = `http://localhost:4000`;
 
function Header(props) {
        const { signOut, image } = useAuth();
        const { toggle, setToggle } = props;
        const navigate = useNavigate();
        const [value, setValue] = useState('');
        const [usersSearch, setUsersSearch] = useState([]);
        const [userPicture, setUserPicture] = useState("");
        const { token } = useContext(AuthContext);

        const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
      
        useEffect(() => {
          getUserPicture();
        }, []);

        async function handleSearchEvent(e) {
            e.preventDefault();
            setValue(e.target.value);
            if (String(e.target.value).length >= 3) {
                setTimeout(async () => {
                    await axios.get(`${URL_API}/search/${String(e.target.value)}`, config)
                    .then(response => {
                        const {data} = response;
                        setUsersSearch(data.map(user => {
                            return (
                                {
                                    username: user.username,
                                    id: user.id
                                }
                            )
                        })
                        )
                    })
                    .catch(err => console.log(err))
                }, 300);
            }
        }
      
        function getUserPicture() {
          // ta feio assim pra evitar conflito no back com /user/:id
          const URL = "https://projeto17-linkr.herokuapp.com/picture/user";
        //   const URL = "http://localhost:4000/picture/user";
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          const promise = axios.get(URL, config);
          promise.then(response => {
            const { data } = response;
            setUserPicture(data.pictureUrl);
          });
          promise.catch(error => {
            alert("Houve um erro ao buscar a foto do usuário!");
          });
        }
 
        const handleLogout = () => {
                signOut();
                navigate("/");
                
        };
 
        return (
                <ContainerParent>
                        <Container onClick={() => setUsersSearch(null)}>
                                <h1 onClick={() => navigate('/timeline')}>linkr</h1>
                                <SearchBar 
                                className='bar-header' 
                                callbackEventHandler={handleSearchEvent} 
                                placeholder='search for users'
                                value={value}
                                valueCallback={() => setValue('')}
                                users={usersSearch}/>
                                <div onClick={() => setToggle(!toggle)}>
                                        {toggle ? (
                                                <IoIosArrowUp color="#FFFFFF" size={18} strokeWidth="5" />
                                        ) : (
                                                <IoIosArrowDown color="#FFFFFF" size={18} strokeWidth="5" />
                                        )}
                                        <img src={userPicture} alt="userImage" />
                                </div>
                        </Container>
                        {toggle ? (
                                <Bar onClick={() => setToggle(false)}>
                                        <p onClick={() => handleLogout()}>Logout</p>
                                </Bar>
                        ) : (
                                <></>
                        )}
                        <SearchBar 
                        className='bar-below' 
                        callbackEventHandler={handleSearchEvent} 
                        placeholder='search for users'
                        value={value}
                        users={usersSearch}
                        valueCallback={() => setValue('')}/>
                </ContainerParent>
        );

}
 
export default Header;

const ContainerParent = styled.div`
display: flex;
flex-direction: column;
align-items: center;

.bar-below {
    position: relative;
    margin-top: 0;
}

@media (min-width: 720px) {
    .bar-below {
        display: none;
    }
}
`

const UsersList = styled.ul`
width: 100%;

&:hover {
    cursor: pointer;
}
`;

const User = styled.li`
font-family: 'Lato';
font-size: 20px;
font-weight: 400;
line-height: 23px;
color: black;
background-color: #E7E7E7;
padding: 15px;
border-radius: 8px;
width: 100%;

&:hover {
    cursor: pointer;
    background-color: white;
}
`

const Input = styled.div`
display: flex; 
flex-direction: column;
position: inherit;
top: ${props => props.search ? '50px' : ''};

input {
    width: 90vw;
    max-width: 450px;
    background-color: white;
    border-radius: 8px;
    height: 45px;
    border: none;

    ::placeholder {
        margin-left: 10px;
    }
}

svg {
        font-size: 25px;
        position: absolute;
        right: 10px;
        top: 10px;
    }
`
 
const Container = styled.header`
        padding: 28px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72px;
        width: 100vw;
        background-color: #151515;
        margin-bottom: 10px;
        position: relative;
        h1 {
                color: #ffffff;
                font-family: "Passion One", cursive;
                font-size: 49px;
                font-weight: 700;

                &:hover{
                    cursor: pointer;
                }
        }
        div {
                display: flex;
                align-items: center;
                img {
                        width: 53px;
                        height: 53px;
                        margin-left: 16px;
                        border-radius: 50px;
                }
        }

        @media (max-width: 720px) {
            .bar-header {
                display: none;
            }
        }

`;
 
const Bar = styled.section`
        z-index: 99;  
        width: 150px;
        height: 43px;
        background-color: #171717;
        position: absolute;
        right: 0;
        border-radius: 0px 0px 0px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        p {
                font-size: 15px;
                font-weight: 700;
                color: #ffffff;
        }
`;