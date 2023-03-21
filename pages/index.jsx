import { useState } from 'react'
import Head from 'next/head'
import Form from './components/Form';
import MyDropzone from './components/MyDropzone'
import getTranslate from '@/service/getTranslate';
import { downloadFile } from '@/lib/utils.js';


export default function Home() {
  const [listTranslate, setListTranslate] = useState([]);
  const [loadingTranslate, setLoadingTranslate] = useState(false)

  const handlerChangeCheckbox = (index) => {
    const newMsgid = listTranslate
    newMsgid[index].isChecked = !newMsgid[index].isChecked
    setListTranslate([...newMsgid])
  }

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setLoadingTranslate(true)
    
    const lang = e.target[0].value

    const newT = []
    for await (let text of listTranslate) {
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
    setLoadingTranslate(false)
    setListTranslate(newT);
  }

  const handlerCheckedAll = (e) => {
    const newMsg = listTranslate.map((text) => {
      return {
        ...text,
        isChecked: e.target.checked,
      }
    })
    setListTranslate([...newMsg])
  }

  const handlerChangeText = (e, index) => {
    const newMsgid = listTranslate
    newMsgid[index].msgstr = e.target.value
    newMsgid[index].isChecked = e.target.value === ''
    setListTranslate([...newMsgid])
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
        <h1>Translate PO and Csv with Deepl</h1>
        {listTranslate.length === 0 && <MyDropzone setListTranslate={setListTranslate} />}
        {listTranslate.length > 0 &&
          <>
            <div className='container-form'>
              <Form handlerSubmit={handlerSubmit} loadingTranslate={loadingTranslate}/>
            </div>
            <div className='list-buttons'>
              <button onClick={() => downloadFile(listTranslate, "po")}>Generate PO</button>
              <button onClick={() => downloadFile(listTranslate, "csv")}>Generate CSV</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Idioma</th>
                  <th>Traducción</th>
                  <th><input type="checkbox" id="checkbox" value="" onChange={handlerCheckedAll} /></th>
                </tr>
              </thead>
              <tbody>

                {listTranslate.map((traduccion, index) => {
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
