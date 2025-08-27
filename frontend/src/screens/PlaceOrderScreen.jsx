import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import Message from '../components/Message'
import { addDecimals } from '../utils/cartUtils'
import { useCreateOrderMutation } from '../slices/ordersApislice.js'
import Loader from '../components/Loader'
import { clearCartItems } from '../slices/cartSlice'
import { toast } from 'react-toastify'

const PlaceOrderScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart ?? {}

    const [createOrder, { isLoading, error }] = useCreateOrderMutation()

    useEffect(() => {
        if (!shippingAddress?.address) {
            navigate("/shipping")
        } else if (!paymentMethod) {
            navigate("/payment")
        }
    }, [shippingAddress.address, paymentMethod, navigate])

    const placeOrderHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await createOrder({
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice
            })
            dispatch(clearCartItems())
            console.log("res", res)
            navigate(`/order/${res?.data?._id}`)
        } catch (error) {
            toast.error(error)
        }
    }
    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {shippingAddress?.address},{" "}
                                {shippingAddress?.city},{" "}
                                {shippingAddress?.postalCode},{" "}
                                {shippingAddress?.country}.
                            </p>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Order Items</h2>
                            {cartItems?.length === 0 ? (
                                <Message>Your cart is empty.</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {cartItems?.map((item) => {
                                        const { name, image, product: productId, qty, price } = item ?? {}
                                        return (
                                            <ListGroupItem key={name}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={image} alt={name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${productId}`}>{name}</Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {qty} x {price} = &#8377;{Number(qty * price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                        )
                                    })}
                                </ListGroup>
                            )}
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <h2>Order Summary</h2>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>&#8377;{itemsPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>&#8377;{shippingPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>&#8377;{taxPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>&#8377;{totalPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            {error && <Message variant="danger">{error}</Message>}
                            <ListGroupItem>
                                <Button
                                    type='button'
                                    className='btn-bloct'
                                    disabled={cartItems?.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                                {isLoading && <Loader />}
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen