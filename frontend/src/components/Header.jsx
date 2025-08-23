import React from 'react'
import { Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, NavLink } from "react-bootstrap";
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';

const Header = () => {
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