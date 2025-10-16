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
    const [deleteBook, setDeleteBook] = useState(false);

    const endpoint = "book";
    const url = `http://localhost:3002/${endpoint}`;

    const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!libro?.isbn) return;
    const ok = window.confirm(`¿Eliminar el libro con ISBN ${libro.isbn}?`);
    if (!ok) return;

    try {
      setDeleting(true);
      setMessage("");
      setError(null);
      
      const resp = await fetch(`http://localhost:3002/book/${encodeURIComponent(libro.isbn)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.message || "No se pudo eliminar el libro");

      setMessage(data.message || "Libro eliminado");
    
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al eliminar el libro");
    } finally {
      setDeleting(false);
    }
  };
    

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
                isbn:decoded                
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
    }, [encodedUrl]
    );

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
                </div>
            );
        })}       
        <BackButton onClick={() => navigate(-1)}>Volver</BackButton>
        <BackButton onClick={handleDelete} disabled={loading || deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
        </BackButton>
                                    
        </DetailsContainer>
    );
};

export default DetailsPage;
