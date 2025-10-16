// npm install @mui/material @emotion/react @emotion/styled
import { CardContent, CardMedia, Typography } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
import {colors} from "../styles/variables";
import styled from "styled-components";
import { Link } from 'react-router-dom';


const CardContainer = styled(Link)`
    margin: 15px auto;
    text-align: center;    
    background-color: ${colors.textSecondary};
    border: 1px solid ${colors.border};
    border-radius: 8px;
    padding: 10px;    
    width: 300px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.4);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    cursor: pointer;
    text-decoration: none; 
    color: ${colors.text};
    display: flex;
    flex-direction: column;
    justify-content: space-between;        

    &:hover{
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.8);
    }
`;

export default function BookCard({ title, author, isbn,imagen, editorial, description}){
    
    return(
        <CardContainer sx={{maxWidth:345}} to={`/${encodeURIComponent(btoa(isbn))}`   }>            
            <CardMedia                
                component='img'
                height='160'                
                image={imagen} 
                alt="Imagen de un libro"
                sx={{ objectFit: 'contain' }}
            />
            <CardContent>
                <Typography gutterBottom variant="h5">Título: {title}</Typography>                
                 {author? 
                <Typography variant="body2" color= "info" >Autor: {author}</Typography>
                : null}
                {isbn? 
                <Typography variant="body2" color="text.secondary">ISBN: {isbn}</Typography>
                : null}
                {editorial? 
                <Typography variant="body2" color="text.secondary">Editorial: {editorial}</Typography>  
                :null}
                {description? 
                <Typography variant="body2" color="text.secondary">Sinapsis: {description}</Typography>  
                : null}                

            </CardContent>

        </CardContainer>
    );
}