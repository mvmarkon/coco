import React from 'react'
import FormCloseContact from './FormCloseContact'
import FormPossiblePositive from './FormPossiblePositive'
import NotifyReportCovid from '../Cases/ReportCovid'
import '../../css/Cases/CovidReportPage.css'
import '../../css/CoCo.css';

const CovidReportPage = () => {
    return (
        <div className="App-header">
            <h1>Reporte covid</h1>
            <div className="divisor">
                <FormCloseContact />
                <FormPossiblePositive />
            </div>
            <NotifyReportCovid/>
        </div>
    )
}

export default CovidReportPage