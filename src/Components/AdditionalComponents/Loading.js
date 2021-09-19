import React from 'react'
import {Spinner} from 'react-bootstrap'

/**
 * Loading spinner
 * @param {*} param0 
 * @returns 
 */
export default function Loading({show}){

    return (

        <>
            {
                show ? (
                    <Spinner as="span" animation="border" variant="danger" size="sm"/>
                ) : (<></>)
            }
        </>
    )
}