import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { colors } from "../styles/variables";
import {  CardMedia } from "@mui/material";

const DetailsContainer = styled.div`
  padding: 40px;
  background-color: ${colors.textSecondary};
  border-radius: 10px;
  margin: 40px auto;
  max-width: 400px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  color: ${colors.primary};
  border: 2px solid ${colors.border};
  min-width: 250px;
`;

const DetailTitle = styled.h1`
  color: ${colors.secondary};
  font-size: 2em;
  margin-bottom: 10px;
  text-align: center;
  text-shadow: 0 0 8px ${colors.secondary};
`;

const DetailItem = styled.p`
  font-size: 1.1em;
  margin-bottom: 10px;
  strong {
    color: ${colors.accent};
    margin-right: 5px;
  }
    span {
    color: ${colors.secondary};
  }
`;
const BackButton = styled.button`
  background-color: ${colors.border};
  color: ${colors.accent};
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 30px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #fce100;
  }
`;

const DetailsPage = () => {
  const { encodedUrl } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [imagen, setImagen] = useState("");
  const [editorial, setEditorial] = useState("");
  const [description, setDescription] = useState(""); 

  const [message, setMessage] = useState("");
  const [libro, setLibro] = useState(null);

  const endpoint = "book";
  const url = `http://localhost:3002/${endpoint}`;

    useEffect(() => {
    const loadDetails = async () => {
  
      setLoading(true);
      setError(null);
      try {
  
        if (!encodedUrl) throw new Error("Parámetro faltante");
        const decoded = atob(decodeURIComponent(encodedUrl));        
        setIsbn(decoded);    
        
          const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            author,
            isbn:decoded,
            imagen,
            editorial,
            description,
          }),
        });

        const data = await response.json(); //se convierte la respuesta en json
        
        if (response.ok) {
          setMessage(data.message);
          setLibro(data.book);

          setImagen(data.book.imagen);

          setTimeout(() => {
            setMessage("");
          }, 2000);
        } else {
          throw new Error(data.message || "Error al cargar la data");
        }
      } catch (err) {
        setError("Error al cargar la data, intente nuevamente");
        
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [encodedUrl]);

  if (error) {
    return (
      <DetailsContainer> 
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        <BackButton onClick={() => navigate(-1)}>Volver</BackButton>
      </DetailsContainer>
    );
  }
  if (!libro) {
    return (
      <DetailsContainer>
        <p style={{ textAlign: "center" }}>
          `No se encontraron detalles`, ${isbn}
        </p>
        <BackButton onClick={() => navigate(-1)}>Volver</BackButton>
      </DetailsContainer>
    );
  }
  return (
    <DetailsContainer>
      <DetailTitle>{libro.name || libro.title}</DetailTitle>

{imagen && (
        <CardMedia
          component="img"
          height="220"
          image={imagen}
          alt="Imagen de un libro"
          sx={{ objectFit: "contain", marginTop: 2 }}
        />
      )}     
     
      {Object.entries(libro).map(([key, value]) => {
        // if (typeof value === "string" && value.startsWith("http")) return null;        
        if (Array.isArray(value)) return null;

        return (
            <div>   
          <DetailItem key={key}>            
            <strong>
              {key==='_id'
                ? null
                : key === "title"
                ? "Título:"
                : key === "author"
                ? "Autor:"
                : key === "isbn"
                ? "ISBN:"                
                : key === "editorial"
                ? "Editorial:"
                : key === "description"
                ? "Sinapsis:"
                : key}

            </strong>
            {key !== '_id' && key !== 'imagen' && <span>{value}</span>}                        
                                    
          </DetailItem>
              {/* {key === 'imagen' && value && 
                (   
                    <CardMedia                
                        component='img'
                        height='220'                
                        image={value}
                        alt="Imagen de un libro"
                        sx={{ objectFit: 'contain' }}
                    />
                )
                
              } */}
            </div>
        );
      })}

       
      <BackButton onClick={() => navigate(-1)}>Volver</BackButton>
    </DetailsContainer>
  );
};

export default DetailsPage;
