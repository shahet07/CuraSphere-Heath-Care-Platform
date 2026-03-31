package com.application.repository;

import org.springframework.data.repository.CrudRepository;
import com.application.model.User;

public interface UserRegistrationRepository extends CrudRepository<User, String>
{
	
    public User findByEmail(String email);
	
	public User findByUsername(String username);
	
	public User findByEmailAndPassword(String email, String password);

}
