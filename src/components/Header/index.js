import styled from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { MdKeyboardArrowDown } from 'react-icons/md';
import { AuthContext } from '../../contexts/AuthContext';

function Header(props) {

  // FIXME: Creio que seria mais interessante usar Context ao invés de props aqui.
  const {
    // pictureUrl, 
    username
  } = props;

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

  return (
    <Section>
      <Span>linkr</Span>
      <Div>
        <Icon><MdKeyboardArrowDown /></Icon>
        <img src={userPicture} alt={username} />
      </Div>
    </Section>
  )
}

const Section = styled.header`
  width: 100%;
  height: 72px;
  background-color: #151515;
  position: fixed;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;

  @media (max-width: 375px)  {
    padding: 0 17px;
  }
`;

const Span = styled.span`
  font-family: 'Passion One', cursive;
  font-weight: 700;
  font-size: 49px;
  color: #FFF;
  cursor: pointer;
`;

const Div = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 53px;
    height: 53px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    object-fit: cover;
    margin-left: 15px;
  }

  @media (max-width: 375px)  {
    img {
      margin-left: 10px;
    }
  }

`;

const Icon = styled.div`
  color: #FFF;
  font-size: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default Header;