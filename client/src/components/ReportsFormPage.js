import { useEffect, useState } from "react";
import axios from "axios";
import AccountNavi from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function ReportsFormPage() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/account/reports/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setDescription(data.description);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-sm text-gray-500">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(header)}
      </>
    );
  }

  async function saveReport(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      description,
    };

    if (id) {
      await axios.put("/account/reports", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      await axios.post("/account/reports", placeData);
      setRedirect(true);
    }
  }

  async function deleteReport() {
    if (window.confirm("Are you sure you want to delete this place?")) {
      await axios.delete("/account/reports/" + id);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/reports"} />;
  }

  return (
    <div>
      <AccountNavi />
      <form className="px-40" onSubmit={savePlace}>
        {preInput(
          "Title",
          "title for your place, should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          placeholder="title, eg: my lovely apartment"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />

        {preInput("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />

        <div className="flex gap-3">
          <button
            className="rounded-2xl text-white  bg-red-500 mt-4"
            onClick={deletePlace}
          >
            Delete Report
          </button>
          <button className="primary mt-4"> Save </button>
        </div>
      </form>
    </div>
  );
}
