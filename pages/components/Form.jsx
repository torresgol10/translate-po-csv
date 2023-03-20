export default function Form({ handlerSubmit }) {
    return (
        <form onSubmit={handlerSubmit}>
            <label>Solo 1 idioma (es || en || ru)
                <input type="text" placeholder='Lang only 1 (es)' required /></label>
            <button>Traducir</button>
        </form>

    )
}