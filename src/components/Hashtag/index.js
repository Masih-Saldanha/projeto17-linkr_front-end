import styled from 'styled-components';

function Hashtag(props){

  const { hashtag } = props;
  return (
    <Tags># { hashtag }</Tags>
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