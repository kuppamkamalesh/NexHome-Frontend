import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Axios from "axios";
import "./sell.css";
import { useSelector } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase";

function Sell() {
  const [Type, setType] = useState("");
  const [to, setTo] = useState("");
  const [name, setName] = useState("");
  const [Location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [rooms, setRooms] = useState(0);

  const [files, setFiles] = useState([]);
  // const [link, setLink] = useState("");
  const [linkarr, setLinkarr] = useState([]);
  const [mobile, setMobile] = useState(0);
  const [mail, setMail] = useState("");
  const [cost, setCost] = useState(0);
  const [info, setInfo] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  // const currentU

  // console.log(files);
  // function handleImage(e) {
  //   if (files.length > 0 && files.length < 7) {
  //   }
  // }

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          console.log(urls);
          setLinkarr([...linkarr, ...urls]);
          document.getElementById(
            "msg"
          ).innerHTML = `<p class="text-success">Uploded Sucssfully</p>`;
        })
        .catch((err) => {
          console.log(err);
          document.getElementById(
            "msg"
          ).innerHTML = `<p class="text-danger">Something happend Upload once again</p>`;
        });
    } else {
      document.getElementById(
        "msg"
      ).innerHTML = `<p class="text-danger"> You have to upload atleast one image or You can only upload 6 images per listing</p>`;
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const arr = [
    Type,
    to,
    name,
    Location,
    bedrooms,
    bathrooms,
    rooms,
    linkarr,
    mobile,
    mail,
    cost,
    info,
  ];

  // Posting into MongoDb

  const handleSubmit = (e) => {
    // e.prevetDefault();
    e.preventDefault();

    // alert("creating a record");

    const data = {
      Type: arr[0],
      to: arr[1],
      name: arr[2],
      Location: arr[3],
      bedrooms: arr[4],
      bathrooms: arr[5],
      rooms: arr[6],
      linkarr: arr[7],
      mobile: arr[8],
      mail: arr[9],
      cost: arr[10],
      info: arr[11],
    };
    Axios.post("https://nexhome-backend.onrender.com/sell/create-sell", data)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          // alert("Successful");
          document.getElementById(
            "status"
          ).innerHTML = `<p class="text-success">Uploded Successfully</p>`;
        } else {
          Promise.reject();
        }
      })
      .then(() => {
        Axios.patch(
          `https://nexhome-backend.onrender.com/nexHome/updateSellData/${currentUser._id}`,
          data
        );
      })

      .catch((err) => {
        // alert(err);
        document.getElementById(
          "status"
        ).innerHTML = `<p class="text-success">Something Happend Upload once again</p>`;
      });
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#faf9e3 ",
        paddingTop: "100px",
      }}
    >
      <div className="seller">
        <NavBar />
        {/* <img src="../../Images/sell.jpg" alt="sell" /> */}
        <h1>Discribe about your property Here</h1>
        <form onSubmit={handleSubmit}>
          <div className="radio-inputs ">
            <div>
              <label className="name" style={{ fontWeight: "normal" }}>
                You are Here to
              </label>
              <label>
                <input
                  onClick={() => {
                    setTo("Sell");
                  }}
                  type="radio"
                  name="to"
                  className="radio_input"
                />
                <span className="name" style={{ fontWeight: "normal" }}>
                  Sell
                </span>
              </label>

              <label>
                <input
                  onClick={() => {
                    setTo("Rent");
                  }}
                  className="radio_input"
                  name="to"
                  type="radio"
                />
                <span className="name" style={{ fontWeight: "normal" }}>
                  Rent
                </span>
              </label>
            </div>
          </div>

          <div className="radio-inputs">
            <div>
              <label>Select your property type</label>

              <label>
                <input
                  onClick={() => {
                    setType("Flat");
                  }}
                  name="type"
                  type="radio"
                  className="radio_input"
                />
                <span>Flat</span>
              </label>

              {/* Single House */}
              <label className="radio_label">
                <input
                  onClick={() => {
                    setType("House");
                  }}
                  name="type"
                  type="radio"
                  className="radio_input"
                  checked={Type === "House"}
                />
                <span>House</span>
              </label>

              {/* Shop */}
              <label className="radio_label">
                <input
                  onClick={() => {
                    setType("Shop");
                  }}
                  name="type"
                  type="radio"
                  className="radio_input"
                />
                <span>Shop</span>
              </label>
            </div>
          </div>

          <div className="about-property">
            <img src="../../Images/city.jpg" alt="img" />
            <div className="city-location">
              <h2>Tell Us about your city and Location</h2>
              <div className="name" style={{ fontWeight: "normal" }}>
                <label>Enter Your name:</label>
                <input
                  placeholder="Enter your name"
                  type="text"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                ></input>
              </div>

              <div className="Location">
                {/* Location */}
                <label>Enter the City : </label>
                <input
                  onChange={(event) => {
                    setLocation(event.target.value);
                    // console.log(Location);
                  }}
                  type="text"
                  placeholder="Enter the City "
                />
              </div>
            </div>
          </div>

          <div className="house-details">
            <div className="city-location">
              <div className="Bedrooms">
                <label>Enter no.of Bedrooms :</label>
                <input
                  onChange={(event) => {
                    setBedrooms(event.target.value);
                  }}
                  type="number"
                  placeholder="No.of bedrooms"
                />
              </div>
              <div className="Bathrooms">
                <label>Enter no.of bathrooms :</label>
                <input
                  onChange={(event) => {
                    setBathrooms(event.target.value);
                  }}
                  type="number"
                  placeholder="No.of bathrooms"
                />
              </div>

              <div className="room">
                <label>Enter total no.of rooms</label>
                <input
                  type="number"
                  onChange={(e) => {
                    setRooms(e.target.value);
                  }}
                ></input>
              </div>
            </div>
            <img src="../../Images/interior.jpg" alt="img" />
          </div>

          <div className="contact-details">
            <img src="../../Images/contact.jpg" alt="img" />
            <div className="city-location">
              <div className="Mobile">
                <label>Enter Contact Details :</label>
                <input
                  onChange={(event) => {
                    setMobile(event.target.value);
                  }}
                  type="tel"
                  placeholder="Enter your contact details"
                />
              </div>

              <div>
                <label>Enter Mail id :</label>
                <input
                  onChange={(e) => {
                    setMail(e.target.value);
                  }}
                  type="email"
                />
              </div>

              <div className="cost">
                {/* Cost of property */}
                <label>Enter Cost :</label>
                <input
                  onChange={(e) => {
                    setCost(e.target.value);
                  }}
                  type="number"
                  placeholder="Enter Cost"
                />
              </div>
            </div>
          </div>

          <div className="house-pics">
            <div className="photos d-flex flex-column p-2">
              <label>
                Images :
                <span className="text-muted ms-2">
                  The first image will be cover (max:6 and size should be less
                  than 2mb)
                </span>
              </label>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <input
                  onChange={(e) => {
                    setFiles(e.target.files);
                  }}
                  style={{
                    width: "80%",
                    paddingBottom: "33px",
                  }}
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />

                <button
                  type="button"
                  onClick={handleImageSubmit}
                  className="btn btn-secondary"
                >
                  Upload
                </button>
              </div>
              <div id="msg"></div>
            </div>
            {/* Break */}

            <div className="information">
              <label>Discribe additional information :</label>
              <textarea
                onChange={(e) => {
                  setInfo(e.target.value);
                }}
                rows={5}
                cols={25}
              ></textarea>
            </div>
          </div>

          <div className="login-button">
            <button
              type="submit"
              onClick={() => {
                console.log(arr);
              }}
            >
              Upload
            </button>
          </div>
          <div id="status"></div>
        </form>
      </div>
    </div>
  );
}
export default Sell;
