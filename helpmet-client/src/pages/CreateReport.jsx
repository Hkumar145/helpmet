import React, { useState } from 'react'
import { Combobox } from '@/components/ui/combobox'
import axios from '../api/axios';
import { useSelector } from 'react-redux';

const CreateReport = () => {
    const senderEmail = useSelector((state) => state.user.email);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [reportID, setReportID] = useState("");
    const [remark, setRemark] = useState("");

  const handleSelectRecipient = (recipient) => {
    if (!selectedRecipients.some((item) => item.email === recipient.email)) {
      setSelectedRecipients((prev) => [...prev, recipient]);
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
      <h1 className="text-2xl font-semibold text-center my-7 text-white">New Injury Report</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}> {/* onSubmit={handleSubmit} */}
        <input
          type="text"
          placeholder="Report ID"
          className="border p-3 rounded-lg"
          id="reportID"
          required
          value={reportID}
          onChange={(e) => setReportID(e.target.value)}
        />
        <p className='mt-4 text-white'>Select recipient:</p>
        <Combobox onSelectRecipient={handleSelectRecipient} />
        <div className="mt-4 text-white">
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
        <textarea placeholder="Remark" id="remark" cols="30" className='min-h-[6rem] max-h-[12rem]' value={remark} onChange={(e) => setRemark(e.target.value)}></textarea>
        <button
          type='submit'
          className='bg-slate-600 hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed'
        >
              Create & Send
        </button>
      </form>
    </main>
  )
}

export default CreateReport