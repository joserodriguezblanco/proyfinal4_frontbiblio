import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import styled from "styled-components";

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;


const BookForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [imagen, setImagen] = useState("");
  const [editorial, setEditorial] = useState("");
  const [description, setDescription] = useState("");

  const [isRegisterMode, setisRegisterMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [libroencontrado, setlibroencontrado] = useState(null);
  const [libros, setLibros] = useState([]);
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // setisRegisterMode(true);
    setlibroencontrado(null);

    const endpoint = isRegisterMode ? "register" : "view"; // Ajusta según tu configuración de backend
    const url = `http://localhost:3002/${endpoint}`;

    try {      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, isbn, imagen,editorial, description }),
      });
      const data = await response.json(); //se convierte la respuesta en json
      if (response.ok) {
        
        setMessage(data.message);
        

        if (!isRegisterMode) {          

          setMessage(data.message);
          setLibros(data.books);

          setTimeout(() => {
            setMessage("");
          }, 2000);
        } else {
          setlibroencontrado(null);
          setTitle("");
          setAuthor("");
          setIsbn("");
          setImagen("");
          setEditorial("");
          setDescription("");
            setLibros([]); // Limpia la lista de libros al registrar uno nuevo
            setisRegisterMode(false);
        }
      } else {        
        setMessage(
          data.message ||
            `Error al ${isRegisterMode} ? 'Agregar Libro' : 'View') `
        );
      }
    } catch (error) {
      setMessage(
        "No se pudo conectar al servidor. Reivsar que haya conexión con el backend."
      );
    } finally {
      setLoading(false);
    }
  };

  
useEffect(() => {
    if (!isRegisterMode) handleSubmit(new Event("submit"));
  }, [isRegisterMode]);
  

  return (
    <div>
        <div className="container">
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="text">Título:</label>
                        <input
                        type="text"
                        placeholder="Título del libro"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="text">Autor:</label>
                        <input
                        type="text"
                        placeholder="Autor del libro"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="text">ISBN:</label>
                        <input
                        type="text"
                        placeholder="ISBN del libro"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="text">Img URL:</label>
                        <input
                        type="text"
                        placeholder="Ruta de la imagen"
                        value={imagen}
                        onChange={(e) => setImagen(e.target.value)}
                        className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="text">Editorial:</label>
                        <input
                        type="text"
                        placeholder="Editorial del libro"
                        value={editorial}
                        onChange={(e) => setEditorial(e.target.value)}
                        className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="text">Sinapsis:</label>
                        <input
                        type="text"
                        placeholder="Sinapsis del libro"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-input"
                        />
                    </div>

                    {loading
                        ? "Cargando..."
                        : (
                            <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                            onClick={() => setisRegisterMode(true)}
                            >
                            Agregar Libro
                            </button>
                        )
                    }
                </form>                
            </div>
        </div>


        {libros.length > 0 ? (
        <CardsGrid>
        {libros.map((libro) => (
            <BookCard
            key={libro._id || libro.isbn}
            title={libro.title}
            author={libro.author}
            imagen={libro.imagen}
            isbn={libro.isbn}
            />
        ))}
        </CardsGrid>
        ) : (
            <p>No hay libros registrados aún.</p>
        )}

        {message && (
            <div
                className={`message-box ${
                message.includes("exitos") ? "success" : "error"
                }`}
            >
                {message}
            </div>
        )}

        {libroencontrado}
        
        {libroencontrado && (
        <div
            className={`message-box ${
            libroencontrado.includes("exitos") ? "success" : "error"
            }`}
        >
            {libroencontrado}
        </div>
        )}
    </div>
  );
};


export default BookForm;
