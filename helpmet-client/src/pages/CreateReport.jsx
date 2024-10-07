import React from 'react'
import { Combobox } from '@/components/ui/combobox'

const CreateReport = () => {
  return (
    <main>
        <h1 className='text-2xl font-semibold text-center my-7'>New Injury Report</h1>
        <form className='flex flex-col'>
            <input type="text" placeholder='Report ID' className='border p-3 rounded-lg' id='reportID' required />
        </form>
        <Combobox />
    </main>
  )
}

export default CreateReport