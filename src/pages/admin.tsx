import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [emails, setEmails] = useState("");

  const handleSendEmails = async () => {
    const emailList = emails.split(",").map((email) => email.trim());
    await axios.post("/api/availability-request", { emails: emailList });
  };

  return (
    <div>
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder="Enter emails, separated by commas"
      />
      <button onClick={handleSendEmails}>Send Emails</button>
    </div>
  );
}
