import React, { useState, useEffect } from "react";
import TextareaAutosize from "react-autosize-textarea";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import {
  FiCheckSquare,
  FiPlus,
  FiX,
  FiTrash,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { AiFillFacebook, AiOutlineCloudSync } from "react-icons/ai";
import {
  MdCloudDone,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Slide from "@material-ui/core/Slide";
import moment from "moment";

import { FACEBOOK_ID } from "../../.env.json";
import api from "../../services/api";

import "./styles.css";
import ProfileImage from "../../assets/Profile.png";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Notes() {
  const [user, setUser] = useState({
    photoUrl: ProfileImage,
    guest: true,
  });
  const [notes, setNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [selected, setSelected] = useState("");
  const [hovering, setHovering] = useState("");
  const [profileModal, setProfileModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [toDos, setToDos] = useState([]);

  const [saveRequest, setSaveRequest] = useState({
    request: false,
    lastSave: new Date().toLocaleTimeString("pt-BR"),
  });
  const history = useHistory();
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("Theme"));
    if (theme) setDarkTheme(theme);
    const userData = JSON.parse(localStorage.getItem("User"));

    async function loadNotes(id) {
      const response = await api.get("/notes", {
        headers: {
          Authorization: id,
        },
      });
      setNotes(response.data);
    }

    if (userData) {
      loadNotes(userData.id);
      loadUser(userData);
    } else {
      const notes = JSON.parse(localStorage.getItem("Notes"));
      if (notes) {
        setNotes(notes);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSave();
    }, 10000);
    return () => clearInterval(interval);
  });

  async function loadUser(data) {
    const facebookapi = axios.create();
    const photo = await facebookapi.get(
      `https://graph.facebook.com/v7.0/${data.id}/picture?redirect=0&height=200&type=large&width=200`
    );
    data.photoUrl = photo.data.data.url;
    setUser(data);
  }

  async function handleSave() {
    if (saveRequest.request) {
      if (user.guest) {
        localStorage.setItem("Notes", JSON.stringify(notes));
      } else {
        await api.post(
          "/sync",
          { notes: notes, deleted: deletedNotes },
          {
            headers: {
              Authorization: user.id,
            },
          }
        );
        setDeletedNotes([]);
      }
      var saved_at = new Date().toLocaleTimeString("pt-BR");

      setSaveRequest({ request: false, lastSave: saved_at });
    }
  }

  function handleSelection(note) {
    if (selected !== note.id) {
      setSelected(note.id);
      setTitle(note.title);
      setDescription(note.description);
      setToDos(note.toDos);
      handleSave();
    }
  }

  function handleNewNote(e) {
    e.preventDefault();
    var created_at = moment().utcOffset("-03:00").format("HH:mm:ss DD/MM/YY");
    const id =
      Date.now().toString() +
      (Math.floor(Math.random() * (9999999999 - 10000 + 1)) + 10000).toString();
    const newNote = {
      id,
      title: "",
      description: "",
      toDos: [],
      created_at,
      updated_at: created_at,
    };
    setNotes([...notes, newNote]);
    handleSelection(newNote);
    setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
  }

  function handleDeleteNote() {
    if (window.confirm("Tem certeza que deseja deletar essa anotação?")) {
      const newNotes = notes.filter((note) => note.id !== selected);
      setDeletedNotes([...deletedNotes, selected]);
      setNotes(newNotes);
      setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
      setSelected("");
    }
  }

  function handleEditTitle(text) {
    var newNotes = notes;
    var updated_at = moment().utcOffset("-03:00").format("HH:mm:ss DD/MM/YY");
    newNotes.forEach((note) => {
      if (note.id === selected) {
        note.title = text;
        note.updated_at = updated_at;
      }
    });
    setNotes([...newNotes]);
    setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
  }

  function handleEditDescription(text) {
    var newNotes = notes;
    var updated_at = moment().utcOffset("-03:00").format("HH:mm:ss DD/MM/YY");
    newNotes.forEach((note) => {
      if (note.id === selected) {
        note.description = text;
        note.updated_at = updated_at;
      }
    });
    setNotes([...newNotes]);
    setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
  }

  function handleEditToDos(array) {
    var newNotes = notes;
    var updated_at = moment().utcOffset("-03:00").format("HH:mm:ss DD/MM/YY");
    newNotes.forEach((note) => {
      if (note.id === selected) {
        note.toDos = array;
        note.updated_at = updated_at;
      }
    });
    setNotes([...newNotes]);
    setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
  }

  function handleAddToDo(e) {
    e.preventDefault();
    if (toDos.length < 20) {
      const id =
        Date.now().toString() +
        (
          Math.floor(Math.random() * (9999999999 - 10000 + 1)) + 10000
        ).toString();
      setToDos([...toDos, { id, label: "", checked: false }]);
      setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
      handleEditToDos(toDos);
    } else {
      alert("Número máximo de tarefas atingido.");
    }
  }

  function handleChangeLabel(text, id) {
    var array = toDos;
    array[id].label = text;
    setToDos([...array]);
    setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
    handleEditToDos(toDos);
  }

  function handleChangeCheck(id) {
    var array = toDos;
    array[id].checked = !array[id].checked;
    setToDos([...array]);
    setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
    handleEditToDos(toDos);
  }

  function handleDeleteToDo(id) {
    var array = toDos.filter((todo, index) => index !== id);
    setToDos(array);
    setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
    handleEditToDos(array);
  }

  function switchModal() {
    setProfileModal(!profileModal);
  }

  async function Login(data) {
    const props = {
      id: data.id,
      name: data.name,
      email: data.email,
    };
    try {
      await api.post("/users", props);
      localStorage.setItem("User", JSON.stringify(props));
      loadUser(props);

      const response = await api.get("/notes", {
        headers: {
          Authorization: data.id,
        },
      });
      var newNotes = [...notes, ...response.data];
      const unique = newNotes
        .map((e) => e["id"])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter((e) => newNotes[e])
        .map((e) => newNotes[e]);
      setNotes(unique);
      localStorage.removeItem("Notes");
      setSaveRequest({ request: true, lastSave: saveRequest.lastSave });
      history.replace("/notes");
    } catch (err) {
      console.log(err);
    }
  }

  function Loggout(e) {
    e.preventDefault();
    localStorage.removeItem("User");
    setUser({
      photoUrl: ProfileImage,
      guest: true,
    });
    setNotes([]);
    history.push("/");
  }

  async function DeleteAccount(e) {
    e.preventDefault();
    if (
      window.confirm("Tem certeza que deseja APAGAR a conta e todas anotações?")
    ) {
      await api.delete(`/users/${user.id}`);
      localStorage.clear();
      history.push("/");
    }
  }

  function showDeleteButton(id) {
    setHovering(id);
  }

  function hideDeleteButton() {
    setHovering("");
  }

  function handleThemeSwitch() {
    localStorage.setItem("Theme", !darkTheme);
    setDarkTheme(!darkTheme);
  }

  async function HandleHideSideBar() {
    const SideBar = document.querySelector(".SideBar");
    const HideButton = document.querySelector(".HideSideBar");
    const NoteContainer = document.querySelector(".NoteContainer");
    const ArrowRight = document.querySelector("#ArrowRight");
    const ArrowLeft = document.querySelector("#ArrowLeft");
    if (SideBar.style.display === "none") {
      HideButton.style.left = "15%";
      NoteContainer.style.marginLeft = "15vw";
      ArrowLeft.style.display = "block";
      ArrowRight.style.display = "none";
      SideBar.style.display = "block";
      SideBar.animate(
        [{ transform: "translateX(0px)" }, { transform: "translateX(-15vw)" }],
        {
          duration: 200,
          iterations: 1,
          direction: "reverse",
        }
      );
    } else {
      HideButton.style.left = "0";
      NoteContainer.style.marginLeft = "0";
      ArrowRight.style.display = "block";
      ArrowLeft.style.display = "none";
      SideBar.animate(
        [{ transform: "translateX(0px)" }, { transform: "translateX(-15vw)" }],
        {
          duration: 200,
          iterations: 1,
        }
      ).onfinish = () => {
        SideBar.style.display = "none";
      };
    }
  }

  return (
    <div
      className="Container"
      style={darkTheme ? { backgroundColor: "#121212" } : {}}
    >
      <Dialog
        className="ProfileModal"
        TransitionComponent={Transition}
        onClose={switchModal}
        open={profileModal}
      >
        <button onClick={switchModal} className="CloseModal">
          <FiX className="CloseModalIcon" size={24} />
        </button>
        <div
          style={user.guest ? { display: "flex" } : {}}
          className={
            darkTheme ? "ModalContainerLoginDark" : "ModalContainerLogin"
          }
        >
          <img src={user.photoUrl} alt="ProfileImage" />
          <h1>Faça Login</h1>
          <span>
            - Sincronize suas anotações com o app mobile. <br />- Acesse suas
            anotações de qualquer lugar.
          </span>
          <FacebookLogin
            appId={FACEBOOK_ID}
            fields="name,email"
            language="pt_BR"
            callback={Login}
            render={(renderProps) => (
              <button className="LoginButton" onClick={renderProps.onClick}>
                <AiFillFacebook className="FBIcon" size={32} color="#fff" />
                <p>Login com o Facebook</p>
              </button>
            )}
          />
        </div>
        <div
          style={user.guest ? {} : { display: "flex" }}
          className={
            darkTheme ? "ModalContainerLoggedDark" : "ModalContainerLogged"
          }
        >
          <img src={user.photoUrl} alt="ProfileImage" />
          <h1>{user.name}</h1>
          <span>{user.email}</span>
          <button onClick={DeleteAccount} className="ModalDelete">
            <FiTrash className="ModalDeleteIcon" size={20} />
            <p>Deletar Conta</p>
          </button>
          <button onClick={Loggout} className="ModalLoggout">
            <FiLogOut className="ModalLoggoutIcon" size={20} />
            <p>Sair</p>
          </button>
        </div>
      </Dialog>
      <div className={darkTheme ? "HeaderDark" : "Header"}>
        <button onClick={switchModal} className="ProfileButton">
          <img src={user.photoUrl} alt="ProfileImage" />
          <h1 style={darkTheme ? { color: "#eee" } : {}}>
            {user.guest ? "Login" : user.name}
          </h1>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleThemeSwitch();
          }}
          className="ThemeSwitch"
        >
          <FiSun
            style={darkTheme ? { display: "flex" } : { display: "none" }}
            color="#eee"
            size={22}
          />
          <FiMoon
            style={darkTheme ? { display: "none" } : { display: "flex" }}
            color="#da552f"
            size={22}
          />
        </button>
        <div className="SaveContainer">
          <p
            style={
              saveRequest.request
                ? darkTheme
                  ? { display: "flex", color: "#eee" }
                  : { display: "flex" }
                : { display: "none" }
            }
          >
            Último Salvamento:
          </p>
          <span
            style={
              saveRequest.request
                ? darkTheme
                  ? { display: "flex", color: "#aaa" }
                  : { display: "flex" }
                : { display: "none" }
            }
          >
            {saveRequest.lastSave}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
            style={
              saveRequest.request ? { display: "flex" } : { display: "none" }
            }
          >
            <AiOutlineCloudSync size={26} />
          </button>
          <p
            style={
              saveRequest.request
                ? { display: "none" }
                : darkTheme
                ? { display: "flex", color: "#eee" }
                : { display: "flex" }
            }
          >
            Salvo
          </p>
          <MdCloudDone
            style={
              saveRequest.request ? { display: "none" } : { display: "flex" }
            }
            size={25}
          />
        </div>
        <button
          style={
            selected === ""
              ? { display: "none" }
              : darkTheme
              ? { color: "#eee" }
              : {}
          }
          onClick={(e) => {
            handleAddToDo(e);
          }}
          className="AddToDoButton"
        >
          <FiPlus size={22} />
          <FiCheckSquare size={22} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleDeleteNote();
          }}
          style={
            selected === ""
              ? { display: "none" }
              : darkTheme
              ? { color: "#eee" }
              : {}
          }
          className="DeleteNote"
        >
          <FiTrash size={22} />
        </button>
      </div>
      <div className="HideSideBar">
        <button
          onClick={HandleHideSideBar}
          className={darkTheme ? "HideSideBarButtonDark" : "HideSideBarButton"}
        >
          <MdKeyboardArrowRight
            id="ArrowRight"
            style={{ display: "none" }}
            size={35}
          />
          <MdKeyboardArrowLeft id="ArrowLeft" size={35} />
        </button>
      </div>
      <div
        className="SideBar"
        style={darkTheme ? { backgroundColor: "#2a2a2a" } : {}}
      >
        <div className="AddNoteContainer">
          <h1
            style={
              notes.length === 0
                ? darkTheme
                  ? { color: "#555", opacity: 1 }
                  : { opacity: 1 }
                : {}
            }
            className="PreviewPlaceholder"
          >
            Crie uma
            <br />
            Anotação
          </h1>
          <button onClick={handleNewNote} className="AddNote">
            <FiPlus size={26} />
          </button>
        </div>
        <div
          style={notes.length === 0 ? { display: "none" } : {}}
          className="PreviewsContainer"
        >
          {notes.map((note) => (
            <div
              elevation={10}
              onMouseEnter={() => {
                showDeleteButton(note.id);
              }}
              onMouseLeave={hideDeleteButton}
              key={note.id}
              className={
                selected === note.id
                  ? "NotePreviewContainerSelected"
                  : darkTheme
                  ? "NotePreviewContainerDark"
                  : "NotePreviewContainer"
              }
            >
              <h1
                onClick={(e) => {
                  e.preventDefault();
                  handleSelection(note);
                }}
                style={
                  hovering === note.id && selected !== note.id
                    ? { width: "90%" }
                    : {}
                }
                className="TitlePreview"
              >
                {note.title === "" ? "Sem Titulo" : note.title}
              </h1>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    window.confirm(
                      "Tem certeza que deseja deletar essa anotação?"
                    )
                  ) {
                    const newNotes = notes.filter(
                      (note) => note.id !== hovering
                    );
                    setDeletedNotes([...deletedNotes, hovering]);
                    setNotes(newNotes);
                    setSaveRequest({
                      request: true,
                      lastSave: saveRequest.lastSave,
                    });
                  }
                }}
                style={
                  hovering === note.id && selected !== note.id
                    ? { display: "flex" }
                    : {}
                }
              >
                <FiTrash size={19} />
              </button>
              <div className="UpdatedAtContainer">
                <span
                  style={
                    hovering === note.id && selected !== note.id
                      ? { display: "none" }
                      : {}
                  }
                  className="Updated_at"
                >
                  {note.updated_at.substr(0, 8)}
                </span>

                <span
                  style={
                    hovering === note.id && selected !== note.id
                      ? { display: "none" }
                      : { marginTop: 2 }
                  }
                  className="Updated_at"
                >
                  {note.updated_at.substr(9)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={darkTheme ? { backgroundColor: "#121212" } : {}}
        className="NoteContainer"
      >
        <div
          style={
            selected === ""
              ? darkTheme
                ? { display: "flex", backgroundColor: "#121212" }
                : { display: "flex" }
              : {}
          }
          className="PlaceholderContainer"
        >
          <h1
            className="NotePlaceholder"
            style={
              notes.length === 0
                ? { display: "none" }
                : darkTheme
                ? { color: "#333" }
                : {}
            }
          >
            Selecione uma Anotação
          </h1>
        </div>
        <div
          style={selected === "" ? { display: "none" } : {}}
          className="Note"
        >
          <input
            className={darkTheme ? "TitleInputDark" : "TitleInput"}
            maxLength={20}
            required
            placeholder="Titulo"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleEditTitle(e.target.value);
            }}
            style={darkTheme ? { color: "#eee" } : {}}
          />
          <TextareaAutosize
            className={darkTheme ? "DescriptionInputDark" : "DescriptionInput"}
            maxLength={5000}
            placeholder="Digite aqui sua anotação"
            onChange={(e) => {
              setDescription(e.target.value);
              handleEditDescription(e.target.value);
            }}
            value={description}
          />
          {toDos.map((toDo, index) => (
            <div key={index} className="CheckboxContainer">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteToDo(index);
                }}
                className="DeleteCheckbox"
                style={darkTheme ? { color: "#aaa" } : {}}
              >
                <FiX size={16} />
              </button>
              <Checkbox
                checked={toDo.checked ? true : false}
                className="Checkbox"
                color="default"
                onChange={() => {
                  handleChangeCheck(index);
                }}
                style={darkTheme ? { color: "#eee" } : {}}
              />
              <input
                maxLength={30}
                className="CheckboxLabel"
                style={
                  toDo.checked
                    ? darkTheme
                      ? { color: "#aaa", textDecoration: "line-through" }
                      : {
                          textDecoration: "line-through",
                          color: "rgba(0, 0, 0, 0.6)",
                        }
                    : darkTheme
                    ? { color: "#eee" }
                    : {}
                }
                placeholder="Tarefa"
                onChange={(e) => handleChangeLabel(e.target.value, index)}
                value={toDo.label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
