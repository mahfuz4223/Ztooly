-- ================================================
-- Ztooly - Analytics Database Schema
-- ================================================

-- ================================================
-- Table: tool_usage
-- Purpose: Track every tool interaction/usage
-- ================================================
CREATE TABLE IF NOT EXISTS tool_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id VARCHAR(255) NOT NULL COMMENT 'Unique identifier for the tool (e.g., qr-generator)',
    tool_name VARCHAR(255) NOT NULL COMMENT 'Human readable tool name (e.g., QR Code Generator)',
    user_session VARCHAR(255) COMMENT 'Anonymous session ID for tracking user sessions',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the tool was used',
    ip_address VARCHAR(45) COMMENT 'User IP address (IPv4 or IPv6)',
    user_agent TEXT COMMENT 'Browser user agent string',
    
    -- Indexes for better performance
    INDEX idx_tool_id (tool_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_session (user_session),
    INDEX idx_tool_timestamp (tool_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracks individual tool usage events';

-- ================================================
-- Table: daily_stats
-- Purpose: Store aggregated daily statistics
-- ================================================
CREATE TABLE IF NOT EXISTS daily_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE UNIQUE NOT NULL COMMENT 'Date for the statistics',
    total_users INT DEFAULT 0 COMMENT 'Total unique users for this date',
    total_tool_uses INT DEFAULT 0 COMMENT 'Total tool uses for this date',
    unique_tools_used INT DEFAULT 0 COMMENT 'Number of unique tools used on this date',
    
    -- Indexes for better performance
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Daily aggregated statistics';

-- ================================================
-- Table: user_sessions
-- Purpose: Track unique visitor sessions
-- ================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL COMMENT 'Unique session identifier (UUID)',
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'First time this session was seen',
    last_visit DATETIME COMMENT 'Most recent activity from this session',
    total_tool_uses INT DEFAULT 0 COMMENT 'Total number of tools used in this session',
    ip_address VARCHAR(45) COMMENT 'User IP address',
    user_agent TEXT COMMENT 'Browser user agent string',
    
    -- Indexes for better performance
    INDEX idx_session_id (session_id),
    INDEX idx_first_visit (first_visit),
    INDEX idx_last_visit (last_visit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User session tracking for analytics';

-- ================================================
-- Additional Tables for Enhanced Analytics (Optional)
-- ================================================

-- Tool performance metrics
CREATE TABLE IF NOT EXISTS tool_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id VARCHAR(255) NOT NULL,
    response_time_ms INT COMMENT 'Response time in milliseconds',
    error_occurred BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tool_performance (tool_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tool performance and error tracking';

-- Popular tools cache
CREATE TABLE IF NOT EXISTS popular_tools_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id VARCHAR(255) NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    usage_count INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_tool (tool_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cached popular tools for faster retrieval';

-- ================================================
-- Sample Data Insertion (for testing)
-- ================================================

-- Insert sample tool usage data
INSERT INTO tool_usage (tool_id, tool_name, user_session, ip_address, user_agent) VALUES
('qr-generator', 'QR Code Generator', 'test-session-1', '127.0.0.1', 'Mozilla/5.0 Test Browser'),
('background-remover', 'Background Remover', 'test-session-1', '127.0.0.1', 'Mozilla/5.0 Test Browser'),
('password-generator', 'Password Generator', 'test-session-2', '127.0.0.1', 'Mozilla/5.0 Test Browser'),
('qr-generator', 'QR Code Generator', 'test-session-2', '127.0.0.1', 'Mozilla/5.0 Test Browser'),
('image-resizer', 'Image Resizer', 'test-session-3', '127.0.0.1', 'Mozilla/5.0 Test Browser');

-- Insert sample user sessions
INSERT INTO user_sessions (session_id, ip_address, user_agent, total_tool_uses, last_visit) VALUES
('test-session-1', '127.0.0.1', 'Mozilla/5.0 Test Browser', 2, NOW()),
('test-session-2', '127.0.0.1', 'Mozilla/5.0 Test Browser', 2, NOW()),
('test-session-3', '127.0.0.1', 'Mozilla/5.0 Test Browser', 1, NOW());

-- Insert sample daily stats
INSERT INTO daily_stats (date, total_users, total_tool_uses, unique_tools_used) VALUES
(CURDATE(), 3, 5, 4);

-- ================================================
-- Useful Queries for Analytics
-- ================================================

-- Get most popular tools (last 30 days)
/*
SELECT 
    tool_id, 
    tool_name, 
    COUNT(*) as usage_count
FROM tool_usage 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY tool_id, tool_name 
ORDER BY usage_count DESC 
LIMIT 10;
*/

-- Get daily usage for last 7 days
/*
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_uses,
    COUNT(DISTINCT user_session) as unique_users,
    COUNT(DISTINCT tool_id) as unique_tools
FROM tool_usage 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(timestamp)
ORDER BY date DESC;
*/

-- Get user session details
/*
SELECT 
    session_id,
    first_visit,
    last_visit,
    total_tool_uses,
    TIMESTAMPDIFF(MINUTE, first_visit, last_visit) as session_duration_minutes
FROM user_sessions
ORDER BY first_visit DESC
LIMIT 20;
*/

-- Get tool usage by hour (for peak usage analysis)
/*
SELECT 
    HOUR(timestamp) as hour_of_day,
    COUNT(*) as usage_count
FROM tool_usage 
WHERE DATE(timestamp) = CURDATE()
GROUP BY HOUR(timestamp)
ORDER BY hour_of_day;
*/

-- ================================================
-- Database Maintenance Queries
-- ================================================

-- Clean up old data (older than 90 days)
/*
DELETE FROM tool_usage WHERE timestamp < DATE_SUB(NOW(), INTERVAL 90 DAY);
DELETE FROM daily_stats WHERE date < DATE_SUB(CURDATE(), INTERVAL 90 DAY);
*/

-- Update popular tools cache
/*
INSERT INTO popular_tools_cache (tool_id, tool_name, usage_count)
SELECT tool_id, tool_name, COUNT(*) as usage_count
FROM tool_usage 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY tool_id, tool_name
ON DUPLICATE KEY UPDATE 
    usage_count = VALUES(usage_count),
    last_updated = CURRENT_TIMESTAMP;
*/
