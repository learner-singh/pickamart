import React, { useEffect, useState } from "react";
import { Form, Link, useNavigate, useParams } from "react-router-dom";
import products from "../products";
import {
  Button,
  Card,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
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

  const {
    data: product,
    refetch,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createReview({ productId, rating, comment }).unwrap();
      if (res?.error) {
        toast.error(res?.err?.data?.message);
      } else {
        refetch();
        toast.success("Review submitted.");
        setRating(0);
        setComment("");
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          {/* <Meta title={product?.name} /> */}
          <Row>
            <Col md={5}>
              <Image src={product?.image} alt={product?.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h3>{product?.name}</h3>
                </ListGroupItem>
                <ListGroupItem>
                  <Rating
                    value={product?.rating}
                    text={`${product?.numReviews} reviews`}
                  />
                </ListGroupItem>
                <ListGroupItem>Price: &#8377;{product?.price}</ListGroupItem>
                <ListGroupItem>
                  Desciption: {product?.description}
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>&#8377;{product?.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product?.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroupItem>

                  {product?.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col> Qty: </Col>
                        <Col>
                          <FormControl
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e?.target?.value))}
                          >
                            {[...Array(product.countInStock).keys()]?.map(
                              (o) => (
                                <option key={o} value={o + 1}>
                                  {o + 1}
                                </option>
                              )
                            )}
                          </FormControl>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}

                  <ListGroupItem>
                    <Button
                      className="btn-block"
                      type="button"
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
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {product?.reviews?.length === 0 && <Message>No reviews</Message>}
              <ListGroup variant="flush">
                {product?.reviews?.map((review) => (
                  <ListGroupItem key={review?._id}>
                    <strong>{review?.name}</strong>
                    <Rating value={review?.rating} />
                    <p>{review?.createdAt?.substring(0, 10)}</p>
                    <p>{review?.comment}</p>
                  </ListGroupItem>
                ))}
                <ListGroupItem>
                  <h2>Writw a Customer Review</h2>
                  {loadingProductReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <FormGroup controlId="rating" className="my-2">
                        <FormLabel>Rating</FormLabel>
                        <FormControl
                          as={"select"}
                          value={rating}
                          onChange={(e) => setRating(Number(e?.target?.value))}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </FormControl>
                      </FormGroup>
                      <FormGroup controlId="comment" className="my-2">
                        <FormLabel>Comment</FormLabel>
                        <FormControl
                          type="textarea"
                          row={3}
                          value={comment}
                          onChange={(e) => setComment(e?.target?.value)}
                        ></FormControl>
                      </FormGroup>
                      <Button
                        type="submit"
                        disabled={loadingProductReview}
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">Sign In</Link> to write a review.
                    </Message>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
