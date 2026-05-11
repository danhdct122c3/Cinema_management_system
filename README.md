# Cinema Booking System

Cinema Booking System là một ứng dụng đặt vé xem phim trực tuyến theo mô hình full-stack

## Tổng quan dự án

Dự án mô phỏng một quy trình đặt vé phim thực tế: người dùng xem phim, chọn suất chiếu, chọn ghế, thanh toán và theo dõi lịch sử đặt vé. Bên cạnh đó, hệ thống có khu vực quản trị riêng tại `/admin` để quản lý dữ liệu vận hành.



## Điểm nổi bật

- Luồng đặt vé hoàn chỉnh từ xem phim đến thanh toán
- Tách biệt rõ trải nghiệm của người dùng và quản trị viên
- Tích hợp VNPay sandbox cho thanh toán online
- Chọn ghế theo sơ đồ phòng chiếu và giữ ghế tạm thời
- Chạy đồng bộ toàn hệ thống qua Docker Compose

## Tính năng chính

### Người dùng

- Xem danh sách phim và chi tiết phim
- Tìm kiếm, khám phá và chọn phim đang chiếu
- Chọn suất chiếu, chọn ghế và đặt vé
- Thanh toán qua VNPay sandbox
- Xem lịch sử đặt vé

### Quản trị viên

- Đăng nhập tại khu vực `/admin`
- Quản lý phim, suất chiếu, phòng chiếu và booking
- Theo dõi thông tin người dùng và trạng thái vận hành
- Phân tách luồng quản trị với luồng người dùng

## Luồng hoạt động

### Luồng đặt vé

1. Người dùng đăng nhập vào hệ thống.
2. Người dùng chọn phim, xem chi tiết và chọn suất chiếu.
3. Hệ thống hiển thị sơ đồ ghế theo phòng chiếu.
4. Ghế được giữ tạm trong một khoảng thời gian để tránh đặt trùng.
5. Người dùng xác nhận booking và chuyển sang thanh toán.

### Luồng thanh toán VNPay

1. Người dùng chọn thanh toán qua VNPay.
2. Backend tạo request và điều hướng sang cổng thanh toán sandbox.
3. Người dùng nhập thông tin thẻ demo và OTP để hoàn tất giao dịch.
4. VNPay trả kết quả về backend để cập nhật trạng thái thanh toán.
5. Booking được ghi nhận và hiển thị trong lịch sử đặt vé.

### Luồng quản trị

1. Admin truy cập trang `/admin`.
2. Admin đăng nhập bằng tài khoản quản trị riêng.
3. Admin quản lý phim, phòng chiếu, suất chiếu và booking.
4. Phân quyền được tách biệt để đảm bảo kiểm soát hệ thống.

## Công nghệ sử dụng

- **Backend**: Spring Boot, Maven, MySQL
- **Frontend**: React, TypeScript
- **Triển khai**: Docker, Docker Compose, Nginx
- **Kiến trúc giao tiếp**: REST API

## Tài khoản demo

### Tài khoản người dùng

- Email: test@gmail.com
- Mật khẩu: test

### Tài khoản quản trị

- Truy cập: `/admin`
- Email: admin@gmail.com
- Mật khẩu: admin

### VNPay sandbox

Thông tin mặc định để test thanh toán:

- Ngân hàng: NCB
- Số thẻ: 9704198526191432198
- Tên chủ thẻ: NGUYEN VAN A
- Ngày phát hành: 07/15
- Mật khẩu OTP: 123456
- Kết quả giao dịch: Thành công

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

Sau khi hệ thống khởi động xong, truy cập:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/home

## Cấu trúc thư mục

```text
Cinema-Booking/
├── cinema-booking/           # Backend Spring Boot
│   ├── src/                  # Source code Java
│   ├── docker/               # Docker config cho backend
│   └── pom.xml               # Maven dependencies
├── cinema-booking-frontend/  # Frontend React
│   ├── src/                  # Source code React/TypeScript
│   ├── public/               # Static assets
│   └── package.json          # NPM dependencies
├── docker-compose.yml        # Cấu hình chạy toàn hệ thống
└── README.md                 # Tài liệu dự án
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
   - Kiểm tra và dừng các services đang dùng port 80, 8080 hoặc 3307
   - Hoặc chỉnh lại ports trong `docker-compose.yml`

2. **Frontend không kết nối được với Backend**
   - Đảm bảo tất cả services đều đang chạy bằng `docker-compose ps`
   - Kiểm tra logs bằng `docker-compose logs`

3. **Database không khởi động**
   - Xóa volume cũ bằng `docker-compose down -v`
   - Khởi động lại với `docker-compose up --build`

## Giấy phép

[MIT License](LICENSE)
