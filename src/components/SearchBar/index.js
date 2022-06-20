import styled from 'styled-components';
import { IoSearchOutline } from 'react-icons/io5';

export default function SearchBar() {
    return (
        <Input>
            <input type="text" placeholder="search"></input>
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