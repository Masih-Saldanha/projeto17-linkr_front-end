import styled from 'styled-components';

import PublishPost from '../../components/PublishPost';
import Header from './../../components/Header';

function Home() {
  return (
    <>
      <Header />
      <TimelineTitle>timeline</TimelineTitle>
      <PublishPost></PublishPost>
    </>
  )
}

const TimelineTitle = styled.h1`
margin-top: 91px;
margin-left: 17px;
margin-bottom: 19px;
font-family: Oswald;
font-weight: 700;
font-size: 33px;
line-height: 49px;
color: #FFFFFF;
`

export default Home;