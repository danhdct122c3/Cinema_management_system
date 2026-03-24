package com.example.cinema_booking.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data // tạo getter, setter, toString, equals, hashCode
@Builder //cho phép sử dụng setter trên  dòng ko cần tạo 1 object rồi mới set
@NoArgsConstructor //tạo constructor ko tham số
@AllArgsConstructor //tạo constructor có tham số
@FieldDefaults(level = AccessLevel.PRIVATE) //gán AccessLevel.PRIVATE cho tất cả các field

public class UserUpdateRequest {
    String name;
    String password;
    String phone;
    List<String> roles;
}
