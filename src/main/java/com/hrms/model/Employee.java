package com.hrms.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate joiningDate;
    private LocalDate birthDate;
    private String degree;
    private String department;
    private String designation;
    private String employmentType;

    @Column(nullable = false)
    private String password;

    private String avatarUrl;

    // Leave balance
    private int casualLeave = 12;
    private int earnedLeave = 15;
    private int sickLeave = 7;
    private int compensatoryLeave = 3;

    // Attendance
    private double attendancePercentage = 100.0;
    private String currentStatus = "PRESENT";

    public enum Gender {
        MALE, FEMALE, OTHER
    }
} 