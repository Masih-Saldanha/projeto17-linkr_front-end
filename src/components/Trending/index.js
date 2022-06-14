import styled from 'styled-components';

import Hashtag from './../Hashtag';

function Trending(){
  
  const hashtags = [];
  
  return(
    <Section>
      <Title>trending</Title>
      {hashtags?.map( (tag,index) => <Hashtag key={index} hashtag={tag} /> )}
    </Section>
  )
}

const Section = styled.section`
  width: 300px;
  min-height: 80px;
  max-height: 100%;
  color: #fff;
  margin-left: 25px;
  margin-top: 150px;
  background-color: #171717;
  border-radius: 16px;
`;

const Title = styled.div`
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 27px;
  background-color: #171717;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom: solid 1px #484848;
  padding: 16px;
`;



export default Trending;
