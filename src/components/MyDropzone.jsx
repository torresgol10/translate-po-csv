import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { tranformStringFromCSV, tranformStringFromPO } from '../utils';

export default function MyDropzone({ setMsgid }) {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')

            reader.onload = () => {
                const textSting = reader.result
                const list = file.type.endsWith(".po") || file.type.endsWith(".pot") ? tranformStringFromPO(textSting) : tranformStringFromCSV(textSting);
                setMsgid(list);
            }

            reader.readAsText(file)
        })

    }, [])
    const { getRootProps, getInputProps } = useDropzone({
        onDrop, maxFiles: 1,
        accept: {
            'application/vnd.ms-powerpoint': ['.po', '.pot'],
            'text/csv': ['.csv'],
        }
    })

    return (
        <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <em>(Only *.po, *.pot and *.csv files will be accepted)</em>
        </div>
    )
}