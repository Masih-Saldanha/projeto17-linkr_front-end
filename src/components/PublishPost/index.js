import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

import { AuthContext } from '../../contexts/AuthContext';
import PostContext from '../../contexts/postContext';

function PublishPost() {
    const { getPosts } = useContext(PostContext);
    const [userPicture, setUserPicture] = useState("");

    const [postData, setPostData] = useState({ description: "", link: "" });
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        getPosts(token);
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

    function publishPost(e) {
        e.preventDefault();
        if (!postData.link) {
            alert("Envie um link");
            return;
        }
        setLoading(true);

        const URL = "https://projeto17-linkr.herokuapp.com/posts";
        const config = {
            headers: {
                // FIXME: ADICIONAR TOKEN AQUI
                Authorization: `Bearer ${token}`
            }
        };
        let metaPostData = {
            description: postData.description,
            link: postData.link
        }
        if (!metaPostData.description) {
            delete metaPostData.description;
        }
        console.log(metaPostData);
        const promise = axios.post(URL, metaPostData, config);
        promise.then(response => {
            getPosts(token);
            setPostData({ description: "", link: "" });
            setLoading(false);
        });
        promise.catch(error => {
            alert("Houve um erro ao publicar seu link");
            setPostData({ description: "", link: "" });
            setLoading(false);
        });
    }

    return (
        <Section>
            {/* // FIXME: AQUI VAI A FOTO DO USUARIO LOGADO */}
            <img src={userPicture} />
            <h1>What are you going to share today?</h1>
            {
                !loading ?
                    <form onSubmit={publishPost}>
                        <Link
                            type="url"
                            placeholder="http://..."
                            value={postData.link}
                            onChange={(e) => setPostData({ ...postData, link: e.target.value })}
                        />
                        <Description
                            type="text"
                            placeholder="Awesome article about #javascript"
                            value={postData.description}
                            onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                        />
                        <button type="submit">Publish</button>
                    </form>
                    :
                    <form onSubmit={publishPost}>
                        <Link
                            type="url"
                            placeholder="http://..."
                            value={postData.link}
                            onChange={(e) => setPostData({ ...postData, link: e.target.value })}
                            disabled
                        />
                        <Description
                            type="text"
                            placeholder="Awesome article about #javascript"
                            value={postData.description}
                            onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                            disabled
                        />
                        <button type="submit" disabled>Publishing</button>
                    </form>
            }
        </Section>
    )
}

const Section = styled.section`
position: relative;
padding: 21px 22px 52px 87px;
background-color: #FFFFFF;
margin-bottom: 29px;
border-radius: 16px;
img {
    position: absolute;
    top: 16px;
    left: 18px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
h1 {
    font-family: Lato;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 24px;
    color: #707070;
    margin-bottom: 10px;
}
form {
    display: flex;
    flex-direction: column;
    button {
        position: absolute;
        bottom: 16px;
        right: 22px;
        width: 112px;
        height: 31px;
        background-color: #1877F2;
        border-radius: 5px;
        border: none;

        font-family: Lato;
        font-style: normal;
        font-weight: 700;
        font-size: 13px;
        line-height: 16px;
        color: #FFFFFF;
    }
}
@media (max-width: 375px) {
    position: relative;
    text-align: center;
    padding: 10px 15px 40px 15px;
    background-color: #FFFFFF;
    margin-bottom: 16px;
    border-radius: 0;
    img {
        display: none;
    }
    h1 {
        font-family: Lato;
        font-style: normal;
        font-weight: 300;
        font-size: 17px;
        line-height: 20px;
        color: #707070;
        margin-bottom: 10px;
    }
    form {
        display: flex;
        flex-direction: column;
        button {
            position: absolute;
            bottom: 12px;
            right: 15px;
            width: 112px;
            height: 22px;
            background-color: #1877F2;
            border-radius: 5px;
            border: none;

            font-family: Lato;
            font-style: normal;
            font-weight: 700;
            font-size: 13px;
            line-height: 16px;
            color: #FFFFFF;
        }
    }
}

`

const Link = styled.input`
background-color: #EFEFEF;
border-radius: 5px;
border: none;
height: 30px;
padding-left: 13px;
margin-bottom: 5px;
::placeholder {
    font-family: Lato;
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 18px;
    color: #949494;
}
@media (max-width: 375px) {
    background-color: #EFEFEF;
    border-radius: 5px;
    border: none;
    height: 30px;
    padding-left: 11px;
    margin-bottom: 5px;
    ::placeholder {
        font-family: Lato;
        font-style: normal;
        font-weight: 300;
        font-size: 13px;
        line-height: 16px;
        color: #949494;
    }
}
`

const Description = styled.input`
background-color: #EFEFEF;
border-radius: 5px;
border: none;
height: 66px;
padding-left: 13px;
::placeholder {
    font-family: Lato;
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 18px;
    color: #949494;
}
@media (max-width: 375px) {
    background-color: #EFEFEF;
    border-radius: 5px;
    border: none;
    height: 47px;
    padding-left: 11px;
    ::placeholder {
        font-family: Lato;
        font-style: normal;
        font-weight: 300;
        font-size: 13px;
        line-height: 16px;
        color: #949494;
    }
}
`

export default PublishPost;