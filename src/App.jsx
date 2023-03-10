import { useState } from 'react'
import "./App.css"
import Form from './components/Form';
import MyDropzone from './components/MyDropzone'
import getTranslate from './service/getTranslate';
import { downloadFile } from './utils';

function App() {
  const [msgid, setMsgid] = useState([]);

  const handlerChangeCheckbox = (index) => {
    const newMsgid = msgid
    newMsgid[index].isChecked = !newMsgid[index].isChecked
    setMsgid([...newMsgid])
  }

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const lang = e.target[0].value

    const newT = []
    for await (let text of msgid) {
      if (text.isChecked) {
        const newText = await getTranslate({ langTo: lang, text: text.msgid })
        const obj = {
          isChecked: false,
          msgid: text.msgid,
          msgstr: newText
        }
        newT.push(obj)
      } else {
        newT.push(text)
      }
    }
    setMsgid(newT);
  }

  const handlerCheckedAll = () => {
    const newMsg = msgid.map((text) => {
      return {
        ...text,
        isChecked: true,
      }
    })
    setMsgid([...newMsg])
  }

  const handlerChangeText = (e, index) => {
    console.log(e.target.value != '')
    const newMsgid = msgid
    newMsgid[index].msgstr = e.target.value
    newMsgid[index].isChecked = e.target.value === ''
    setMsgid([...newMsgid])
  }

  return (
    <div className="App">
      {msgid.length === 0 && <MyDropzone setMsgid={setMsgid} />}
      {msgid.length > 0 &&
        <>
          <Form handlerSubmit={handlerSubmit} />
          <div>
            <button onClick={() => downloadFile(msgid, "po")}>Generate PO</button>
            <button onClick={() => downloadFile(msgid, "csv")}>Generate CSV</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Idioma</th>
                <th>Traducción</th>
                <input type="checkbox" id="checkbox" value="" onChange={handlerCheckedAll} />
              </tr>
            </thead>
            <tbody>

              {msgid.map((traduccion, index) => {
                return (
                  <tr key={index}>
                    <td>{traduccion.msgid}</td>
                    <td><input type="text" value={traduccion.msgstr} onChange={(e) => handlerChangeText(e, index)} /></td>
                    <td><input type="checkbox" id="checkbox" value="translate"
                      checked={traduccion.isChecked}
                      onChange={() => handlerChangeCheckbox(index)} /></td>
                  </tr>
                )
              })}

            </tbody>
          </table>
        </>
      }
    </div>
  )
}

export default App
