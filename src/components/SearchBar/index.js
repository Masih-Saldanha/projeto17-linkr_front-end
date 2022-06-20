import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

export default function SearchBar() {

    const [value, setValue] = useState('');

    async function handleSearchEvent(e) {
        e.preventDefault();
        setValue(e.target.value);
        if (e.target.value.length >= 3) {
            await axios.get(`${URL_API}/search/${e.target.value}`)
                .then()
                .catch()
        }
    }

    return (
        <Input>
            <input type="text" placeholder="search" onChange={e => handleSearchEvent(e)}></input>
            <IoSearchOutline />
        </Input>
    )
}

const Input = styled.div`
position: relative;

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
    }
`