import React from "react";
import styled from "styled-components";
import { colors } from "../styles/variables";
import { Link } from 'react-router-dom';

const CardContainer = styled(Link)`
    background-color: ${colors.textSecondary};
    border: 1px solid ${colors.border};
    border-radius: 8px;
    padding: 20px;
    margin: 15px;
    width: 250px;
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

const CardTitle = styled.h3`
    color : ${colors.primary};
    margin-bottom: 5px;
    font-size: 1.5em;
    text-align: center;
`;

const CardDetail = styled.p`
    color: ${colors.textSecondary};
    font-size: 0.9em;
    margin-bottom: 5px;
    text-align: center;
`;

const Card = ({ name, type, details, url })=>{

    const detailUrl = `/${type}/${encodeURIComponent(btoa(url))}`;
    return (
        <CardContainer to={detailUrl}>
            <CardTitle>{name}</CardTitle>
            {details && Object.entries(details).map(([key,value])=>(
                <CardDetail key={key}>
                    <strong>{key}:{value}</strong>
                </CardDetail>
            ))}
        </CardContainer>
    );
};

export default Card;