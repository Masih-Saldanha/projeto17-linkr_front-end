import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { IoSearchOutline } from 'react-icons/io5';

import useAuth from "../../hooks/useAuth";
import { AuthContext } from "../../contexts/AuthContext";

// const URL_API = `https://projeto17-linkr.herokuapp.com`;
const URL_API = `http://localhost:4000`;
 
function Header(props) {
        const { signOut, image } = useAuth();
        const { toggle, setToggle } = props;
        const navigate = useNavigate();
        const [value, setValue] = useState('');
        const [usersSearch, setUsersSearch] = useState(null);

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
                await axios.get(`${URL_API}/search/${e.target.value}`, config)
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
            }
        }
      
        function getUserPicture() {
          // ta feio assim pra evitar conflito no back com /user/:id
          const URL = "https://projeto17-linkr.herokuapp.com/picture/user";
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

        function returnUsers() {
            return (
                usersSearch.map(user => {
                    return (
                        <User onClick={() => navigate(`/user/${user.id}`)}>{user.username}</User>
                    )
                })
            )
        }
 
        return (
                <ContainerParent>
                        <Container onClick={() => setUsersSearch(null)}>
                                <h1 onClick={() => navigate('/timeline')}>linkr</h1>
                                <Input className={`bar-header`} search={usersSearch}>
                                    <input 
                                    type="text"
                                    placeholder="search for users" 
                                    onChange={e => handleSearchEvent(e)}>
                                    </input>
                                    <IoSearchOutline />
                                    {usersSearch ? 
                                    <UsersList>
                                        {returnUsers()}
                                    </UsersList> : <></>}
                                </Input>
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
                        <Input className={`bar-below`} search={usersSearch}>
                            <input 
                            type="text"
                            placeholder="search for users" 
                            onChange={e => handleSearchEvent(e)}>
                            </input>
                            <IoSearchOutline />
                            {usersSearch ? 
                            <UsersList>
                                {returnUsers()}
                            </UsersList> : <></>}
                        </Input>
                </ContainerParent>
        );

}
 
export default Header;

const ContainerParent = styled.div`
display: flex;
flex-direction: column;
align-items: center;

@media (min-width: 720px) {
    .bar-below {
        display: none;
    }
}
`

const UsersList = styled.ul`
width: 100%;
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
z-index: 1;

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