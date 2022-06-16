import axios from 'axios';
import { useState } from 'react';
import styled from 'styled-components';

function PublishPost() {
    const [postData, setPostData] = useState({ description: "", link: "" });
    const [loading, setLoading] = useState(false);

    function publishPost(e) {
        e.preventDefault();
        if (!postData.link) {
            alert("Envie um link");
            return;
        }
        setLoading(true);
        console.log(postData);

        const URL = "https://projeto17-linkr.herokuapp.com/posts";
        const promise = axios.post(URL, postData);
        promise.then(response => {
            // ATIVAR FUNÇÃO DE GET POSTS AQUI
            setPostData({ description: "", link: "" });
            setLoading(false);
        });
        promise.catch(error => {
            alert("Houve um erro ao publicar seu link");
            setPostData({ description: "", link: "" });
            setLoading(false);
        });

        // setLoading(true);
        // console.log("carregando");
        // setTimeout(() => {
        //     console.log(postData);
        //     setLoading(false);
        //     console.log("não está mais carregando")
        // }, 3000);

        // FIXME: NO CATCH IMPLEMENTAR ALERT("Houve um erro ao publicar seu link") e
        // setPostData({ description: "", link: "" })
        // setLoading(false)
    }

    return (
        <Section>
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
text-align: center;
padding: 10px 15px 40px 15px;
background-color: #FFFFFF;
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
`

const Link = styled.input`
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
`

const Description = styled.input`
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
`

export default PublishPost;