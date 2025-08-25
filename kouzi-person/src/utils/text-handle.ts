/**
 * 从Markdown文本中提取纯文字内容，移除所有格式标记
 * @param markdownText 包含Markdown格式的文本字符串
 * @returns 提取后的纯文字字符串
 */
export function extractTextFromMarkdown(markdownText: string): string {
    let text = markdownText;
    
    // 移除标题标记 (例如: # 标题)
    text = text.replace(/^#{1,6}\s+/gm, '');
    
    // 移除粗体和斜体标记 (**, __, *, _)
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');
    
    // 移除链接格式 [文本](链接)
    text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
    
    // 移除图片格式 ![描述](链接)
    text = text.replace(/!\[(.*?)\]\(.*?\)/g, '$1');
    
    // 移除列表标记 (- , *, + 和数字加点)
    text = text.replace(/^[*-+]\s+/gm, '');
    text = text.replace(/^\d+\.\s+/gm, '');
    
    // 移除引用标记 (>)
    text = text.replace(/^>\s+/gm, '');
    
    // 移除代码块标记 (``` 和 `)
    text = text.replace(/```.*?```/gs, '');
    text = text.replace(/`.*?`/g, '');
    
    // 移除水平线 (---, ***, ___)
    text = text.replace(/^[-*_]{3,}\s*$/gm, '');
    
    // 移除多余的空行
    text = text.replace(/\n\s*\n/g, '\n\n').trim();
    
    return text;
}
