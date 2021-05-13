import React from 'react'
import FormCloseContact from './FormCloseContact'
import FormPossiblePositive from './FormPossiblePositive'
import '../css/CovidReportPage.css'

const CovidReportPage = () => {

    return (
        <div className="divisor">
            <FormCloseContact />
            <FormPossiblePositive />
        </div>
    )
}

export default CovidReportPage