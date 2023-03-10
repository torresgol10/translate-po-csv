const URL = "";
const API_KEY = "";

export default async function getTranslate({ langTo, text }) {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "format": "text",
            "q": text,
            "source": 'en',
            "target": langTo,
            "api_key": API_KEY

        })
    });
    const json = await response.json()

    return json.translatedText;
}