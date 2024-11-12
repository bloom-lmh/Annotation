import { getTranslation } from "../api/translateApi";
import { TranslationConfig } from "../config/configtype";

/**
 * 文本处理工具
 */
export class WordUtil {
    public static async handleWord(wordText: string, translationConfig?: TranslationConfig): Promise<string> {
        // 翻译配置存在
        if (translationConfig) {
            // 解构翻译配置
            let { open, wordMaps, apiKey } = translationConfig
            // 按驼峰命名法进行文本切割(翻译接口太棒了暂时不需要)
            // let wordTexts = wordText.split(/(?=[A-Z]|[0-9])/)
            let key = ''
            // 调用翻译接口进行翻译
            if (open && apiKey) {
                if (Array.isArray(apiKey)) {
                    // 获取随机一条apiKey
                    const randomNumber = Math.floor(Math.random() * apiKey.length);
                    key = apiKey[randomNumber]
                } else {
                    key = apiKey
                }
                const { data: { data: res } } = await getTranslation(wordText, key)
                wordText = res.text
            }
        }
        // 使用单词映射进行替换
        return wordText
    }
}