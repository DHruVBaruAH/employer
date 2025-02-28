package com.hrms.service;

import com.hrms.model.Employee;
import com.hrms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (employeeRepository.existsByEmployeeId(employee.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists");
        }
        
        // Encode password
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        
        return employeeRepository.save(employee);
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee updateEmployee(Employee employee) {
        if (!employeeRepository.existsById(employee.getId())) {
            throw new RuntimeException("Employee not found");
        }
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public Employee updateLeaveBalance(Long id, String leaveType, int days) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        switch (leaveType.toLowerCase()) {
            case "casual":
                employee.setCasualLeave(employee.getCasualLeave() - days);
                break;
            case "earned":
                employee.setEarnedLeave(employee.getEarnedLeave() - days);
                break;
            case "sick":
                employee.setSickLeave(employee.getSickLeave() - days);
                break;
            case "compensatory":
                employee.setCompensatoryLeave(employee.getCompensatoryLeave() - days);
                break;
            default:
                throw new RuntimeException("Invalid leave type");
        }

        return employeeRepository.save(employee);
    }

    public Employee updateAttendance(Long id, String status, double percentage) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        employee.setCurrentStatus(status);
        employee.setAttendancePercentage(percentage);
        
        return employeeRepository.save(employee);
    }

    public Employee authenticateEmployee(String employeeId, String password) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (!passwordEncoder.matches(password, employee.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return employee;
    }
} 