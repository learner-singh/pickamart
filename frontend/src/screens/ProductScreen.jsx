import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import products from '../products'
import { Button, Card, Col, FormControl, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import Rating from '../components/Rating'
import axios from 'axios'
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch } from 'react-redux'
import { addToCart } from "../slices/cartSlice"

const ProductScreen = () => {
    const { id: productId } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [qty, setQty] = useState(1)
    // const [product, setProduct] = useState({})

    // useEffect(() => {
    //     fetchProductById()
    // }, [productId])

    // const fetchProductById = async () => {
    //     try {
    //         const response = await axios.get(`/api/products/${productId}`)
    //         if (response?.data) {
    //             setProduct(response.data)
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }

    // }

    // // const product = products.find((p) => p._id === productId)

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate("/cart")
    }

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>Go Back</Link>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant={"danger"}>{error?.data?.message || error?.error}</Message>
            ) : (
                <>
                    <Row>
                        <Col md={5}>
                            <Image src={product?.image} alt={product?.name} fluid />
                        </Col>
                        <Col md={4}>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <h3>{product?.name}</h3>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Rating value={product?.rating} text={`${product?.numReviews} reviews`} />
                                </ListGroupItem>
                                <ListGroupItem>
                                    Price: &#8377;{product?.price}
                                </ListGroupItem>
                                <ListGroupItem>
                                    Desciption: {product?.description}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>&#8377;{product?.price}</strong></Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                <strong>{product?.countInStock > 0 ? "In Stock" : "Out of Stock"}</strong></Col>
                                        </Row>
                                    </ListGroupItem>

                                    {product?.countInStock > 0 && (
                                        <ListGroupItem>
                                            <Row>
                                                <Col> Qty: </Col>
                                                <Col>
                                                    <FormControl
                                                        as='select'
                                                        value={qty}
                                                        onChange={(e) => setQty(Number(e?.target?.value))}
                                                    >
                                                        {[...Array(product.countInStock).keys()]?.map(o => (
                                                            <option key={o} value={o + 1} >{o + 1}</option>
                                                        ))}
                                                    </FormControl>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    )}

                                    <ListGroupItem>
                                        <Button
                                            className='btn-block'
                                            type='button'
                                            disabled={product?.countInStock === 0}
                                            onClick={addToCartHandler}
                                        >
                                            Add To Cart
                                        </Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default ProductScreen