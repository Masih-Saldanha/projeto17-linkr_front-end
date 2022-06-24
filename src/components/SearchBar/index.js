import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { IoSearchOutline, IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function SearchBar(props) {

    const { callbackEventHandler, placeholder, className, value, users, valueCallback } = props;
    const navigate = useNavigate();
    return (
        <ContainerSearch className={className}>
            <Input>
                <input 
                type="text" 
                placeholder={placeholder} 
                onChange={e => callbackEventHandler(e)}
                value={value}
                results={users ? true : false}></input>
                <IconContainer>
                    {String(value).length > 0 ? <IoClose onClick={valueCallback} /> : <IoSearchOutline />}
                </IconContainer>
            </Input>
            <Results>
                {users?.map(user => {
                    return (
                        <p onClick={() => navigate(`/user/${String(user.id)}`)}>{user.username}</p>
                    )
                })}
            </Results>
        </ContainerSearch>
    )
}

const Input = styled.div`
display: flex;
position: relative;

input {
    width: 90vw;
    max-width: 450px;
    background-color: white;
    border-radius: 8px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: ${props => props.results === true ? '0' : '8px'};
    height: 45px;
    border: none;

    ::placeholder {
        margin-left: 10px;
    }

    &:focus {
        outline: none;
    }
}
`

const IconContainer = styled.div`
display: grid;
place-items: center;
background-color: white;
width: 30px;
height: 45px;
border-top-right-radius: 8px;
border-bottom-right-radius: ${props => props.results === true ? '0' : '8px'};

svg {
        font-size: 25px;
        color: black;

        &:hover {
            cursor: pointer;
        }
    }
`

const ContainerSearch = styled.div`
display: flex;
flex-direction: column;
position: absolute;
top: 15px;
left: 0;
right: 0;
`

const Results = styled.div`
display: flex;
flex-direction: column;
width: calc(90vw + 30px);
max-width: calc(450px + 30px);
height: auto;
align-items: flex-start;
z-index: 2;

p:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

p {
    padding: 15px;
    width: 100%;
    font-size: 18px;
    background-color: white;

    &:hover {
        cursor: pointer;
        background-color: gray;
    }
}
`