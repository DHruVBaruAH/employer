package com.hrms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class TestController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getTestData() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "HR Management System API is running");
        response.put("timestamp", new Date());
        response.put("version", "1.0.0");
        
        // Add some demo statistics
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", 150);
        stats.put("departmentCount", 8);
        stats.put("averageAttendance", 92.5);
        stats.put("activeLeaveRequests", 12);
        response.put("statistics", stats);
        
        // Add demo departments
        List<Map<String, Object>> departments = new ArrayList<>();
        departments.add(createDepartment("Engineering", 45, "John Doe"));
        departments.add(createDepartment("Marketing", 25, "Jane Smith"));
        departments.add(createDepartment("HR", 15, "Alice Johnson"));
        departments.add(createDepartment("Finance", 20, "Bob Wilson"));
        response.put("departments", departments);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("database", "Connected");
        health.put("uptime", "12h 30m");
        health.put("memoryUsage", "512MB");
        health.put("timestamp", new Date());
        
        return ResponseEntity.ok(health);
    }

    @GetMapping("/test/employees")
    public ResponseEntity<List<Map<String, Object>>> getTestEmployees() {
        List<Map<String, Object>> employees = new ArrayList<>();
        
        employees.add(createEmployee("EMP001", "John Doe", "Engineering", "Senior Developer"));
        employees.add(createEmployee("EMP002", "Jane Smith", "Marketing", "Marketing Manager"));
        employees.add(createEmployee("EMP003", "Alice Johnson", "HR", "HR Director"));
        employees.add(createEmployee("EMP004", "Bob Wilson", "Finance", "Financial Analyst"));
        employees.add(createEmployee("EMP005", "Carol Brown", "Engineering", "Software Engineer"));
        
        return ResponseEntity.ok(employees);
    }

    private Map<String, Object> createDepartment(String name, int employeeCount, String head) {
        Map<String, Object> dept = new HashMap<>();
        dept.put("name", name);
        dept.put("employeeCount", employeeCount);
        dept.put("departmentHead", head);
        dept.put("budget", new Random().nextInt(100000, 500000));
        return dept;
    }

    private Map<String, Object> createEmployee(String id, String name, String department, String position) {
        Map<String, Object> employee = new HashMap<>();
        employee.put("id", id);
        employee.put("name", name);
        employee.put("department", department);
        employee.put("position", position);
        employee.put("email", name.toLowerCase().replace(" ", ".") + "@company.com");
        employee.put("joiningDate", "2023-01-01");
        employee.put("status", "Active");
        employee.put("attendance", new Random().nextInt(85, 100));
        
        Map<String, Integer> leaves = new HashMap<>();
        leaves.put("sick", new Random().nextInt(12));
        leaves.put("casual", new Random().nextInt(15));
        leaves.put("earned", new Random().nextInt(30));
        employee.put("leaves", leaves);
        
        return employee;
    }
} 