import styled from 'styled-components';
import { useNavigate } from 'react-router';

function Hashtag(props){

  const { hashtag } = props;
  const navigate = useNavigate();

  function HandleClick(){
    navigate(`/hashtag/${hashtag}`);
  }

  return (
    <Tags onClick={HandleClick}># { hashtag }</Tags>
  )
}

const Tags = styled.div`
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 19px;
  padding: 16px;
  color: #fff;
  cursor: pointer;
`;

export default Hashtag;