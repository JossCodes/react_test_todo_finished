import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { generateRandomId, paginate } from "../utils";

const TableList = () => {
  const inputReference = useRef(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullTodos, setFullTodos] = useState([]);
  const [todos, setTodos] = useState([]);

  const [page, setPage] = useState(1);
  const [paginationItems, setPaginationItems] = useState(1);

  const [newTodo, setNewTodo] = useState({ title: "" });

  const getTodos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setFullTodos(paginate(data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  const handleChangePage = (e) => {
    const newPage = e.currentTarget.tabIndex;
    if (newPage !== page) setPage(newPage);
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (fullTodos.length > 0) {
      setTodos(fullTodos[page - 1]);
      let items = [];
      for (let number = 1; number <= fullTodos.length; number++) {
        items.push(
          <Pagination.Item
            tabIndex={number}
            key={number}
            active={number === page}
            onClick={handleChangePage}
          >
            {number}
          </Pagination.Item>
        );
      }
      setPaginationItems(items);
    }
  }, [fullTodos, page]);

  const handleNewTodo = (e) => {
    setNewTodo({ ...newTodo, title: e.currentTarget.value });
  };

  const handleSubmitTodo = (e) => {
    e.preventDefault();
    if (newTodo.title) {
      setTodos([
        {
          title: newTodo.title,
          id: generateRandomId(),
          userId: generateRandomId(),
          completed: false,
        },
        ...todos,
      ]);
      setNewTodo({ title: "" });
      inputReference.current.focus();
    }
  };

  return (
    <Container>
      {error ? (
        <>
          <h4>
            Sorry, we couldn't load the data :( <br /> Please check your network
            and try again
          </h4>
          <Button
            variant="dark"
            onClick={() => {
              getTodos();
              setError(false);
            }}
          >
            Refresh
          </Button>
        </>
      ) : loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Row>
          <Col>
            <Button
              variant="dark"
              className="d-block me-0 ms-auto my-3"
              onClick={getTodos}
            >
              Refresh
            </Button>
            <Form onSubmit={handleSubmitTodo}>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Describe Todo"
                  aria-label="Describe Todo"
                  aria-describedby="basic-addon2"
                  value={newTodo.title}
                  onChange={handleNewTodo}
                  ref={inputReference}
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  type="submit"
                >
                  Create
                </Button>
              </InputGroup>
            </Form>
            <Pagination>{paginationItems}</Pagination>
            <Table striped bordered hover responsive width={"100%"}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Description</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr key={todo.id}>
                    <td>{todo.id}</td>
                    <td>{todo.userId}</td>
                    <td>{todo.title}</td>
                    <td>{todo.completed ? <BsCheckLg /> : <BsXLg />}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>{paginationItems}</Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default TableList;
