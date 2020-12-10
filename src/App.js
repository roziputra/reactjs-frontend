import React, {useRef, useState, useEffect}from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Chart from 'chart.js';

import { ButtonToolbar } from 'react-bootstrap';

const App = () => {
  
  const [content, setContent] = useState({page: "home"});

  const MaxPage = 100;

  const fetchData = async ({url,filter},callback) => {
      const req = await axios.get(url,filter);
      const res = req.data;
      if (res.status===1) {
        return callback(res);
      }
      return;
  }
  
  const Navigation = props => {
    return (
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
        <Navbar.Brand href="/">Best</Navbar.Brand>
        <Nav className="mr-auto" activeKey={props.page} >
          <Nav.Link onClick={() => setContent({page: "home"})} href="#home">Home</Nav.Link>
          <Nav.Link onClick={() => setContent({page: "categories"})} href="#categories">Categories</Nav.Link>
          <Nav.Link onClick={() => setContent({page: "books"})} href="#books">Books</Nav.Link>
        </Nav>
        </Container>
      </Navbar>
    )
  }

  const Footer = () => {
    return (
      <footer className="footer mt-auto py-3 bg-dark">
        <Container>
          <span className="text-white">Copyright &copy; 2020 </span>
        </Container>        
      </footer>
    )
  }

  const ShowHome = () => {
      const offersClick = e => {
        e.preventDefault();
        setContent({page: "books", query: {"price[min]": 0, "price[max]": 0}});
      }
      return (
        <React.Fragment>
          <Navigation page="#home" />
          <Container>
            <Jumbotron>
              <h1>Hai!</h1>
              <p>
                This is limited promo, get free items for now.
              </p>
              <p>
              <Button className="button" onClick={((e) => offersClick(e))} variant="danger" size="sm">
                View books
              </Button>
              </p>
            </Jumbotron>
          </Container>
          <Footer/>
        </React.Fragment>
      )
  }

  const ShowCategories = () => {
      const [categories, setCategories] = useState([]);
      
      useEffect(() => {
        let urlCategory = {
          url: "http://localhost:8080/api/v1/books/categories"
        }
        //fetch data when component create
        fetchData(urlCategory,(res) => {
          setCategories(res.Data);
        })
      }, []);

      const categoryClick = (e, data) => {
        e.preventDefault();
        setContent({page: "books", query: {category: data.kode}});
      }

      const TrHead = () => {
        return (
          <tr className="bg-warning">
            <th>#</th>
            <th>Category</th>
            <th></th>
          </tr>
        )
      }
      const TrBody = ({data}) => {
        if (!data || data.length === 0) {
          return (
            <tr>
              <td className="text-center" colSpan="3">No Data</td>
            </tr>
          )
        } else {
          return data && data.map(({ kode, name },idx) => {
              return (
                  <tr key={kode}>
                      <td>{idx+1}</td>
                      <td>{name}</td>
                      <td className="operation">
                          <Button className="button" onClick={((e) => categoryClick(e, {kode}))} variant="primary" size="sm">
                            View Books
                          </Button>
                      </td>
                  </tr>
              )
          })
        } 
      }
            
      return (
        <React.Fragment>
          <Navigation page="#categories" />
          <Container>
            <Table striped hover size="sm">
              <thead>
                <TrHead />
              </thead>
              <tbody>
                <TrBody data={categories} />
              </tbody>
            </Table>
          </Container>
          <Footer/>
        </React.Fragment>
      )
  }
  
  const ShowBooks = ({dataquery}) => {
      
      const initFilterval = {title: "", category: 0, "price[min]": "", "price[max]": ""}
      const [book, setBook] = useState([]);
      const [total, setTotal] = useState(0);
      const [numpage, setNumpage] = useState(1);
      const [filterval, setFilterval] = useState(initFilterval);
      
      useEffect(() => {
        let urlBooks = {
          url: "http://localhost:8080/api/v1/books/filter",
          filter: {
            params: {
              title: "", 
              category: 0, 
              "price[min]": "", 
              "price[max]": "",
              ...dataquery
            }
          }
        }

        //check data from props
        if (dataquery!==undefined) {
          //define initial value for form
          setFilterval(() => {
            return {...urlBooks.filter.params,...dataquery}
          })
        }
        
        //fetch data when component create
        fetchData(urlBooks, (res) => {
          setBook(res.Data);
          setTotal(res.Total);
          setNumpage(res.Page);
        })
      }, [dataquery]);

      const [category, setCategory] = useState([]);
      
      useEffect(() => {
        let selectCategory = {
          url: "http://localhost:8080/api/v1/books/categories"
        }
        //fetch data when component create
        fetchData(selectCategory,(res) => {
          setCategory(res.Data);
        })
      }, [setCategory]);
      
      const setPage = (e, data) => {
        let urlPage = {
          url: "http://localhost:8080/api/v1/books/filter",
          filter: {
            params: {
              ...filterval,
              page: data.page
            }
          }
        }
       
        fetchData(urlPage, (res) => {
          setBook(res.Data);
          setTotal(res.Total);
          setNumpage(res.Page);
        })
      }
      const handleChange = (event,field) => {
        setFilterval(filterval => {
          return {
            ...filterval,    // keep all other key-value pairs
            [field]: event.target.value       // update the value of specific key
          }
        })
      }
      const handleSubmit = (event) => {
        event.preventDefault();
        let urlFilter = {
          url: "http://localhost:8080/api/v1/books/filter",
          filter: {
            params: filterval
          }
        }
        
        fetchData(urlFilter, (res) => {
          setBook(res.Data);
          setTotal(res.Total);
          setNumpage(res.Page);
        })
      }
      const handleReset = (event) => {
        event.preventDefault();
        let urlReset = {
          url: "http://localhost:8080/api/v1/books/filter"
        }
        setFilterval(initFilterval)
        fetchData(urlReset, res => {
          setBook(res.Data);
          setTotal(res.Total);
          setNumpage(res.Page);
        })
      }

      const OptSelect = ({data}) => {
        if (!data || data.length === 0) {
          return (
            <option key={0} value={0}>No Option</option>
          )
        } else {
          return data && data.map(({ kode, name },idx) => {
              return (
                <option key={idx} value={kode}>{name}</option>
              )
          })
        } 
      }

      const TrHead = () => {
        return (
          <tr className="bg-success text-white">
            <th>#</th>
            <th>Title</th>
            <th>Category</th>
            <th>Format</th>
            <th>Price</th>
            <th></th>
          </tr>
        )
      }

      const TrBody = ({data}) => {
        if (!data || data.length === 0) {
          return (
            <tr>
              <td className="text-center" colSpan="6">No Data</td>
            </tr>
          )
        } else {
          return data && data.map(({ kode, title, category, format, price },idx) => {
              return (
                  <tr key={idx+1}>
                      <td>{((numpage - 1) * MaxPage)+idx+1}</td>
                      <td>{title}</td>
                      <td>{category}</td>
                      <td>{format}</td>
                      <td>{price}</td>
                      
                      <td className="operation">
                          <Button className="button" onClick={() => setContent({page: "detail",kode: kode})}  variant="primary" size="sm">
                            Detail Book
                          </Button>
                      </td>
                  </tr>
              )
          })
        } 
      }

      let lastpage = Math.ceil(total/MaxPage);

      return (
        <React.Fragment>
          <Navigation page="#books" />
          <Container>
            <Card border="success" className="my-2">
              <Card.Header className="bg-success text-white py-2">Filter</Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => handleSubmit(e)} >
                  <Form.Group as={Row} controlId="formtitle">
                    <Form.Label column md="2">
                      Title
                    </Form.Label>
                    <Col md="10">
                      <Form.Control name="title" size="sm" type="text" placeholder="" onChange={(e) => handleChange(e,"title")} value={filterval.title} />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formcategory">
                    <Form.Label column md="2">
                      Category
                    </Form.Label>
                    <Col md="10">
                      <Form.Control name="category" size="sm" as="select" onChange={(e) => handleChange(e,"category")} value={filterval.category} custom>
                        <option key={0} value={0}>All Category</option>
                        <OptSelect data={category} />
                      </Form.Control>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formprice">
                    <Form.Label column md="2">
                      Price
                    </Form.Label>
                    <Col md="5">
                      <InputGroup size="sm" className="mb-2 mr-sm-2">
                        <InputGroup.Prepend>
                          <InputGroup.Text>Min</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl name="price[min]" type="number" onChange={(e) => handleChange(e,"price[min]")} placeholder="" value={filterval["price[min]"]} />
                      </InputGroup>
                    </Col>
                    <Col md="5">
                    <InputGroup size="sm" className="mb-2 mr-sm-2">
                        <InputGroup.Prepend>
                          <InputGroup.Text>Max</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl name="price[max]" type="number" onChange={(e) => handleChange(e,"price[max]")} placeholder="" value={filterval["price[max]"]} />
                      </InputGroup>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 2 }}>
                      <ButtonToolbar aria-label="Toolbar">
                        <Button size="sm" type="submit">Filter</Button>
                        <Button size="sm" onClick={(e) => handleReset(e)} className="mx-2" variant="warning" type="button">Reset</Button>
                      </ButtonToolbar>
                    </Col>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
            <Table striped bordered hover size="sm">
              <thead>
                <TrHead />
              </thead>
              <tbody>
                <TrBody data={book} />
              </tbody>
            </Table>
            <ButtonToolbar  className="my-2 float-right" aria-label="Toolbar">
              <ButtonGroup aria-label="pagination">
                <Button size="sm" onClick={(e) => setPage(e, {page: 1})} className="px-3" variant="warning" disabled={numpage <= 1 ? true : false} > First </Button>
                <Button size="sm" onClick={(e) => setPage(e, {page: numpage-1})} className="px-3" variant="warning" disabled={numpage <= 1 ? true : false} > Prev </Button>
                <Button size="sm" onClick={(e) => setPage(e, {page: numpage+1})} className="px-3" variant="warning" disabled={numpage >= lastpage ? true : false} > Next </Button>
                <Button size="sm" onClick={(e) => setPage(e, {page: lastpage})} className="px-3" variant="warning" disabled={numpage >= lastpage ? true : false} > Last </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Container>
          <Footer/>
        </React.Fragment>
      )
  }

  const ShowBooksDetail = ({kode}) => {
      
      const [detail, setDetail] = useState([]);

      useEffect(() => {
        let urlDetail = {
          url: "http://localhost:8080/api/v1/book/detail/" + kode
        }
        //fetch data when component create
        fetchData(urlDetail, (res) => {
          setDetail(res.Data);
        })
      }, [kode]);

      const BookDetail = ({data}) => {
        if (!data || data.length === 0) {
          return (
            <Table size="sm">
              <tbody>
                <tr>
                  <td className="text-center" colSpan="2">No Item</td>
                </tr>
              </tbody>
            </Table>
          )
        } else {
          return (
            <Table size="sm">
              <tbody>
                <tr>
                  <td className="align-middle px-3">Title</td>
                  <td className="align-middle">{data[0].title}</td>
                </tr>
                <tr>
                  <td className="align-middle px-3">Category</td>
                  <td className="align-middle">{data[0].category}</td>
                </tr>
                <tr>
                  <td className="align-middle px-3">Format</td>
                  <td className="align-middle">{data[0].format}</td>
                </tr>
                <tr>
                  <td className="align-middle px-3">Price</td>
                  <td className="align-middle">{"$"+data[0].price}</td>
                </tr>
              </tbody>
            </Table>
          )
        } 
      }
      const ShowChart = ({data}) => {
        const myChart = useRef(null);
        useEffect(() => {
          var lineChart = new Chart(myChart.current, {
            type: 'line',
            data: {
              labels: data.map(d=>d.date),
              datasets: [{
                label: "BAR CHART",
                data: data.map(d=>d.price),
              }]
            }
          });
          console.log(data)
        }, []);
        
        return (
          <canvas className="inline-block align-bottom" ref={myChart} width="100%"></canvas>
        )
      }

      return (
        <React.Fragment>
          <Navigation page="#books" />
          <Container>
            <Row>
              <Col md="6">
                <Card border="primary">
                  <Card.Header className="bg-primary text-white">Book Detail</Card.Header>
                  <Card.Body className="px-0">
                    <BookDetail data={detail} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md="6">
                <ShowChart data={detail} />
              </Col>
            </Row>
            <Row>
            
            </Row>
          </Container>
          <Footer/>
        </React.Fragment>
      )
  }

  let page = content.page;
  
  switch(page) {
    case 'books':
      return <ShowBooks dataquery={content.query} />;
    case 'categories':
      return <ShowCategories />;
    case 'detail':
      return <ShowBooksDetail kode={content.kode} />;
    default:
      return <ShowHome />;
  }
}

export default App;
