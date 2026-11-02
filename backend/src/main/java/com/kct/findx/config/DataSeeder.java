package com.kct.findx.config;

import com.kct.findx.entity.*;
import com.kct.findx.repository.CategoryRepository;
import com.kct.findx.repository.LocationRepository;
import com.kct.findx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedCategories();
        seedLocations();
        seedAdmin();
    }

    private void seedCategories() {
        List<String> categories = List.of(
                "Electronics", "ID & Cards", "Books & Stationery",
                "Accessories", "Bottles & Bags", "Keys", "Other");
        categories.forEach(name -> {
            if (!categoryRepository.existsByNameIgnoreCase(name)) {
                categoryRepository.save(Category.builder().name(name).build());
            }
        });
    }

    private void seedLocations() {
        List<String> locations = List.of(
                "Central Library", "LT Complex", "Canteen", "Hostel Zone",
                "Sports Complex", "Academic Block", "Auditorium");
        locations.forEach(name -> {
            if (!locationRepository.existsByNameIgnoreCase(name)) {
                locationRepository.save(Location.builder().name(name).build());
            }
        });
    }

    private void seedAdmin() {
        String adminEmail = "admin@kct.ac.in";
        if (!userRepository.existsByEmail(adminEmail)) {
            userRepository.save(User.builder()
                    .name("FindX Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build());
        }
    }
}
