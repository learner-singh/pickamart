import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
} from "../slices/ordersApislice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const {
    user,
    shippingAddress,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
    paymentMethod,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = order ?? {};

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal?.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !isPaid) {
        if (!window.paypal) {
          console.log("LOADING SCRIPT");
          loadPayPalScript();
        }
      }
    }
  }, [order, isPaid, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions?.order?.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment Successful.");
      } catch (err) {
        toast.error(err?.data?.message || err?.message);
      }
    });
  }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment Successful.");
  }
  function onError(err) {
    toast.error(err?.data?.message || err?.message);
  }
  
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: String(totalPrice),
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant={"danger"}>{error}</Message>
  ) : (
    <>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {user?.name}
              </p>
              <p>
                <strong>Email: </strong> {user?.email}
              </p>
              <p>
                <strong>Address: </strong>
                {shippingAddress?.address}, {shippingAddress?.city},{" "}
                {shippingAddress?.postalCode}, {shippingAddress?.country}
              </p>
              {isDelivered ? (
                <Message variant={"success"}>
                  Delivered on {deliveredAt}.
                </Message>
              ) : (
                <Message variant={"danger"}>Not Delivered.</Message>
              )}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong> {paymentMethod}
              </p>
              {isPaid ? (
                <Message variant={"success"}>Paid on {paidAt}.</Message>
              ) : (
                <Message variant={"danger"}>Not Paid.</Message>
              )}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Order Items</h2>
              <ListGroup>
                {orderItems?.map((item) => {
                  const {
                    name,
                    image,
                    product: productId,
                    qty,
                    price,
                  } = item ?? {};
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
                          {qty} x {price} = &#8377;
                          {Number(qty * price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroupItem>
                <h2>Order Summary</h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Items</Col>
                  <Col>&#8377;{itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#8377;{shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>&#8377;{taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>&#8377;{totalPrice}</Col>
                </Row>
              </ListGroupItem>

              {!isPaid && (
                <ListGroupItem>
                  {loadingPayPal && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button>
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroupItem>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
