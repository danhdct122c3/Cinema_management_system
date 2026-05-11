# Cinema Booking System

Cinema Booking System là một ứng dụng đặt vé xem phim trực tuyến được xây dựng theo mô hình full-stack với Spring Boot ở backend và React ở frontend. Dự án được đóng gói bằng Docker để có thể chạy đồng bộ toàn bộ hệ thống chỉ bằng một lệnh.

## Tổng quan dự án

Mục tiêu của dự án là mô phỏng một hệ thống đặt vé phim thực tế, trong đó người dùng có thể xem phim, chọn suất chiếu, chọn ghế và tạo booking. Ở phía quản trị, admin có thể đăng nhập vào khu vực riêng `/admin` để quản lý dữ liệu vận hành của hệ thống.

Đây là một project phù hợp để demo cho nhà tuyển dụng vì có đủ các lớp chức năng chính của một web application hiện đại: giao diện người dùng, API backend, cơ sở dữ liệu, phân quyền và triển khai bằng Docker.

## Tính năng chính

### Dành cho người dùng

- Xem danh sách phim và chi tiết phim
- Tìm kiếm và khám phá các bộ phim đang chiếu
- Chọn suất chiếu, chọn ghế và đặt vé
- Theo dõi lịch sử đặt vé
- Trải nghiệm quy trình đặt vé nhanh và trực quan

### Dành cho quản trị viên

- Truy cập khu vực quản trị tại `/admin`
- Quản lý phim, suất chiếu, phòng chiếu và các dữ liệu vận hành khác
- Theo dõi thông tin booking và người dùng
- Có luồng đăng nhập riêng cho admin

## Công nghệ sử dụng

- **Backend**: Spring Boot, Maven, MySQL
- **Frontend**: React, TypeScript
- **Triển khai**: Docker, Docker Compose, Nginx
- **Giao tiếp hệ thống**: REST API

## Tài khoản demo

Bạn có thể dùng các tài khoản sau để test nhanh hệ thống:

- **Tài khoản user**
  - Email: `test@gmail.com`
  - Mật khẩu: `test`
- **Tài khoản admin**
  - Truy cập: `/admin`
  - Email: `admin@gmail.com`
  - Mật khẩu: `admin`

## Cách chạy dự án

### 1. Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo đã cài đặt:

- [Docker](https://www.docker.com/products/docker-desktop/) phiên bản mới nhất
- [Git](https://git-scm.com/downloads) phiên bản mới nhất

### 2. Clone dự án

```bash
git clone https://github.com/Shiengg/Cinema-Booking.git
cd Cinema-Booking
```

### 3. Khởi động hệ thống

```bash
docker-compose up --build
```

Lệnh này sẽ:

- Build và khởi động backend Spring Boot
- Build và khởi động frontend React
- Khởi động MySQL database

### 4. Truy cập ứng dụng

Sau khi hệ thống chạy xong, mở:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/home

## Cấu trúc thư mục

```text
Cinema-Booking/
├── cinema-booking/           # Backend Spring Boot
│   ├── src/                   # Source code Java
│   ├── docker/                # Docker config cho backend
│   └── pom.xml                # Maven dependencies
├── cinema-booking-frontend/   # Frontend React
│   ├── src/                   # Source code React/TypeScript
│   ├── public/                # Static assets
│   └── package.json           # NPM dependencies
├── docker-compose.yml         # Cấu hình chạy toàn hệ thống
└── README.md                  # Tài liệu dự án
```

## Lệnh hữu ích

### Dừng hệ thống

```bash
docker-compose down
```

### Xem logs

```bash
docker-compose logs
docker-compose logs [service_name]
```

### Khởi động lại một service

```bash
docker-compose restart [service_name]
```

### Xóa dữ liệu cũ và rebuild

```bash
docker-compose down -v
docker-compose up --build --no-cache
```

## Xử lý sự cố

1. **Lỗi port đã được sử dụng**
   - Kiểm tra và dừng các services đang sử dụng port 80, 8080 hoặc 3307
   - Hoặc chỉnh lại ports trong `docker-compose.yml`

2. **Frontend không kết nối được với Backend**
   - Đảm bảo tất cả services đều đang chạy bằng `docker-compose ps`
   - Kiểm tra logs bằng `docker-compose logs`

3. **Database không khởi động**
   - Xóa volume cũ bằng `docker-compose down -v`
   - Khởi động lại với `docker-compose up --build`

## Giấy phép

[MIT License](LICENSE)
