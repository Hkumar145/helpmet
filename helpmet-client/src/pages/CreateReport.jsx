import React, { useState } from 'react'
import { Combobox } from '@/components/ui/combobox'

const CreateReport = () => {
    const [selectedRecipients, setSelectedRecipients] = useState([]);

  const handleSelectRecipient = (recipient) => {
    if (!selectedRecipients.some((item) => item.email === recipient.email)) {
      setSelectedRecipients((prev) => [...prev, recipient]);
    }
  };

  const handleRemoveRecipient = (email) => {
    setSelectedRecipients((prev) =>
      prev.filter((recipient) => recipient.email !== email)
    );
  };

  return (
    <main>
      <h1 className="text-2xl font-semibold text-center my-7 text-white">New Injury Report</h1>
      <form className="flex flex-col">
        <input type="text" placeholder="Report ID" className="border p-3 rounded-lg" id="reportID" required />
        <Combobox onSelectRecipient={handleSelectRecipient} />
        <div className="mt-4 text-white">
          {selectedRecipients.length === 0 ? (
            <p>Please select recipient.</p>
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
      </form>
    </main>
  )
}

export default CreateReport