import React, { useState } from 'react'
import { Combobox } from '@/components/ui/combobox'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import axios from '../api/axios';
import { useSelector } from 'react-redux';

const DialogClose = DialogPrimitive.Close

const CreateReport = () => {
  const senderEmail = useSelector((state) => state.user.email);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [reportID, setReportID] = useState("");
  const [remark, setRemark] = useState("");
  const [currentSelection, setCurrentSelection] = useState(null);

  const handleSelectRecipient = (recipient) => {
    setCurrentSelection(recipient);
  };

  const handleAddRecipient = () => {
    if (currentSelection && !selectedRecipients.some((item) => item.email === currentSelection.email)) {
      setSelectedRecipients((prev) => [...prev, currentSelection]);
      setCurrentSelection(null);
    }
  };

  const handleRemoveRecipient = (email) => {
    setSelectedRecipients((prev) => prev.filter((recipient) => recipient.email !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportID || selectedRecipients.length === 0) {
      alert('Please enter a Report ID and select at least one recipient');
      return;
    }

    try {
      await axios.post("/email/send-report-email", {
        selectedRecipients,
        reportID,
        senderEmail,
        remark
      });
      alert("Injury report email sent to selected recipients.");
      setReportID("");
      setRemark("");
      setSelectedRecipients([]);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  return (
    <main>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Report ID"
          className="border p-3 rounded-lg"
          id="reportID"
          required
          value={reportID}
          onChange={(e) => setReportID(e.target.value)}
        />
        <p className='mt-4'>Select recipient:</p>
        <div className="flex items-center gap-4">
          <Combobox onSelectRecipient={handleSelectRecipient} />
          <button
            type="button"
            onClick={handleAddRecipient}
            className="px-6 rounded text-black hover:cursor-pointer border"
            disabled={!currentSelection}
          >
            Add
          </button>
        </div>
        <div className="mt-4">
          {selectedRecipients.length === 0 ? (
            <div />
          ) : (
            selectedRecipients.map((recipient) => (
              <div key={recipient.email} className="p-2 border rounded mb-2 flex items-center">
                <span>{`${recipient.firstName} - ${recipient.email}`}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRecipient(recipient.email)}
                  className="ml-2 my-auto text-red-500 hover:underline"
                >
                  remove
                </button>
              </div>
            ))
          )}
        </div>
        <textarea placeholder="Remark" id="remark" cols="30" className='min-h-[6rem] max-h-[12rem] border' value={remark} onChange={(e) => setRemark(e.target.value)}></textarea>
        <div className='flex flex-row justify-between gap-4'>
          <DialogClose asChild>
            <button
              type="button"
              className="text-black border px-6"
            >
              Close
            </button>
          </DialogClose>
          <button
            type='submit'
            className='bg-slate-600 hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed w-full'
          >
                Send Links
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateReport