import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer'
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

const RegisterScreen = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get("redirect") || "/"


    const [register, { isLoading }] = useRegisterMutation()
    const { userInfo } = useSelector(state => state.auth)

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        if(password !== confirmPassword) {
            toast.error("Passwords do not match")
            return;
        }
        try {
            const res = await register({ name, email, password }).unwrap()
            dispatch(setCredentials({ ...res }))
            navigate(redirect)
        } catch (error) {
            toast.error(error?.data?.message || error?.error)
        }
    }

    return (
        <FormContainer>
            <h1>Register</h1>

            <Form onSubmit={submitHandler}>
            <FormGroup controlId='name' className='my-3'>
                    <FormLabel>Name</FormLabel>
                    <FormControl
                        type='name'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></FormControl>
                </FormGroup>
                <FormGroup controlId='email' className='my-3'>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></FormControl>
                </FormGroup>
                <FormGroup controlId='password' className='my-3'>
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></FormControl>
                </FormGroup>
                <FormGroup controlId='confirmPassword' className='my-3'>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></FormControl>
                </FormGroup>
                <Button
                    type='submit'
                    variant='primary'
                    className='mt-2'
                    disabled={isLoading}
                >
                    Register
                </Button>
                {isLoading && <Loader />}
            </Form>

            <Row className='py-3'>
                <Col>
                    Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen