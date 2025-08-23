import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import axios from 'axios'
import products from '../product'
import Product from '../components/Product'

const HomeScreen = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products')
            if (response?.data) {
                setProducts(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <h1>Latest Products</h1>
            <Row>
                {products?.map(product => (
                    <Col key={product?._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default HomeScreen