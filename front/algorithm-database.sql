-- 算法题管理模块数据库设计
-- 简洁版，匹配当前前端功能需求

-- 算法题目表
CREATE TABLE algorithm_problems (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT '题目标题',
    difficulty ENUM('简单', '中等', '困难') NOT NULL DEFAULT '中等' COMMENT '难度等级',
    category VARCHAR(100) NOT NULL COMMENT '算法分类',
    description TEXT COMMENT '题目描述',
    solution TEXT COMMENT '解题思路',
    answer TEXT COMMENT '答案或代码',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    INDEX idx_created_at (created_at)
);

-- 插入示例数据
INSERT INTO algorithm_problems (title, difficulty, category, description, solution, answer, created_at) VALUES
('两数之和', '简单', '数组', '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那两个整数，并返回它们的数组下标。', '使用哈希表存储已经遍历过的数字及其索引，时间复杂度O(n)', '```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}
```', '2024-01-15'),

('最长回文子串', '中等', '字符串', '给你一个字符串 s，找到 s 中最长的回文子串。', '使用中心扩展法，从每个字符向两边扩展判断回文', '```javascript
function longestPalindrome(s) {
  if (s.length < 2) return s;
  let start = 0, maxLen = 1;
  
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const len = right - left + 1;
      if (len > maxLen) {
        maxLen = len;
        start = left;
      }
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i);
    expandAroundCenter(i, i + 1);
  }
  
  return s.substring(start, start + maxLen);
}
```', '2024-01-16'),

('合并两个有序链表', '简单', '链表', '将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。', '使用递归或迭代的方式，比较两个链表节点的值，选择较小的节点连接到结果链表', '```javascript
function mergeTwoLists(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
}
```', '2024-01-17'),

('二叉树的最大深度', '简单', '树', '给定一个二叉树，找出其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。', '使用递归深度优先搜索，计算左右子树的最大深度加1', '```javascript
function maxDepth(root) {
  if (!root) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}
```', '2024-01-18');

-- 查询示例
-- 按分类统计题目数量
SELECT category, COUNT(*) as count FROM algorithm_problems GROUP BY category;

-- 按难度统计题目数量
SELECT difficulty, COUNT(*) as count FROM algorithm_problems GROUP BY difficulty;

-- 搜索题目（标题或描述包含关键词）
SELECT * FROM algorithm_problems 
WHERE title LIKE '%关键词%' OR description LIKE '%关键词%'
ORDER BY created_at DESC;