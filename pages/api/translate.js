// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { translate } from 'deeplx'

export default async function handler(req, res) {
  const { text, target_language } = req.body
  const response = await translate(text, target_language)

  res.status(200).json({ text: response })
}
