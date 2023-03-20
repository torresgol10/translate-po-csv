import { useState } from 'react'
import Head from 'next/head'
import Form from './components/Form';
import MyDropzone from './components/MyDropzone'
import getTranslate from '@/service/getTranslate';
import { downloadFile } from '@/lib/utils.js';


export default function Home() {
  const [msgid, setMsgid] = useState([]);
  console.log(msgid)
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
        const newText = await getTranslate({ target_language: lang, text: text.msgid })
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

  const handlerCheckedAll = (e) => {
    const newMsg = msgid.map((text) => {
      return {
        ...text,
        isChecked: e.target.checked,
      }
    })
    setMsgid([...newMsg])
  }

  const handlerChangeText = (e, index) => {
    const newMsgid = msgid
    newMsgid[index].msgstr = e.target.value
    newMsgid[index].isChecked = e.target.value === ''
    setMsgid([...newMsgid])
  }

  return (
    <>
      <Head>
        <title>Translate PO and Csv with Deepl</title>
        <meta name="description" content="Translate PO and Csv with Deepl" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
      </Head>

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
    </>
  )
}
