-- 网站访问量统计表
CREATE TABLE IF NOT EXISTS `visit_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `date` date NOT NULL COMMENT '统计日期',
  `count` int(11) NOT NULL DEFAULT '0' COMMENT '访问量',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='网站访问量统计表';