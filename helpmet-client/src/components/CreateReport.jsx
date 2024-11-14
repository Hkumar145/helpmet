import React, { useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DialogClose = DialogPrimitive.Close;

const CreateReport = ({ onSubmitSuccess }) => {
  const senderEmail = useSelector((state) => state.user.email);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [remark, setRemark] = useState("");
  const [currentSelection, setCurrentSelection] = useState(null);

  const handleSelectRecipient = (recipient) => {
    setCurrentSelection(recipient);
  };

  const handleAddRecipient = () => {
    if (
      currentSelection &&
      !selectedRecipients.some((item) => item.email === currentSelection.email)
    ) {
      setSelectedRecipients((prev) => [...prev, currentSelection]);
      setCurrentSelection(null);
    }
  };

  const handleRemoveRecipient = (email) => {
    setSelectedRecipients((prev) =>
      prev.filter((recipient) => recipient.email !== email)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    toast.info("Sending email...", {
      autoClose: 1000,
      className: "custom-toast-info",
      bodyClassName: "custom-toast-body",
    });

    try {
      await axios.post("/email/send-report-email", {
        selectedRecipients,
        senderEmail,
        remark,
      });
      setRemark("");
      setSelectedRecipients([]);
      onSubmitSuccess();
    } catch (error) {
      toast.error(`Failed to send email: ${error}`, {
        autoClose: 3000,
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    }
  };

  return (
    <main>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="remark" className="text-sm text-gray-700 mb-2">
          Select recipient:
        </label>
        <div className="flex items-center gap-2 -mt-4">
          <Combobox onSelectRecipient={handleSelectRecipient} />
          <button
            type="button"
            onClick={handleAddRecipient}
            // className="px-6 rounded text-black hover:cursor-pointer border"
            className="px-4 py-3 text-xs rounded border hover:bg-[#D9D6FE] hover:text-[#6938EF] hover:cursor-pointer mb-0"
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
              <div
                key={recipient.email}
                className="p-2 border rounded-md mb-2 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    name={recipient.firstName}
                    round={true}
                    size="40"
                    textSizeRatio={1.75}
                    style={{ cursor: "default" }}
                  />
                  <div className="text-xs">
                    <span className="font-bold">{`${recipient.firstName} • ${recipient.role}`}</span>
                    <p className="text-gray-500">{recipient.email}</p>
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
        <label htmlFor="remark" className="text-sm text-gray-700 mb-2">
          Additional notes (optional)
        </label>
        <textarea
          placeholder="Add a note..."
          id="remark"
          cols="30"
          className="min-h-[6rem] p-2 max-h-[12rem] border border-gray-200"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        ></textarea>
        <div className="flex flex-row justify-end gap-2 mt-4">
          <DialogClose asChild>
            <button className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0">
              Cancel
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button
              type="submit"
              // className="bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 disabled:opacity-40 disabled:cursor-not-allowed w-full"
              className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0"
            >
              Send Links
            </button>
          </DialogClose>
        </div>
      </form>
    </main>
  );
};

export default CreateReport;
