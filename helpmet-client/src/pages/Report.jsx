import React from 'react'
import { Link } from 'react-router-dom'

const Report = () => {
  return (
    <div>
      <h1 className='text-white'>Report</h1>
      <Link className='bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95' to={"/create-report"}>
        New Report
      </Link>
    </div>
  )
}

export default Report