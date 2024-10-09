import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import CreateReport from '../components/CreateReport'

const Report = () => {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-white'>Reports</h1>
      <Dialog>
        <DialogTrigger asChild>
          <button className='bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95'>
            New Report
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>New Incident Report</DialogTitle>
          <DialogDescription>Create a incident report and add the relavant people to send the report to fill out</DialogDescription>
          <CreateReport />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Report