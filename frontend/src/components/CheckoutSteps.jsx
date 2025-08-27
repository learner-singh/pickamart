import React from 'react'
import { Nav, NavItem, NavLink } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <Nav className='justify-content-center mb-4'>
            <NavItem>
                {step1 ? (
                    <NavLink as={Link} to="/login">Sign In</NavLink>
                ) : (
                    <NavLink disabled>Sign In</NavLink>
                )}
            </NavItem>
            <NavItem>
                {step2 ? (
                    <NavLink as={Link} to="/shipping">Shipping</NavLink>
                ) : (
                    <NavLink disabled>Shipping</NavLink>
                )}
            </NavItem>
            <NavItem>
                {step3 ? (
                    <NavLink as={Link} to="/payment">Payment</NavLink>
                ) : (
                    <NavLink disabled>Payment</NavLink>
                )}
            </NavItem>
            <NavItem>
                {step4 ? (
                    <NavLink as={Link} to="/placeorder">Place Order</NavLink>
                ) : (
                    <NavLink disabled>Place Order</NavLink>
                )}
            </NavItem>
        </Nav>
    )
}

export default CheckoutSteps