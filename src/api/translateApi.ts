import axios from "axios";

/**
 * 翻译API
 */
export function getTranslation(wordText: string) {
    return axios.post(`http://www.trans-home.com/api/index/translate?token=MqENgg3NeMirAsnEpa4z`, {
        keywords: wordText
    })
}