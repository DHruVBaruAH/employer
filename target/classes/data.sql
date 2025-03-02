-- Insert default admin user
INSERT INTO employees (id, employee_id, name, email, password, phone, gender, joining_date, birth_date, degree, department, designation, employment_type, attendance_percentage, current_status, casual_leave, earned_leave, sick_leave, compensatory_leave)
VALUES (1, 'ADMIN001', 'Admin User', 'admin@hrms.com', '$2a$10$yfIHMg4KLQtF/JkzR.vxYeRQz7v0zrhhNkgyqXS9EbRzd.YXgt3.O', '1234567890', 'MALE', '2023-01-01', '1990-01-01', 'MBA', 'Administration', 'Admin', 'FULL_TIME', 100.0, 'PRESENT', 12, 15, 7, 3);

/*
-- Insert sample departments
-- INSERT INTO departments (id, name, description)
-- VALUES 
-- (1, 'HR', 'Human Resources Department'),
-- (2, 'IT', 'Information Technology Department'),
-- (3, 'FINANCE', 'Finance Department'),
-- (4, 'OPERATIONS', 'Operations Department');

-- Insert sample leave types
-- INSERT INTO leave_types (id, name, description, max_days_per_year)
-- VALUES 
-- (1, 'Casual Leave', 'Short duration leave for personal reasons', 12),
-- (2, 'Sick Leave', 'Leave due to illness or medical reasons', 7),
-- (3, 'Earned Leave', 'Leave earned based on service duration', 15),
-- (4, 'Compensatory Leave', 'Leave granted for working on holidays', 3);

-- Insert sample holidays
-- INSERT INTO holidays (id, name, date, description)
-- VALUES 
-- (1, 'New Year', '2024-01-01', 'New Year Celebration'),
-- (2, 'Republic Day', '2024-01-26', 'Republic Day of India'),
-- (3, 'Independence Day', '2024-08-15', 'Independence Day of India'),
-- (4, 'Gandhi Jayanti', '2024-10-02', 'Birth Anniversary of Mahatma Gandhi'),
-- (5, 'Christmas', '2024-12-25', 'Christmas Day');

-- Insert sample employee leave balances for admin
-- INSERT INTO leave_balances (id, user_id, leave_type_id, balance)
-- VALUES 
-- (1, 1, 1, 12),
-- (2, 1, 2, 7),
-- (3, 1, 3, 15),
-- (4, 1, 4, 3);
*/
