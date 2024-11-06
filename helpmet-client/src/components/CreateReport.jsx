import React, { useState } from 'react'
import { Combobox } from '@/components/ui/combobox'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';

const DialogClose = DialogPrimitive.Close

const CreateReport = () => {
  const senderEmail = useSelector((state) => state.user.email);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
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
    if (selectedRecipients.length === 0) {
      alert('Please select at least one recipient');
      return;
    }

    try {
      await axios.post("/email/send-report-email", {
        selectedRecipients,
        senderEmail,
        remark
      });
      alert("Injury report email sent to selected recipients.");
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
              <div key={recipient.email} className="p-2 border rounded mb-2 flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <Avatar
                      name={recipient.firstName}
                      round={true}
                      size="40"
                      textSizeRatio={1.75}
                      style={{ cursor: 'default' }}
                    />
                  <div className='text-xs'>
                    <span className='font-bold'>{`${recipient.firstName} • ${recipient.role}`}</span>
                    <p className='text-gray-500'>{recipient.email}</p>
                  </div>
                  
                </div>
                
                <button
                  type="button"
                  onClick={() => handleRemoveRecipient(recipient.email)}
                  className="ml-2 my-auto text-red-500 hover:underline text-xs"
                >
                  Remove
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
            className='bg-slate-600 text-white hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed w-full'
          >
                Send Links
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateReport