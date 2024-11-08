import { getTranslation } from "../api/translateApi";
import { WordMaps } from "../config/configtype";

/**
 * 文本处理工具
 */
export class WordUtil {
    public static async handleWord(wordText: string, wordMaps?: WordMaps): Promise<string> {
        // 按驼峰命名法进行文本切割
        console.log(wordText);
        // 调用翻译接口进行翻译
        const { data: { data: res } } = await getTranslation(wordText)
        // 使用单词映射进行替换
        return res.text
    }
}