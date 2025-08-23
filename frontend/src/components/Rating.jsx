import React from 'react'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

const Rating = ({ value = 0, text = '', max = 5 }) => {
    const getStarIcon = (index) => {
        if (value >= index + 1) return <FaStar />
        if (value >= index + 0.5) return <FaStarHalfAlt />
        return <FaRegStar />
    }

    return (
        <div className='rating'>
            {[...Array(max)].map((_, i) => (
                <span key={i}>{getStarIcon(i)}</span>
            ))}
            {text && <span className='rating-text'>{text}</span>}
        </div>
    )
}

export default Rating
