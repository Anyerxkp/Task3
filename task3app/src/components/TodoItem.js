import React, { useState } from "react";
import { ListGroup, Button, Form } from "react-bootstrap";

const TodoItem = ({ todo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const [updatedDescription, setUpdatedDescription] = useState(todo.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(todo._id, updatedTitle, updatedDescription, todo.completed);
    setIsEditing(false);
  };

  const handleCompletionChange = async () => {
    onUpdate(todo._id, todo.title, todo.description, !todo.completed);
  };

  return (
    <ListGroup.Item>
      {isEditing ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
          </Form.Group>
          <Button type="submit">Save</Button>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Form>
      ) : (
        <>
          <Form.Check
            type="checkbox"
            label="Completed"
            checked={todo.completed}
            onChange={handleCompletionChange}
            inline
          />
          <span className={todo.completed ? "text-muted" : ""}>
            <strong>{todo.title}</strong> - {todo.description}
          </span>
          <Button
            className="float-right"
            variant="danger"
            size="sm"
            onClick={() => onDelete(todo._id)}
          >
            Delete
          </Button>
          <Button
            className="float-right mr-2"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </>
      )}
    </ListGroup.Item>
  );
};

export default TodoItem;
