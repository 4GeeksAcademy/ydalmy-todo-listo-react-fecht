import React from "react";
import { useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component

const Home = () => {
    const URL_USERS = "https://playground.4geeks.com/todo/users/";
    const URL_TODOS = "https://playground.4geeks.com/todo/todos/";
    const USER = "elena";
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    const initTodos = async () => {
        let userExists = true;
        await fetch(`${URL_USERS}${USER}`)
            .then(resp => {
                console.log(resp.ok);
                console.log(resp.status);
                if (resp.status === 404) {
                    console.log("El usuario no existe");
                    userExists = false;
                }
                else {
                    console.log("El usuario existe");
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log(error);
            });

        if (!userExists) {
            await fetch(`${URL_USERS}${USER}`, {
                method: "POST",
                body: JSON.stringify([]),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(resp => {
                    console.log(resp.ok);
                    console.log(resp.status);
                    return resp.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.log(error);
                });
        }

        await fetch(`${URL_USERS}${USER}`)
            .then(resp => {
                console.log(resp.ok);
                console.log(resp.status);
                return resp.json();
            })
            .then(data => {
                console.log(data);
                setTodos(data["todos"].map((item) => ({ id: item.id, label: item.label })));
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleOnChange = (e) => {
        setInputValue(e.target.value);
    }
    const handleOnClick = (evt) => {
        evt.preventDefault();
        const inputValueTrimmed = inputValue.trim();
        if (inputValueTrimmed === '') {
            alert('Debe contener un valor')
            return;
        }
        fetch(`${URL_TODOS}${USER}`, {
            method: "POST",
            body: JSON.stringify({
                "label": inputValueTrimmed
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                console.log(resp.ok);
                console.log(resp.status);
                return resp.json();
            })
            .then(data => {
                setTodos([...todos, { id: data.id, label: data.label }]);
                setInputValue("");
                console.log(data);
                console.log(data.label);
            })
            .catch(error => {
                console.log(error);
            });
    }
    const handleDelete = (index) => {
        let id = todos[index].id;
        fetch(`${URL_TODOS}${id}`, {
            method: "DELETE"
        })
            .then(resp => {
                console.log(resp.ok);
                console.log(resp.status);
            })
            .catch(error => {
                console.log(error);
            });
        const updateTodos = todos.filter((todos, i) => i !== index)
        setTodos(updateTodos)

    }

    React.useEffect(() => {
        initTodos();
    }, []);

    return (
        <div className="container">
            <h2>TODOS </h2>
            <div clasName="container _input">
                <input type="text" value={inputValue} onChange={handleOnChange} />
                <button type="button" className="btn btn-primary" onClick={handleOnClick}> Add</button>
            </div>

            <ul>
                {
                    todos.length > 0 ? todos.map((todo, index) => {
                        return (
                            <li key={index}>{todo.label}<button type="button" className="btn btn-dark" onClick={() => { handleDelete(index) }}>Delete</button></li>
                        )


                    }) :



                        <p> No hay tareas aun </p>
                }

            </ul>

        </div>




    )
}


export default Home;		