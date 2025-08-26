import React from 'react'
import { Badge, Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, NavLink } from "react-bootstrap";
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart)
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <NavbarBrand as={Link} to="/">
                        <img src={logo} alt="logo" />
                        PickaMart
                    </NavbarBrand>
                    <NavbarToggle aria-controls='basic-navbar-nav' />
                    <NavbarCollapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            <NavLink as={Link} to="/cart" >
                                <FaShoppingCart /> Cart
                                {cartItems?.length > 0 && (
                                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                                        {cartItems?.reduce((acc, item) => acc + item?.qty, 0)}
                                    </Badge>
                                )}
                            </NavLink>
                            <NavLink as={Link} to='/login'>
                                <FaUser /> Sign In
                            </NavLink>
                        </Nav>
                    </NavbarCollapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header