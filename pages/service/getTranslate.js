const URL = "/api/translate";

export default async function getTranslate({ target_language, text }) {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "text": text,
            "target_language": target_language,
        })
    });
    const json = await response.json()

    return json.text;
}