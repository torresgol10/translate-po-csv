import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { tranformStringFromCSV, tranformStringFromPO } from '../../lib/utils.js';

export default function MyDropzone({ setListTranslate }) {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')

            reader.onload = () => {
                const textSting = reader.result.replace(/\r\n/g, '\n');
                const list = file.name.endsWith(".po") || file.name.endsWith(".pot") ? tranformStringFromPO(textSting) : tranformStringFromCSV(textSting);
                setListTranslate(list);
            }

            reader.readAsText(file)
        })

    }, [setListTranslate])

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
            <p>Drag and drop some files here, or click to select files</p>
            <em>(Only *.po, *.pot and *.csv files will be accepted)</em>
        </div>
    )
}