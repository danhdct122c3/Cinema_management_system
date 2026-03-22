package com.example.cinema_booking.config;


import com.example.cinema_booking.entity.User;
import com.example.cinema_booking.enums.Role;
import com.example.cinema_booking.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;

@Configuration
@Slf4j
public class ApplicationInitConfig {

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository)
    {
        return args -> {
               if (userRepository.findByEmail("admin").isEmpty())
               {
                   var roles = new HashSet<String>();
                   roles.add(Role.ADMIN.name());
                   User user = User.builder()
                           .email("admin")
                           .roles(roles)
                           // Trong thực tế, bạn nên mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu. Đây chỉ là ví dụ đơn giản.
                           .password("admin")
                           .build();

                   userRepository.save(user);
                   log.warn("admin user have been created with default password: admin, you must change the password");

               }
        };
    }

}
