import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  ListGroup,
  Alert,
  FormSelect,
} from "react-bootstrap";
import TodoItem from "./components/TodoItem";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    role: "admin",
  });

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/todos", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setTodos(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchTodos();
    }
  }, [authenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", loginData);
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setAuthenticated(true);
      setError(null);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/signup", signupData);
      setError(null);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setToken(null);
    setTodos([]);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/todos",
        { title, description },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchTodos();
      setTitle("");
      setDescription("");
      setError(null);
    } catch (error) {
      setError(error.response.data.errors[0].msg);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      fetchTodos();
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateTodo = async (id, updatedTitle, updatedDescription, updatedCompleted) => {
    try {
      await axios.put(
        `http://localhost:3000/todos/${id}`,
        {
          title: updatedTitle,
          description: updatedDescription,
          completed: updatedCompleted,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchTodos();
      setError(null);
    } catch (error) {
      setError(error.response.data.errors[0].msg);
    }
    };
    
    return (
    <Container>
    {!authenticated ? (
    <>
    <Row>
    <Col>
    <h1>Login</h1>
    <Form onSubmit={handleLogin}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Button type="submit">Login</Button>
              </Form>
            </Col>
            <Col>
              <h1>Signup</h1>
              <Form onSubmit={handleSignup}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({ ...signupData, username: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={signupData.role}
                    onChange={(e) =>
                      setSignupData({ ...signupData, role: e.target.value })
                    }
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit">Signup</Button>
              </Form>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="mt-4">
            <Col>
              <h1>Todo List</h1>
            </Col>
            <Col className="text-right">
              <Button onClick={handleLogout}>Logout</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError(null)}
                  dismissible
                >
                  {error}
                </Alert>
              )}
              <Form onSubmit={addTodo}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit">Add Todo</Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                {todos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                  />
                ))}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default App;
