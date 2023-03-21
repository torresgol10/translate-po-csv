export default function Form({ handlerSubmit, loadingTranslate }) {
    return (
        <form onSubmit={handlerSubmit}>
            <label>Solo 1 idioma (es || en || ru)
                <input type="text" placeholder='Lang only 1 (es)' required /></label>
            {loadingTranslate ? <button><div class="lds-dual-ring"></div></button> : <button>Traducir</button>}
        </form>

    )
}