-- 网站访问量统计假数据插入脚本
-- 插入最近10天的访问量数据

-- 确保表存在（如果已创建可忽略）
CREATE TABLE IF NOT EXISTS `visit_stats` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `date` date NOT NULL COMMENT '日期',
  `count` int NOT NULL DEFAULT '0' COMMENT '访问量',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `date_unique` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='网站访问量统计表';

-- 清空现有数据（可选，开发环境使用）
-- TRUNCATE TABLE `visit_stats`;

-- 插入10条假数据（最近10天，访问量从低到高）
INSERT INTO `visit_stats` (`date`, `count`) VALUES
  (DATE_SUB(CURDATE(), INTERVAL 9 DAY), 15),
  (DATE_SUB(CURDATE(), INTERVAL 8 DAY), 23),
  (DATE_SUB(CURDATE(), INTERVAL 7 DAY), 18),
  (DATE_SUB(CURDATE(), INTERVAL 6 DAY), 35),
  (DATE_SUB(CURDATE(), INTERVAL 5 DAY), 42),
  (DATE_SUB(CURDATE(), INTERVAL 4 DAY), 28),
  (DATE_SUB(CURDATE(), INTERVAL 3 DAY), 56),
  (DATE_SUB(CURDATE(), INTERVAL 2 DAY), 67),
  (DATE_SUB(CURDATE(), INTERVAL 1 DAY), 89),
  (CURDATE(), 78);

-- 查询插入结果
SELECT 
  `date`,
  `count` as '访问量',
  DATE_FORMAT(`create_time`, '%Y-%m-%d %H:%i:%s') as '创建时间'
FROM `visit_stats`
ORDER BY `date` ASC;