import React from "react";
import {
  Badge,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavDropdown,
  NavLink,
} from "react-bootstrap";
import {
  FaClipboardList,
  FaShoppingBag,
  FaShoppingCart,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice.js";
import SearchBox from "./SearchBox.jsx";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state?.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiCall, { isLoading }] = useLogoutMutation();

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <NavbarBrand as={Link} to="/">
            <img src={logo} alt="logo" />
            PickaMart
          </NavbarBrand>
          <NavbarToggle aria-controls="basic-navbar-nav" />
          <NavbarCollapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <NavLink as={Link} to="/cart">
                <FaShoppingCart /> Cart
                {cartItems?.length > 0 && (
                  <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                    {cartItems?.reduce((acc, item) => acc + item?.qty, 0)}
                  </Badge>
                )}
              </NavLink>
              {userInfo ? (
                <NavDropdown title={userInfo?.name} id="username">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavLink as={Link} to="/login">
                  <FaUser /> Sign In
                </NavLink>
              )}
              {userInfo && userInfo?.isAdmin && (
                <NavDropdown title="Admin" id="adminMenu">
                  <NavDropdown.Item as={Link} to="/admin/productlist">
                    <FaShoppingBag /> Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    <FaUsers /> Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist">
                    <FaClipboardList /> Orders
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
