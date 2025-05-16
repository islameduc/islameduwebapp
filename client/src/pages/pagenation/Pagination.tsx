
import React from 'react'
import './pagination.css'

type Props = {
    totalPosts: number,
    postsPerPage: number,
    setCurrentPage: (page: number) => void,
    currentPage: number,
}

export default function Pagination({ totalPosts, postsPerPage, setCurrentPage, currentPage }: Props) {
    const pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        if (Math.ceil(totalPosts / postsPerPage) === 1) {
            pages.push()
        } else {
            pages.push(i);
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const goToNextPage = () => {
        if (currentPage < pages.length) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <div className='pagination'>
            { !(Math.ceil(totalPosts / postsPerPage) === 1)?
             <>
            <button onClick={goToPreviousPage} className="arrow-button">←</button>
            {
                pages.map((page, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(page)}
                            className={page == currentPage ? 'active' : ''}
                        >
                            {page}
                        </button>
                    )
                })
            }
            <button onClick={goToNextPage} className="arrow-button">→</button>
            </>: <div></div>}
        </div>
    )
}