package com.application.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.application.model.Doctor;
import com.application.model.Slots;
import com.application.model.User;
import com.application.service.DoctorRegistrationService;
import com.application.service.UserRegistrationService;

@RestController
public class RegistrationController 
{
	@Autowired
	private UserRegistrationService userRegisterService;
	
	@Autowired
	private DoctorRegistrationService doctorRegisterService;
	
	@PostMapping("/registeruser")
	@CrossOrigin(origins = "http://localhost:4200")
	public ResponseEntity<?> registerUser(@RequestBody User user)
	{
		String currEmail = user.getEmail();
		if(currEmail != null && !currEmail.trim().isEmpty()) {
			User existing = userRegisterService.fetchUserByEmail(currEmail);
			if(existing != null) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body("User with email "+currEmail+" already exists");
			}
		}
		User saved = userRegisterService.saveUser(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}
	
	@PostMapping("/registerdoctor")
	@CrossOrigin(origins = "http://localhost:4200")
	public ResponseEntity<?> registerDoctor(@RequestBody Doctor doctor)
	{
		String currEmail = doctor.getEmail();
		if(currEmail != null && !currEmail.trim().isEmpty()) {
			Doctor existing = doctorRegisterService.fetchDoctorByEmail(currEmail);
			if(existing != null) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body("Doctor with email "+currEmail+" already exists");
			}
		}
		Doctor saved = doctorRegisterService.saveDoctor(doctor);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}
	
	@PostMapping("/addDoctor")
	@CrossOrigin(origins = "http://localhost:4200")
	public Doctor addNewDoctor(@RequestBody Doctor doctor) throws Exception
	{
		Doctor doctorObj = null;
		doctorObj = doctorRegisterService.saveDoctor(doctor);
		return doctorObj;
	}
	
	@GetMapping("/gettotalusers")
	@CrossOrigin(origins = "http://localhost:4200")
	public ResponseEntity<List<Integer>> getTotalSlots() throws Exception
	{
		List<User> users = userRegisterService.getAllUsers();
		List<Integer> al = new ArrayList<>();
		al.add(users.size());
		return new ResponseEntity<List<Integer>>(al, HttpStatus.OK);
	}

}
