import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import useAuth from "../../hooks/useAuth";
import { AuthContext } from "../../contexts/AuthContext";
 
function Header(props) {
        const { signOut, image } = useAuth();
        const { toggle, setToggle } = props;
        const navigate = useNavigate();

        const [userPicture, setUserPicture] = useState("");
        const { token } = useContext(AuthContext);
      
        useEffect(() => {
          getUserPicture();
        }, []);
      
        function getUserPicture() {
          // ta feio assim pra evitar conflito no back com /user/:id
          const URL = "https://projeto17-linkr.herokuapp.com/picture/user";
          const config = {
            headers: {
              // FIXME: ADICIONAR TOKEN AQUI
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
                <>
                        <Container>
                                <h1>linkr</h1>
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
                </>
        );

}
 
export default Header;
 
const Container = styled.header`
        padding: 28px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72px;
        background-color: #151515;
        h1 {
                color: #ffffff;
                font-family: "Passion One", cursive;
                font-size: 49px;
                font-weight: 700;
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