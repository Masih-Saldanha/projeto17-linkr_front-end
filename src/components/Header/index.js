import styled from 'styled-components';
import { MdKeyboardArrowDown } from 'react-icons/md';

function Header(props){
  
  const { pictureUrl, username } = props;

  return(
    <Section>
      <Span>linkr</Span>
      <Div>
        <Icon><MdKeyboardArrowDown/></Icon>
        <img src={pictureUrl} alt={username}/>
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
