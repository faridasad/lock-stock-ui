import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import "./create.scss";

const Create = () => {
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    image: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [statusText, setStatusText] = useState("")
  const navigate = useNavigate();

  const generateImage = async () => {
    if (!form.prompt || isGenerating) return;

    try {
      setIsGenerating(true);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/dalle`,
        {
          prompt: form.prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      if (data) {
        setForm({ ...form, image: `data:image/jpeg;base64,${data.image}` });
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const sharePost = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.prompt || !form.image) return;

    try {
      setIsSharing(true);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/create`,
        {
          name: form.name,
          prompt: form.prompt,
          image: form.image,
        },
        {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );
      
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <section className="create">
      <div className="wrapper">
        <h2>GENERATE IMAGE</h2>

        <form className="post-form" onSubmit={sharePost}>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="image-form">
            <input
              onChange={(e) => {
                setForm({ ...form, prompt: e.target.value });
              }}
              type="text"
              placeholder="Describe your image as you want to"
            />
            <button
              type="button"
              disabled={isGenerating}
              onClick={generateImage}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>

          <div className="image-con">
            {!isGenerating ? (
              <img
                draggable="false"
                src={form.image || "https://via.placeholder.com/1024x1024"}
              />
            ) : (
              <Loader />
            )}
          </div>

          <button type="submit" disabled={isSharing}>
            {isSharing ? "Sharing" : "Share"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Create;
