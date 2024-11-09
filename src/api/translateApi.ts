import axios from "axios";


/**
 * 翻译API
 */
export function getTranslation(wordText: string, apiKey: string) {
    return axios.post(`http://www.trans-home.com/api/index/translate?token=${apiKey}`, {
        keywords: wordText
    })
}
