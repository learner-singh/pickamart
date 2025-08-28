import React from 'react'
import { useGetTopProductsQuery } from '../slices/productsApiSlice'
import Loader from './Loader'
import Message from './Message'
import { Carousel, CarouselCaption, CarouselItem, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ProductCarousel = () => {
    const {data: products, isLoading, error} = useGetTopProductsQuery()
  return isLoading ? <Loader /> : error ? <Message variant={"danger"}>{error}</Message>
  : (
    <Carousel pause="hover" className='bg-primary mb-4'>
        {products?.map(product => (
            <CarouselItem key={product?._id}>
                <Link to={`/produc/${product?._id}`}>
                <Image src={product?.image} alt={product?.name} fluid />
                <CarouselCaption className='carousel-caption'>
                    <h2>
                        {product?.name} &#8377;{product?.price}
                    </h2>
                </CarouselCaption>
                </Link>
            </CarouselItem>
        ))}

    </Carousel>
  )
}

export default ProductCarousel