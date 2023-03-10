export const tranformStringFromPO = (string) => {
	const arrayAll = string.slice(1, string.length - 1).split("\n").filter(Boolean)

	const lineGood = arrayAll.filter((line) => {
		return line.startsWith('msgid') || line.startsWith("msgstr")
	})

	let list = lineGood.map((line, index) => {
		const obj = {
			msgid: line.startsWith('msgid') ? line.replace("msgid ", "").replaceAll("\"", "") : "",
			msgstr: lineGood[index + 1]?.startsWith('msgstr') ? lineGood[index + 1].replace("msgstr ", "").replaceAll("\"", "") : "",
		}
		if (obj.msgstr !== '') return obj

		return {
			isChecked: true,
			...obj
		}
	})

	list = list.filter((obj) => obj.msgid != '')

	return list;
}

export const tranformStringFromCSV = (string) => {
	const arrayLine = string.split("\n")
	let list = arrayLine.map((line) => {
		const l = line.split("	")
		console.log(l)
		const obj = {
			msgid: l[0]?.replaceAll("\"", "") || '',
			msgstr: l[1]?.replaceAll("\"", "") || "",
		}
		if (obj.msgstr !== '') return obj

		return {
			isChecked: true,
			...obj
		}
	})

	list = list.filter((obj) => obj.msgid != "")

	return list
}

const generatePO = (objs) => {
	const result = objs.map(element => {
		return `msgid "${element.msgid}"
msgstr "${element.msgstr}"

`
	});

	return result
}

const generateCSV = (objs) => {
	const result = objs.map(element => {
		return `"${element.msgid}"	"${element.msgstr}"
`
	});

	return result
}


export const downloadFile = (objs, type) => {
	const element = document.createElement("a");
	let file = null;
	let texts = null;

	if (type == 'po') {
		texts = generatePO(objs)
		file = new Blob(texts, { type: 'application/vnd.ms-powerpoint' });
		element.download = "po-" + Date.now() + ".po";
	} else {
		texts = generateCSV(objs)
		file = new Blob(texts, { type: 'text/csv' });
		element.download = "csv-" + Date.now() + ".csv";
	}

	element.href = URL.createObjectURL(file);
	document.body.appendChild(element);

	element.click();
}