import React from 'react'
import FormCloseContact from './FormCloseContact'
import FormPossiblePositive from './FormPossiblePositive'
import NotifyReportCovid from './NotifyReportCovid'
import '../css/CovidReportPage.css'

const CovidReportPage = () => {

    return (
        <>
        <h1>Reporte covid</h1>
        <div className="divisor">
            <FormCloseContact />
            <FormPossiblePositive />
        </div>
        <NotifyReportCovid/>
        </>
    )
}

export default CovidReportPage