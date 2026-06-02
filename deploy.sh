#!/bin/bash
# =============================================================
# deploy.sh - Script deploy Cinema Booking lên EC2
# Chạy script này trên EC2 instance sau khi clone repo
# Usage: chmod +x deploy.sh && ./deploy.sh
# =============================================================

set -e  # Dừng ngay nếu có lỗi

echo "======================================"
echo "  Cinema Booking - EC2 Deploy Script  "
echo "======================================"

# Kiểm tra .env tồn tại
if [ ! -f ".env" ]; then
  echo ""
  echo "[ERROR] Không tìm thấy file .env!"
  echo "Hãy tạo file .env từ .env.example:"
  echo "  cp .env.example .env"
  echo "  nano .env   # Điền IP Elastic IP của bạn vào"
  echo ""
  exit 1
fi

echo ""
echo "[1/4] Kiểm tra Docker..."
docker --version
docker compose version

echo ""
echo "[2/4] Thêm swap memory (phòng OOM khi build)..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo "Đã tạo swap 2GB"
else
  echo "Swap đã tồn tại, bỏ qua."
fi

echo ""
echo "[3/4] Build Docker images (có thể mất 5-15 phút lần đầu)..."
docker compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "[4/4] Khởi động các container..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "======================================"
echo "  Deploy hoàn tất!"
echo "======================================"
echo ""
echo "Kiểm tra trạng thái:"
docker compose -f docker-compose.prod.yml ps

echo ""
# Lấy IP public của instance
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "<EC2_IP>")
echo "Truy cập ứng dụng tại: http://${PUBLIC_IP}"
echo ""
echo "Xem logs:"
echo "  docker compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Dừng ứng dụng:"
echo "  docker compose -f docker-compose.prod.yml down"
